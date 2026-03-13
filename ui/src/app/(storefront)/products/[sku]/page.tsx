\"use client\";

import { useQuery, useMutation, useQueryClient } from \"@tanstack/react-query\";
import { useState } from \"react\";
import { api, ApiEnvelope } from \"../../../../../lib/api\";
import { useAuth } from \"../../../../components/auth-provider\";

interface ProductPageProps {
  params: { sku: string };
}

interface Product {
  sku: string;
  name: string;
  shortDescription: string;
  price: number;
  stock: number;
}

interface CartResponse {
  id: string;
  memberId: string;
  totalItems: number;
  totalPrice: number;
}

async function fetchProduct(sku: string): Promise<Product> {
  const res = await api.get<ApiEnvelope<Product>>(`/products/${sku}`);
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Product not found\");
  }
  return res.data;
}

async function addToCart(sku: string, qty: number): Promise<CartResponse> {
  const res = await api.post<ApiEnvelope<CartResponse>>(\"/cart\", {
    sku,
    qty,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Failed to add to cart\");
  }
  return res.data;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { sku } = params;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [\"product\", sku],
    queryFn: () => fetchProduct(sku),
  });

  const addMutation = useMutation({
    mutationFn: (quantity: number) => addToCart(sku, quantity),
    onSuccess: () => {
      setMessage(\"Added to cart\");
      queryClient.invalidateQueries({ queryKey: [\"cart\"] });
    },
    onError: (err: unknown) => {
      setMessage(err instanceof Error ? err.message : \"Failed to add to cart\");
    },
  });

  if (isLoading) {
    return <p className=\"text-sm\">Loading product...</p>;
  }

  if (isError || !product) {
    return (
      <p className=\"text-sm text-red-600\">
        {(error as Error)?.message || \"Failed to load product\"}
      </p>
    );
  }

  return (
    <div className=\"w-full max-w-xl space-y-4\">
      <div>
        <h1 className=\"text-2xl font-semibold tracking-tight\">
          {product.name}
        </h1>
        <p className=\"mt-1 text-sm text-zinc-600 dark:text-zinc-400\">
          {product.shortDescription}
        </p>
      </div>
      <div className=\"rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900\">
        <p className=\"text-lg font-semibold\">
          ₹ {product.price.toFixed(2)}
        </p>
        <p className=\"mt-1 text-xs text-zinc-500\">
          SKU: {product.sku} · Stock: {product.stock}
        </p>
        <div className=\"mt-4 flex items-center gap-3\">
          <label className=\"text-xs font-medium\">Quantity</label>
          <input
            type=\"number\"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
            className=\"w-20 rounded-md border px-2 py-1 text-sm shadow-sm\"
          />
          <button
            type=\"button\"
            disabled={!isAuthenticated || addMutation.isPending}
            onClick={() => addMutation.mutate(qty)}
            className=\"rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60\"
          >
            {isAuthenticated ? \"Add to cart\" : \"Login to add\"}
          </button>
        </div>
        {message && (
          <p className=\"mt-2 text-xs text-zinc-600 dark:text-zinc-300\">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}



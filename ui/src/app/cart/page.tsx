\"use client\";

import { useMutation, useQuery, useQueryClient } from \"@tanstack/react-query\";
import Link from \"next/link\";
import { api, ApiEnvelope } from \"../../../lib/api\";
import { useAuth } from \"../../components/auth-provider\";

interface CartItem {
  sku: string;
  productName: string;
  qty: number;
  priceSnapshot: number;
}

interface CartResponse {
  id: string;
  memberId: string;
  totalItems: number;
  totalPrice: number;
  items: CartItem[];
}

async function fetchCart(): Promise<CartResponse> {
  const res = await api.get<ApiEnvelope<CartResponse>>(\"/cart\");
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Failed to load cart\");
  }
  return res.data;
}

async function removeItem(sku: string): Promise<CartResponse> {
  const res = await api.delete<ApiEnvelope<CartResponse>>(
    `/cart/items/${sku}`,
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Failed to remove item\");
  }
  return res.data;
}

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [\"cart\"],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: (sku: string) => removeItem(sku),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [\"cart\"] });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className=\"w-full\">
        <h1 className=\"text-xl font-semibold tracking-tight\">Cart</h1>
        <p className=\"mt-2 text-sm text-zinc-600 dark:text-zinc-400\">
          Please{" "}
          <Link href=\"/login\" className=\"text-blue-600 underline\">
            login
          </Link>{" "}
          to view your cart.
        </p>
      </div>
    );
  }

  return (
    <div className=\"w-full space-y-4\">
      <h1 className=\"text-xl font-semibold tracking-tight\">Cart</h1>
      {isLoading && <p className=\"text-sm\">Loading cart...</p>}
      {isError && (
        <p className=\"text-sm text-red-600\">
          {(error as Error)?.message || \"Failed to load cart\"}
        </p>
      )}
      {cart && (
        <>
          <div className=\"rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900\">
            {cart.items.length === 0 ? (
              <p className=\"text-sm text-zinc-600 dark:text-zinc-400\">
                Your cart is empty.
              </p>
            ) : (
              <ul className=\"divide-y\">
                {cart.items.map((item) => (
                  <li
                    key={item.sku}
                    className=\"flex items-center justify-between py-2 text-sm\"
                  >
                    <div>
                      <p className=\"font-medium\">{item.productName}</p>
                      <p className=\"text-xs text-zinc-500\">
                        SKU: {item.sku} · Qty: {item.qty}
                      </p>
                    </div>
                    <div className=\"flex items-center gap-3\">
                      <span className=\"text-sm font-semibold\">
                        ₹ {(item.priceSnapshot * item.qty).toFixed(2)}
                      </span>
                      <button
                        type=\"button\"
                        onClick={() => removeMutation.mutate(item.sku)}
                        disabled={removeMutation.isPending}
                        className=\"text-xs text-red-600 hover:underline disabled:opacity-60\"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className=\"flex items-center justify-between text-sm\">
            <div>
              <p className=\"font-medium\">
                Total ({cart.totalItems} items): ₹ {cart.totalPrice.toFixed(2)}
              </p>
            </div>
            <Link
              href=\"/checkout\"
              className=\"rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700\"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}



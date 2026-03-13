\"use client\";

import { useQuery } from \"@tanstack/react-query\";
import Link from \"next/link\";
import { useState } from \"react\";
import { api, ApiEnvelope } from \"../../../../lib/api\";

interface Product {
  sku: string;
  name: string;
  shortDescription: string;
  price: number;
  stock: number;
}

async function fetchProducts(search: string): Promise<Product[]> {
  const params = new URLSearchParams();
  if (search) params.set(\"search\", search);
  const query = params.toString();
  const path = `/products${query ? `?${query}` : \"\"}`;
  const res = await api.get<ApiEnvelope<Product[]>>(path);
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Failed to load products\");
  }
  return res.data;
}

export default function ProductsPage() {
  const [search, setSearch] = useState(\"\");
  const [submittedSearch, setSubmittedSearch] = useState(\"\");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [\"products\", submittedSearch],
    queryFn: () => fetchProducts(submittedSearch),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedSearch(search.trim());
  }

  return (
    <div className=\"w-full space-y-4\">
      <div className=\"flex items-center justify-between gap-3\">
        <h1 className=\"text-xl font-semibold tracking-tight\">Products</h1>
        <form onSubmit={handleSubmit} className=\"flex gap-2 text-sm\">
          <input
            type=\"text\"
            placeholder=\"Search products...\"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=\"rounded-md border px-3 py-1.5 shadow-sm\"
          />
          <button
            type=\"submit\"
            className=\"rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700\"
          >
            Search
          </button>
        </form>
      </div>
      {isLoading && <p className=\"text-sm\">Loading products...</p>}
      {isError && (
        <p className=\"text-sm text-red-600\">
          {(error as Error).message || \"Failed to load products\"}
        </p>
      )}
      <div className=\"grid gap-4 md:grid-cols-3\">
        {data?.map((product) => (
          <Link
            key={product.sku}
            href={`/products/${product.sku}`}
            className=\"rounded-lg border bg-white p-4 text-sm shadow-sm transition hover:shadow-md dark:bg-zinc-900\"
          >
            <h2 className=\"font-medium\">{product.name}</h2>
            <p className=\"mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400\">
              {product.shortDescription}
            </p>
            <p className=\"mt-3 text-sm font-semibold\">
              ₹ {product.price.toFixed(2)}
            </p>
            <p className=\"mt-1 text-xs text-zinc-500\">
              Stock: {product.stock}
            </p>
          </Link>
        ))}
      </div>
      {data && data.length === 0 && !isLoading && !isError && (
        <p className=\"text-sm text-zinc-600 dark:text-zinc-400\">
          No products found.
        </p>
      )}
    </div>
  );
}



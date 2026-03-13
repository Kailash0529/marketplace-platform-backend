\"use client\";

import { useMutation, useQueryClient } from \"@tanstack/react-query\";
import { FormEvent, useState } from \"react\";
import { api, ApiEnvelope } from \"../../../lib/api\";
import { useAuth } from \"../../components/auth-provider\";
import Link from \"next/link\";

interface OrderResponse {
  orderId: number;
  status: string;
  totalAmount: number;
  address: string;
}

async function createOrder(address: string): Promise<OrderResponse> {
  const res = await api.post<ApiEnvelope<OrderResponse>>(\"/order/create\", {
    address,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || \"Failed to create order\");
  }
  return res.data;
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState(\"\");
  const [message, setMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: (addr: string) => createOrder(addr),
    onSuccess: (order) => {
      setOrderId(order.orderId);
      setMessage(\"Order created successfully\");
      queryClient.invalidateQueries({ queryKey: [\"cart\"] });
    },
    onError: (err: unknown) => {
      setMessage(err instanceof Error ? err.message : \"Failed to create order\");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className=\"w-full\">
        <h1 className=\"text-xl font-semibold tracking-tight\">Checkout</h1>
        <p className=\"mt-2 text-sm text-zinc-600 dark:text-zinc-400\">
          Please{" "}
          <Link href=\"/login\" className=\"text-blue-600 underline\">
            login
          </Link>{" "}
          before checking out.
        </p>
      </div>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    mutation.mutate(address);
  }

  return (
    <div className=\"w-full max-w-lg\">
      <h1 className=\"text-xl font-semibold tracking-tight\">Checkout</h1>
      <p className=\"mt-2 text-sm text-zinc-600 dark:text-zinc-400\">
        Enter your shipping address to place an order from your current cart.
      </p>
      <form onSubmit={handleSubmit} className=\"mt-4 space-y-4\">
        <div>
          <label className=\"block text-sm font-medium\">Shipping address</label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className=\"mt-1 w-full rounded-md border px-3 py-2 text-sm shadow-sm\"
          />
        </div>
        {message && (
          <p className=\"text-sm text-zinc-700 dark:text-zinc-200\">
            {message}
            {orderId != null && (
              <>
                {\" \"}
                <span>(Order ID: {orderId})</span>
              </>
            )}
          </p>
        )}
        <button
          type=\"submit\"
          disabled={mutation.isPending}
          className=\"rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60\"
        >
          {mutation.isPending ? \"Placing order...\" : \"Place order\"}
        </button>
      </form>
    </div>
  );
}



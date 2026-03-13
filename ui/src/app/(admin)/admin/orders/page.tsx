"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { api, ApiEnvelope } from "../../../../../lib/api";

interface OrderResponse {
  orderId: number;
  status: string;
  totalAmount: number;
  address: string;
}

async function updateOrderStatus(
  orderId: number,
  status: string,
): Promise<OrderResponse> {
  const res = await api.patch<ApiEnvelope<OrderResponse>>(
    `/order/update/status?orderId=${orderId}`,
    status,
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update order status");
  }
  return res.data;
}

export default function AdminOrdersPage() {
  const [orderId, setOrderId] = useState<number | "">("");
  const [status, setStatus] = useState("SHIPPED");
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: (order) => {
      setMessage(`Updated order ${order.orderId} to ${order.status}`);
    },
    onError: (err: unknown) => {
      setMessage(
        err instanceof Error ? err.message : "Failed to update status",
      );
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (typeof orderId !== "number") return;
    mutation.mutate({ id: orderId, status });
  }

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Use this form to update the status of an existing order via{" "}
        <code>PATCH /order/update/status</code>.
      </p>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-3 rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900"
      >
        <div>
          <label className="block text-xs font-medium">Order ID</label>
          <input
            type="number"
            required
            value={orderId}
            onChange={(e) =>
              setOrderId(e.target.value ? Number(e.target.value) : "")
            }
            className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium">New status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
          >
            <option value="CREATED">CREATED</option>
            <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        {message && (
          <p className="text-xs text-zinc-700 dark:text-zinc-200">{message}</p>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Updating..." : "Update status"}
        </button>
      </form>
    </div>
  );
}



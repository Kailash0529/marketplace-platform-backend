"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { api, ApiEnvelope } from "../../../../../lib/api";

interface Product {
  sku: string;
  name: string;
  shortDescription: string;
  price: number;
  stock: number;
}

async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<ApiEnvelope<Product[]>>("/products");
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load products");
  }
  return res.data;
}

async function createProduct(input: Product): Promise<Product> {
  const res = await api.post<ApiEnvelope<Product>>("/products", input);
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create product");
  }
  return res.data;
}

async function deleteProduct(sku: string): Promise<void> {
  const res = await api.delete<ApiEnvelope<null>>(`/products/${sku}`);
  if (!res.success) {
    throw new Error(res.message || "Failed to delete product");
  }
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const [form, setForm] = useState<Product>({
    sku: "",
    name: "",
    shortDescription: "",
    price: 0,
    stock: 0,
  });

  const createMutation = useMutation({
    mutationFn: (input: Product) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setForm({
        sku: "",
        name: "",
        shortDescription: "",
        price: 0,
        stock: 0,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (sku: string) => deleteProduct(sku),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createMutation.mutate(form);
  }

  return (
    <div className="w-full space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Products</h1>
      <div className="rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">Create product</h2>
        <form onSubmit={handleSubmit} className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-xs font-medium">SKU</label>
            <input
              required
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium">
              Short description
            </label>
            <input
              required
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Stock</label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border px-2 py-1.5 text-sm shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {createMutation.isPending ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>
      </div>
      <div className="rounded-lg border bg-white p-4 text-sm shadow-sm dark:bg-zinc-900">
        <h2 className="text-sm font-semibold">Existing products</h2>
        {isLoading && <p className="mt-2 text-sm">Loading products...</p>}
        {isError && (
          <p className="mt-2 text-sm text-red-600">
            {(error as Error)?.message || "Failed to load products"}
          </p>
        )}
        <table className="mt-3 w-full border-collapse text-xs">
          <thead>
            <tr className="border-b text-left">
              <th className="py-1 pr-2">SKU</th>
              <th className="py-1 pr-2">Name</th>
              <th className="py-1 pr-2">Price</th>
              <th className="py-1 pr-2">Stock</th>
              <th className="py-1 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((p) => (
              <tr key={p.sku} className="border-b last:border-0">
                <td className="py-1 pr-2">{p.sku}</td>
                <td className="py-1 pr-2">{p.name}</td>
                <td className="py-1 pr-2">₹ {p.price.toFixed(2)}</td>
                <td className="py-1 pr-2">{p.stock}</td>
                <td className="py-1 text-right">
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(p.sku)}
                    disabled={deleteMutation.isPending}
                    className="text-red-600 hover:underline disabled:opacity-60"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-2 text-zinc-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



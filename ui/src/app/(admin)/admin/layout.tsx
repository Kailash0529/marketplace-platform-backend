import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full gap-6">
      <aside className="w-48 shrink-0 rounded-lg border bg-white p-4 text-sm dark:bg-zinc-900">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Admin
        </h2>
        <nav className="mt-3 flex flex-col gap-1">
          <Link href="/admin/products" className="hover:text-blue-600">
            Products
          </Link>
          <Link href="/admin/orders" className="hover:text-blue-600">
            Orders
          </Link>
          <Link href="/admin/members" className="hover:text-blue-600">
            Members
          </Link>
          <Link href="/admin/observability" className="hover:text-blue-600">
            Observability
          </Link>
        </nav>
      </aside>
      <section className="flex-1">{children}</section>
    </div>
  );
}


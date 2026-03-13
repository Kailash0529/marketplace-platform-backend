import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to the Marketplace
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Browse products, add them to your cart, and place orders. Switch to
          the admin area to manage products, orders, and members.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/products"
            className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Browse products
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            View cart
          </Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 text-sm dark:bg-zinc-900">
          <h2 className="font-medium">Customer journey</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Discover products, see details, manage your cart, and check out
            smoothly.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-sm dark:bg-zinc-900">
          <h2 className="font-medium">Admin control</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Manage catalog, orders, and members from a dedicated admin
            dashboard.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-sm dark:bg-zinc-900">
          <h2 className="font-medium">Observability</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Monitor traffic and performance through SigNoz, wired from the
            backend.
          </p>
        </div>
      </section>
    </div>
  );
}


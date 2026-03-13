import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Customer storefront and admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b bg-white/80 backdrop-blur dark:bg-zinc-900/80">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">Marketplace</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    Demo
                  </span>
                </div>
                <nav className="flex gap-4 text-sm">
                  <a href="/" className="hover:text-blue-600">
                    Storefront
                  </a>
                  <a href="/cart" className="hover:text-blue-600">
                    Cart
                  </a>
                  <a href="/orders" className="hover:text-blue-600">
                    My orders
                  </a>
                  <a href="/admin" className="hover:text-blue-600">
                    Admin
                  </a>
                  <a href="/login" className="hover:text-blue-600">
                    Login
                  </a>
                </nav>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6">
              {children}
            </main>
            <footer className="border-t bg-white/80 py-4 text-center text-xs text-zinc-500 dark:bg-zinc-900/80">
              <span>Marketplace demo · Connected to API Gateway at&nbsp;</span>
              <code className="rounded bg-zinc-100 px-1 py-0.5 text-[10px] dark:bg-zinc-800">
                {process.env.NEXT_PUBLIC_API_BASE_URL ??
                  "http://localhost:8090"}
              </code>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}



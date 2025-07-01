"use client";

import { Header } from "@/components/Header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-8">
        {children}
      </main>
    </>
  );
}

import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-4 sm:py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

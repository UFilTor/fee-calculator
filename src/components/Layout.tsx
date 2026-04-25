import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "var(--color-light-grey)",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "24px 24px 32px",
        }}
        className="sm:px-12"
      >
        {children}
      </div>
    </div>
  );
}

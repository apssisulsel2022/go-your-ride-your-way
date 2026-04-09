import { ReactNode } from "react";

interface DriverLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function DriverLayout({ children, noPadding }: DriverLayoutProps) {
  return (
    <div className="min-h-screen max-w-lg mx-auto relative bg-background">
      <main className={noPadding ? "" : "p-4"}>{children}</main>
    </div>
  );
}

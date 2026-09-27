import { ReactNode } from "react";

export function Screen({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
      </header>
      <div className="flex-1 space-y-3">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </main>
  );
}

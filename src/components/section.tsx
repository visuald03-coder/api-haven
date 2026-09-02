import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="canvas-glow border-b border-border">
      <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 md:pt-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-5 py-16", className)}>
      {title ? (
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

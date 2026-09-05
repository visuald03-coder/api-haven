import { Link } from "@tanstack/react-router";
import { Boxes } from "lucide-react";

const groups = [
  {
    title: "产品",
    items: [
      { label: "API 接入", to: "/api-access" as const },
      { label: "模型广场", to: "/models" as const },
      { label: "AI 能力", to: "/ai-studio" as const },
    ],
  },
  {
    title: "方案",
    items: [
      { label: "价格", to: "/pricing" as const },
      { label: "控制台", to: "/console" as const },
    ],
  },
];


export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-4" />
            </span>
            <span className="font-display text-[15px] font-semibold">API FLOW</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            一个统一网关，聚合全球大模型与 AI 能力。按量计费、企业级稳定、支持私有化交付。
          </p>
        </div>

        <div className="flex gap-16">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {g.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.items.map((i) => (
                  <li key={i.to}>
                    <Link
                      to={i.to}
                      className="text-sm text-foreground/80 transition-colors hover:text-copper"
                    >
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">
          © 2026 API FLOW · 本页为演示原型
        </p>
      </div>
    </footer>
  );
}

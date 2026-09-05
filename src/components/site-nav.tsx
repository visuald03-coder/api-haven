import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/api-access", label: "API 接入" },
  { to: "/models", label: "模型广场" },
  { to: "/ai-studio", label: "AI 能力" },
  { to: "/pricing", label: "价格" },
  { to: "/console", label: "控制台" },
] as const;


export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Boxes className="size-4" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            API FLOW
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&.active]:bg-secondary [&.active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button size="sm">免费试用</Button>
        </div>

        <button
          className="rounded-md p-2 text-muted-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-5 py-3 md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-muted-foreground [&.active]:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Button className="mt-3">免费试用</Button>
          </div>
        </div>
      )}
    </header>
  );
}

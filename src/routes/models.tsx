import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Zap, ArrowUpRight, Image as ImageIcon, Film, MessageSquare } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  priceModels,
  unitLabel,
  categoryLabels,
  vendorOf,
  priceRangeOf,
  hotModelIds,
  type PriceModel,
} from "@/data/pricing";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "模型广场 · 图片 / 视频 / LLM 全模型 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 模型广场按图片、视频、LLM 三类收录全部可调用模型：GPT、Gemini、Claude、DeepSeek、Qwen、Kimi、Nano Banana、GPT Image 2、Seedream、Seedance、MiniMax H3 等，价格与单价表一一对应。",
      },
      { property: "og:title", content: "模型广场 · 图片 / 视频 / LLM | API FLOW" },
      {
        property: "og:description",
        content: "图片、视频、LLM 三类模型统一接入，能力与价格一处对齐。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModelsPage,
});

const tabs = [
  { value: "all", label: "全部", icon: Zap },
  { value: "llm", label: "LLM", icon: MessageSquare },
  { value: "image", label: "图片", icon: ImageIcon },
  { value: "video", label: "视频", icon: Film },
] as const;
type Tab = (typeof tabs)[number]["value"];

const fmt = (n: number) => {
  if (n === 0) return "0";
  const s = n < 0.01 ? n.toFixed(6) : n.toFixed(n < 1 ? 4 : 2);
  return s.replace(/\.?0+$/, "");
};

const shortUnit = (unit: string) => (unitLabel[unit] ?? "").replace("USD / ", "");

function ModelCard({ m }: { m: PriceModel }) {
  const { min, max, saving } = priceRangeOf(m);
  const unit = shortUnit(m.unit);
  const hot = hotModelIds.has(m.id);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-paper transition-colors hover:border-copper/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-mono text-sm font-medium">{m.name}</span>
            {hot && (
              <Badge className="gap-1 bg-copper-soft text-accent-foreground hover:bg-copper-soft">
                <Zap className="size-3" />热门
              </Badge>
            )}
          </div>
          <div className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
            {m.alias ?? m.id}
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-[11px] font-normal">
          {categoryLabels[m.category]}
        </Badge>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-3">
        <div>
          <div className="font-mono text-[13px]">
            ${fmt(min)}
            {max > min && <span className="text-muted-foreground"> ~ ${fmt(max)}</span>}
            <span className="text-muted-foreground"> / {unit}</span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {vendorOf(m)} · {m.rows.length} 个规格
            {saving > 0 && <span className="text-sage"> · 省 {saving.toFixed(0)}%</span>}
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link to="/pricing">
            价格 <ArrowUpRight className="ml-1 size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ModelsPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [vendor, setVendor] = useState<string>("全部");
  const [q, setQ] = useState("");
  const [hotOnly, setHotOnly] = useState(false);

  const counts = useMemo(
    () =>
      priceModels.reduce(
        (acc, m) => {
          acc[m.category]++;
          acc.all++;
          return acc;
        },
        { all: 0, image: 0, video: 0, llm: 0 } as Record<Tab, number>,
      ),
    [],
  );

  const vendors = useMemo(() => {
    const pool = priceModels.filter((m) => tab === "all" || m.category === tab);
    const map = new Map<string, number>();
    pool.forEach((m) => map.set(vendorOf(m), (map.get(vendorOf(m)) ?? 0) + 1));
    return ["全部", ...[...map.entries()].sort((a, b) => b[1] - a[1]).map(([v]) => v)];
  }, [tab]);

  const list = useMemo(() => {
    const key = q.trim().toLowerCase();
    return priceModels
      .filter((m) => {
        if (tab !== "all" && m.category !== tab) return false;
        if (vendor !== "全部" && vendorOf(m) !== vendor) return false;
        if (hotOnly && !hotModelIds.has(m.id)) return false;
        if (!key) return true;
        return `${m.id} ${m.name} ${m.alias ?? ""} ${vendorOf(m)}`.toLowerCase().includes(key);
      })
      .sort((a, b) => {
        const ha = hotModelIds.has(a.id) ? 0 : 1;
        const hb = hotModelIds.has(b.id) ? 0 : 1;
        return ha - hb || a.name.localeCompare(b.name);
      });
  }, [tab, vendor, q, hotOnly]);

  return (
    <>
      <PageHeader
        eyebrow="Model Square"
        title="图片 · 视频 · LLM，一张模型清单"
        description="模型分类与价格表完全一致：LLM 覆盖 GPT、Gemini、Claude、DeepSeek、Qwen、Kimi；生图覆盖 Nano Banana、GPT Image 2、Seedream、Flux；生视频覆盖 Seedance 2.5、MiniMax H3、Kling、Veo、Sora。"
      >
        <div className="flex flex-wrap gap-8">
          {[
            [String(counts.all), "在线模型"],
            [String(counts.llm), "LLM"],
            [String(counts.image), "图片模型"],
            [String(counts.video), "视频模型"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-2xl font-semibold">{n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </PageHeader>

      <Section className="pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTab(t.value);
                  setVendor("全部");
                }}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  tab === t.value
                    ? "border-copper bg-copper text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="size-3.5" />
                {t.label}
                <span className="text-[11px] opacity-70">({counts[t.value]})</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHotOnly((v) => !v)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                hotOnly
                  ? "border-copper bg-copper-soft text-accent-foreground"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              只看热门
            </button>
            <div className="relative md:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索模型或厂商"
                className="bg-surface pl-9"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {vendors.map((v) => (
            <button
              key={v}
              onClick={() => setVendor(v)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                vendor === v
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          共 {list.length} 个模型 · 价格为 USD 起价，与「价格」页单价表同源
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m) => (
            <ModelCard key={m.id} m={m} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            没有匹配的模型，换个关键词或分类试试。
          </p>
        )}
      </Section>
    </>
  );
}

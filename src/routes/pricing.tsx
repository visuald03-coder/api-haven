import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Zap } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  priceModels,
  unitLabel,
  vendorOf,
  priceRangeOf,
  hotModelIds,
  categoryLabels,
  type PriceModel,
} from "@/data/pricing";


export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "价格 · 模型单价表 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 按图片、视频、LLM 分类展示全部模型单价，价格公开透明，按实际调用扣减，无月租无最低消费。",
      },
      { property: "og:title", content: "价格 · 模型单价表 | API FLOW" },
      {
        property: "og:description",
        content: "按图片、视频、LLM 分类的完整模型单价表，按实际调用扣减。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const categoryTabs = [
  { value: "all", label: "全部" },
  { value: "llm", label: "LLM" },
  { value: "image", label: "图片" },
  { value: "video", label: "视频" },
] as const;
type Category = (typeof categoryTabs)[number]["value"];

const fmt = (n: number) => {
  if (n === 0) return "0";
  const s = n < 0.01 ? n.toFixed(6) : n.toFixed(n < 1 ? 4 : 2);
  return s.replace(/\.?0+$/, "");
};

const shortUnit = (unit: string) => (unitLabel[unit] ?? "").replace("USD / ", "");

function PriceCard({ m }: { m: PriceModel }) {
  const { min, max, officialMin, saving } = priceRangeOf(m);
  const unit = shortUnit(m.unit);
  const hot = hotModelIds.has(m.id);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-paper transition-colors hover:border-copper/60">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{m.name}</span>
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

      <div className="mt-auto border-t border-border/70 pt-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[15px]">
              ${fmt(min)}
              {max > min && <span className="text-muted-foreground"> ~ ${fmt(max)}</span>}
              <span className="text-xs text-muted-foreground"> / {unit}</span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              官方 ${fmt(officialMin)} 起 · {vendorOf(m)} · {m.rows.length} 个规格
            </div>
          </div>
          {saving > 0 && (
            <span className="shrink-0 rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage">
              省 {saving.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PricingPage() {
  const [category, setCategory] = useState<Category>("llm");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () =>
      priceModels.reduce(
        (acc, m) => {
          acc[m.category]++;
          acc.all++;
          return acc;
        },
        { all: 0, image: 0, video: 0, llm: 0 },
      ),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return priceModels
      .filter((m) => {
        if (category !== "all" && m.category !== category) return false;
        if (!q) return true;
        return `${m.id} ${m.name} ${m.alias ?? ""} ${vendorOf(m)}`.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const ha = hotModelIds.has(a.id) ? 0 : 1;
        const hb = hotModelIds.has(b.id) ? 0 : 1;
        return ha - hb || a.name.localeCompare(b.name);
      });
  }, [category, query]);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="模型单价表"
        description="按图片、视频、LLM 分类，与模型广场一一对应。每个模型一张卡片，展示起价区间与相对官方价的节省。调用一次扣一次，无月租、无最低消费。"
      />

      <Section title="按分类查看全部模型价格" className="pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
            <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
              {categoryTabs.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm data-[state=active]:border-copper data-[state=active]:bg-copper data-[state=active]:text-primary-foreground"
                >
                  {t.label}
                  <span className="ml-1.5 text-[11px] opacity-70">({counts[t.value]})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索模型名称、ID 或厂商..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-surface pl-9"
            />
          </div>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          共 {filtered.length} 个模型 · 价格为 USD 起价，实际扣款按实时汇率换算为积分，1 元 ≈ 1,000 积分
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <PriceCard key={m.id} m={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            没有匹配的模型，换个关键词或分类试试。
          </p>
        )}
      </Section>
    </>
  );
}


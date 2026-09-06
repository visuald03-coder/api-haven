import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priceModels, unitLabel } from "@/data/pricing";

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
  { value: "image", label: "图片" },
  { value: "video", label: "视频" },
  { value: "llm", label: "LLM" },
] as const;
type Category = (typeof categoryTabs)[number]["value"];

const categoryLabel: Record<Exclude<Category, "all">, string> = {
  image: "图片",
  video: "视频",
  llm: "LLM",
};

const fmtPrice = (n: number) => {
  const fixed = n.toFixed(6);
  return fixed.replace(/\.?0+$/, "");
};

const savingsText = (official: number, our: number) => {
  if (!official || official <= our) return null;
  const pct = ((official - our) / official) * 100;
  return `${pct.toFixed(1)}%`;
};

function PricingPage() {
  const [category, setCategory] = useState<Category>("llm");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    return priceModels.reduce(
      (acc, m) => {
        acc[m.category]++;
        acc.all++;
        return acc;
      },
      { all: 0, image: 0, video: 0, llm: 0 }
    );
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return priceModels.filter((m) => {
      if (category !== "all" && m.category !== category) return false;
      if (!q) return true;
      const hay = `${m.id} ${m.name} ${m.alias ?? ""} ${m.rows
        .map((r) => r.spec)
        .join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [category, query]);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="模型单价表"
        description="按图片、视频、LLM 分类，所有模型与规格的价格公开透明。调用一次扣一次，无月租、无最低消费。"
      />

      <Section title="按分类查看全部模型价格" className="pt-0">
        <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
          <TabsList className="mb-5 flex flex-wrap gap-2 bg-transparent p-0">
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索模型名称、ID 或规格..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-5 pl-9"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  模型
                </th>
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  规格
                </th>
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  API FLOW 单价
                </th>
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  官方单价
                </th>
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  节省
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) =>
                m.rows.map((r, i) => {
                  const unit = unitLabel[m.unit].replace("USD / ", "");
                  const save = savingsText(r.official, r.our);
                  return (
                    <tr
                      key={`${m.id}-${r.spec}`}
                      className="border-b border-border/70 last:border-0"
                    >
                      {i === 0 && (
                        <td
                          rowSpan={m.rows.length}
                          className="px-5 py-3.5 align-top font-medium"
                        >
                          <div>{m.name}</div>
                          {m.alias && (
                            <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                              {m.alias}
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-muted-foreground">{r.spec}</td>
                      <td className="px-5 py-3.5 font-mono text-[12.5px]">
                        ${fmtPrice(r.our)} / {unit}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">
                        ${fmtPrice(r.official)} / {unit}
                      </td>
                      <td className="px-5 py-3.5">
                        {save ? (
                          <span className="font-medium text-sage">{save}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                  >
                    未找到匹配的 {categoryLabel[category as Exclude<Category, "all">] || ""} 模型
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          价格为 USD，按模型原始计费单位展示；实际扣款按实时汇率换算为积分，1 元 ≈ 1,000 积分。
        </p>
      </Section>
    </>
  );
}

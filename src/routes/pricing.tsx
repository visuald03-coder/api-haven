import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Zap, ArrowDownRight } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  priceModels,
  unitLabel,
  vendorOf,
  hotModelIds,
  categoryLabels,
  type PriceModel,
  type PriceRow,
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


function modelDescription(m: PriceModel): string {
  if (m.description) return m.description;
  const map: Record<string, string> = {
    "gemini-2.5-flash-image-preview": "Google 高性价比生图模型，适合快速创意草图",
    "gemini-3-pro-image-preview": "Google 旗舰生图模型，细节与语义对齐更强",
    "gemini-3.1-flash-image-preview": "Google 新一代轻量生图模型，速度与质量兼顾",
    "gpt-image-2": "OpenAI 最新原生生图模型，提示词遵循度极高",
    "seedream-5-0-pro": "字节跳动 Seedream 系列旗舰，中文场景表现出色",
    "flux-2-pro": "Black Forest Labs 专业级生图模型，商用质感突出",
    "qwen-image-3.0": "阿里通义千问生图模型，中文理解与图文对齐优秀",
    midjourney: "全球知名艺术风格生图平台，社区生态丰富",
    "seedance-2.5": "字节跳动高画质视频生成模型，运动一致性优秀",
    "seedance-2.0": "字节跳动视频生成基础版，性价比之选",
    "MiniMax-H3": "MiniMax 高性能视频生成模型，镜头语言自然",
    "MiniMax-Hailuo-2.3": "MiniMax 海螺视频模型，适合短视频与广告",
    "kling-v3": "快手 Kling 视频生成模型，物理规律理解强",
    "sora-2-pro": "OpenAI Sora 专业级视频生成，电影感镜头突出",
    "veo3.1-quality": "Google Veo 高质量视频生成模型，语义控制精准",
    "wan2.7": "阿里 Wan 视频生成模型，开源生态与效果兼顾",
    "gpt-5.2": "OpenAI 最新旗舰大模型，复杂推理与代码能力突出",
    "gpt-5.1": "OpenAI 旗舰大模型，综合性能与稳定性俱佳",
    "gpt-5.1-codex": "OpenAI 专为代码与工具调用优化的模型",
    "gemini-3-pro-preview": "Google 旗舰多模态大模型，长上下文与推理优秀",
    "gemini-3-flash-preview": "Google 轻量多模态大模型，响应快成本低",
    "claude-opus-4-6": "Anthropic 最强推理与写作模型，长文理解突出",
    "claude-sonnet-4-6": "Anthropic 平衡性能与速度的主力模型",
    "deepseek-v4-pro": "DeepSeek 最新专业版，推理与代码能力突出",
    "deepseek-v3.2": "DeepSeek 轻量高效模型，日常任务性价比之选",
    "qwen3.8-max": "阿里通义千问旗舰模型，中文理解与知识问答强",
    "kimi-k3": "Moonshot 长上下文与文档理解旗舰模型",
    "glm-5.2": "智谱 GLM 新一代旗舰，中文场景与 Agent 能力突出",
    "grok-4.6": "xAI 最新大模型，实时信息与推理能力突出",
    minimax_m3: "MiniMax 主力大模型，中文对话与创作优秀",
  };
  return map[m.id] ?? (m.alias ? `模型 ID: ${m.alias}` : `模型 ID: ${m.id}`);
}

function savingOf(row: PriceRow) {
  if (row.official <= 0) return 0;
  return Math.round(((row.official - row.our) / row.official) * 100);
}

function PriceTable({ m }: { m: PriceModel }) {
  const unit = shortUnit(m.unit);
  const hot = hotModelIds.has(m.id);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-paper">
      {/* Header row */}
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          {vendorLogos[vendorOf(m)] ? (
            <img
              src={vendorLogos[vendorOf(m)]}
              alt=""
              className="size-6 rounded-md object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex size-6 items-center justify-center rounded-md bg-surface font-mono text-[10px] font-bold text-muted-foreground">
              {vendorOf(m).slice(0, 1)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold tracking-tight">{m.name}</span>
              {hot && (
                <Badge className="gap-1 bg-copper-soft text-accent-foreground hover:bg-copper-soft">
                  <Zap className="size-3" />热门
                </Badge>
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {modelDescription(m)}
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-muted-foreground md:mt-0">
          {m.rows.length} 个价格档位
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-4 border-b border-border bg-surface/50 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <div>规格</div>
        <div className="text-right">我们的价格</div>
        <div className="text-right">官方价格</div>
        <div className="text-right">节省</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/70">
        {m.rows.map((row, idx) => {
          const saving = savingOf(row);
          return (
            <div
              key={`${row.spec}-${idx}`}
              className="grid grid-cols-4 items-center px-5 py-3 text-sm"
            >
              <div className="font-medium">{row.spec}</div>
              <div className="text-right font-mono text-foreground">
                {fmt(row.our)}
                <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
              </div>
              <div className="text-right font-mono text-muted-foreground line-through">
                {fmt(row.official)}
                <span className="ml-1 text-xs">{unit}</span>
              </div>
              <div className="flex items-center justify-end gap-1 font-mono text-xs text-sage">
                {saving > 0 ? (
                  <>
                    <ArrowDownRight className="size-3" />
                    {saving}%
                  </>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
            </div>
          );
        })}
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
        return `${m.id} ${m.name} ${m.alias ?? ""} ${vendorOf(m)} ${modelDescription(m)}`.toLowerCase().includes(q);
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
        description="按图片、视频、LLM 分类，与模型广场一一对应。每个模型一个清单，展示全部规格、我们的价格、官方价格与节省比例。调用一次扣一次，无月租、无最低消费。"
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
          共 {filtered.length} 个模型 · 价格为 USD，实际扣款按实时汇率换算为积分，1 元 ≈ 1,000 积分
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {filtered.map((m) => (
            <PriceTable key={m.id} m={m} />
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

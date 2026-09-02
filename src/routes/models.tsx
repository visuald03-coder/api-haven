import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Zap, Eye, Wrench, ArrowUpRight } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "模型广场 · 200+ 大模型统一比价 | API MART" },
      {
        name: "description",
        content:
          "对比 GPT、Claude、Gemini、DeepSeek、Qwen 等 200+ 模型的上下文、能力标签与每百万 token 价格，一键切换。",
      },
      { property: "og:title", content: "模型广场 · API MART" },
      { property: "og:description", content: "200+ 大模型的能力与价格，一处对比一键切换。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ModelsPage,
});

type Model = {
  id: string;
  vendor: string;
  category: "对话" | "推理" | "多模态" | "生图" | "语音" | "向量";
  context: string;
  input: string;
  output: string;
  tags: string[];
  hot?: boolean;
};

const MODELS: Model[] = [
  { id: "gpt-5.1", vendor: "OpenAI", category: "对话", context: "400K", input: "¥8.9", output: "¥26.7", tags: ["视觉", "工具"], hot: true },
  { id: "o4-reasoning", vendor: "OpenAI", category: "推理", context: "200K", input: "¥15.0", output: "¥60.0", tags: ["长链推理"] },
  { id: "claude-4.5-sonnet", vendor: "Anthropic", category: "对话", context: "1M", input: "¥7.2", output: "¥36.0", tags: ["代码", "工具"], hot: true },
  { id: "claude-4.5-haiku", vendor: "Anthropic", category: "对话", context: "200K", input: "¥1.8", output: "¥7.2", tags: ["低延迟"] },
  { id: "gemini-3-pro", vendor: "Google", category: "多模态", context: "2M", input: "¥6.5", output: "¥25.0", tags: ["视频", "视觉"], hot: true },
  { id: "gemini-3-flash", vendor: "Google", category: "多模态", context: "1M", input: "¥0.6", output: "¥2.4", tags: ["高并发"] },
  { id: "deepseek-v4", vendor: "DeepSeek", category: "推理", context: "128K", input: "¥1.0", output: "¥4.0", tags: ["性价比"], hot: true },
  { id: "qwen3-max", vendor: "阿里云", category: "对话", context: "256K", input: "¥2.4", output: "¥9.6", tags: ["中文"] },
  { id: "kimi-k2", vendor: "月之暗面", category: "对话", context: "512K", input: "¥2.0", output: "¥8.0", tags: ["长文档"] },
  { id: "glm-5", vendor: "智谱", category: "对话", context: "200K", input: "¥1.6", output: "¥6.4", tags: ["Agent"] },
  { id: "flux-2-pro", vendor: "BFL", category: "生图", context: "—", input: "¥0.28/张", output: "—", tags: ["高保真"] },
  { id: "seedream-4", vendor: "字节", category: "生图", context: "—", input: "¥0.14/张", output: "—", tags: ["中文渲字"] },
  { id: "whisper-lg-v3", vendor: "OpenAI", category: "语音", context: "—", input: "¥0.04/分钟", output: "—", tags: ["转写"] },
  { id: "cosyvoice-3", vendor: "阿里云", category: "语音", context: "—", input: "¥0.09/千字", output: "—", tags: ["音色克隆"] },
  { id: "bge-m3", vendor: "BAAI", category: "向量", context: "8K", input: "¥0.05", output: "—", tags: ["多语言"] },
  { id: "text-embed-4", vendor: "OpenAI", category: "向量", context: "8K", input: "¥0.09", output: "—", tags: ["检索"] },
];

const CATEGORIES = ["全部", "对话", "推理", "多模态", "生图", "语音", "向量"] as const;

function ModelsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("全部");

  const list = useMemo(
    () =>
      MODELS.filter(
        (m) =>
          (cat === "全部" || m.category === cat) &&
          (m.id.includes(q.toLowerCase()) || m.vendor.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, cat],
  );

  return (
    <>
      <PageHeader
        eyebrow="Model Square"
        title="200+ 模型，同一份价目表"
        description="按能力和成本挑模型，而不是按你手上有哪家的账号。价格为每百万 token 参考价，实时同步厂商调价。"
      >
        <div className="flex flex-wrap gap-8">
          {[
            ["216", "在线模型"],
            ["29", "接入厂商"],
            ["99.98%", "网关可用性"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-2xl font-semibold">{n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </PageHeader>

      <Section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索模型或厂商"
              className="bg-surface pl-9"
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-paper">
          <div className="hidden grid-cols-[2.2fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-4 border-b border-border bg-surface-2 px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:grid">
            <span>模型</span>
            <span>厂商</span>
            <span>上下文</span>
            <span>输入</span>
            <span>输出</span>
            <span />
          </div>
          {list.map((m) => (
            <div
              key={m.id}
              className="grid gap-2 border-b border-border/70 px-5 py-4 transition-colors last:border-0 hover:bg-surface-2 md:grid-cols-[2.2fr_1fr_0.8fr_0.8fr_0.8fr_auto] md:items-center md:gap-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-medium">{m.id}</span>
                {m.hot && (
                  <Badge className="gap-1 bg-copper-soft text-accent-foreground hover:bg-copper-soft">
                    <Zap className="size-3" />热门
                  </Badge>
                )}
                {m.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[11px] font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{m.vendor}</span>
              <span className="text-sm text-muted-foreground">{m.context}</span>
              <span className="text-sm">{m.input}</span>
              <span className="text-sm">{m.output}</span>
              <Button variant="ghost" size="sm" className="justify-self-start md:justify-self-end">
                调用 <ArrowUpRight className="ml-1 size-3.5" />
              </Button>
            </div>
          ))}
          {list.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              没有匹配的模型，换个关键词试试。
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Eye className="size-3.5" /> 视觉输入
          </span>
          <span className="flex items-center gap-1.5">
            <Wrench className="size-3.5" /> 工具调用 / Function Calling
          </span>
          <span>价格单位：元 / 百万 token（生图与语音另计）</span>
        </div>
      </Section>
    </>
  );
}

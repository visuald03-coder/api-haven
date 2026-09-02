import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Image as ImageIcon,
  FileText,
  Mic,
  ScanText,
  Sparkles,
  Video,
  Wand2,
  Workflow,
} from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/ai-studio")({
  head: () => ({
    meta: [
      { title: "AI 能力 · 生图、语音、文档解析开箱即用 | API MART" },
      {
        name: "description",
        content:
          "封装好的 AI Skill：文生图、图像编辑、语音转写、文档解析、视频生成与工作流编排，一个接口直接调用。",
      },
      { property: "og:title", content: "AI 能力 · API MART" },
      { property: "og:description", content: "生图、语音、文档解析等 AI Skill，一个接口直接调用。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiStudioPage,
});

const skills = [
  {
    icon: ImageIcon,
    name: "文生图 / 图像编辑",
    endpoint: "POST /v1/images/generations",
    desc: "多引擎并行出图，支持参考图、局部重绘、去背、超分与中文渲字。",
    tags: ["Flux", "Seedream", "SDXL"],
  },
  {
    icon: Mic,
    name: "语音转写与合成",
    endpoint: "POST /v1/audio/*",
    desc: "长音频分段转写、说话人分离、时间戳输出，以及音色克隆的 TTS。",
    tags: ["ASR", "TTS", "克隆"],
  },
  {
    icon: FileText,
    name: "文档解析",
    endpoint: "POST /v1/skills/doc-parse",
    desc: "PDF / Word / 扫描件转为结构化 Markdown，保留表格与公式，可直接入库做 RAG。",
    tags: ["OCR", "表格", "Markdown"],
  },
  {
    icon: ScanText,
    name: "信息抽取",
    endpoint: "POST /v1/skills/extract",
    desc: "给一个 JSON Schema，返回严格校验后的结构化字段，用于发票、合同、简历。",
    tags: ["Schema", "严格模式"],
  },
  {
    icon: Video,
    name: "视频生成",
    endpoint: "POST /v1/videos/generations",
    desc: "文生视频与图生视频，支持首尾帧控制、时长与比例设置，异步任务回调。",
    tags: ["异步", "回调"],
  },
  {
    icon: Workflow,
    name: "工作流编排",
    endpoint: "POST /v1/flows/{id}/run",
    desc: "把多个 Skill 串成一条链：解析文档 → 抽取字段 → 生成摘要 → 写回你的系统。",
    tags: ["链式", "重试"],
  },
];

const presets = [
  "一张米白色纸质质感的产品海报，正中一枚铜色徽章",
  "把这张照片的背景换成清晨的落地窗，保持人物光影一致",
  "为这份 30 页的招股书生成中文摘要与风险清单",
];

function AiStudioPage() {
  const [prompt, setPrompt] = useState(presets[0]);

  return (
    <>
      <PageHeader
        eyebrow="AI Skills"
        title="不只是模型，是能直接上线的能力"
        description="生图、转写、解析、抽取这些活儿，我们已经把选模型、切分、重试、后处理都做完了。你只需要一次调用。"
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg">
            <Sparkles className="mr-1.5 size-4" /> 打开在线体验台
          </Button>
          <Button size="lg" variant="outline">
            Skill 文档
          </Button>
        </div>
      </PageHeader>

      <Section title="在线体验台" description="原型演示：填提示词，看看请求会长什么样。">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="panel p-6">
            <div className="flex items-center gap-2">
              <Wand2 className="size-4 text-copper" />
              <span className="text-sm font-medium">图像生成</span>
              <Badge variant="secondary" className="ml-auto font-mono text-[11px]">
                flux-2-pro
              </Badge>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="mt-4 resize-none bg-surface"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setPrompt(p)}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.slice(0, 12)}…
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full">生成</Button>
          </div>

          <div className="panel overflow-hidden">
            <div className="border-b border-border bg-surface-2 px-4 py-2.5 font-mono text-xs text-muted-foreground">
              request preview
            </div>
            <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed text-foreground/85">
              <code>{`POST /v1/images/generations
{
  "model": "flux-2-pro",
  "prompt": "${prompt}",
  "size": "1024x1024",
  "n": 1
}`}</code>
            </pre>
          </div>
        </div>
      </Section>

      <Section title="能力清单">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <div key={s.name} className="panel flex flex-col p-6 transition-shadow hover:shadow-lift">
              <s.icon className="size-5 text-copper" />
              <h3 className="mt-4 text-base font-semibold">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <code className="mt-4 block truncate rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] text-muted-foreground">
                {s.endpoint}
              </code>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[11px] font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

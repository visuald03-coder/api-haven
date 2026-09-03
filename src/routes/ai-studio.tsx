import { createFileRoute } from "@tanstack/react-router";
import {
  Image as ImageIcon,
  FileText,
  Mic,
  ScanText,
  Palette,
  Scissors,
  Music2,
  Languages,
  Presentation,
  Sparkles,
  Video,
  Workflow,
} from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ai-studio")({
  head: () => ({
    meta: [
      { title: "AI 能力 · 生图、语音、文档解析开箱即用 | API FLOW" },
      {
        name: "description",
        content:
          "封装好的 AI Skill：文生图、图像编辑、语音转写、文档解析、视频生成与工作流编排，一个接口直接调用。",
      },
      { property: "og:title", content: "AI 能力 · API FLOW" },
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

const practical = [
  {
    icon: Palette,
    name: "审美提升 Skill",
    endpoint: "aesthetic-boost",
    desc: "给一张草稿图或界面截图，自动重排构图、统一配色与字体层级，输出更高级的版本。设计不及格的图也能救回来。",
    stat: "平均美学分 +32%",
    tags: ["构图", "配色", "版式"],
  },
  {
    icon: Scissors,
    name: "视频混剪 Skill",
    endpoint: "video-remix",
    desc: "丢进一批素材和一句主题，自动挑高光片段、卡点剪辑、加转场与字幕，直出竖版或横版成片。",
    stat: "10 分钟素材 → 45 秒成片",
    tags: ["卡点", "字幕", "竖版"],
  },
  {
    icon: Presentation,
    name: "一句话成稿 Skill",
    endpoint: "deck-writer",
    desc: "一句需求生成结构化 PPT / 图文稿：大纲、文案、配图提示词一并给全，可导出 PPTX 与 Markdown。",
    stat: "支持 PPTX 导出",
    tags: ["大纲", "配图", "导出"],
  },
  {
    icon: Music2,
    name: "口播配音 Skill",
    endpoint: "voice-over",
    desc: "文稿自动断句、加停顿与情绪，配上克隆音色生成口播音频，并输出对齐好的字幕轨。",
    stat: "12 种情绪风格",
    tags: ["情绪", "字幕轨"],
  },
  {
    icon: Languages,
    name: "本地化 Skill",
    endpoint: "localize",
    desc: "整站文案、视频字幕、图内文字一起翻译并回填，保留术语表与占位符，不破坏排版。",
    stat: "32 种语言",
    tags: ["术语表", "图内文字"],
  },
  {
    icon: Sparkles,
    name: "商品图美化 Skill",
    endpoint: "product-shot",
    desc: "手机随手拍的实物图，换背景、补光影、生成多尺寸主图与详情图，直接上架电商平台。",
    stat: "一次出 6 个尺寸",
    tags: ["电商", "多尺寸"],
  },
];

function AiStudioPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Skills"
        title="不只是模型，是能直接上线的能力"
        description="生图、转写、解析、抽取这些活儿，我们已经把选模型、切分、重试、后处理都做完了。你只需要一次调用。"
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg">
            <Sparkles className="mr-1.5 size-4" /> 查看全部 Skill
          </Button>
          <Button size="lg" variant="outline">
            Skill 文档
          </Button>
        </div>
      </PageHeader>

      <Section
        title="超实用 Skill 精选"
        description="不是 demo 级的玩具，而是团队每天真的会调的那几个：把审美、剪辑、排版这些最费人的环节自动化。"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practical.map((s) => (
            <div
              key={s.name}
              className="panel flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-copper-soft text-accent-foreground">
                  <s.icon className="size-4" />
                </span>
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {s.stat}
                </Badge>
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <code className="mt-4 block truncate rounded-md bg-surface-2 px-2.5 py-1.5 font-mono text-[11.5px] text-muted-foreground">
                skill: {s.endpoint}
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

      <Section title="基础能力清单" description="所有 Skill 都建立在这几类原子能力之上。" className="pt-0">
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

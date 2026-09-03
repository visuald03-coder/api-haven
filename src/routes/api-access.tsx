import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, KeyRound, Plug, ShieldCheck, Terminal } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/api-access")({
  head: () => ({
    meta: [
      { title: "API 接入 · 一行改动切换全球模型 | API FLOW" },
      {
        name: "description",
        content:
          "兼容 OpenAI 协议的统一网关：替换 base_url 即可接入 200+ 模型，支持流式、函数调用、多密钥与用量配额。",
      },
      { property: "og:title", content: "API 接入 · API FLOW" },
      {
        property: "og:description",
        content: "兼容 OpenAI 协议的统一网关，一行改动接入 200+ 模型。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApiAccessPage,
});

const snippets = {
  curl: `curl https://api.apiflow.dev/v1/chat/completions \\
  -H "Authorization: Bearer $APIMART_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5.1",
    "messages": [{ "role": "user", "content": "你好" }],
    "stream": true
  }'`,
  python: `from openai import OpenAI

client = OpenAI(
    api_key=os.environ["APIMART_KEY"],
    base_url="https://api.apiflow.dev/v1",  # 只改这一行
)

resp = client.chat.completions.create(
    model="claude-4.5-sonnet",
    messages=[{"role": "user", "content": "总结这份合同的风险点"}],
)
print(resp.choices[0].message.content)`,
  node: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.APIMART_KEY,
  baseURL: "https://api.apiflow.dev/v1",
});

const stream = await client.chat.completions.create({
  model: "gemini-3-pro",
  messages: [{ role: "user", content: "写一段落地页文案" }],
  stream: true,
});`,
};

type Lang = keyof typeof snippets;

const steps = [
  {
    icon: KeyRound,
    title: "1 · 创建密钥",
    body: "控制台一键生成 API Key，可按项目、环境、成员分别限额，支持 IP 白名单与到期时间。",
  },
  {
    icon: Plug,
    title: "2 · 替换 base_url",
    body: "完全兼容 OpenAI / Anthropic 协议，官方 SDK 无需改造，流式与工具调用行为一致。",
  },
  {
    icon: ShieldCheck,
    title: "3 · 上线与观测",
    body: "自动重试、跨厂商故障转移、逐次调用的 token 与延迟明细，异常可回放请求体。",
  },
];

const specs = [
  ["协议兼容", "OpenAI / Anthropic / Gemini 原生格式"],
  ["流式", "SSE 流式输出，首字延迟 < 400ms"],
  ["能力", "Function Calling、JSON Mode、视觉输入"],
  ["限流", "按 Key 设置 RPM / TPM / 日预算"],
  ["回退", "主模型异常自动切换备用模型"],
  ["日志", "30 天调用明细，可导出 CSV"],
];

function ApiAccessPage() {
  const [lang, setLang] = useState<Lang>("python");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <PageHeader
        eyebrow="API Access"
        title={
          <>
            一个网关，
            <br />
            接住你所有模型调用
          </>
        }
        description="不用为每家厂商维护一套 SDK、一份密钥和一套计费。替换 base_url，剩下的路由、重试、配额和账单都交给 API FLOW。"
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg">获取 API Key</Button>
          <Button size="lg" variant="outline">
            查看接口文档
          </Button>
        </div>
      </PageHeader>

      <Section title="三步接入" description="从注册到生产流量，通常不超过十分钟。">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="panel p-6">
              <s.icon className="size-5 text-copper" />
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="立刻可跑的示例"
        description="下面的代码可直接复制运行，模型名替换成模型广场里的任意 ID。"
      >
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
            <div className="flex items-center gap-1">
              {(Object.keys(snippets) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    lang === l
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? <Check className="size-3.5 text-sage" /> : <Copy className="size-3.5" />}
              {copied ? "已复制" : "复制"}
            </button>
          </div>
          <pre className="overflow-x-auto bg-surface px-5 py-5 font-mono text-[12.5px] leading-relaxed text-foreground/85">
            <code>{snippets[lang]}</code>
          </pre>
        </div>
      </Section>

      <Section title="接口能力一览">
        <div className="grid gap-x-10 gap-y-0 md:grid-cols-2">
          {specs.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-6 border-b border-border py-4"
            >
              <span className="text-sm font-medium">{k}</span>
              <span className="text-right text-sm text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1.5">
            <Terminal className="size-3" /> OpenAPI 3.1 规范可下载
          </Badge>
          <Badge variant="secondary">Postman 集合</Badge>
          <Badge variant="secondary">SDK: Python / Node / Go</Badge>
        </div>
      </Section>
    </>
  );
}

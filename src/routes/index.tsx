import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Gauge,
  Image as ImageIcon,
  Layers,
  ServerCog,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Eyebrow, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "API MART · 统一网关聚合 200+ 大模型与 AI 能力" },
      {
        name: "description",
        content:
          "一个兼容 OpenAI 协议的网关，聚合 200+ 大模型、生图与语音等 AI Skill，按量计费，并支持私有化部署。",
      },
      { property: "og:title", content: "API MART · 统一 AI 网关" },
      {
        property: "og:description",
        content: "聚合 200+ 大模型与 AI 能力，一行改动接入，支持私有化部署。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const modules = [
  {
    to: "/api-access" as const,
    icon: Boxes,
    name: "API 接入",
    desc: "替换 base_url 即可调用全部模型，自动重试与跨厂商故障转移。",
    meta: "OpenAI 协议兼容",
  },
  {
    to: "/models" as const,
    icon: Layers,
    name: "模型广场",
    desc: "216 个在线模型的上下文、能力标签与每百万 token 价格，一处对比。",
    meta: "29 家厂商",
  },
  {
    to: "/ai-studio" as const,
    icon: ImageIcon,
    name: "AI 能力",
    desc: "生图、语音转写、文档解析、信息抽取，封装成开箱即用的 Skill。",
    meta: "12 个 Skill",
  },
  {
    to: "/pricing" as const,
    icon: Wallet,
    name: "价格",
    desc: "按量计费无最低消费，预付阶梯折扣，团队与企业版可享 SLA。",
    meta: "8 折起",
  },
  {
    to: "/deploy" as const,
    icon: ServerCog,
    name: "私有化部署",
    desc: "VPC 专属、混合云与全离线三种形态，兼容国产算力与等保要求。",
    meta: "最快 3 天",
  },
];

const proofs = [
  { icon: Gauge, k: "首字延迟 P95", v: "380ms" },
  { icon: ShieldCheck, k: "网关可用性", v: "99.98%" },
  { icon: Layers, k: "月调用量", v: "42 亿次" },
];

function Home() {
  return (
    <>
      <section className="canvas-glow relative overflow-hidden border-b border-border">
        <div className="paper-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 md:pt-28">
          <Eyebrow>Unified AI Gateway</Eyebrow>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] md:text-[68px]">
            所有模型，
            <span className="text-copper">一个入口</span>
            <br />
            所有账单，一张表
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            API MART 把 200+ 大模型、生图与语音能力收进同一套协议、同一份配额、同一个控制台。
            公有网关按量付费，也可以整套搬进你的内网。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/api-access">
                开始接入 <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/models">浏览模型广场</Link>
            </Button>
          </div>

          <div className="mt-16 grid max-w-2xl gap-6 sm:grid-cols-3">
            {proofs.map((p) => (
              <div key={p.k} className="border-l border-border pl-4">
                <p.icon className="size-4 text-muted-foreground" />
                <div className="mt-2 font-display text-xl font-semibold">{p.v}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        title="五个模块，覆盖从试用到私有交付"
        description="每个模块都是独立页面，可以按你团队所处的阶段进入。"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="panel group flex flex-col p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <m.icon className="size-5 text-copper" />
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {m.meta}
                </Badge>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                进入
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="接入前后的差别"
        description="不是多一层代理，而是少维护五套集成。"
        className="pt-0"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface-2 p-7">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              before
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "每家厂商一套 SDK、一份密钥、一张账单",
                "某个厂商限流，线上功能直接不可用",
                "换模型要改代码、重新压测",
                "成本只能月底看厂商后台对账",
              ].map((t) => (
                <li key={t}>— {t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-copper/40 bg-card p-7 shadow-lift">
            <p className="font-mono text-xs uppercase tracking-widest text-copper">after</p>
            <ul className="mt-5 space-y-3 text-sm text-foreground/85">
              {[
                "一个 base_url、一个 Key、一张聚合账单",
                "限流自动转移到备用模型，无感知",
                "改一个 model 字段就能灰度新模型",
                "按项目、成员、模型实时看成本",
              ].map((t) => (
                <li key={t}>— {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="border-t border-border bg-surface-2">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">先跑通一个请求再决定</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              注册即送 ¥20 额度，无需绑卡，十分钟内可以看到第一条调用日志。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/api-access">免费试用</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/deploy">咨询私有化</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

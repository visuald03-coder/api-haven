import { createFileRoute } from "@tanstack/react-router";
import { Building2, Cpu, Lock, Network, ServerCog, ShieldCheck } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/deploy")({
  head: () => ({
    meta: [
      { title: "私有化部署 · 数据不出内网的 AI 网关 | API MART" },
      {
        name: "description",
        content:
          "支持 VPC 专属、混合云与全离线三种交付形态，兼容国产算力，提供 SSO、审计与合规文档，两周内上线。",
      },
      { property: "og:title", content: "私有化部署 · API MART" },
      { property: "og:description", content: "VPC、混合云与全离线交付，数据不出内网的 AI 网关。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeployPage,
});

const modes = [
  {
    icon: Network,
    name: "VPC 专属实例",
    tag: "最快上线",
    desc: "在你的云账号内开一套独立网关与数据库，流量不经过公网多租户集群。",
    points: ["独立密钥与配额", "云商 VPC 对等互联", "3 天内交付"],
  },
  {
    icon: ServerCog,
    name: "混合云",
    tag: "常见选择",
    desc: "网关与日志留在内网，仅按白名单出网调用外部模型，敏感请求走本地模型。",
    points: ["敏感数据本地推理", "出网请求可审计", "支持双活容灾"],
  },
  {
    icon: Lock,
    name: "全离线",
    tag: "信创合规",
    desc: "完全断网环境交付，随包提供开源权重与运维手册，升级采用离线镜像包。",
    points: ["昇腾 / 海光 / 寒武纪适配", "无外部依赖", "现场部署支持"],
  },
];

const guarantees = [
  { icon: ShieldCheck, title: "数据主权", body: "日志、Prompt 与向量全部落在你指定的存储，我们无读取权限。" },
  { icon: Cpu, title: "算力弹性", body: "支持 GPU 池化调度与国产芯片混部，闲时自动缩容。" },
  { icon: Building2, title: "合规交付", body: "提供等保、SOC2 支撑材料、渗透测试报告与源码托管选项。" },
];

const timeline = [
  ["W1", "需求与环境评估", "梳理模型清单、算力与合规边界，输出部署方案。"],
  ["W2", "环境搭建与联调", "交付镜像、打通网络与 SSO，完成压测与回归。"],
  ["W3", "灰度上线", "小流量灰度、监控告警接入、运维培训与文档移交。"],
  ["持续", "运维与升级", "季度版本升级、专属技术群、故障 1 小时响应。"],
];

function DeployPage() {
  return (
    <>
      <PageHeader
        eyebrow="Private Deployment"
        title="把整套网关搬进你的内网"
        description="金融、政务、医疗客户关心的不是模型榜单，而是数据边界、审计链路和可交付性。三种形态覆盖从 VPC 到全离线。"
      >
        <div className="flex flex-wrap gap-2">
          {["等保三级支撑", "数据不出境", "国产算力适配", "源码托管可选"].map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </PageHeader>

      <Section title="三种交付形态">
        <div className="grid gap-4 md:grid-cols-3">
          {modes.map((m) => (
            <div key={m.name} className="panel flex flex-col p-6">
              <div className="flex items-center justify-between">
                <m.icon className="size-5 text-copper" />
                <Badge variant="outline" className="text-[11px] font-normal">
                  {m.tag}
                </Badge>
              </div>
              <h3 className="mt-4 text-base font-semibold">{m.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {m.points.map((p) => (
                  <li key={p} className="text-sm text-foreground/80">
                    · {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="部署架构" description="网关是唯一出入口，所有调用留痕、可回放、可限流。">
        <div className="paper-grid rounded-2xl border border-border bg-surface p-6 md:p-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["你的业务系统", ["Web / App", "内部工单", "数据平台"]],
              ["API MART 网关（内网）", ["路由与鉴权", "配额与审计", "缓存与重试"]],
              ["模型算力层", ["本地开源模型", "国产芯片集群", "白名单外部厂商"]],
            ].map(([title, items]) => (
              <div key={title as string} className="rounded-xl border border-border bg-card p-5 shadow-paper">
                <p className="font-display text-sm font-semibold">{title as string}</p>
                <ul className="mt-3 space-y-2">
                  {(items as string[]).map((i) => (
                    <li
                      key={i}
                      className="rounded-md bg-surface-2 px-3 py-2 font-mono text-[12px] text-muted-foreground"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="交付节奏">
        <div className="grid gap-0 md:grid-cols-4">
          {timeline.map(([w, t, d], i) => (
            <div
              key={w}
              className={`border-border px-0 py-5 md:px-6 md:py-0 ${
                i < timeline.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
              } ${i === 0 ? "md:pl-0" : ""}`}
            >
              <span className="font-mono text-xs uppercase tracking-widest text-copper">{w}</span>
              <h3 className="mt-2 text-base font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 md:grid-cols-3">
          {guarantees.map((g) => (
            <div key={g.title} className="panel p-6">
              <g.icon className="size-5 text-sage" />
              <h3 className="mt-4 text-base font-semibold">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-copper/40 bg-card p-8 shadow-lift md:p-10">
          <h2 className="text-2xl font-semibold">获取部署方案与报价</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            留下企业邮箱，我们会发送架构白皮书、硬件清单模板与合规材料索引。
          </p>
          <form
            className="mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input placeholder="you@company.com" type="email" className="bg-surface" />
            <Button type="submit" size="lg">
              发送资料
            </Button>
          </form>
        </div>
      </Section>
    </>
  );
}

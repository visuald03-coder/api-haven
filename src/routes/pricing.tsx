import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "价格 · 按量计费，无最低消费 | API MART" },
      {
        name: "description",
        content:
          "免费额度起步，按 token 实际用量结算。团队版提供预付折扣、SLA 与专属通道，企业版支持私有化与合同结算。",
      },
      { property: "og:title", content: "价格 · API MART" },
      { property: "og:description", content: "按量计费，无最低消费，团队与企业版可享预付折扣与 SLA。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "开发者",
    price: "¥0",
    unit: "起步",
    desc: "个人项目与验证阶段，充值即用。",
    features: ["¥20 试用额度", "全部公开模型", "60 RPM", "社区支持", "7 天调用日志"],
    cta: "免费开始",
    highlight: false,
  },
  {
    name: "团队",
    price: "¥699",
    unit: "/ 月起",
    desc: "有稳定线上流量的产品团队。",
    features: [
      "用量 8 折起阶梯折扣",
      "1200 RPM，可申请提额",
      "多密钥 + 成员权限",
      "故障自动转移",
      "30 天日志与用量看板",
      "工单 4 小时响应",
    ],
    cta: "开始 14 天试用",
    highlight: true,
  },
  {
    name: "企业",
    price: "定制",
    unit: "年度合约",
    desc: "有合规、审计与交付要求的组织。",
    features: [
      "99.95% SLA 与赔付条款",
      "专属通道 / 独立集群",
      "私有化与信创适配",
      "SSO、审计日志、数据不出境",
      "解决方案架构师",
      "对公合同与发票",
    ],
    cta: "联系销售",
    highlight: false,
  },
];

const matrix: [string, (string | boolean)[]][] = [
  ["模型数量", ["216", "216", "216 + 自有模型"]],
  ["速率上限", ["60 RPM", "1200 RPM", "自定义"]],
  ["预付折扣", [false, "8 折起", "定制"]],
  ["故障转移", [false, true, true]],
  ["SSO / 审计", [false, false, true]],
  ["私有化部署", [false, false, true]],
  ["专属支持", ["社区", "工单", "架构师 + 专属群"]],
];

function PricingPage() {
  const [tokens, setTokens] = useState(50);
  const est = (tokens * 6.4).toFixed(0);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="用多少付多少，不做阶梯陷阱"
        description="所有套餐共用同一份模型价目表，差别只在折扣、速率、支持与合规能力。随时升级或暂停，不锁定。"
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-7 ${
                p.highlight
                  ? "border-copper bg-card shadow-lift"
                  : "border-border bg-surface shadow-paper"
              }`}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                {p.highlight && (
                  <Badge className="bg-copper-soft text-accent-foreground hover:bg-copper-soft">
                    最受欢迎
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-semibold">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.unit}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-sage" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-7" variant={p.highlight ? "default" : "outline"}>
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="用量估算" description="按团队版折扣后的混合均价粗算，实际取决于你选的模型。">
        <div className="panel p-7">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">每月消耗 token</p>
              <p className="mt-1 font-display text-2xl font-semibold">{tokens} 百万</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">预计费用</p>
              <p className="mt-1 font-display text-2xl font-semibold text-copper">≈ ¥{est}</p>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
            className="mt-6 w-full accent-copper"
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>1M</span>
            <span>500M</span>
          </div>
        </div>
      </Section>

      <Section title="套餐对比">
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  能力
                </th>
                {plans.map((p) => (
                  <th key={p.name} className="px-5 py-3 font-medium">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map(([label, vals]) => (
                <tr key={label} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3.5 text-muted-foreground">{label}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="px-5 py-3.5">
                      {v === true ? (
                        <Check className="size-4 text-sage" />
                      ) : v === false ? (
                        <Minus className="size-4 text-muted-foreground/50" />
                      ) : (
                        v
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

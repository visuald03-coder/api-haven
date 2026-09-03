import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Coins, Infinity as InfinityIcon, ReceiptText, Zap } from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "价格 · 积分充值随充随用，无包月 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 采用积分充值制：充多少用多少，积分永久有效，按实际调用扣减。充值越多赠送越多，无月租、无最低消费。",
      },
      { property: "og:title", content: "价格 · API FLOW" },
      { property: "og:description", content: "积分充值随充随用，按调用扣减，无月租无最低消费。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const packs = [
  {
    name: "体验包",
    pay: 50,
    credits: 50_000,
    bonus: 0,
    desc: "先跑通一条请求，验证效果。",
    highlight: false,
  },
  {
    name: "常用包",
    pay: 200,
    credits: 220_000,
    bonus: 10,
    desc: "个人项目与小团队的日常用量。",
    highlight: false,
  },
  {
    name: "推荐包",
    pay: 1000,
    credits: 1_200_000,
    bonus: 20,
    desc: "有稳定线上流量，最划算的一档。",
    highlight: true,
  },
  {
    name: "大额包",
    pay: 5000,
    credits: 6_500_000,
    bonus: 30,
    desc: "高并发业务，附赠专属通道与提额。",
    highlight: false,
  },
];

const rates = [
  ["gpt-5.1", "对话", "1 积分 / 千 token", "3 积分 / 千 token"],
  ["claude-4.5-sonnet", "对话", "1.2 积分 / 千 token", "6 积分 / 千 token"],
  ["deepseek-v4", "对话", "0.1 积分 / 千 token", "0.3 积分 / 千 token"],
  ["flux-2-pro", "生图", "—", "35 积分 / 张"],
  ["whisper-large-v3", "语音", "—", "3 积分 / 分钟"],
  ["video-remix", "Skill", "—", "180 积分 / 条"],
  ["aesthetic-boost", "Skill", "—", "45 积分 / 张"],
];

const perks = [
  { icon: InfinityIcon, t: "积分永久有效", d: "不清零、不过期，也没有月租在后台悄悄扣。" },
  { icon: Zap, t: "随充随用", d: "充值秒到账，余额为零即停，不会产生欠费。" },
  { icon: Coins, t: "充多送多", d: "阶梯赠送最高 30%，赠送积分与充值积分同价。" },
  { icon: ReceiptText, t: "可开发票", d: "每一笔充值都能在控制台自助开票、下载账单。" },
];

const fmt = (n: number) => n.toLocaleString("zh-CN");

function PricingPage() {
  const [amount, setAmount] = useState(1000);
  const bonusRate = amount >= 5000 ? 0.3 : amount >= 1000 ? 0.2 : amount >= 200 ? 0.1 : 0;
  const credits = Math.round(amount * 1000 * (1 + bonusRate));
  const chatCalls = Math.round(credits / 8);

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="充积分，按调用扣，不做包月"
        description="没有订阅、没有阶梯陷阱。充值换成积分，调一次扣一次，余额和明细在控制台实时可见。积分永久有效。"
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg">立即充值</Button>
          <Button size="lg" variant="outline">
            查看积分单价表
          </Button>
        </div>
      </PageHeader>

      <Section title="充值包" description="金额越大赠送比例越高，赠送积分与充值积分一样用。">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {packs.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                p.highlight ? "border-copper bg-card shadow-lift" : "border-border bg-surface shadow-paper"
              }`}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold">{p.name}</h3>
                {p.bonus > 0 && (
                  <Badge className="bg-copper-soft text-accent-foreground hover:bg-copper-soft">
                    赠 {p.bonus}%
                  </Badge>
                )}
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-semibold">¥{p.pay}</span>
              </div>
              <p className="mt-2 font-mono text-sm text-copper">{fmt(p.credits)} 积分</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <Button className="mt-6" variant={p.highlight ? "default" : "outline"}>
                充 ¥{p.pay}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          注册即赠 5,000 积分，无需绑卡；也支持自定义金额充值（最低 ¥10）。
        </p>
      </Section>

      <Section title="充值估算" description="拖动金额，看看能拿到多少积分、大概够跑多少次调用。" className="pt-0">
        <div className="panel p-7">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">充值金额</p>
              <p className="mt-1 font-display text-2xl font-semibold">¥{fmt(amount)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">赠送比例</p>
              <p className="mt-1 font-display text-2xl font-semibold text-sage">
                +{Math.round(bonusRate * 100)}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">到账积分</p>
              <p className="mt-1 font-display text-2xl font-semibold text-copper">{fmt(credits)}</p>
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={10000}
            step={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-6 w-full accent-copper"
          />
          <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>¥10</span>
            <span>¥10,000</span>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            约等于 <span className="font-medium text-foreground">{fmt(chatCalls)}</span> 次中等长度对话，
            或 <span className="font-medium text-foreground">{fmt(Math.round(credits / 35))}</span> 张生图。
          </p>
        </div>
      </Section>

      <Section title="积分单价表" description="所有模型与 Skill 共用一套积分，1 元 = 1,000 积分。">
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {["模型 / Skill", "类型", "输入扣减", "输出扣减"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r[0]} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-[12.5px]">{r[0]}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r[1]}</td>
                  <td className="px-5 py-3.5">{r[2]}</td>
                  <td className="px-5 py-3.5">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="为什么是积分制" className="pt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="panel p-6">
              <p.icon className="size-5 text-copper" />
              <h3 className="mt-4 text-base font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
        <ul className="mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          {[
            "不设最低消费，不绑定订阅周期",
            "余额告警可设置阈值，邮件与 Webhook 通知",
            "企业可对公转账充值，自动开票",
            "大额充值可申请专属通道与速率提额",
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-sage" />
              <span className="text-foreground/85">{t}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

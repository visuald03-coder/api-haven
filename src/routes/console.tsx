import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Copy,
  Coins,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  ReceiptText,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import { PageHeader, Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "控制台 · 密钥、积分与账单一处管理 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 控制台：创建与轮换 API 密钥、查看积分余额与消耗趋势、逐条调用日志与充值账单，支持自助开票。",
      },
      { property: "og:title", content: "控制台 · API FLOW" },
      { property: "og:description", content: "密钥管理、积分消耗、消费日志与账单，一个控制台看全。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

const fmt = (n: number) => n.toLocaleString("zh-CN");

const stats = [
  { icon: Coins, k: "可用积分", v: "1,284,600", note: "含赠送 204,000" },
  { icon: TrendingUp, k: "今日消耗", v: "36,420", note: "较昨日 +12%" },
  { icon: KeyRound, k: "活跃密钥", v: "4", note: "1 个仅测试环境" },
  { icon: ReceiptText, k: "本月充值", v: "¥2,000", note: "2 笔已开票" },
];

const keys = [
  { name: "生产环境", prefix: "sk-flow-9f2c", secret: "sk-flow-9f2c7a41b83de5602ab", used: 842_100, limit: "无限制", created: "2026-05-12", status: "启用" },
  { name: "移动端", prefix: "sk-flow-4ab1", secret: "sk-flow-4ab1e07c92fd1188cc4", used: 216_540, limit: "300,000 / 日", created: "2026-06-30", status: "启用" },
  { name: "内部工具", prefix: "sk-flow-77de", secret: "sk-flow-77de5b3a10c9ff2401d", used: 51_300, limit: "50,000 / 日", created: "2026-07-18", status: "限额中" },
  { name: "旧版脚本", prefix: "sk-flow-1c05", secret: "sk-flow-1c0533ee8a7b9042fa6", used: 0, limit: "—", created: "2026-02-04", status: "已停用" },
];

const usageByModel = [
  { model: "gpt-5.1", credits: 486_200, share: 42 },
  { model: "claude-4.5-sonnet", credits: 291_700, share: 25 },
  { model: "deepseek-v4", credits: 174_500, share: 15 },
  { model: "flux-2-pro", credits: 116_300, share: 10 },
  { model: "video-remix", credits: 93_000, share: 8 },
];

const trend = [28, 34, 31, 46, 52, 44, 61, 58, 72, 65, 80, 74, 91, 86];

const logs = [
  { time: "09:41:22", key: "生产环境", model: "gpt-5.1", type: "对话", tokens: "1,240 → 780", credits: 3_580, status: "成功" },
  { time: "09:40:58", key: "移动端", model: "flux-2-pro", type: "生图", tokens: "1 张", credits: 35, status: "成功" },
  { time: "09:39:04", key: "生产环境", model: "aesthetic-boost", type: "Skill", tokens: "3 张", credits: 135, status: "成功" },
  { time: "09:36:17", key: "内部工具", model: "deepseek-v4", type: "对话", tokens: "8,600 → 2,100", credits: 1_490, status: "成功" },
  { time: "09:33:41", key: "生产环境", model: "video-remix", type: "Skill", tokens: "1 条 45s", credits: 180, status: "处理中" },
  { time: "09:30:02", key: "移动端", model: "claude-4.5-sonnet", type: "对话", tokens: "2,300 → 0", credits: 0, status: "限流" },
];

const bills = [
  { no: "IN-2026-0731", date: "2026-07-31", item: "积分充值 · 推荐包", amount: "¥1,000", credits: 1_200_000, invoice: "已开票" },
  { no: "IN-2026-0715", date: "2026-07-15", item: "积分充值 · 常用包", amount: "¥200", credits: 220_000, invoice: "已开票" },
  { no: "IN-2026-0628", date: "2026-06-28", item: "积分充值 · 推荐包", amount: "¥1,000", credits: 1_200_000, invoice: "可开票" },
  { no: "IN-2026-0602", date: "2026-06-02", item: "积分充值 · 自定义", amount: "¥300", credits: 330_000, invoice: "已开票" },
];

const statusTone: Record<string, string> = {
  成功: "text-sage",
  处理中: "text-copper",
  限流: "text-destructive",
};

function ConsolePage() {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (k: (typeof keys)[number]) => {
    void navigator.clipboard?.writeText(k.secret);
    setCopied(k.prefix);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <>
      <PageHeader
        eyebrow="Console"
        title="你的密钥、积分与账单，一个页面看全"
        description="控制台是账户的唯一入口：创建与轮换密钥、设置每日限额、按模型看积分消耗、逐条查调用日志，并自助下载账单与发票。"
      >
        <div className="flex flex-wrap gap-3">
          <Button size="lg">进入控制台</Button>
          <Button size="lg" variant="outline">
            <Plus className="mr-1.5 size-4" /> 充值积分
          </Button>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="panel p-6">
              <s.icon className="size-4 text-copper" />
              <p className="mt-4 font-display text-2xl font-semibold">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.k}</p>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="密钥管理"
        description="按环境拆分密钥，单独设置每日积分上限，泄露时一键轮换不影响其他环境。"
        className="pt-0"
      >
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {["名称", "密钥", "已用积分", "每日上限", "创建时间", "状态", ""].map((h) => (
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
              {keys.map((k) => (
                <tr key={k.prefix} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3.5 font-medium">{k.name}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-[12.5px] text-muted-foreground">
                        {revealed === k.prefix ? k.secret : `${k.prefix}••••••••••••`}
                      </code>
                      <button
                        aria-label="显示密钥"
                        onClick={() => setRevealed((v) => (v === k.prefix ? null : k.prefix))}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {revealed === k.prefix ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button
                        aria-label="复制密钥"
                        onClick={() => copy(k)}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      {copied === k.prefix && <span className="text-[11px] text-sage">已复制</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px]">{fmt(k.used)}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{k.limit}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">{k.created}</td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={k.status === "启用" ? "secondary" : "outline"}
                      className="text-[11px] font-normal"
                    >
                      {k.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs text-muted-foreground transition-colors hover:text-copper">
                      轮换
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" className="mt-4">
          <Plus className="mr-1.5 size-4" /> 新建密钥
        </Button>
      </Section>

      <Section title="积分消耗" description="近 14 天趋势与按模型拆分，异常增长可以立刻定位到哪个密钥。">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">近 14 天消耗（千积分）</p>
              <Badge variant="secondary" className="text-[11px] font-normal">
                合计 1,161,700
              </Badge>
            </div>
            <div className="mt-6 flex h-40 items-end gap-2">
              {trend.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-copper/70 transition-colors hover:bg-copper"
                  style={{ height: `${v}%` }}
                  title={`${v} 千积分`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>14 天前</span>
              <span>今天</span>
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-sm font-medium">按模型 / Skill 拆分</p>
            <ul className="mt-5 space-y-4">
              {usageByModel.map((u) => (
                <li key={u.model}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-mono text-[12.5px]">{u.model}</span>
                    <span className="text-muted-foreground">
                      {fmt(u.credits)} · {u.share}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-copper" style={{ width: `${u.share * 2}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        title="消费日志"
        description="每一次调用都留痕：耗时、token、扣减积分与失败原因，可按密钥、模型、时间筛选并导出 CSV。"
        className="pt-0"
      >
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {["时间", "密钥", "模型 / Skill", "类型", "用量", "扣减积分", "状态"].map((h) => (
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
              {logs.map((l) => (
                <tr key={l.time} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">{l.time}</td>
                  <td className="px-5 py-3.5">{l.key}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px]">{l.model}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{l.type}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">{l.tokens}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px]">{fmt(l.credits)}</td>
                  <td className={`px-5 py-3.5 ${statusTone[l.status] ?? ""}`}>{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <ScrollText className="mr-1.5 size-4" /> 导出 CSV
          </Button>
          <Button variant="ghost" size="sm">
            查看全部日志
          </Button>
        </div>
      </Section>

      <Section title="账单与发票" description="充值即生成账单，支持自助开具电子发票与对公抬头管理。">
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {["账单号", "日期", "项目", "金额", "到账积分", "发票"].map((h) => (
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
              {bills.map((b) => (
                <tr key={b.no} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-3.5 font-mono text-[12.5px]">{b.no}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-3.5">{b.item}</td>
                  <td className="px-5 py-3.5 font-medium">{b.amount}</td>
                  <td className="px-5 py-3.5 font-mono text-[12.5px] text-muted-foreground">
                    {fmt(b.credits)}
                  </td>
                  <td className="px-5 py-3.5">
                    {b.invoice === "已开票" ? (
                      <span className="text-sage">已开票</span>
                    ) : (
                      <button className="text-copper transition-opacity hover:opacity-70">申请开票</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}

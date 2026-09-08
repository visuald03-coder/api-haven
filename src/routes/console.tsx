import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronRight,
  Copy,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  ReceiptText,
  Search,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "控制台 · 密钥、积分与成员一处管理 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 控制台：查看账户密钥与剩余积分、购买积分、逐条积分消耗流水与生成资产记录，并管理团队成员与角色权限。",
      },
      { property: "og:title", content: "控制台 · API FLOW" },
      {
        property: "og:description",
        content: "账户密钥、剩余积分、消耗流水与成员管理，一个控制台看全。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

const fmt = (n: number) => n.toLocaleString("zh-CN");

const account = {
  name: "Alex Tan",
  phone: "+86 138 **** 6621",
  credits: 158_442,
  accessKey: "5WKEwApmj6dwn0VgWYe5Qg",
  secretKey: "sk-flow-9f2c7a41b83de5602ab19d47",
};

type Flow = {
  id: string;
  created: string;
  updated: string;
  type: string;
  credits: number;
  asset: "文本" | "图片" | "视频" | "音频";
  operator: string;
};

const flows: Flow[] = [
  { id: "TX-2026090801", created: "2026-09-08 02:14:07", updated: "2026-09-08 02:14:19", type: "对话 · gpt-5.2", credits: -1_820, asset: "文本", operator: "Alex Tan" },
  { id: "TX-2026090802", created: "2026-09-08 01:58:41", updated: "2026-09-08 01:59:12", type: "生图 · nano-banana", credits: -340, asset: "图片", operator: "Nora Lin" },
  { id: "TX-2026090803", created: "2026-09-08 01:32:10", updated: "2026-09-08 01:35:02", type: "视频 · seedance-2.5", credits: -12_400, asset: "视频", operator: "Kai Zhou" },
  { id: "TX-2026090804", created: "2026-09-08 00:47:55", updated: "2026-09-08 00:48:01", type: "Skill · 审美增强", credits: -960, asset: "图片", operator: "Alex Tan" },
  { id: "TX-2026090805", created: "2026-09-07 23:21:33", updated: "2026-09-07 23:21:33", type: "充值 · 在线支付", credits: 200_000, asset: "文本", operator: "Alex Tan" },
  { id: "TX-2026090806", created: "2026-09-07 22:05:18", updated: "2026-09-07 22:07:44", type: "视频混剪 Skill", credits: -8_600, asset: "视频", operator: "Kai Zhou" },
  { id: "TX-2026090807", created: "2026-09-07 20:41:02", updated: "2026-09-07 20:41:09", type: "语音合成 · tts-2", credits: -180, asset: "音频", operator: "Nora Lin" },
  { id: "TX-2026090808", created: "2026-09-07 19:12:47", updated: "2026-09-07 19:13:20", type: "对话 · claude-sonnet-4.6", credits: -2_450, asset: "文本", operator: "Mia Guo" },
  { id: "TX-2026090809", created: "2026-09-07 17:55:26", updated: "2026-09-07 17:56:00", type: "生图 · gpt-image-2", credits: -1_120, asset: "图片", operator: "Mia Guo" },
  { id: "TX-2026090810", created: "2026-09-07 16:03:14", updated: "2026-09-07 16:04:38", type: "视频 · MiniMax-H3", credits: -9_700, asset: "视频", operator: "Alex Tan" },
];

type Member = {
  name: string;
  email: string;
  team: string;
  role: "拥有者" | "管理员" | "开发者" | "只读";
};

const members: Member[] = [
  { name: "Alex Tan", email: "alex@apiflow.dev", team: "平台组", role: "拥有者" },
  { name: "Nora Lin", email: "nora@apiflow.dev", team: "增长组", role: "管理员" },
  { name: "Kai Zhou", email: "kai@apiflow.dev", team: "视频实验室", role: "开发者" },
  { name: "Mia Guo", email: "mia@apiflow.dev", team: "设计组", role: "开发者" },
  { name: "Ivan Xu", email: "ivan@apiflow.dev", team: "财务", role: "只读" },
];

const th =
  "px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground whitespace-nowrap text-left";
const td = "px-5 py-3.5 align-middle";

const navItems = [
  { key: "flow", label: "积分消耗与流水", icon: Wallet },
  { key: "member", label: "成员管理", icon: Users },
] as const;

function ConsolePage() {
  const [showSecret, setShowSecret] = useState(false);
  const [tab, setTab] = useState<(typeof navItems)[number]["key"]>("flow");
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState("all");
  const [operator, setOperator] = useState("all");

  const operators = useMemo(
    () => Array.from(new Set(flows.map((f) => f.operator))),
    [],
  );

  const filtered = useMemo(
    () =>
      flows.filter((f) => {
        const q = query.trim().toLowerCase();
        return (
          (asset === "all" || f.asset === asset) &&
          (operator === "all" || f.operator === operator) &&
          (q === "" || `${f.id} ${f.type} ${f.operator}`.toLowerCase().includes(q))
        );
      }),
    [query, asset, operator],
  );

  const copy = (value: string, label: string) => {
    void navigator.clipboard?.writeText(value);
    toast.success(`${label} 已复制`);
  };

  return (
    <div className="pb-24">
      {/* 概览大卡片 */}
      <section className="canvas-glow border-b border-border">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-14 md:pt-16">
          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:p-9">
            <button
              type="button"
              onClick={() => toast.success("开票申请已提交，我们将在 1 个工作日内寄出发票")}
              className="absolute right-5 top-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-copper"
            >
              <ReceiptText className="h-3.5 w-3.5" />
              申请发票
            </button>

            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Account overview
                </p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{account.name}</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">{account.phone}</p>

                <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">剩余积分</p>
                    <p className="mt-1 font-mono text-3xl font-semibold">{fmt(account.credits)}</p>
                  </div>
                  <Button
                    size="sm"
                    className="mb-1"
                    onClick={() => toast.success("已打开积分购买，随充随用，积分永久有效")}
                  >
                    购买积分
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  API Key
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-muted-foreground">AccessKey</span>
                    <code className="min-w-0 flex-1 truncate font-mono text-[13px]">
                      {account.accessKey}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copy(account.accessKey, "AccessKey")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-muted-foreground">SecretKey</span>
                    <code className="min-w-0 flex-1 truncate font-mono text-[13px]">
                      {showSecret ? account.secretKey : "••••••••••••••••••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowSecret((v) => !v)}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copy(account.secretKey, "SecretKey")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  如需帮助，请查阅我们的{" "}
                  <a href="/api-access" className="text-copper underline underline-offset-4">
                    接口文档
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 左侧目录 + 右侧列表 */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)]">
          <nav className="flex gap-2 md:flex-col">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors",
                  tab === item.key
                    ? "border-border bg-card font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-surface",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {tab === "flow" ? (
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="搜索流水 ID、类型或操作人"
                      className="pl-9"
                    />
                  </div>
                  <Select value={asset} onValueChange={setAsset}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="资产类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部资产</SelectItem>
                      <SelectItem value="文本">文本</SelectItem>
                      <SelectItem value="图片">图片</SelectItem>
                      <SelectItem value="视频">视频</SelectItem>
                      <SelectItem value="音频">音频</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={operator} onValueChange={setOperator}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="操作人" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部操作人</SelectItem>
                      {operators.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => toast.success(`已导出 ${filtered.length} 条流水为 CSV`)}
                  >
                    <Download className="h-4 w-4" />
                    导出
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead className="border-b border-border bg-surface">
                      <tr>
                        <th className={th}>ID</th>
                        <th className={th}>创建时间</th>
                        <th className={th}>更新时间</th>
                        <th className={th}>类型</th>
                        <th className={cn(th, "text-right")}>积分</th>
                        <th className={th}>生成内容资产类型</th>
                        <th className={th}>操作人</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((f) => (
                        <tr key={f.id} className="border-b border-border/70 last:border-0">
                          <td className={cn(td, "font-mono text-[12px]")}>{f.id}</td>
                          <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                            {f.created}
                          </td>
                          <td className={cn(td, "whitespace-nowrap text-muted-foreground")}>
                            {f.updated}
                          </td>
                          <td className={cn(td, "whitespace-nowrap")}>{f.type}</td>
                          <td
                            className={cn(
                              td,
                              "text-right font-mono",
                              f.credits > 0 ? "text-copper" : "",
                            )}
                          >
                            {f.credits > 0 ? `+${fmt(f.credits)}` : fmt(f.credits)}
                          </td>
                          <td className={td}>
                            <Badge variant="secondary">{f.asset}</Badge>
                          </td>
                          <td className={cn(td, "whitespace-nowrap")}>{f.operator}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                            没有符合条件的流水
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    共 {members.length} 位成员，按团队与角色分配调用权限。
                  </p>
                  <Button onClick={() => toast.success("邀请链接已复制，发送给成员即可加入")}>
                    邀请成员
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b border-border bg-surface">
                      <tr>
                        <th className={th}>成员</th>
                        <th className={th}>所属团队</th>
                        <th className={th}>角色</th>
                        <th className={cn(th, "text-right")}>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.email} className="border-b border-border/70 last:border-0">
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs">
                                {m.name.charAt(0)}
                              </span>
                              <span>
                                <span className="block">{m.name}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {m.email}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className={cn(td, "whitespace-nowrap")}>{m.team}</td>
                          <td className={td}>
                            <Badge variant={m.role === "拥有者" ? "default" : "secondary"}>
                              {m.role}
                            </Badge>
                          </td>
                          <td className={cn(td, "text-right")}>
                            <div className="inline-flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success(`已进入 ${m.name} 的权限设置`)}
                              >
                                编辑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={() => toast.success(`已移除 ${m.name}`)}
                                disabled={m.role === "拥有者"}
                              >
                                移除
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toast("更多操作：重置密钥、转移团队")}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Coins,
  Copy,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Plus,
  ReceiptText,
  RefreshCcw,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eyebrow } from "@/components/section";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "控制台 · 密钥、积分与账单一处管理 | API FLOW" },
      {
        name: "description",
        content:
          "API FLOW 控制台：创建与轮换 API 密钥、设置每日积分上限、查看积分余额与消耗趋势、逐条调用日志与充值账单，支持自助开票。",
      },
      { property: "og:title", content: "控制台 · API FLOW" },
      {
        property: "og:description",
        content: "密钥管理、积分消耗、消费日志与账单，一个控制台看全。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

const fmt = (n: number) => n.toLocaleString("zh-CN");

type ApiKey = {
  id: string;
  name: string;
  secret: string;
  used: number;
  dailyLimit: number | null;
  created: string;
  enabled: boolean;
};

const randomSecret = () => {
  const chars = "abcdef0123456789";
  let s = "sk-flow-";
  for (let i = 0; i < 24; i += 1) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const initialKeys: ApiKey[] = [
  {
    id: "k1",
    name: "生产环境",
    secret: "sk-flow-9f2c7a41b83de5602ab19d47",
    used: 842_100,
    dailyLimit: null,
    created: "2026-05-12",
    enabled: true,
  },
  {
    id: "k2",
    name: "移动端",
    secret: "sk-flow-4ab1e07c92fd1188cc4a3b06",
    used: 216_540,
    dailyLimit: 300_000,
    created: "2026-06-30",
    enabled: true,
  },
  {
    id: "k3",
    name: "内部工具",
    secret: "sk-flow-77de5b3a10c9ff2401d8e552",
    used: 51_300,
    dailyLimit: 50_000,
    created: "2026-07-18",
    enabled: true,
  },
  {
    id: "k4",
    name: "旧版脚本",
    secret: "sk-flow-1c0533ee8a7b9042fa61c7d0",
    used: 0,
    dailyLimit: null,
    created: "2026-02-04",
    enabled: false,
  },
];

const usageByModel = [
  { model: "gpt-5.1", credits: 486_200, share: 42 },
  { model: "claude-4.5-sonnet", credits: 291_700, share: 25 },
  { model: "deepseek-v4", credits: 174_500, share: 15 },
  { model: "flux-2-pro", credits: 116_300, share: 10 },
  { model: "video-remix", credits: 93_000, share: 8 },
];

const trend = [28, 34, 31, 46, 52, 44, 61, 58, 72, 65, 80, 74, 91, 86];

type LogRow = {
  id: string;
  time: string;
  key: string;
  model: string;
  type: "对话" | "生图" | "视频" | "Skill" | "语音";
  credits: number;
  genTime: string;
  content: string;
  asset: "文本" | "图片" | "视频" | "音频";
  operator: string;
  status: "成功" | "处理中" | "限流" | "失败";
};

const allLogs: LogRow[] = [
  { id: "TX-20260905-0912", time: "2026-09-05 09:41:22", key: "生产环境", model: "gpt-5.1", type: "对话", credits: 3_580, genTime: "1.2s", content: "为新版落地页生成 3 组文案", asset: "文本", operator: "zhang@studio.dev", status: "成功" },
  { id: "TX-20260905-0911", time: "2026-09-05 09:40:58", key: "移动端", model: "flux-2-pro", type: "生图", credits: 35, genTime: "4.6s", content: "极简米白色产品海报 1024²", asset: "图片", operator: "li@studio.dev", status: "成功" },
  { id: "TX-20260905-0910", time: "2026-09-05 09:39:04", key: "生产环境", model: "aesthetic-boost", type: "Skill", credits: 135, genTime: "7.1s", content: "3 张商品图审美增强", asset: "图片", operator: "zhang@studio.dev", status: "成功" },
  { id: "TX-20260905-0909", time: "2026-09-05 09:36:17", key: "内部工具", model: "deepseek-v4", type: "对话", credits: 1_490, genTime: "3.4s", content: "客服工单批量分类总结", asset: "文本", operator: "bot@studio.dev", status: "成功" },
  { id: "TX-20260905-0908", time: "2026-09-05 09:33:41", key: "生产环境", model: "video-remix", type: "视频", credits: 180, genTime: "生成中", content: "45s 产品混剪 · 竖屏 9:16", asset: "视频", operator: "wang@studio.dev", status: "处理中" },
  { id: "TX-20260905-0907", time: "2026-09-05 09:30:02", key: "移动端", model: "claude-4.5-sonnet", type: "对话", credits: 0, genTime: "0.2s", content: "请求被限流（超出每日上限）", asset: "文本", operator: "li@studio.dev", status: "限流" },
  { id: "TX-20260905-0906", time: "2026-09-05 09:24:55", key: "内部工具", model: "whisper-turbo", type: "语音", credits: 240, genTime: "9.8s", content: "12 分钟访谈录音转写", asset: "音频", operator: "bot@studio.dev", status: "成功" },
  { id: "TX-20260905-0905", time: "2026-09-05 09:18:30", key: "生产环境", model: "gpt-5.1-mini", type: "对话", credits: 210, genTime: "0.7s", content: "商品标题改写 20 条", asset: "文本", operator: "zhang@studio.dev", status: "成功" },
  { id: "TX-20260905-0904", time: "2026-09-05 09:11:07", key: "移动端", model: "flux-2-pro", type: "生图", credits: 0, genTime: "—", content: "4 张主图（上游超时已退还）", asset: "图片", operator: "li@studio.dev", status: "失败" },
  { id: "TX-20260905-0903", time: "2026-09-05 09:02:44", key: "生产环境", model: "claude-4.5-sonnet", type: "对话", credits: 2_740, genTime: "4.1s", content: "长文档摘要与要点抽取", asset: "文本", operator: "wang@studio.dev", status: "成功" },
];


type Bill = {
  no: string;
  date: string;
  item: string;
  amount: string;
  credits: number;
  invoiced: boolean;
};

const initialBills: Bill[] = [
  { no: "IN-2026-0731", date: "2026-07-31", item: "积分充值 · 推荐包", amount: "¥1,000", credits: 1_200_000, invoiced: true },
  { no: "IN-2026-0715", date: "2026-07-15", item: "积分充值 · 常用包", amount: "¥200", credits: 220_000, invoiced: true },
  { no: "IN-2026-0628", date: "2026-06-28", item: "积分充值 · 推荐包", amount: "¥1,000", credits: 1_200_000, invoiced: false },
  { no: "IN-2026-0602", date: "2026-06-02", item: "积分充值 · 自定义", amount: "¥300", credits: 330_000, invoiced: true },
];

const statusTone: Record<LogRow["status"], string> = {
  成功: "text-sage",
  处理中: "text-copper",
  限流: "text-destructive",
  失败: "text-destructive",
};

const rechargePacks = [
  { amount: 100, credits: 105_000, tag: "体验" },
  { amount: 200, credits: 220_000, tag: "常用" },
  { amount: 1000, credits: 1_200_000, tag: "推荐" },
  { amount: 5000, credits: 6_500_000, tag: "团队" },
];

const th =
  "px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground whitespace-nowrap";
const td = "px-5 py-3.5";

function ConsolePage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [balance, setBalance] = useState(1_284_600);

  // create key dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLimit, setNewLimit] = useState("");

  // recharge dialog
  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [pack, setPack] = useState(1000);

  // log filters
  const [logKey, setLogKey] = useState("all");
  const [logStatus, setLogStatus] = useState("all");
  const [logQuery, setLogQuery] = useState("");

  const copy = (value: string) => {
    void navigator.clipboard?.writeText(value);
    toast.success("已复制到剪贴板");
  };

  const createKey = () => {
    const name = newName.trim() || `密钥 ${keys.length + 1}`;
    const limit = Number(newLimit.replace(/[^\d]/g, ""));
    const key: ApiKey = {
      id: `k${Date.now()}`,
      name,
      secret: randomSecret(),
      used: 0,
      dailyLimit: limit > 0 ? limit : null,
      created: new Date().toISOString().slice(0, 10),
      enabled: true,
    };
    setKeys((prev) => [key, ...prev]);
    setRevealed(key.id);
    setCreateOpen(false);
    setNewName("");
    setNewLimit("");
    toast.success(`已创建「${name}」，请立即复制保存`);
  };

  const rotate = (id: string) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, secret: randomSecret() } : k)));
    setRevealed(id);
    toast.success("密钥已轮换，旧密钥立即失效");
  };

  const remove = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("密钥已删除");
  };

  const toggle = (id: string, enabled: boolean) => {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, enabled } : k)));
    toast.success(enabled ? "密钥已启用" : "密钥已停用");
  };

  const setLimit = (id: string, value: string) => {
    const limit = Number(value.replace(/[^\d]/g, ""));
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, dailyLimit: limit > 0 ? limit : null } : k)),
    );
  };

  const recharge = () => {
    const chosen = rechargePacks.find((p) => p.amount === pack) ?? rechargePacks[2]!;
    setBalance((b) => b + chosen.credits);
    setBills((prev) => [
      {
        no: `IN-2026-${String(prev.length + 8).padStart(4, "0")}`,
        date: new Date().toISOString().slice(0, 10),
        item: `积分充值 · ${chosen.tag}包`,
        amount: `¥${fmt(chosen.amount)}`,
        credits: chosen.credits,
        invoiced: false,
      },
      ...prev,
    ]);
    setRechargeOpen(false);
    toast.success(`充值成功，到账 ${fmt(chosen.credits)} 积分`);
  };

  const filteredLogs = useMemo(
    () =>
      allLogs.filter(
        (l) =>
          (logKey === "all" || l.key === logKey) &&
          (logStatus === "all" || l.status === logStatus) &&
          (logQuery.trim() === "" || l.model.includes(logQuery.trim().toLowerCase())),
      ),
    [logKey, logStatus, logQuery],
  );

  const totalUsed = keys.reduce((s, k) => s + k.used, 0);
  const activeKeys = keys.filter((k) => k.enabled).length;

  const stats = [
    { icon: Coins, k: "可用积分", v: fmt(balance), note: "含赠送 204,000" },
    { icon: TrendingUp, k: "今日消耗", v: "36,420", note: "较昨日 +12%" },
    { icon: KeyRound, k: "活跃密钥", v: `${activeKeys}`, note: `共 ${keys.length} 个` },
    { icon: ReceiptText, k: "本月充值", v: "¥2,000", note: `${bills.filter((b) => b.invoiced).length} 笔已开票` },
  ];

  return (
    <>
      {/* Console header */}
      <section className="canvas-glow border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-10 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Console</Eyebrow>
            <h1 className="mt-4 text-3xl font-semibold md:text-4xl">账户控制台</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              zhang@studio.dev · 团队「Nebula Labs」 · 密钥、积分、日志与账单都在这里操作。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-paper">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                余额
              </p>
              <p className="font-display text-xl font-semibold">{fmt(balance)}</p>
            </div>
            <Dialog open={rechargeOpen} onOpenChange={setRechargeOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Wallet className="mr-1.5 size-4" /> 充值积分
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>充值积分</DialogTitle>
                  <DialogDescription>随充随用，积分永久有效，不设月费。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  {rechargePacks.map((p) => (
                    <button
                      key={p.amount}
                      onClick={() => setPack(p.amount)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        pack === p.amount
                          ? "border-copper bg-copper/5"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-semibold">¥{fmt(p.amount)}</span>
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {p.tag}
                        </Badge>
                      </div>
                      <p className="mt-1.5 font-mono text-[12px] text-muted-foreground">
                        到账 {fmt(p.credits)} 积分
                      </p>
                    </button>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRechargeOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={recharge}>确认支付</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.k} className="panel p-5">
              <s.icon className="size-4 text-copper" />
              <p className="mt-3 font-display text-2xl font-semibold">{s.v}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.k}</p>
              <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="keys" className="mt-10">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="keys">密钥管理</TabsTrigger>
            <TabsTrigger value="usage">积分消耗</TabsTrigger>
            <TabsTrigger value="logs">消费日志</TabsTrigger>
            <TabsTrigger value="bills">账单与发票</TabsTrigger>
          </TabsList>

          {/* ---------------- Keys ---------------- */}
          <TabsContent value="keys" className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                按环境拆分密钥，单独设置每日积分上限；泄露时一键轮换，不影响其他环境。
              </p>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-1.5 size-4" /> 新建密钥
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新建 API 密钥</DialogTitle>
                    <DialogDescription>
                      密钥只在创建后完整展示一次，请立即复制保存。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">名称</Label>
                      <Input
                        id="key-name"
                        placeholder="例如：生产环境 / 移动端"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="key-limit">每日积分上限（留空为不限制）</Label>
                      <Input
                        id="key-limit"
                        inputMode="numeric"
                        placeholder="300000"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={createKey}>创建</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-left">
                    {["名称", "密钥", "已用积分", "每日上限", "创建时间", "启用", "操作"].map((h) => (
                      <th key={h} className={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr key={k.id} className="border-b border-border/70 last:border-0">
                      <td className={cn(td, "font-medium")}>{k.name}</td>
                      <td className={td}>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-[12.5px] text-muted-foreground">
                            {revealed === k.id
                              ? k.secret
                              : `${k.secret.slice(0, 12)}••••••••••••`}
                          </code>
                          <button
                            aria-label="显示密钥"
                            onClick={() => setRevealed((v) => (v === k.id ? null : k.id))}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {revealed === k.id ? (
                              <EyeOff className="size-3.5" />
                            ) : (
                              <Eye className="size-3.5" />
                            )}
                          </button>
                          <button
                            aria-label="复制密钥"
                            onClick={() => copy(k.secret)}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className={cn(td, "font-mono text-[12.5px]")}>{fmt(k.used)}</td>
                      <td className={td}>
                        <Input
                          value={k.dailyLimit ? String(k.dailyLimit) : ""}
                          placeholder="不限制"
                          onChange={(e) => setLimit(k.id, e.target.value)}
                          className="h-8 w-28 font-mono text-[12.5px]"
                        />
                      </td>
                      <td className={cn(td, "font-mono text-[12.5px] text-muted-foreground")}>
                        {k.created}
                      </td>
                      <td className={td}>
                        <Switch
                          checked={k.enabled}
                          onCheckedChange={(v) => toggle(k.id, v)}
                          aria-label="启用密钥"
                        />
                      </td>
                      <td className={cn(td, "text-right")}>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => rotate(k.id)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-copper"
                          >
                            <RefreshCcw className="size-3.5" /> 轮换
                          </button>
                          <button
                            onClick={() => remove(k.id)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" /> 删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {keys.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        还没有密钥，点击「新建密钥」开始接入。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              全部密钥累计消耗 {fmt(totalUsed)} 积分
            </p>
          </TabsContent>

          {/* ---------------- Usage + Logs (merged) ---------------- */}
          <TabsContent value="usage" className="mt-6">
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
                        <div
                          className="h-full rounded-full bg-copper"
                          style={{ width: `${u.share * 2}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 mb-4 flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={logQuery}
                  onChange={(e) => setLogQuery(e.target.value)}
                  placeholder="搜索流水 ID / 目标 / 内容"
                  className="h-9 w-64 pl-9"
                />
              </div>
              <Select value={logKey} onValueChange={setLogKey}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="全部资产类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部资产类型</SelectItem>
                  {[...new Set(allLogs.map((l) => l.asset))].map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={logStatus} onValueChange={setLogStatus}>
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="全部操作人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部操作人</SelectItem>
                  {[...new Set(allLogs.map((l) => l.operator))].map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => toast.success(`已导出 ${filteredLogs.length} 条流水 CSV`)}
              >
                <Download className="mr-1.5 size-4" /> 导出 CSV
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
              <table className="w-full min-w-[1080px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-left">
                    {[
                      "流水ID",
                      "时间",
                      "类型/目标",
                      "积分",
                      "生成时间",
                      "生成内容",
                      "资产类型",
                      "操作人",
                    ].map((h) => (
                      <th key={h} className={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((l) => (
                    <tr key={l.id} className="border-b border-border/70 last:border-0">
                      <td className={cn(td, "font-mono text-[12.5px]")}>{l.id}</td>
                      <td className={cn(td, "font-mono text-[12.5px] text-muted-foreground")}>
                        {l.time}
                      </td>
                      <td className={td}>
                        <span className="text-muted-foreground">{l.type}</span>
                        <span className="ml-2 font-mono text-[12.5px]">{l.model}</span>
                      </td>
                      <td className={cn(td, "font-mono text-[12.5px]")}>-{fmt(l.credits)}</td>
                      <td className={cn(td, "font-mono text-[12.5px] text-muted-foreground")}>
                        {l.genTime}
                      </td>
                      <td className={cn(td, "max-w-[260px] truncate")} title={l.content}>
                        {l.content}
                      </td>
                      <td className={td}>
                        <Badge variant="outline" className="text-[11px] font-normal">
                          {l.asset}
                        </Badge>
                      </td>
                      <td className={cn(td, "text-muted-foreground")}>{l.operator}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        没有符合条件的记录。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { k: "低余额提醒", v: "余额低于 100,000 积分时邮件通知", on: true },
                { k: "日消耗超限提醒", v: "单日超过 80,000 积分时通知", on: true },
                { k: "失败率告警", v: "5 分钟内失败率超 5% 时通知", on: false },
              ].map((a) => (
                <div key={a.k} className="panel flex items-start justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-medium">{a.k}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.v}</p>
                  </div>
                  <Switch defaultChecked={a.on} aria-label={a.k} />
                </div>
              ))}
            </div>
          </TabsContent>


          {/* ---------------- Bills ---------------- */}
          <TabsContent value="bills" className="mt-6">
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-paper">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-left">
                    {["账单号", "日期", "项目", "金额", "到账积分", "发票", "凭证"].map((h) => (
                      <th key={h} className={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.no} className="border-b border-border/70 last:border-0">
                      <td className={cn(td, "font-mono text-[12.5px]")}>{b.no}</td>
                      <td className={cn(td, "font-mono text-[12.5px] text-muted-foreground")}>
                        {b.date}
                      </td>
                      <td className={td}>{b.item}</td>
                      <td className={cn(td, "font-medium")}>{b.amount}</td>
                      <td className={cn(td, "font-mono text-[12.5px] text-muted-foreground")}>
                        {fmt(b.credits)}
                      </td>
                      <td className={td}>
                        {b.invoiced ? (
                          <span className="text-sage">已开票</span>
                        ) : (
                          <button
                            className="text-copper transition-opacity hover:opacity-70"
                            onClick={() => {
                              setBills((prev) =>
                                prev.map((x) => (x.no === b.no ? { ...x, invoiced: true } : x)),
                              );
                              toast.success("开票申请已提交，1 个工作日内发送到邮箱");
                            }}
                          >
                            申请开票
                          </button>
                        )}
                      </td>
                      <td className={td}>
                        <button
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                          onClick={() => toast.success(`已下载 ${b.no}.pdf`)}
                        >
                          <Download className="size-3.5" /> 下载
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="panel p-6">
                <p className="text-sm font-medium">发票抬头</p>
                <div className="mt-4 space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-name">公司名称</Label>
                    <Input id="inv-name" defaultValue="星云智能科技有限公司" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-tax">纳税人识别号</Label>
                    <Input id="inv-tax" defaultValue="91310000MA1FL9XXXX" className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="inv-mail">接收邮箱</Label>
                    <Input id="inv-mail" defaultValue="finance@nebula.dev" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toast.success("抬头信息已保存")}
                    className="mt-1"
                  >
                    保存抬头
                  </Button>
                </div>
              </div>
              <div className="panel p-6">
                <p className="text-sm font-medium">自动充值</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  余额低于阈值时自动扣款充值，避免线上调用被中断。
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Label htmlFor="auto-recharge">开启自动充值</Label>
                  <Switch id="auto-recharge" defaultChecked aria-label="开启自动充值" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="auto-th">触发阈值（积分）</Label>
                    <Input id="auto-th" defaultValue="100000" className="font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="auto-amt">每次充值（元）</Label>
                    <Input id="auto-amt" defaultValue="1000" className="font-mono" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => toast.success("自动充值规则已更新")}
                >
                  保存规则
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

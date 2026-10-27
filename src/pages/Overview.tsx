// ReferralHero · /overview page
// Drop into a Lovable (React + Vite + Tailwind + lucide-react) project, e.g. src/pages/Overview.tsx
// Two states, switched by `programState`:
//   "established" → ROI ≥ 1.5×  (revenue-led results block, Share of revenue column)
//   "building"    → ROI < 1.5×  (engagement-led results block, Visitors column)
// All numbers are SAMPLE DATA — wire to real API.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, ArrowUp, ArrowDown, BookOpen, ChevronDown, ChevronRight, Code, Copy,
  Gift, MessageCircle, Pencil, Plus, RefreshCw, Settings, Sparkles, Square, Trash2, TriangleAlert, Type, UserCheck,
  Wrench, Minus, X, User, Trophy, BarChart3, FileCheck2, Eye, ThumbsUp, ThumbsDown,
} from "lucide-react";

/* ───────────── Design tokens (from ReferralHero Figma / design system) ───────────── */
// Put these in tailwind.config theme.extend.colors if you prefer named tokens.
const C = {
  page: "#F2F1F6",
  ink: "#171423",
  ink2: "#5C5C5C",
  muted: "#5A5870",
  divider: "#F0EEF5",
  stroke: "#CDCCD9",
  purple: "#7057C6",      // brand / Btn main violet
  darkPurple: "#403754",  // results block, dark buttons
  tile: "#4E4763",        // tiles inside dark block
  lavender: "#E7DDFC",    // Insights card
  engagement: "#F6F4FF",  // funnel Engagement group tint
  impact: "#FFF8EC",      // funnel Impact group tint
  payouts: "#EEFAF3",     // Revenue & Payouts card
  blue: "#6C90FC",
  mint: "#9BE3B5",        // positive numbers on dark
  // status badges
  pendingBg: "#FFF9E0", pendingFg: "#FFB300",
  unconfBg: "#FFEEED", unconfFg: "#FF5D58",
  confBg: "#EAF5F3", confFg: "#429A84",
};
// Font: Manrope (400/500/600/700/800) from Google Fonts.

type ProgramState = "established" | "building";
type Range = "90D" | "12M" | "All";

/* ───────────────────────────── Sample data ───────────────────────────── */
const PERIOD: Record<Range, { title: string; phrase: string; prev: string }> = {
  "90D": { title: "Your 90-day results", phrase: "in the last 90 days", prev: "the previous 90 days" },
  "12M": { title: "Your 12-month results", phrase: "in the last 12 months", prev: "the previous 12 months" },
  All: { title: "Your all-time results", phrase: "since your program launched", prev: "the same point last year" },
};

const DATA = {
  established: {
    tiles: [
      { label: "Revenue generated", value: "$23,482.15", delta: "18%", highlight: false, green: true },
      { label: "Avg. revenue per referral", value: "$3,355", delta: "5%", info: "Revenue ÷ 7 confirmed referrals" },
      { label: "Return on rewards", value: "13.7×", info: "Revenue ÷ (rewards paid $1,637.80 + payout fees $76.20): $13.70 back for every $1 of rewards" },
      { label: "All-in ROI", value: "10.4×", highlight: true, green: true, info: "Revenue ÷ all costs: rewards $1,637.80 + payout fees $76.20 + ReferralHero plan $500.00 + SMS $38.40 = $2,252.40" },
    ],
    statuses: { pending: 9, unconfirmed: 4, confirmed: 7 },
    insights:
      "Referral revenue is up 18% over the last 90 days, driven mostly by Jordan Ellis (55% of revenue). Your biggest opportunity is sharing: only 214 of 3,980 subscribers shared their link. Your Oct 2 email drove 19 referrals in 5 days, so a reminder to the rest could roughly double that. 3 rewards ($770.80) are waiting for your approval.",
    questions: ["Why did signups drop this quarter?", "Which reward brings in the most customers?", "Should I approve the 3 pending rewards?"],
    months: [["May", 4200], ["Jun", 6800], ["Jul", 9100], ["Aug", 12400], ["Sep", 19900], ["Oct", 23500]] as [string, number][],
    money: [["Rewards paid", "$1,637.80"], ["Rewards pending", "$770.80"], ["Reward cost per confirmed referral", "$233.97"], ["Return on rewards", "13.7×"]],
  },
  building: {
    tiles: [
      { label: "Engaged advocates", value: "642", delta: "18%", info: "Subscribers who visited their referral dashboard in the period" },
      { label: "Shares", value: "214", delta: "40%" },
      { label: "Referred visitors", value: "92", delta: "11%" },
      { label: "Pending referrals", value: "13", delta: "6", highlight: true, info: "Referrals waiting on a conversion. Each one that converts adds revenue." },
    ],
    statuses: { pending: 13, unconfirmed: 5, confirmed: 2 },
    insights:
      "Your program hasn't paid for itself yet: $760 in revenue against $1,210 in total costs over the last 90 days. That's common in the first few months. You're $1,055 short of a 1.5× return, and your 13 pending referrals only need 3 to convert to get there. The biggest lever is sharing: only 214 of 3,980 subscribers shared their link, so a reminder email is the quickest way to grow the pipeline.",
    questions: ["How do I reach 1.5× ROI faster?", "Is my reward too generous?", "Which pending referrals are closest to converting?"],
    months: [["May", 0], ["Jun", 0], ["Jul", 40], ["Aug", 120], ["Sep", 260], ["Oct", 380]] as [string, number][],
    money: [["Rewards paid", "$640.00"], ["Rewards pending", "$520.00"], ["Reward cost per confirmed referral", "$320.00"], ["Return on rewards", "1.1×"]],
  },
};

const ADVOCATES_BASE = [
  ["Jordan Ellis", 4, 3, 5, 1289.84, 12922, 24],
  ["Sam Rivera", 4, 3, 1, 238.0, 4310, 16],
  ["Taylor Brooks", 3, 2, 1, 195.04, 3870, 12],
  ["Casey Nguyen", 3, 2, 0, 86.0, 1240, 10],
  ["Morgan Lee", 2, 2, 0, 0, 1140, 8],
  ...["Avery Shah", "Jamie Ortiz", "Quinn Foster", "Reese Patel", "Skyler Grant", "Rowan Kim", "Parker Hayes", "Emerson Diaz", "Finley Wood", "Hayden Cole", "Kendall Ross", "Logan Price", "Micah Bell", "Noel Reyes", "Peyton Ward", "Remy Lopez", "Sage Turner", "Tatum Hill", "Blake Murphy", "Dakota Gray"]
    .map((n, i) => [n, Math.max(0, 3 - Math.floor(i / 5)), i % 3 === 0 ? 1 : 0, i < 4 ? 1 : 0, i < 4 ? 40 : 0, Math.max(0, 980 - i * 52), Math.max(1, 7 - Math.floor(i / 3))]),
] as [string, number, number, number, number, number, number][];

const AVATAR = [["#F6E8F5", "#9B4DB5"], ["#DCEBFB", "#1F4F8C"], ["#DFF4E6", "#1F6B3A"], ["#FCEFC2", "#6B5200"], ["#E9E4F7", "#4A3690"]];

const money = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });

/* Sample campaign list — wire to real API. */
const CAMPAIGNS: { name: string; status: "Active" | "Stopped" | null }[] = [
  { name: "All campaigns", status: null },
  { name: "Customer referral program", status: "Active" },
  { name: "Request a demo", status: "Active" },
  { name: "Partner referral program", status: "Active" },
  { name: "Product launch waitlist", status: "Active" },
  { name: "Newsletter referrals", status: "Active" },
  { name: "VIP early access", status: "Active" },
  { name: "Spring giveaway", status: "Stopped" },
  { name: "Holiday gift guide", status: "Stopped" },
  { name: "Beta tester invites", status: "Stopped" },
];

/* ───────────────────────────── Small pieces ───────────────────────────── */
const Info = ({ text, dark = false }: { text: string; dark?: boolean }) => (
  <span
    title={text}
    aria-label={text}
    role="img"
    className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full text-[10px] font-bold italic"
    style={{ background: dark ? "#57506B" : "#EEECF4", color: dark ? "#D6D1E4" : "#4A4658", fontFamily: "Georgia, serif" }}
  >
    i
  </span>
);

const Card = ({ className = "", style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) => (
  <section className={`rounded-[24px] bg-white p-6 ${className}`} style={style}>{children}</section>
);

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="m-0 text-[18px] font-bold text-[#171423]">{children}</h2>;

const LinkArrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <a href="#" className="inline-flex items-center gap-1 text-[13px] font-semibold no-underline" style={{ color: light ? "#D6D1E4" : C.purple }}>
    {children}<ArrowRight size={14} />
  </a>
);

const OutlineBtn = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium no-underline shadow-[inset_0_0_0_1px_#CDCCD9] hover:bg-[#F4F2FB]" style={{ color: C.purple }}>
    {children}
  </a>
);

/* ───────────────────────────── Sidebar (Figma node 2774:46505) ───────────────────────────── */
function Sidebar() {
  const items = [
    { label: "Overview", icon: FileCheck2, active: true },
    { label: "Subscribers", icon: User },
    { label: "Reward Logs", icon: Trophy },
    { label: "Analytics", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ];
  return (
    <aside className="w-[228px] shrink-0 border-r border-[#CDCCD9]">
      <div className="sticky top-0 flex h-screen flex-col justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 pt-3">
            {/* Replace with the real ReferralHero logo SVG from Figma */}
            <div className="flex h-10 w-[175px] items-center justify-center text-[22px] tracking-[-0.02em] text-[#171423]">
              Referral<b className="font-extrabold">Hero</b>
            </div>
            <div className="h-px w-full bg-[#CDCCD9]" />
          </div>
          <nav className="flex flex-col gap-5 px-6">
            {items.map(({ label, icon: Icon, active }) => (
              <a key={label} href="#" className="flex items-center justify-between no-underline">
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: active ? C.purple : "#fff" }}>
                    <Icon size={16} color={active ? "#fff" : C.ink} strokeWidth={1.8} />
                  </span>
                  <span className="text-[14px] leading-[1.45]" style={{ fontWeight: active ? 700 : 500, color: active ? C.ink : C.ink2 }}>{label}</span>
                </span>
                {!active && <ChevronDown size={16} color={C.ink} />}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-[#CDCCD9] p-6">
          <span className="text-[14px] font-medium uppercase leading-[1.7] tracking-[0.28px] text-[#171423]">Need help?</span>
          <div className="flex gap-2">
            <a href="#" aria-label="Support" className="flex h-10 w-[86px] items-center justify-center rounded-full bg-[#403754]"><Wrench size={20} color="#fff" /></a>
            <a href="#" aria-label="Help docs" className="flex h-10 w-[86px] items-center justify-center rounded-full bg-[#403754]"><BookOpen size={20} color="#fff" /></a>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <nav className="flex gap-6 text-[14px] font-medium">
        <a href="#" className="text-[#171423] no-underline">Home</a>
        <a href="#" className="text-[#171423] no-underline">Our email</a>
        <a href="#" className="text-[#171423] no-underline">Book a call</a>
      </nav>
      <button className="flex items-center gap-2.5 rounded-full border border-[#E8E6EE] bg-transparent py-1.5 pl-1.5 pr-2">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#E7DDFC] text-[12px] font-bold text-[#332845]">AM</span>
        <span className="text-[14px] font-semibold">Alex Morgan</span>
        <ChevronDown size={14} color="#5C5C5C" />
      </button>
    </div>
  );
}

/* ───────────────────────────── Page header ───────────────────────────── */
function Header({ range, setRange }: { range: Range; setRange: (r: Range) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [campaign, setCampaign] = useState("Customer referral program");
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [query, setQuery] = useState("");
  const switcherRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [menuOpen]);
  useEffect(() => {
    if (!switcherOpen) return;
    const close = (e: MouseEvent) => { if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) setSwitcherOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setSwitcherOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [switcherOpen]);
  const selected = CAMPAIGNS.find((c) => c.name === campaign);
  const matches = CAMPAIGNS.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const menuItems = [
    { label: "Edit", icon: Pencil },
    { label: "Get Code", icon: Code },
    { label: "Rename", icon: Type },
    { label: "Duplicate", icon: Copy },
    { label: "Stop campaign", icon: Square, fill: true },
  ];
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-5">
        <h1 className="m-0 text-[28px] font-bold tracking-[-0.01em]">Overview</h1>
        <div ref={switcherRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={switcherOpen}
            onClick={() => { setSwitcherOpen((v) => !v); setQuery(""); }}
            className="flex h-10 min-w-[260px] cursor-pointer items-center justify-between gap-2 rounded-xl border-0 bg-white pl-4 pr-3 text-[14px] font-semibold text-[#171423]"
          >
            <span className="truncate">{campaign}</span>
            <ChevronDown size={16} color={C.muted} />
          </button>
          {switcherOpen && (
            <div role="listbox" aria-label="Switch campaign" className="absolute left-0 top-12 z-50 w-[300px] overflow-hidden rounded-[18px] py-2 shadow-[0_18px_40px_rgba(23,20,35,0.28)]" style={{ background: C.darkPurple }}>
              <div className="px-3 pb-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search campaigns"
                  className="h-9 w-full rounded-lg border-0 bg-white/10 px-3 text-[14px] text-white outline-none placeholder:text-white/50"
                />
              </div>
              <div className="max-h-[260px] overflow-y-auto">
                {matches.map((c) => (
                  <button
                    key={c.name}
                    role="option"
                    aria-selected={campaign === c.name}
                    onClick={() => { setCampaign(c.name); setSwitcherOpen(false); }}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-2.5 text-left text-[15px] font-medium text-white hover:bg-white/10"
                  >
                    <span className="truncate">{c.name}</span>
                    {c.status && (
                      <span className="shrink-0 text-[11px] font-semibold" style={{ color: c.status === "Active" ? C.mint : "#B9B3C9" }}>
                        {c.status}
                      </span>
                    )}
                  </button>
                ))}
                {matches.length === 0 && (
                  <div className="px-4 py-3 text-[13px] text-white/60">No campaigns match “{query}”</div>
                )}
              </div>
            </div>
          )}
        </div>
        {selected?.status && (
          <span
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold"
            style={selected.status === "Active"
              ? { background: C.confBg, color: C.confFg }
              : { background: "#F0EEF5", color: C.muted }}
          >
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: selected.status === "Active" ? C.confFg : "#B9B3C9" }} />
            {selected.status}
          </span>
        )}
        <div ref={menuRef} className="relative">
          <button aria-label="Campaign settings" title="Campaign settings" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[#403754]">
            <Settings size={18} strokeWidth={1.8} />
          </button>
          {menuOpen && (
            <div role="menu" className="absolute left-0 top-12 z-50 w-[232px] overflow-hidden rounded-[18px] py-2 shadow-[0_18px_40px_rgba(23,20,35,0.28)]" style={{ background: C.darkPurple }}>
              <button role="menuitem" onClick={() => setMenuOpen(false)} className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2.5 text-left text-[15px] font-medium text-white hover:bg-white/10">
                <Plus size={17} strokeWidth={1.8} color="#E5E1F0" />Create New Campaign
              </button>
              <div className="mx-3 my-2 h-px" style={{ background: "rgba(255,255,255,0.14)" }} />
              {menuItems.map(({ label, icon: Icon, fill }) => (
                <button key={label} role="menuitem" onClick={() => setMenuOpen(false)} className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2.5 text-left text-[15px] font-medium text-white hover:bg-white/10">
                  <Icon size={fill ? 13 : 17} strokeWidth={fill ? 0 : 1.8} color="#E5E1F0" fill={fill ? "#E5E1F0" : "none"} />{label}
                </button>
              ))}
              <div className="mx-3 my-2 h-px" style={{ background: "rgba(255,255,255,0.14)" }} />
              <button role="menuitem" onClick={() => setMenuOpen(false)} className="flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 py-2.5 text-left text-[15px] font-medium hover:bg-white/10" style={{ color: "#FF8A7A" }}>
                <Trash2 size={17} strokeWidth={1.8} />Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Date range" className="flex gap-1 rounded-full bg-white p-1">
          {(["90D", "12M", "All"] as Range[]).map((r) => (
            <button key={r} aria-pressed={range === r} onClick={() => setRange(r)}
              className="rounded-full border-0 px-3.5 py-[7px] text-[13px] font-semibold"
              style={{ background: range === r ? C.darkPurple : "transparent", color: range === r ? "#fff" : "#4A4658" }}>
              {r}
            </button>
          ))}
        </div>
        {/* Figma: Button_Primary_Size M (node 2134:58311) */}
        <a href="#" className="inline-flex h-12 items-center justify-center rounded-full bg-[#7057C6] px-8 pb-0.5 text-[16px] font-medium leading-[1.45] text-white no-underline">
          Add subscriber
        </a>
      </div>
    </header>
  );
}

/* ───────────────────────────── Results block ───────────────────────────── */
function ResultsBlock({ state, range }: { state: ProgramState; range: Range }) {
  const p = PERIOD[range];
  const d = DATA[state];
  return (
    <section className="col-span-8 flex flex-col gap-[22px] rounded-[24px] p-7 text-white" style={{ background: C.darkPurple }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#E7DDFC]"><Sparkles size={16} color={C.blue} /></div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#D6D1E4]">{p.title}</span>
        </div>
        <LinkArrow light>Full analytics</LinkArrow>
      </div>
      {/* fixed 3-line height so both states are the same size */}
      <p className="m-0 min-h-[3.9em] max-w-[780px] text-[26px] font-bold leading-[1.3] tracking-[-0.01em]">
        {state === "established" ? (
          <>Referrals brought in <span style={{ color: C.mint }}>$23,482</span> {p.phrase}, 18% more than {p.prev}, from 7 new customers. You paid $1,638 in rewards to get them.</>
        ) : (
          <><span style={{ color: C.mint }}>214 advocates</span> shared your link {p.phrase}, 40% more than {p.prev}, bringing 92 referred visitors and 13 pending referrals.</>
        )}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {d.tiles.map((t: any) => (
          <div key={t.label} className="flex min-h-[112px] flex-col gap-1 rounded-[14px] p-3.5"
            style={{ background: C.tile, boxShadow: t.highlight ? `inset 0 0 0 2px ${C.mint}` : "none" }}>
            <span className="flex items-center gap-1.5 text-[13px] text-[#D6D1E4]">{t.label}{t.info && <Info text={t.info} dark />}</span>
            <span className="text-[26px] font-bold leading-[1.2]" style={{ color: t.green ? C.mint : "#fff" }}>{t.value}</span>
            {/* change vs previous period — numbers only, no "vs prev." wording; red ↓ when negative */}
            {t.delta && <span className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: C.mint }}><ArrowUp size={12} />{t.delta}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────── Needs your attention ───────────────────────────── */
function NeedsAttention() {
  const items = [
    { text: "3 rewards currently pending", cta: "Review", icon: Gift, bg: "#FCEFC2", fg: "#6B5200" },
    { text: "3 rewards failed and need to be resent", cta: "Resend", icon: RefreshCw, bg: "#FFEEED", fg: "#C23A35" },
    { text: "10 messages need answering", cta: "Reply", icon: MessageCircle, bg: "#DCEBFB", fg: "#1F4F8C" },
    { text: "1 advocate match to resolve", cta: "Resolve", icon: UserCheck, bg: "#E9E4F7", fg: "#4A3690" },
    { text: "2 referrals flagged as high risk", cta: "Review", icon: TriangleAlert, bg: "#FBE3E3", fg: "#8C2323" },
  ];
  return (
    <Card className="col-span-4 flex flex-col gap-2" style={{ boxShadow: "inset 0 0 0 2px #F4D77A" }}>
      <div className="flex items-center justify-between pb-1"><H2>Needs your attention</H2>
        <span className="rounded-full bg-[#FCEFC2] px-2.5 py-1 text-[12px] font-semibold text-[#6B5200]">{items.length}</span></div>
      {/* max-height shows 4.5 rows so the next item peeks and signals scroll */}
      <div className="rh-scroll flex max-h-[258px] flex-col overflow-y-auto pr-1.5">
        {items.map(({ text, cta, icon: Icon, bg, fg }, i) => (
          <div key={text} className={`flex items-center gap-3 py-3 ${i ? "border-t border-[#F0EEF5]" : ""}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]" style={{ background: bg, color: fg }}><Icon size={16} /></div>
            <span className="min-w-0 flex-1 text-[14px] font-semibold">{text}</span>
            <OutlineBtn>{cta}</OutlineBtn>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────────── Referral funnel ───────────────────────────── */
/* ───────────── Growth tips (AI-written, between Results and the funnel) ───────────── */
// Sample tips. In production these are written by the same AI as the Insights card,
// from this account's real funnel numbers. Always show up to 3, ranked by expected impact.
type TipGroup = "engagement" | "messages" | "impact" | "rewards";
type Tip = { id: string; tag: string; group: TipGroup; title: string; body: string; action: string };

const TIP_STYLE: Record<TipGroup, { tile: string; pillBg: string; pillFg: string }> = {
  engagement: { tile: "#F6F4FF", pillBg: "#E9E4F7", pillFg: "#4A3690" },
  messages: { tile: "#F0F6FE", pillBg: "#E0EEFA", pillFg: "#1F4F8C" },
  impact: { tile: "#FFF8EC", pillBg: "#FFFFFF", pillFg: "#FFB300" },
  rewards: { tile: "#EEFAF3", pillBg: "#DFF3E7", pillFg: "#1F6B3A" },
};

const TIPS: Record<ProgramState, Tip[]> = {
  established: [
    { id: "shares", tag: "Engagement", group: "engagement", title: "Turn more dashboard visits into shares.", body: "Only 1 in 3 visitors shares today. Run a limited-time bonus. Your Oct 2 double-rewards week lifted referrals 4.8× in five days.", action: "Set up a promotion" },
    { id: "messages", tag: "Messages", group: "messages", title: "Reach the 2,794 subscribers you haven't heard from.", body: "Send a short SMS reminder with their referral link. It reaches people who skip email.", action: "Send reminder" },
    { id: "top", tag: "Rewards", group: "rewards", title: "Keep Jordan Ellis sharing.", body: "Jordan drives 55% of your revenue. Send a personal thank-you or a VIP bonus to keep your best advocate sharing.", action: "Message Jordan" },
  ],
  building: [
    { id: "shares", tag: "Engagement", group: "engagement", title: "Turn more dashboard visits into shares.", body: "Only 1 in 3 visitors shares today. Run a limited-time bonus. Your Oct 2 double-rewards week lifted referrals 4.8× in five days.", action: "Set up a promotion" },
    { id: "messages", tag: "Messages", group: "messages", title: "Reach the 2,794 subscribers you haven't heard from.", body: "Send a short SMS reminder with their referral link. It reaches people who skip email.", action: "Send reminder" },
    { id: "pending", tag: "Impact", group: "impact", title: "Turn 13 pending referrals into customers.", body: "Nudge referred friends to finish signing up. Each one that confirms moves you closer to a 1.5× return.", action: "Remind referrals" },
  ],
};

function GrowthTips({ state }: { state: ProgramState }) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, "up" | "down">>({});
  // In production: on dismiss / 👎, ask the AI for the next-best tip so 3 stay visible.
  const tips = TIPS[state].filter((t) => !hidden.includes(t.id)).slice(0, 3);
  if (tips.length === 0) return null;
  const hide = (id: string) => setHidden((h) => [...h, id]);
  const vote = (id: string, v: "up" | "down") => {
    setVotes((s) => ({ ...s, [id]: v }));
    // send feedback to the AI here
    if (v === "down") hide(id);
  };
  const iconBtn = "flex h-[30px] w-[30px] items-center justify-center rounded-full text-[#8A879B] hover:bg-white/70";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#E7DDFC]"><Sparkles size={16} color={C.blue} /></span>
          <H2>{"Let's grow your referrals"}</H2>
        </div>
        <LinkArrow>More ideas</LinkArrow>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {tips.map((t, i) => {
          const st = TIP_STYLE[t.group];
          return (
            <div key={t.id} className="flex min-w-0 flex-col gap-2.5 rounded-[18px] p-[18px]" style={{ background: st.tile }}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] font-bold text-[#403754]">{i + 1}</span>
                  <span className="rounded-full px-2 py-0.5 text-[12px] font-semibold" style={{ background: st.pillBg, color: st.pillFg }}>{t.tag}</span>
                </div>
                <button type="button" aria-label="Dismiss tip" title="Dismiss" onClick={() => hide(t.id)} className={`${iconBtn} -mr-1.5 -mt-1`}>
                  <X size={14} />
                </button>
              </div>
              <span className="text-[15px] font-bold leading-[1.35]">{t.title}</span>
              <span className="flex-1 text-[13px] leading-[1.55] text-[#5A5870]">{t.body}</span>
              <div className="flex items-center justify-between gap-2">
                <a href="#" className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[13px] font-medium no-underline shadow-[inset_0_0_0_1px_#CDCCD9]" style={{ color: C.purple }}>
                  {t.action}
                </a>
                <div className="flex gap-0.5">
                  <button type="button" aria-label="Helpful" title="Helpful" aria-pressed={votes[t.id] === "up"} onClick={() => vote(t.id, "up")} className={iconBtn} style={votes[t.id] === "up" ? { color: C.purple } : undefined}>
                    <ThumbsUp size={16} />
                  </button>
                  <button type="button" aria-label="Not helpful" title="Not helpful" onClick={() => vote(t.id, "down")} className={iconBtn}>
                    <ThumbsDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Funnel({ state }: { state: ProgramState }) {
  const s = DATA[state].statuses;
  const total = s.pending + s.unconfirmed + s.confirmed;
  const pct = (n: number) => Math.round((n / total) * 100) + "%";
  const steps = [
    { label: "Subscribers", v: 3980, conv: "", info: "In your program", fill: "bg-funnel-subscriber", track: "bg-funnel-subscriber-track", pill: "" },
    { label: "Messages", v: 1186, conv: "29.8%", info: "Clicked an email or SMS · Email 64% · SMS 36%", fill: "bg-funnel-engagement", track: "bg-funnel-engagement-track", pill: "bg-funnel-engagement-pill text-funnel-engagement-text" },
    { label: "Dashboard visits", v: 642, conv: "54.1%", info: "Opened their referral dashboard", fill: "bg-funnel-engagement", track: "bg-funnel-engagement-track", pill: "bg-funnel-engagement-pill text-funnel-engagement-text" },
    { label: "Shares", v: 214, conv: "33.3%", info: "Shared their referral link", fill: "bg-funnel-engagement", track: "bg-funnel-engagement-track", pill: "bg-funnel-engagement-pill text-funnel-engagement-text" },
    { label: "Visitors", v: 92, conv: "43%", info: "Arrived via a referral link", fill: "bg-funnel-visitors", track: "bg-funnel-impact-track", pill: "bg-funnel-visitors-pill text-funnel-visitors-text" },
    { label: "Pending", v: s.pending, conv: pct(s.pending), info: "Of referrals · waiting on a conversion", fill: "bg-funnel-pending", track: "bg-funnel-impact-track", pill: "bg-funnel-pending-pill text-funnel-pending" },
    { label: "Unconfirmed", v: s.unconfirmed, conv: pct(s.unconfirmed), info: "Of referrals · not yet verified", fill: "bg-funnel-unconfirmed", track: "bg-funnel-impact-track", pill: "bg-funnel-unconfirmed-pill text-funnel-unconfirmed" },
    { label: "Confirmed", v: s.confirmed, conv: pct(s.confirmed), info: "Of referrals · converted, reward earned", fill: "bg-funnel-confirmed", track: "bg-funnel-impact-track", pill: "bg-funnel-confirmed-pill text-funnel-confirmed" },
  ];
  // log scale so tiny numbers are still visible next to 3,980
  const h = (v: number) => Math.max(8, Math.round((Math.log10(v + 1) / Math.log10(3981)) * 100)) + "%";
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H2>Referral funnel</H2>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-funnel-muted">Engaged referral rate
            <Info text="Referrals ÷ subscribers who visited their referral dashboard in the selected period (20 ÷ 642). Across all subscribers it is 0.2%." /></span>
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-bold leading-none">3.1%</span>
            <span className="rounded-full bg-funnel-positive-bg px-2 py-0.5 text-[12px] font-semibold text-funnel-positive">↑ 0.4 pts</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-3">
        <div className="col-span-1" />
        <div className="col-span-3 border-b-2 border-funnel-engagement-line pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-funnel-engagement-text">Engagement</div>
        <div className="col-span-4 border-b-2 border-funnel-impact-line pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-funnel-impact-text">Impact</div>
      </div>
      <div className="grid grid-cols-8 gap-3">
        {steps.map((st) => (
          <a key={st.label} href="#" className="flex min-w-0 flex-col gap-2 text-funnel-ink no-underline">
            <span className="flex min-h-[38px] items-start gap-1.5 text-[13px] font-semibold leading-[1.35]">{st.label}<Info text={st.info} /></span>
            <div className={`flex h-[120px] items-end overflow-hidden rounded-2xl ${st.track}`}>
              <div className={`w-full rounded-t-2xl ${st.fill}`} style={{ height: h(st.v) }} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[22px] font-bold">{st.v.toLocaleString("en-US")}</span>
              {st.conv && <span className={`rounded-full px-2 py-[3px] text-[12px] font-semibold ${st.pill}`}>{st.conv}</span>}
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}

/* ───────────────────────────── Top 25 advocates (sortable) ───────────────────────────── */
type SortKey = "visitors" | "pend" | "unconf" | "conf" | "rewards" | "revenue" | "share";
function TopAdvocates({ state }: { state: ProgramState }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "revenue", dir: -1 });
  const rows = useMemo(() => {
    const base = ADVOCATES_BASE.map(([name, pend, unconf, conf, rewards, revenue, visitors], i) => {
      let r = { rank: i + 1, name, pend, unconf, conf, rewards, revenue, visitors, share: (revenue / 23482) * 100 };
      if (state === "building") {
        const tot = pend + unconf + conf;
        const c = i < 2 ? 1 : 0, u = Math.min(unconf, tot - c);
        r = { ...r, conf: c, unconf: u, pend: tot - c - u, rewards: i < 2 ? 320 : 0, revenue: i < 2 ? 380 : 0 };
      }
      return r;
    });
    return [...base].sort((a, b) => ((a as any)[sort.key] - (b as any)[sort.key]) * sort.dir || a.rank - b.rank);
  }, [sort, state]);

  // building state: Visitors column (before Pending) replaces Share of revenue
  const cols: [string, SortKey][] = state === "building"
    ? [["Visitors", "visitors"], ["Pending", "pend"], ["Unconfirmed", "unconf"], ["Confirmed", "conf"], ["Rewards", "rewards"], ["Revenue", "revenue"]]
    : [["Pending", "pend"], ["Unconfirmed", "unconf"], ["Confirmed", "conf"], ["Rewards", "rewards"], ["Revenue", "revenue"], ["Share of revenue", "share"]];
  const grid = state === "building"
    ? "32px minmax(0,2.4fr) repeat(4,minmax(0,.9fr)) minmax(0,1fr) minmax(0,1fr)"
    : "32px minmax(0,2.2fr) repeat(3,minmax(0,.9fr)) minmax(0,1fr) minmax(0,1fr) minmax(0,1.5fr)";
  const badge = (n: number, bg: string, fg: string) => <span className="rounded-full px-2.5 py-0.5 text-[12px] font-semibold" style={{ background: bg, color: fg }}>{n}</span>;

  return (
    <Card className="order-1 col-span-8 flex flex-col gap-4">
      <div className="flex items-center justify-between"><H2>Top 25 advocates</H2><LinkArrow>All subscribers</LinkArrow></div>
      <div className="overflow-x-auto rounded-[20px] shadow-[inset_0_0_0_1px_#E8E6EE]">
        <div className="grid items-center gap-4 bg-[#EEECF4] px-5 py-[13px] text-[12px] font-medium uppercase tracking-[0.02em] text-[#4A4658]" style={{ gridTemplateColumns: grid }}>
          <span>#</span><span>Advocate</span>
          {cols.map(([label, key]) => {
            const on = sort.key === key;
            return (
              <button key={key} aria-sort={on ? (sort.dir < 0 ? "descending" : "ascending") : "none"}
                onClick={() => setSort({ key, dir: on ? (-sort.dir as 1 | -1) : -1 })}
                className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-left uppercase" style={{ color: on ? C.ink : "#4A4658" }}>
                {label}{on && sort.dir > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} style={{ opacity: on ? 1 : 0.35 }} />}
              </button>
            );
          })}
        </div>
        <div className="rh-scroll max-h-[352px] overflow-y-auto">
          {rows.map((r) => {
            const [bg, fg] = AVATAR[(r.rank - 1) % 5]!;
            const initials = r.name.split(" ").map((w) => w[0]).join("");
            return (
              <div key={r.name} className="grid items-center gap-4 border-t border-[#F0EEF5] px-5 py-[13px] text-[14px]" style={{ gridTemplateColumns: grid }}>
                <span className="font-bold text-[#5A5870]">{r.rank}</span>
                <a href="#" className="flex min-w-0 items-center gap-3 text-[#171423] no-underline">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: bg, color: fg }}>{initials}</span>
                  <span className="flex min-w-0 flex-col"><span className="font-semibold">{r.name}</span>
                    <span className="truncate text-[12px] text-[#5A5870]">{r.name.toLowerCase().replace(" ", ".")}@example.com</span></span>
                </a>
                {state === "building" && <span className="font-semibold">{r.visitors}</span>}
                <span>{badge(r.pend, C.pendingBg, C.pendingFg)}</span>
                <span>{badge(r.unconf, C.unconfBg, C.unconfFg)}</span>
                <span>{badge(r.conf, C.confBg, C.confFg)}</span>
                <span>{money(r.rewards)}</span>
                <span className="font-bold">{money(r.revenue)}</span>
                {state === "established" && (
                  <div className="flex items-center gap-2.5">
                    <span className="block h-2 flex-1 overflow-hidden rounded-full bg-[#EEECF4]"><span className="block h-full rounded-full bg-revenue" style={{ width: r.share + "%" }} /></span>
                    <span className="w-10 text-right text-[13px] font-semibold">{r.share.toFixed(r.share < 10 ? 1 : 0)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ───────────── Insights (matches subscriber profile: image-exact-snapshot.lovable.app) ───────────── */
function Insights({ state }: { state: ProgramState }) {
  const d = DATA[state];
  return (
    <section className="order-2 col-span-4 flex flex-col rounded-[24px] p-6" style={{ background: C.lavender }}>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white"><Sparkles size={16} color={C.blue} /></span>
        <H2>Insights</H2>
      </div>
      <p className="m-0 text-[14px] leading-[1.55] text-[#171423]">{d.insights}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {d.questions.map((q) => (
          <button key={q} className="inline-flex rounded-full border-0 bg-white px-3 py-1.5 text-left text-[13px] font-semibold text-[#171423] hover:bg-[#EEEBF5]">{q}</button>
        ))}
      </div>
      <form className="mt-auto pt-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 rounded-[14px] bg-white p-1.5 pl-4">
          <input placeholder="Ask about your program…" className="min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none placeholder:text-[#5A5870]" />
          <button aria-label="Ask" className="flex h-8 w-8 items-center justify-center rounded-full border-0 bg-[#403754] text-white"><ArrowUp size={16} /></button>
        </div>
      </form>
    </section>
  );
}

/* ───────────────────────────── Revenue & Payouts ───────────────────────────── */
function RevenuePayouts({ state }: { state: ProgramState }) {
  const d = DATA[state];
  const max = Math.max(...d.months.map(([, v]) => v), 1);
  const fmt = (v: number) => (v >= 1000 ? "$" + (v / 1000).toFixed(1) + "k" : "$" + v);
  return (
    <Card className="flex flex-col gap-3.5" style={{ background: C.payouts }}>
      <div className="flex items-center justify-between"><H2>Revenue &amp; Payouts</H2><LinkArrow>Reward logs</LinkArrow></div>
      <div className="grid grid-cols-12 items-start gap-10">
        <div className="col-span-7 flex flex-col gap-2.5">
          <div className="mb-1 border-b-2 border-revenue-heading-line pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-revenue-heading">Revenue</div>
          <div role="img" aria-label="Monthly referral revenue" className="grid h-[110px] grid-cols-6 items-end gap-2">
          {d.months.map(([m, v], i) => (
            <div key={m} className="flex h-full flex-col items-center justify-end gap-1.5">
              <span className="text-[11px] font-semibold text-[#5A5870]">{fmt(v)}</span>
              <span className={`block w-full rounded-t-lg rounded-b ${i === 5 ? "bg-revenue" : ""}`} style={{ height: Math.max(3, Math.round((v / max) * 70)), ...(i !== 5 ? { background: "#D6D1E4" } : {}) }} />
              <span className="text-[11px] text-[#5A5870]">{m}</span>
            </div>
          ))}
          </div>
        </div>
        <div className="col-span-5 flex flex-col">
          <div className="mb-1 border-b-2 border-revenue-heading-line pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-revenue-heading">Payouts</div>
          {d.money.map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-3 py-2.5 text-[14px] ${i < 3 ? "border-b border-[#F0EEF5]" : ""}`}>
              <span className="text-[13px] text-[#5A5870]">{k}</span>
              <span className="font-bold" style={{ color: k === "Return on rewards" && state === "established" ? "#1F6B3A" : C.ink }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────────── Activity (matches subscriber profile) ───────────────────────────── */
/* ───────────── Advocate referral network (replaces Activity) ───────────── */
// Sample data. In production, reuse the existing Advocate-Referral Network data + layout:
// nodes = advocates with ≥1 referred visitor, plus the subscribers they referred.
// x/y are positions inside a 1300×430 viewBox (today's graph layout engine can supply these).
type Tier = 1 | 2 | 3 | 4;
type RefStatus = "pending" | "unconfirmed" | "confirmed";
type Source = "Link" | "QR" | "WOM";
type NetNode = {
  id: string;
  kind: "advocate" | "referral";
  x: number;
  y: number;
  tier?: Tier;
  visitors?: number;
  referrals?: string[];
  status?: RefStatus;
  source?: Source;
  avatar?: [string, string];
};

const NETWORK: NetNode[] = [
  { id: "Jordan Ellis", kind: "advocate", tier: 1, x: 260, y: 230, visitors: 19, referrals: ["Riley Park", "Avery Chen", "Lena Ortiz", "Marco Diaz", "Priya Shah", "Noah Kim"], avatar: ["#E3F3F3", "#2F7F7F"] },
  { id: "Riley Park", kind: "advocate", tier: 1, x: 375, y: 163, visitors: 8, referrals: ["Ella Ward", "Owen Hart", "Ivy Moss"], status: "confirmed", source: "Link", avatar: ["#E6EEFB", "#30589A"] },
  { id: "Sam Rivera", kind: "advocate", tier: 1, x: 840, y: 215, visitors: 9, referrals: ["Dana Fox", "Leo Grant", "Mia Stone"], avatar: ["#ECE7F8", "#5B43B5"] },
  { id: "Dana Fox", kind: "advocate", tier: 3, x: 949, y: 255, visitors: 3, referrals: ["Zoe Lane"], status: "confirmed", source: "Link", avatar: ["#FBEFE3", "#9A5B1F"] },
  { id: "Taylor Brooks", kind: "advocate", tier: 2, x: 640, y: 90, visitors: 6, referrals: ["Ben Cole", "Ada Hale"], avatar: ["#E8F5EA", "#2E7A3E"] },
  { id: "Casey Nguyen", kind: "advocate", tier: 2, x: 1090, y: 110, visitors: 5, referrals: ["Eli Ross", "Ruth Bell"], avatar: ["#E3F3F3", "#2F7F7F"] },
  { id: "Morgan Lee", kind: "advocate", tier: 3, x: 600, y: 345, visitors: 3, referrals: ["Finn Shaw"], avatar: ["#E6EEFB", "#30589A"] },
  { id: "Avery Quinn", kind: "advocate", tier: 3, x: 690, y: 405, visitors: 2, referrals: ["Gus Reed"], avatar: ["#ECE7F8", "#5B43B5"] },
  { id: "Quinn Adams", kind: "advocate", tier: 3, x: 1215, y: 330, visitors: 2, referrals: ["Hana Yu"], avatar: ["#FBEFE3", "#9A5B1F"] },
  { id: "Parker Hayes", kind: "advocate", tier: 4, x: 70, y: 70, visitors: 3, referrals: [], avatar: ["#E8F5EA", "#2E7A3E"] },
  { id: "Skyler Grant", kind: "advocate", tier: 4, x: 960, y: 45, visitors: 2, referrals: [], avatar: ["#E3F3F3", "#2F7F7F"] },
  { id: "Rowan Kim", kind: "advocate", tier: 4, x: 1000, y: 385, visitors: 2, referrals: [], avatar: ["#E6EEFB", "#30589A"] },
  { id: "Noel Reyes", kind: "advocate", tier: 4, x: 1255, y: 45, visitors: 1, referrals: [], avatar: ["#ECE7F8", "#5B43B5"] },
  { id: "Avery Chen", kind: "referral", x: 375, y: 296, status: "confirmed", source: "Link" },
  { id: "Lena Ortiz", kind: "referral", x: 260, y: 363, status: "pending", source: "WOM" },
  { id: "Marco Diaz", kind: "referral", x: 145, y: 296, status: "pending", source: "Link" },
  { id: "Priya Shah", kind: "referral", x: 145, y: 163, status: "pending", source: "Link" },
  { id: "Noah Kim", kind: "referral", x: 260, y: 97, status: "unconfirmed", source: "Link" },
  { id: "Ella Ward", kind: "referral", x: 302, y: 102, status: "pending", source: "Link" },
  { id: "Owen Hart", kind: "referral", x: 400, y: 71, status: "pending", source: "WOM" },
  { id: "Ivy Moss", kind: "referral", x: 470, y: 147, status: "confirmed", source: "Link" },
  { id: "Leo Grant", kind: "referral", x: 751, y: 290, status: "confirmed", source: "Link" },
  { id: "Mia Stone", kind: "referral", x: 820, y: 101, status: "pending", source: "WOM" },
  { id: "Zoe Lane", kind: "referral", x: 1028, y: 283, status: "unconfirmed", source: "WOM" },
  { id: "Ben Cole", kind: "referral", x: 562, y: 135, status: "confirmed", source: "QR" },
  { id: "Ada Hale", kind: "referral", x: 571, y: 32, status: "pending", source: "Link" },
  { id: "Eli Ross", kind: "referral", x: 1059, y: 195, status: "pending", source: "QR" },
  { id: "Ruth Bell", kind: "referral", x: 1000, y: 110, status: "unconfirmed", source: "WOM" },
  { id: "Finn Shaw", kind: "referral", x: 510, y: 345, status: "confirmed", source: "QR" },
  { id: "Gus Reed", kind: "referral", x: 769, y: 368, status: "pending", source: "WOM" },
  { id: "Hana Yu", kind: "referral", x: 1133, y: 300, status: "unconfirmed", source: "Link" },
];

const NETWORK_STATS = { engaged: 1186, link: 11, qr: 3, wom: 6 };

const TIERS: Record<Tier, { label: string; color: string }> = {
  1: { label: "Top 10%", color: "#9D8DF1" },
  2: { label: "Top 10–25%", color: "#86CC8A" },
  3: { label: "Top 25–50%", color: "#8CCBF0" },
  4: { label: "Top 50–100%", color: "#F2D94E" },
};
const STATUS: Record<RefStatus, { label: string; bg: string; fg: string }> = {
  pending: { label: "Pending", bg: "#FFF9E0", fg: "#FFB300" },
  unconfirmed: { label: "Unconfirmed", bg: "#FFEEED", fg: "#FF5D58" },
  confirmed: { label: "Confirmed", bg: "#EAF5F3", fg: "#429A84" },
};
const VB_W = 1300, VB_H = 430;

function PersonNode({ x, y, r }: { x: number; y: number; r: number }) {
  const id = `clip-${Math.round(x)}-${Math.round(y)}`;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#fff" stroke="#C9C8D2" strokeWidth={1} />
      <clipPath id={id}><circle cx={x} cy={y} r={r - 1} /></clipPath>
      <g clipPath={`url(#${id})`} fill="#B5B4BE">
        <circle cx={x} cy={y - r * 0.22} r={r * 0.3} />
        <ellipse cx={x} cy={y + r * 0.78} rx={r * 0.62} ry={r * 0.5} />
      </g>
    </g>
  );
}

function AdvocateNetwork() {
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const byId = useMemo(() => Object.fromEntries(NETWORK.map((n) => [n.id, n])), []);
  const parentOf = useMemo(() => {
    const m: Record<string, string> = {};
    NETWORK.forEach((n) => (n.referrals ?? []).forEach((k) => (m[k] = n.id)));
    return m;
  }, []);
  const edges = NETWORK.flatMap((a) => (a.referrals ?? []).flatMap((k, i) => { const to = byId[k]; return to ? [{ from: a, to, tier: a.tier ?? 4, i }] : []; }));
  const sel = selected ? byId[selected] : null;
  const initials = (name: string) => name.split(" ").map((w) => w[0]).join("");
  const toggle = (id: string) => setSelected((cur) => (cur === id ? null : id));

  // zoom: shrink the viewBox around the centre
  const vw = VB_W / zoom, vh = VB_H / zoom;
  const viewBox = `${(VB_W - vw) / 2} ${(VB_H - vh) / 2} ${vw} ${vh}`;

  // popover data
  const kids = sel ? (sel.referrals ?? []).flatMap((k) => { const n = byId[k]; return n ? [n] : []; }) : [];
  const count = (s: RefStatus) => kids.filter((k) => k.status === s).length;
  const tierOf = (n: NetNode): Tier => n.tier ?? byId[parentOf[n.id] ?? ""]?.tier ?? 4;
  const px = sel ? ((sel.x - (VB_W - vw) / 2) / vw) * 100 : 0;
  const py = sel ? ((sel.y - (VB_H - vh) / 2) / vh) * 100 : 0;
  const openLeft = px > 55;
  const shiftY = py < 35 ? "-12%" : py > 65 ? "-88%" : "-50%";

  const Stat = ({ label, info, value }: { label: string; info: string; value: number }) => (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-[13px] text-[#5A5870]">{label}<Info text={info} /></span>
      <span className="text-[20px] font-bold">{value.toLocaleString("en-US")}</span>
    </div>
  );

  return (
    <Card className="flex flex-col gap-4" style={{ background: "#F6F4FF", boxShadow: "inset 0 0 0 2px #CDBEF5" }}>
      {/* header + stats box */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H2>Advocate referral network</H2>
        <div className="flex flex-wrap items-center gap-4 rounded-[14px] bg-white px-4 py-2">
          <Stat label="Engaged advocates" info="Subscribers who opened an email or received an SMS in the selected period" value={NETWORK_STATS.engaged} />
          <span className="h-[22px] w-px bg-[#E0DDEA]" />
          <Stat label="Link referrals" info="Referrals that came through an advocate's referral link" value={NETWORK_STATS.link} />
          <span className="h-[22px] w-px bg-[#E0DDEA]" />
          <Stat label="QR referrals" info="Referrals that came from scanning an advocate's QR code" value={NETWORK_STATS.qr} />
          <span className="h-[22px] w-px bg-[#E0DDEA]" />
          <Stat label="WOM referrals" info="Word-of-mouth referrals: the referred person named their advocate instead of using a link or QR code" value={NETWORK_STATS.wom} />
        </div>
      </div>

      {/* graph */}
      <div className="relative rounded-2xl bg-white p-1.5">
        <div className="relative">
          <svg viewBox={viewBox} width="100%" className="block" role="img" aria-label="Advocate referral network">
            <defs>
              {(Object.keys(TIERS) as unknown as Tier[]).map((t) => (
                <marker key={t} id={`ar${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0L10 5L0 10z" fill={TIERS[t].color} />
                </marker>
              ))}
            </defs>
            {edges.map(({ from, to, tier, i }) => {
              const d = Math.hypot(to.x - from.x, to.y - from.y), ux = (to.x - from.x) / d, uy = (to.y - from.y) / d;
              const sx = from.x + ux * 22, sy = from.y + uy * 22, ex = to.x - ux * 20, ey = to.y - uy * 20;
              const bend = i % 2 ? 10 : -10, mx = (sx + ex) / 2 - uy * bend, my = (sy + ey) / 2 + ux * bend;
              return <path key={from.id + to.id} d={`M${sx} ${sy} Q${mx} ${my} ${ex} ${ey}`} fill="none" stroke={TIERS[tier].color} strokeWidth={2.5} markerEnd={`url(#ar${tier})`} />;
            })}
            {NETWORK.map((n) => {
              const isSel = selected === n.id;
              const referred = !!parentOf[n.id];
              const r = n.kind === "referral" ? 17 : referred ? 20 : 21;
              const showName = (n.referrals?.length ?? 0) >= 3;
              return (
                <g key={n.id} className="cursor-pointer" onClick={() => toggle(n.id)}>
                  <title>{n.id}</title>
                  {isSel && <circle cx={n.x} cy={n.y} r={r + 4} fill="none" stroke={C.purple} strokeWidth={3} />}
                  {n.kind === "referral" || referred ? (
                    <PersonNode x={n.x} y={n.y} r={r} />
                  ) : (
                    <>
                      <circle cx={n.x} cy={n.y} r={r} fill={n.avatar?.[0]} />
                      <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={14} fontWeight={500} fill={n.avatar?.[1]}>{initials(n.id)}</text>
                    </>
                  )}
                  {showName && (
                    <text x={n.x} y={referred ? n.y - 30 : n.y + 38} textAnchor="middle" fontSize={14} fontWeight={600} fill="#171423">{n.id.split(" ")[0]}</text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* popover */}
          {sel && (
            <div
              role="dialog"
              aria-label="Subscriber details"
              className="absolute z-10 flex w-[340px] flex-col gap-4 rounded-[20px] bg-white p-5 shadow-[0_12px_40px_rgba(23,20,35,.16),0_0_0_1px_#ECEAF2]"
              style={{
                left: `calc(${px}% ${openLeft ? "-" : "+"} 34px)`,
                top: `${Math.min(Math.max(py, 8), 92)}%`,
                transform: `translate(${openLeft ? "-100%" : "0"}, ${shiftY})`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold" style={{ background: sel.avatar?.[0] ?? "#EEECF4", color: sel.avatar?.[1] ?? "#4A4658" }}>
                  {initials(sel.id)}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{sel.id}</span>
                  <span className="truncate text-[13px] text-[#5A5870]">{sel.id.toLowerCase().replace(" ", ".")}@example.com</span>
                </div>
                <button type="button" aria-label="Close" onClick={() => setSelected(null)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F2F1F6] text-[#4A4658]">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {sel.kind === "advocate" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F3FA] px-2.5 py-1 text-[12px] font-semibold">
                    <span className="h-2 w-2 rounded-full" style={{ background: TIERS[tierOf(sel)].color }} />
                    {TIERS[tierOf(sel)].label}
                  </span>
                )}
                {sel.status && (
                  <>
                    <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: STATUS[sel.status].bg, color: STATUS[sel.status].fg }}>{STATUS[sel.status].label}</span>
                    <span className="rounded-full bg-[#EEECF4] px-2.5 py-1 text-[12px] font-semibold text-[#4A4658]">{sel.source}</span>
                  </>
                )}
                <a href="#" className="ml-auto inline-flex items-center gap-1 text-[13px] font-semibold no-underline" style={{ color: C.purple }}>
                  View profile<ArrowRight size={14} />
                </a>
              </div>

              {sel.kind === "advocate" && (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: sel.visitors ?? 0, l: "Visitors", bg: "#DCEBFB", fg: "#1F4F8C" },
                      { v: count("pending"), l: "Pending", bg: "#FFF9E0", fg: "#B07B00" },
                      { v: count("unconfirmed"), l: "Unconf.", bg: "#FFEEED", fg: "#D9443F" },
                      { v: count("confirmed"), l: "Confirmed", bg: "#EAF5F3", fg: "#2F7F6B" },
                    ].map((t) => (
                      <div key={t.l} className="flex flex-col gap-0.5 rounded-xl p-2.5" style={{ background: t.bg, color: t.fg }}>
                        <span className="text-[18px] font-bold">{t.v}</span>
                        <span className="text-[11px]">{t.l}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col">
                    <div className="border-b-2 border-[#CDBEF5] pb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#4A3690]">Their referrals</div>
                    {kids.slice(0, 4).map((k) => (
                      <div key={k.id} className="flex items-center justify-between gap-2 border-b border-[#F0EEF5] py-2 text-[13px]">
                        <button type="button" onClick={() => setSelected(k.id)} className="text-left text-[#171423]">{k.id}</button>
                        {k.status && (
                          <span className="rounded-full px-2 py-0.5 text-[12px] font-semibold" style={{ background: STATUS[k.status].bg, color: STATUS[k.status].fg }}>{STATUS[k.status].label}</span>
                        )}
                      </div>
                    ))}
                    {kids.length === 0 && (
                      <span className="pt-2.5 text-[13px] text-[#5A5870]">
                        No referrals yet. Their link has brought in {sel.visitors} visitor{sel.visitors === 1 ? "" : "s"}.
                      </span>
                    )}
                    {kids.length > 4 && <span className="pt-2.5 text-[12px] text-[#5A5870]">+{kids.length - 4} more</span>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* zoom */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {[{ t: <Plus size={16} />, a: "Zoom in", f: () => setZoom((z) => Math.min(2, z + 0.25)) }, { t: <Minus size={16} />, a: "Zoom out", f: () => setZoom((z) => Math.max(1, z - 0.25)) }].map((b) => (
            <button key={b.a} type="button" aria-label={b.a} onClick={b.f} className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[inset_0_0_0_1px_#CDCCD9]" style={{ color: C.purple }}>
              {b.t}
            </button>
          ))}
        </div>
      </div>

      {/* legend + link */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-[#5A5870]">
          {(Object.keys(TIERS) as unknown as Tier[]).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: TIERS[t].color }} />
              {TIERS[t].label}
            </span>
          ))}
        </div>
        <LinkArrow>Open full network</LinkArrow>
      </div>
    </Card>
  );
}

/* ───────────────────────────── Page ───────────────────────────── */
export default function OverviewPage({ programState = "established" }: { programState?: ProgramState }) {
  // In production: programState = programROI >= 1.5 ? "established" : "building"
  const [range, setRange] = useState<Range>("90D");
  return (
    <div className="flex min-h-screen bg-[#F2F1F6] font-[Manrope] text-[#171423]">
      <style>{`.rh-scroll{scrollbar-width:thin;scrollbar-color:#CDCCD9 transparent}.rh-scroll::-webkit-scrollbar{width:8px}.rh-scroll::-webkit-scrollbar-thumb{background:#CDCCD9;border-radius:8px}`}</style>
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-5 px-10 pb-12 pt-5">
        <TopBar />
        <Header range={range} setRange={setRange} />
        <div className="grid grid-cols-12 gap-5">
          <ResultsBlock state={programState} range={range} />
          <NeedsAttention />
        </div>
        <GrowthTips state={programState} />
        <Funnel state={programState} />
        <div className="grid grid-cols-12 gap-5">
          <TopAdvocates state={programState} />
          <Insights state={programState} />
        </div>
        <RevenuePayouts state={programState} />
        <AdvocateNetwork />
      </main>
    </div>
  );
}

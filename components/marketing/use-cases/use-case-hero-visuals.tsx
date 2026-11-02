import type { ReactNode } from 'react';
import {
  AudioLines,
  CalendarDays,
  Check,
  CheckCircle2,
  Clapperboard,
  FileCheck2,
  Film,
  HeartPulse,
  Layers3,
  LockKeyhole,
  Mic2,
  Play,
  Scissors,
  ShieldCheck,
  Sparkles,
  Subtitles,
  Users,
} from 'lucide-react';

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate mx-auto w-full max-w-[720px] px-1 py-5 sm:px-2 sm:py-6">
      <div
        aria-hidden="true"
        className="absolute inset-10 -z-10 rounded-full bg-cyan-400/10 blur-3xl"
      />
      {children}
    </div>
  );
}

function AppWindow({
  title,
  status,
  children,
  className = '',
}: {
  title: string;
  status: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative z-10 ml-auto w-[96%] overflow-hidden rounded-2xl border border-white/10 bg-[#0d1421]/95 shadow-[0_32px_80px_-28px_rgba(0,0,0,0.8)] sm:rounded-[1.35rem] ${className}`}
    >
      <div className="flex h-10 items-center justify-between gap-3 border-b border-white/10 bg-[#121b2a] px-3 sm:h-12 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex shrink-0 gap-1"><i className="h-2 w-2 rounded-full bg-rose-400"/><i className="h-2 w-2 rounded-full bg-amber-300"/><i className="h-2 w-2 rounded-full bg-emerald-400"/></span>
          <span className="truncate text-[9px] font-semibold text-white/75 sm:text-[10px]">{title}</span>
        </div>
        <span className="shrink-0 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[7px] font-semibold text-cyan-200 sm:text-[8px]">{status}</span>
      </div>
      {children}
    </div>
  );
}

function FloatingPanel({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={`use-case-panel-float absolute z-20 rounded-xl border border-white/15 bg-[#151e2d]/95 p-2.5 text-white shadow-[0_22px_52px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:border-cyan-300/30 sm:rounded-2xl sm:p-3 ${className}`}
    >
      <p className="truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Sidebar({ items, active }: { items: string[]; active: string }) {
  return (
    <aside className="hidden w-[92px] shrink-0 border-r border-white/[0.07] bg-black/15 p-2.5 sm:block">
      {items.map((item) => (
        <div key={item} className={`mb-1.5 rounded-lg px-2 py-2 text-[8px] ${item === active ? 'bg-violet-500/20 font-semibold text-violet-100' : 'text-slate-500'}`}>
          {item}
        </div>
      ))}
    </aside>
  );
}

function Timeline({ labels, colors = ['#38bdf8', '#8b5cf6', '#ec4899'] }: { labels: string[]; colors?: string[] }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-black/20 p-2.5 sm:p-3">
      <div className="mb-2 flex justify-between text-[7px] text-slate-500 sm:text-[8px]"><span>00:00</span><span>00:15</span><span>00:30</span><span>00:45</span></div>
      <div className="space-y-1.5">
        {labels.map((label, index) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-8 shrink-0 truncate text-[7px] text-slate-500 sm:w-10 sm:text-[8px]">{label}</span>
            <div className="flex h-3 min-w-0 flex-1 gap-1 overflow-hidden rounded-sm bg-white/[0.04] sm:h-3.5">
              {[0, 1, 2, 3].map((part) => (
                <span key={part} className="h-full rounded-sm opacity-90" style={{ width: part === 1 ? '29%' : part === 2 ? '20%' : '18%', background: colors[(index + part) % colors.length] }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalBars({ color = '#22d3ee' }: { color?: string }) {
  return (
    <div className="flex h-7 items-end gap-[3px] sm:h-9">
      {Array.from({ length: 26 }, (_, index) => (
        <span key={index} className="flex-1 rounded-t-sm opacity-90" style={{ height: `${22 + ((index * 37 + 13) % 70)}%`, backgroundColor: color }} />
      ))}
    </div>
  );
}

export function YouTubersHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Creator Studio · Video 24" status="Review ready">
        <div className="flex min-w-0">
          <Sidebar items={['Overview', 'Videos', 'Analytics', 'Thumbnails']} active="Analytics" />
          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-2.5 sm:gap-3">
              <div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-indigo-800 via-slate-800 to-cyan-950 p-2.5 sm:p-3">
                <span className="absolute left-2.5 top-2.5 rounded bg-black/40 px-2 py-1 text-[7px] text-white/70">FLAGSHIP · 12:48</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-indigo-700"><Play className="h-3 w-3 fill-current"/></span>
                <span className="ml-2 text-[8px] font-semibold text-white sm:text-[9px]">The opening that keeps viewers</span>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-2.5 sm:p-3">
                <div className="flex items-center justify-between"><span className="text-[8px] text-slate-400">Audience retention</span><span className="text-[8px] font-semibold text-emerald-300">+18%</span></div>
                <svg viewBox="0 0 140 48" className="mt-2 w-full"><path d="M2 40 C15 34 18 20 31 24 S48 33 62 21 S82 14 93 20 S112 24 138 7" fill="none" stroke="#22d3ee" strokeWidth="2.5"/><path d="M2 40 C15 34 18 20 31 24 S48 33 62 21 S82 14 93 20 S112 24 138 7V48H2Z" fill="#22d3ee" fillOpacity=".1"/></svg>
                <p className="mt-1 text-[7px] text-slate-500">First 30 seconds · strong hook</p>
              </div>
            </div>
            <div className="mt-3"><Timeline labels={['Video', 'Music', 'Captions']} /></div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Thumbnail A/B" className="right-0 top-[13%] w-[43%] sm:w-[37%]">
        <div className="grid grid-cols-2 gap-1.5"><div className="aspect-video rounded-md bg-gradient-to-br from-amber-500 to-rose-700 p-1"><span className="rounded bg-black/40 px-1 text-[7px]">A</span></div><div className="aspect-video rounded-md border border-cyan-300/50 bg-gradient-to-br from-cyan-600 to-indigo-800 p-1"><span className="rounded bg-black/40 px-1 text-[7px]">B · 58%</span></div></div>
        <p className="mt-1.5 text-[7px] text-slate-400">Test title and first frame</p>
      </FloatingPanel>
      <FloatingPanel title="Publishing queue" className="bottom-0 left-0 w-[40%] sm:w-[34%]">
        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0 text-cyan-300"/><div><p className="text-[8px] font-semibold text-white">Friday · 4:30 PM</p><p className="text-[7px] text-slate-400">Package approved</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function BusinessesHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Brand workspace · Launch film" status="On brand">
        <div className="flex min-w-0">
          <Sidebar items={['Launch kit', 'Product film', 'Demos', 'Social cuts']} active="Product film" />
          <div className="grid min-w-0 flex-1 gap-3 p-3 sm:grid-cols-[1.15fr_0.85fr] sm:p-4">
            <div>
              <div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 via-indigo-950 to-slate-950 p-3"><span className="rounded-md bg-black/40 px-2 py-1 text-[8px] text-white/80">PRODUCT STORY · CUT 03</span><span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-cyan-300 text-slate-950"><Play className="h-3 w-3 fill-current"/></span></div>
              <div className="mt-3"><Timeline labels={['Film', 'Demo', 'Social']} colors={['#38bdf8', '#8b5cf6', '#f59e0b']}/></div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
              <div className="flex items-center justify-between"><span className="text-[8px] font-semibold text-white/80">Launch checklist</span><span className="text-[7px] text-emerald-300">3 / 4</span></div>
              {['Brief confirmed', 'Brand pass', 'Stakeholder review', 'Exports packaged'].map((item,index)=><div key={item} className="mt-2 flex items-center gap-2 rounded-lg bg-black/15 px-2 py-1.5"><span className={`grid h-4 w-4 place-items-center rounded-full ${index<3?'bg-emerald-400/15 text-emerald-300':'bg-white/5 text-slate-500'}`}><Check className="h-2.5 w-2.5"/></span><span className="truncate text-[7px] text-slate-300">{item}</span></div>)}
              <div className="mt-3 flex -space-x-2"><span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#151e2d] bg-orange-400 text-[7px] font-bold text-slate-950">AM</span><span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#151e2d] bg-sky-400 text-[7px] font-bold text-slate-950">JR</span><span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#151e2d] bg-violet-400 text-[7px] font-bold text-slate-950">KL</span><span className="ml-3 self-center text-[7px] text-slate-400">3 reviewers</span></div>
            </div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Brand kit · approved" className="right-0 top-[16%] w-[38%] sm:w-[34%]">
        <div className="flex gap-1.5">{['#39d4ee','#6c5ce7','#f59e0b','#eff6ff'].map(c=><span key={c} className="h-4 w-4 rounded-full border border-white/15" style={{backgroundColor:c}} />)}</div><p className="mt-1.5 text-[7px] text-slate-400">Type, color, lower thirds</p>
      </FloatingPanel>
      <FloatingPanel title="Version handoff" className="bottom-0 left-0 w-[39%] sm:w-[33%]">
        <div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 shrink-0 text-violet-300"/><div><p className="text-[8px] font-semibold text-white">Launch pack v3</p><p className="text-[7px] text-slate-400">Film · demo · social</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function PodcastersHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Episode editor · The Good Work" status="Mix approved">
        <div className="flex min-w-0">
          <Sidebar items={['Episodes', 'Audio', 'Video clips', 'Delivery']} active="Episodes" />
          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-orange-950 via-slate-800 to-violet-950 p-3"><span className="rounded bg-black/35 px-2 py-1 text-[8px] text-white/80">EP 42 · THE CREATIVE ROUTINE</span><span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-orange-300 text-slate-950"><Play className="h-3 w-3 fill-current"/></span></div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3"><div className="flex items-center gap-2"><Mic2 className="h-4 w-4 text-orange-300"/><span className="text-[8px] font-semibold text-white/80">Voice & mix</span></div><div className="mt-3 space-y-2">{[['Dialogue',82],['Music bed',46],['Noise cleanup',91]].map(([label,width])=><div key={String(label)}><div className="flex justify-between text-[7px] text-slate-400"><span>{label}</span><span>{width}%</span></div><div className="mt-1 h-1.5 rounded-full bg-white/10"><span className="block h-full rounded-full bg-orange-300" style={{width:`${width}%`}}/></div></div>)}</div></div>
            </div>
            <div className="mt-3 rounded-xl border border-white/[0.08] bg-black/20 p-2.5"><div className="mb-2 flex items-center justify-between text-[7px] text-slate-400"><span>Multitrack audio · 42:18</span><span>Noise removed</span></div><SignalBars color="#fb923c"/><div className="mt-2 grid grid-cols-2 gap-1.5"><span className="rounded bg-orange-300/15 px-2 py-1 text-[7px] text-orange-100">HOST · CLEAN</span><span className="rounded bg-violet-300/15 px-2 py-1 text-[7px] text-violet-100">GUEST · MATCHED</span></div></div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Clip exports" className="right-0 top-[14%] w-[38%] sm:w-[34%]">
        <div className="space-y-1.5">{['01 · opening thought','02 · best quote'].map(x=><div key={x} className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1"><Scissors className="h-3 w-3 text-orange-300"/><span className="truncate text-[7px] text-slate-300">{x}</span></div>)}</div>
      </FloatingPanel>
      <FloatingPanel title="Show identity" className="bottom-0 left-0 w-[38%] sm:w-[32%]">
        <div className="flex items-center gap-2"><AudioLines className="h-4 w-4 text-cyan-300"/><div><p className="text-[8px] font-semibold text-white">Sonic signature</p><p className="text-[7px] text-slate-400">Intro · outro · loudness</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function RealtorsHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Listing studio · 742 Willow Lane" status="Listing ready">
        <div className="flex min-w-0">
          <Sidebar items={['Properties', 'Room order', 'Branding', 'Exports']} active="Room order" />
          <div className="grid min-w-0 flex-1 gap-3 p-3 sm:grid-cols-[1.1fr_0.9fr] sm:p-4">
            <div>
              <div className="relative flex aspect-video items-end overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-amber-200/70 via-orange-300/40 to-emerald-900/80 p-3"><div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/80 to-transparent"/><div className="relative flex w-full items-end justify-between"><div><p className="text-[8px] font-semibold text-white">742 Willow Lane</p><p className="mt-0.5 text-[7px] text-white/70">Bright rooms · thoughtful flow</p></div><span className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-orange-700"><Play className="h-3 w-3 fill-current"/></span></div></div>
              <div className="mt-3"><Timeline labels={['Exterior','Living','Kitchen','Primary']} colors={['#f59e0b','#34d399','#38bdf8']}/></div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3"><div className="flex items-center justify-between"><span className="text-[8px] font-semibold text-white/80">Property facts</span><span className="text-[7px] text-emerald-300">Verified</span></div><div className="mt-3 grid grid-cols-2 gap-2">{[['4','Beds'],['3','Baths'],['2,480','Sq ft'],['2','Garage']].map(([value,label])=><div key={label} className="rounded-lg bg-black/20 p-2"><p className="text-[10px] font-semibold text-white">{value}</p><p className="text-[7px] text-slate-400">{label}</p></div>)}</div><div className="mt-3 rounded-lg border border-white/[0.07] p-2"><p className="text-[7px] text-slate-400">Room sequence</p><p className="mt-1 text-[8px] font-medium text-white/80">Porch → living → kitchen</p></div></div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Listing package" className="right-0 top-[15%] w-[39%] sm:w-[34%]">
        <div className="flex items-center gap-2"><Clapperboard className="h-4 w-4 text-amber-300"/><div><p className="text-[8px] font-semibold text-white">Tour + agent intro</p><p className="text-[7px] text-slate-400">Wide · vertical · square</p></div></div>
      </FloatingPanel>
      <FloatingPanel title="Open house · Sat 1–4" className="bottom-0 left-0 w-[40%] sm:w-[34%]">
        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-emerald-300"/><div><p className="text-[8px] font-semibold text-white">Social cut scheduled</p><p className="text-[7px] text-slate-400">Publish with the listing</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function CourseCreatorsHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Course workspace · Build with clarity" status="Module 04">
        <div className="flex min-w-0">
          <aside className="hidden w-[150px] shrink-0 border-r border-white/[0.07] bg-black/15 p-3 sm:block"><p className="text-[7px] font-semibold uppercase tracking-wider text-slate-500">Curriculum</p>{['01 · Start here','02 · The framework','03 · Make it useful','04 · Next steps'].map((item,i)=><div key={item} className={`mt-2 rounded-lg p-2 text-[7px] ${i===3?'border border-violet-300/30 bg-violet-400/10 text-violet-100':'text-slate-400'}`}>{item}</div>)}</aside>
          <div className="grid min-w-0 flex-1 gap-3 p-3 sm:grid-cols-[1.1fr_0.9fr] sm:p-4">
            <div><div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-violet-700 via-indigo-950 to-slate-950 p-3"><span className="rounded bg-black/40 px-2 py-1 text-[8px] text-white/80">LESSON 04 · THE CLEAR NEXT STEP</span><span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-violet-300 text-slate-950"><Play className="h-3 w-3 fill-current"/></span></div><div className="mt-3"><Timeline labels={['Lesson','Chapter cards','Captions']} colors={['#a78bfa','#38bdf8','#ec4899']}/></div></div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3"><div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-violet-300"/><span className="text-[8px] font-semibold text-white/80">Chapter map</span></div>{['Set the goal','Show the method','Try it together','Recap & continue'].map((item,i)=><div key={item} className="mt-2 flex items-center gap-2 rounded-md bg-black/20 p-2"><span className="text-[7px] text-violet-300">0{i+1}</span><span className="min-w-0 flex-1 truncate text-[7px] text-slate-300">{item}</span><span className="h-1 w-7 rounded-full bg-violet-400/70"/></div>)}</div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Lesson packaging" className="right-0 top-[14%] w-[39%] sm:w-[34%]">
        <div className="space-y-1.5">{['Consistent module intro','Readable lesson captions'].map(x=><div key={x} className="flex items-center gap-1.5 text-[7px] text-slate-300"><CheckCircle2 className="h-3 w-3 text-violet-300"/>{x}</div>)}</div>
      </FloatingPanel>
      <FloatingPanel title="Learner-ready exports" className="bottom-0 left-0 w-[40%] sm:w-[34%]">
        <div className="flex items-center gap-2"><Subtitles className="h-4 w-4 text-cyan-300"/><div><p className="text-[8px] font-semibold text-white">Captions synced</p><p className="text-[7px] text-slate-400">Lesson · recap · promo</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function DoctorsHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Patient education · Explainer 08" status="Clinical review">
        <div className="flex min-w-0">
          <Sidebar items={['Explainers', 'Care topics', 'Captions', 'Approvals']} active="Care topics" />
          <div className="grid min-w-0 flex-1 gap-3 p-3 sm:grid-cols-[1.1fr_0.9fr] sm:p-4">
            <div><div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-teal-700 via-slate-800 to-blue-950 p-3"><span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cyan-300/15 text-cyan-200"><HeartPulse className="h-5 w-5"/></span><span className="rounded bg-black/35 px-2 py-1 text-[8px] text-white/80">A CALM GUIDE TO YOUR VISIT</span><span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-cyan-200 text-slate-950"><Play className="h-3 w-3 fill-current"/></span></div><div className="mt-3"><Timeline labels={['Narration','Illustrations','Captions']} colors={['#22d3ee','#34d399','#818cf8']}/></div></div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3"><p className="text-[8px] font-semibold text-white/80">Clarity checks</p>{[['Plain language',true],['Captions readable',true],['Pace feels calm',true],['Clinical review',false]].map(([label,done])=><div key={String(label)} className="mt-2 flex items-center gap-2 rounded-lg bg-black/20 p-2"><span className={`grid h-4 w-4 place-items-center rounded-full ${done?'bg-emerald-400/15 text-emerald-300':'bg-amber-300/15 text-amber-200'}`}>{done?<Check className="h-2.5 w-2.5"/>:<span className="h-1 w-1 rounded-full bg-amber-200"/>}</span><span className="text-[7px] text-slate-300">{label}</span></div>)}</div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Patient-friendly captions" className="right-0 top-[14%] w-[40%] sm:w-[35%]">
        <div className="rounded-lg bg-black/20 p-2"><p className="text-[7px] leading-3 text-slate-300">Short sentences. Clear terms. Comfortable reading time.</p><div className="mt-1.5 h-1 rounded-full bg-cyan-300/70"/><div className="mt-1 h-1 w-3/4 rounded-full bg-white/20"/></div>
      </FloatingPanel>
      <FloatingPanel title="Care team sign-off" className="bottom-0 left-0 w-[38%] sm:w-[32%]">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300"/><div><p className="text-[8px] font-semibold text-white">Approved for clarity</p><p className="text-[7px] text-slate-400">Clinical review pending</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

export function LawyersHeroVisual() {
  return (
    <Stage>
      <AppWindow title="Firm media room · Explainer cut" status="Private review">
        <div className="flex min-w-0">
          <Sidebar items={['Matter videos', 'Firm updates', 'Testimonials', 'Access']} active="Firm updates" />
          <div className="grid min-w-0 flex-1 gap-3 p-3 sm:grid-cols-[1.05fr_0.95fr] sm:p-4">
            <div><div className="relative flex aspect-video items-end rounded-xl border border-white/10 bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 p-3"><span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-black/35 px-2 py-1 text-[7px] text-white/65"><LockKeyhole className="h-3 w-3"/>CLIENT STORY</span><span className="max-w-[75%] rounded bg-black/45 px-2 py-1 text-[8px] font-medium text-white/85">A clear explanation, reviewed by the firm</span><span className="ml-auto grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-300 text-slate-950"><Play className="h-3 w-3 fill-current"/></span></div><div className="mt-3"><Timeline labels={['Story','Disclosure','Captions']} colors={['#818cf8','#38bdf8','#a78bfa']}/></div></div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-3"><div className="flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-indigo-300"/><span className="text-[8px] font-semibold text-white/80">Review record</span></div>{['Script approved','Disclosure included','Partner sign-off'].map((item,i)=><div key={item} className="mt-2 flex items-center justify-between rounded-lg bg-black/20 px-2 py-2"><span className="text-[7px] text-slate-300">{item}</span><span className={`rounded-full px-1.5 py-0.5 text-[7px] ${i<2?'bg-emerald-300/10 text-emerald-200':'bg-indigo-300/10 text-indigo-200'}`}>{i<2?'Done':'Review'}</span></div>)}<div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.08] p-2"><Users className="h-3.5 w-3.5 text-indigo-200"/><span className="text-[7px] text-slate-400">Owner · editor · reviewer</span></div></div>
          </div>
        </div>
      </AppWindow>
      <FloatingPanel title="Firm identity" className="right-0 top-[14%] w-[38%] sm:w-[33%]">
        <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-400/15 text-indigo-200"><Sparkles className="h-3.5 w-3.5"/></span><div><p className="text-[8px] font-semibold text-white">Approved style</p><p className="text-[7px] text-slate-400">Titles · color · lower thirds</p></div></div>
      </FloatingPanel>
      <FloatingPanel title="Access controls" className="bottom-0 left-0 w-[39%] sm:w-[33%]">
        <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-cyan-300"/><div><p className="text-[8px] font-semibold text-white">Restricted workspace</p><p className="text-[7px] text-slate-400">Invited reviewers only</p></div></div>
      </FloatingPanel>
    </Stage>
  );
}

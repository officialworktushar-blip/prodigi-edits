import type { ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  CalendarDays,
  Check,
  Clapperboard,
  FileCheck2,
  HeartPulse,
  Play,
  ShieldCheck,
} from 'lucide-react';
import YouTubersMockup from '@/components/public/UseCases_Youtubers.png';
import PodcasterMockup from '@/components/public/UseCases_Podcaster.png';
import CourseCreatorMockup from '@/components/public/UseCases_CourseCreator.png';
import LawyersMockup from '@/components/public/UseCases_Lawyers.png';

function UploadedMockup({
  image,
  alt,
}: {
  image: StaticImageData;
  alt: string;
}) {
  return (
    <div className="relative mx-auto w-full min-[1440px]:-mr-12 min-[1440px]:w-[calc(100%+3rem)]">
      <Image
        src={image}
        alt={alt}
        priority
        sizes="(max-width: 767px) 100vw, (max-width: 1439px) 52vw, 56vw"
        className="block h-auto w-full object-contain"
      />
    </div>
  );
}

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

export function YouTubersHeroVisual() {
  return <UploadedMockup image={YouTubersMockup} alt="YouTubers creator studio with channel growth analytics, publishing calendar, content pipeline, and export settings." />;
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
  return <UploadedMockup image={PodcasterMockup} alt="Podcast editing mockup with episode artwork, audio timeline, microphone, and publishing controls." />;
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
  return <UploadedMockup image={CourseCreatorMockup} alt="Course creator mockup showing a course workspace, curriculum slides, lesson design controls, and theme settings." />;
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
  return <UploadedMockup image={LawyersMockup} alt="Law firm video production mockup with private workspace, explainer video, brand controls, and export options." />;
}

import type { ReactNode } from 'react';

function Window({
  children,
  label,
  className = '',
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-2xl border border-white/15 bg-[#111827] shadow-[0_30px_80px_-28px_rgba(15,23,42,0.8)] ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-[10px] font-medium text-white/60">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Glow({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate mx-auto w-full max-w-[610px] px-1 py-4 sm:px-3">
      <div aria-hidden="true" className="absolute inset-8 -z-10 rounded-full bg-gradient-to-br from-sky-400/30 via-violet-400/30 to-pink-400/30 blur-3xl" />
      {children}
    </div>
  );
}

export function AboutTeamMockup() {
  return (
    <Glow>
      <Window label="ProdigiEdits · Team workspace">
        <div className="grid grid-cols-[1fr_0.82fr] gap-3 p-4 sm:p-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between text-[10px] text-white/50"><span>Active project</span><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-emerald-300">On track</span></div>
            <div className="mt-4 aspect-video rounded-lg bg-gradient-to-br from-sky-500 via-indigo-600 to-violet-800 p-3"><div className="flex h-full items-end"><span className="rounded bg-black/25 px-2 py-1 text-[9px] text-white">Brand film · cut 03</span></div></div>
            <div className="mt-4 space-y-2"><p className="text-[10px] font-semibold text-white/80">The handoff</p>{['Brief confirmed','First cut reviewed','Final export ready'].map((item, i) => <div key={item} className="flex items-center gap-2 text-[9px] text-white/50"><span className={`grid h-4 w-4 place-items-center rounded-full ${i < 2 ? 'bg-sky-400/20 text-sky-200' : 'border border-white/20'}`}>{i < 2 ? '✓' : ''}</span>{item}</div>)}</div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-slate-800/80 p-3"><p className="text-[9px] uppercase tracking-wider text-white/40">Your editing crew</p><div className="mt-4 flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-800 bg-sky-400 text-[9px] font-bold text-slate-900">AM</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-800 bg-violet-400 text-[9px] font-bold text-slate-900">JR</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-800 bg-pink-300 text-[9px] font-bold text-slate-900">KL</span></div><p className="mt-3 text-[10px] font-medium text-white/80">Editor · Motion · Sound</p><p className="mt-1 text-[9px] text-white/40">One team, one clear point of contact</p></div>
            <div className="rounded-xl border border-sky-300/20 bg-sky-300/10 p-3"><p className="text-[9px] text-sky-100/60">Latest note</p><p className="mt-1 text-[10px] leading-4 text-white/80">“The story lands. Exporting the approved version now.”</p></div>
          </div>
        </div>
      </Window>
      <div className="absolute -bottom-1 right-1 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl sm:right-0"><p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Team rhythm</p><p className="mt-1 text-xs font-semibold text-slate-800">Brief → Edit → Approve</p></div>
    </Glow>
  );
}

export function CaseStudiesHeroMockup() {
  return (
    <Glow>
      <Window label="Selected project stories">
        <div className="grid gap-3 p-4 sm:grid-cols-[1.25fr_0.75fr] sm:p-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="aspect-[1.65] rounded-lg bg-gradient-to-br from-cyan-500 via-blue-700 to-indigo-900 p-3"><div className="flex h-full items-end justify-between"><span className="rounded bg-slate-950/40 px-2 py-1 text-[9px] text-white">Launch film · 02:14</span><span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs text-indigo-700">▶</span></div></div>
            <p className="mt-3 text-[10px] font-semibold text-white/80">From brief to publish-ready</p>
            <div className="mt-2 flex gap-1.5">{['Brief','Review','Delivery'].map((step, i) => <span key={step} className={`rounded-full px-2 py-1 text-[8px] ${i === 2 ? 'bg-emerald-400/15 text-emerald-200' : 'bg-white/10 text-white/45'}`}>{step}</span>)}</div>
          </div>
          <div className="space-y-2">{[['01','Clear scope'],['02','Focused notes'],['03','Final package']].map(([n, title]) => <div key={n} className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-800/70 p-3"><span className="text-[10px] font-semibold text-sky-300">{n}</span><span className="text-[9px] text-white/70">{title}</span></div>)}<div className="rounded-lg bg-indigo-400/10 p-3"><p className="text-[9px] text-indigo-200">Project snapshot</p><div className="mt-2 h-1.5 rounded-full bg-white/10"><span className="block h-full w-4/5 rounded-full bg-gradient-to-r from-sky-400 to-violet-400" /></div></div></div>
        </div>
      </Window>
      <div className="absolute -left-1 top-10 rounded-xl border border-white/80 bg-white/95 px-3 py-2 shadow-xl sm:-left-3"><p className="text-[9px] text-slate-400">Production notes</p><p className="mt-0.5 text-[10px] font-semibold text-slate-800">Real work. Clear process.</p></div>
    </Glow>
  );
}

export function ContactInboxMockup() {
  return (
    <Glow>
      <div className="relative mx-auto max-w-[560px] rounded-[1.4rem] border border-slate-200/80 bg-white p-4 shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)] sm:p-5" aria-hidden="true">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3"><div><p className="text-[10px] font-semibold text-slate-800">Project questions</p><p className="mt-0.5 text-[9px] text-slate-400">Support inbox · 1 conversation</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">Replying today</span></div>
        <div className="mt-4 flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-[10px] font-bold text-white">P</span><div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2.5"><p className="text-[9px] font-semibold text-slate-700">Your ProdigiEdits team</p><p className="mt-1 max-w-[270px] text-[10px] leading-4 text-slate-600">Tell us what you publish, how often, and when the next video needs to land.</p></div></div>
        <div className="ml-auto mt-3 max-w-[75%] rounded-2xl rounded-tr-sm bg-indigo-600 px-3 py-2.5 text-[10px] leading-4 text-white">We have a launch video due next week and a few social versions.</div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"><span className="h-2 w-2 rounded-full bg-sky-500"/><span className="text-[9px] text-slate-400">A specialist will reply with a clear next step</span><span className="ml-auto rounded-lg bg-indigo-600 px-2.5 py-1 text-[9px] font-semibold text-white">Send</span></div>
        <div className="absolute -bottom-4 -right-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg sm:-right-4"><p className="text-[9px] text-slate-400">Typical response</p><p className="text-xs font-semibold text-slate-800">Within one business day</p></div>
      </div>
    </Glow>
  );
}

export function ExamplesReelMockup() {
  const cards = [
    { title: 'Long-form story', ratio: 'aspect-video', color: 'from-sky-500 to-indigo-800', label: '16:9' },
    { title: 'Vertical cut', ratio: 'aspect-[9/13]', color: 'from-fuchsia-500 to-violet-800', label: '9:16' },
    { title: 'Product launch', ratio: 'aspect-video', color: 'from-amber-400 to-rose-700', label: 'Campaign' },
  ];
  return (
    <Glow>
      <div aria-hidden="true" className="relative rounded-2xl border border-white/15 bg-[#111827] p-4 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.8)] sm:p-5">
        <div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-semibold text-white/85">Format gallery</p><p className="mt-1 text-[9px] text-white/40">A preview of the edit, not just the frame</p></div><span className="rounded-full bg-violet-400/15 px-2 py-1 text-[9px] text-violet-200">3 formats</span></div>
        <div className="grid grid-cols-[1fr_0.62fr_1fr] items-end gap-2 sm:gap-3">{cards.map((card, i) => <div key={card.title} className={`rounded-xl border border-white/10 bg-white/[0.04] p-2 ${i === 1 ? 'mb-5' : ''}`}><div className={`${card.ratio} overflow-hidden rounded-lg bg-gradient-to-br ${card.color} p-2`}><div className="flex h-full flex-col justify-between"><span className="w-fit rounded bg-black/25 px-1.5 py-1 text-[8px] text-white">{card.label}</span><div><span className="grid h-6 w-6 place-items-center rounded-full bg-white/85 text-[9px] text-slate-800">▶</span>{i === 1 ? <span className="mt-2 block rounded bg-slate-950/70 px-1 py-1 text-center text-[7px] font-semibold text-white">CAPTIONS ON</span> : null}</div></div></div><p className="mt-2 truncate text-[8px] font-medium text-white/70 sm:text-[9px]">{card.title}</p></div>)}</div>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 p-2"><span className="text-[8px] uppercase tracking-wider text-white/35">Sequence</span><span className="h-2 flex-1 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400"/><span className="text-[8px] text-white/45">00:48</span></div>
      </div>
    </Glow>
  );
}

export function PlatformWorkspaceMockup() {
  return (
    <Glow>
      <Window label="Order #PE-2048 · Workspace">
        <div className="grid gap-3 p-4 sm:grid-cols-[0.72fr_1.28fr] sm:p-5">
          <div className="space-y-2"><div className="rounded-lg bg-indigo-400/15 p-3"><p className="text-[8px] uppercase tracking-wider text-indigo-200/70">Current status</p><p className="mt-1 text-xs font-semibold text-white">In review</p><div className="mt-3 h-1 rounded-full bg-white/10"><span className="block h-full w-4/5 rounded-full bg-indigo-300" /></div></div>{['Brief & files','Review notes','Final delivery'].map((x,i)=><div key={x} className="flex items-center gap-2 rounded-lg border border-white/10 p-2.5"><span className={`h-2 w-2 rounded-full ${i<2?'bg-emerald-400':'bg-white/20'}`}/><span className="text-[9px] text-white/60">{x}</span></div>)}</div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center justify-between"><p className="text-[9px] font-semibold text-white/75">Draft 02 · Review room</p><span className="text-[8px] text-sky-300">00:42</span></div><div className="mt-3 aspect-video rounded-lg bg-gradient-to-br from-slate-700 via-blue-900 to-indigo-950 p-3"><div className="flex h-full items-end"><span className="rounded bg-black/35 px-2 py-1 text-[8px] text-white">Comment at 00:42</span></div></div><div className="mt-3 rounded-lg bg-white/[0.06] p-2.5"><p className="text-[8px] text-white/40">Editor · 2 min ago</p><p className="mt-1 text-[9px] text-white/75">Updated the opening and tightened the first transition.</p></div></div>
        </div>
      </Window>
      <div className="absolute -right-1 top-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl sm:-right-4"><p className="text-[9px] text-slate-400">File shelf</p><p className="mt-0.5 text-[10px] font-semibold text-slate-800">Master · captions · social</p></div>
    </Glow>
  );
}

export function PricingPlanMockup() {
  const plans = [
    { name: 'Short-form', price: '$', items: ['Vertical edits', 'Captions', 'Platform exports'], color: 'border-white/10' },
    { name: 'Long-form', price: '$$', items: ['Story edit', 'Timecoded review', 'Clean master'], color: 'border-sky-300/60 bg-sky-300/[0.08]' },
    { name: 'Channel', price: '$$$', items: ['Weekly plan', 'Packaging', 'Publish rhythm'], color: 'border-white/10' },
  ];
  return (
    <Glow>
      <div aria-hidden="true" className="relative rounded-2xl border border-white/15 bg-[#111827] p-4 shadow-[0_30px_80px_-28px_rgba(15,23,42,0.8)] sm:p-5">
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold text-white/85">Choose your publishing rhythm</p><p className="mt-1 text-[9px] text-white/40">Clear scope, visible deliverables</p></div><span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[8px] text-emerald-200">No hidden fees</span></div>
        <div className="mt-4 grid grid-cols-3 gap-2">{plans.map((plan) => <div key={plan.name} className={`rounded-xl border p-3 ${plan.color}`}><p className="text-[9px] font-semibold text-white/80">{plan.name}</p><p className="mt-2 text-base font-semibold text-white sm:text-lg">{plan.price}</p><div className="my-3 h-px bg-white/10"/><div className="space-y-2">{plan.items.map(item=><div key={item} className="flex items-start gap-1.5 text-[8px] leading-3 text-white/55"><span className="text-sky-300">✓</span>{item}</div>)}</div><div className="mt-3 h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"/></div>)}</div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/[0.05] px-3 py-2"><span className="text-[8px] text-white/50">Add-ons and volume rates shown up front</span><span className="text-[8px] font-semibold text-sky-200">Compare packages ↗</span></div>
      </div>
    </Glow>
  );
}

export function CaseStudyHeroMockup({ title }: { title: string }) {
  return (
    <Glow>
      <Window label="Project story · delivered">
        <div className="p-4 sm:p-5"><div className="aspect-[1.7] rounded-xl bg-gradient-to-br from-violet-600 via-indigo-800 to-slate-950 p-4"><div className="flex h-full flex-col justify-between"><span className="w-fit rounded-full bg-white/15 px-2 py-1 text-[8px] text-white/80">PROJECT CUT · FINAL</span><div><p className="max-w-[19rem] text-sm font-semibold leading-5 text-white sm:text-base">{title}</p><div className="mt-2 flex gap-1"><span className="h-1 w-12 rounded-full bg-sky-300"/><span className="h-1 w-8 rounded-full bg-violet-300"/><span className="h-1 w-5 rounded-full bg-pink-300"/></div></div></div></div><div className="mt-3 grid grid-cols-3 gap-2">{[['01','Brief'],['02','Review'],['03','Delivered']].map(([n,l])=><div key={n} className="rounded-lg border border-white/10 bg-white/[0.04] p-2"><span className="text-[8px] text-sky-300">{n}</span><p className="mt-1 text-[9px] text-white/60">{l}</p></div>)}</div></div>
      </Window>
      <div className="absolute -bottom-1 right-0 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-xl"><p className="text-[9px] text-slate-400">A complete handoff</p><p className="text-[10px] font-semibold text-slate-800">Approved · Ready to publish</p></div>
    </Glow>
  );
}

export function PrivacyHeroMockup() {
  return (
    <Glow>
      <div aria-hidden="true" className="relative mx-auto max-w-[520px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-lg text-indigo-600">◈</span><div><p className="text-xs font-semibold text-slate-800">Workspace access</p><p className="mt-1 text-[9px] text-slate-400">Your files stay with your project</p></div><span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">Protected</span></div>
        <div className="mt-4 space-y-3">{[['Project owner','Full workspace access','bg-indigo-500'],['Assigned editor','Project files only','bg-sky-500'],['Shared link','Disabled by default','bg-violet-500']].map(([role,desc,color])=><div key={role} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><span className={`h-2.5 w-2.5 rounded-full ${color}`}/><div className="min-w-0 flex-1"><p className="text-[10px] font-semibold text-slate-700">{role}</p><p className="mt-0.5 text-[9px] text-slate-400">{desc}</p></div><span className="text-[9px] text-slate-400">•••</span></div>)}</div>
        <div className="mt-4 rounded-xl bg-slate-50 p-3"><div className="flex justify-between text-[9px] text-slate-500"><span>Delivery ownership</span><span className="font-semibold text-indigo-600">You own final files</span></div><div className="mt-2 h-1.5 rounded-full bg-slate-200"><span className="block h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"/></div></div>
      </div>
    </Glow>
  );
}

export function TermsHeroMockup() {
  const steps = ['Submit brief', 'Editor assigned', 'Review & revise', 'Approve', 'Delivered'];
  return (
    <Glow>
      <div aria-hidden="true" className="relative mx-auto max-w-[560px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_28px_70px_-24px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-800">Order lifecycle</p><p className="mt-1 text-[9px] text-slate-400">A clear path from request to final files</p></div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[8px] font-semibold text-blue-700">Service terms</span></div>
        <div className="relative mt-6 grid grid-cols-5 gap-1">{steps.map((step,index)=><div key={step} className="relative flex flex-col items-center text-center"><span className={`z-10 grid h-7 w-7 place-items-center rounded-full text-[9px] font-semibold ${index<3?'bg-indigo-600 text-white':'border border-slate-200 bg-white text-slate-400'}`}>{index<3?'✓':index+1}</span>{index<4?<span className="absolute left-1/2 top-3.5 h-0.5 w-full bg-slate-200"/>:null}<span className="mt-2 text-[8px] leading-3 text-slate-500 sm:text-[9px]">{step}</span></div>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Review window</p><p className="mt-1 text-[10px] font-semibold text-slate-700">Two focused revision rounds</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-3"><p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Final delivery</p><p className="mt-1 text-[10px] font-semibold text-slate-700">Approved files belong to you</p></div></div>
      </div>
    </Glow>
  );
}

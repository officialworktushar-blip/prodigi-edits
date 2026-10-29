interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft flex flex-col items-start gap-1">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  );
}

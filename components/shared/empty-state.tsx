export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-primary-muted flex items-center justify-center rounded-full p-4 mb-4">
        <span className="text-primary-500">{icon}</span>
      </div>
      <h3 className="font-serif-display text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} className="mt-6 inline-block bg-primary-gradient text-white font-semibold rounded-full px-5 py-2 hover:opacity-90 transition-opacity">
          {actionLabel}
        </a>
      )}
    </div>
  );
}
import { FadeIn } from '../../shared/fade-in';

const teams = [
  'Northstar Media',
  'Clipline',
  'Orbit Studio',
  'Fieldnote',
  'Brightwave',
];

export function TrustedBy() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-10 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Trusted by teams who publish every week
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {teams.map((team) => (
              <span
                key={team}
                className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                {team}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

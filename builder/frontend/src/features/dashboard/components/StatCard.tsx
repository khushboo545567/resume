interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <div className="group relative min-w-0 overflow-hidden rounded-2xl border border-border-popup bg-popup p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold/10 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative min-w-0">
        <h2 className="text-2xl font-bold tracking-tight text-display sm:text-4xl">
          {value}
        </h2>
        <p className="mt-1 truncate text-xs font-semibold uppercase tracking-wider text-nav-text sm:text-sm">
          {title}
        </p>
        {subtitle && (
          <p className="mt-2 inline-block max-w-full truncate rounded-full bg-btn-hover-bg px-2.5 py-0.5 text-xs text-subheading">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

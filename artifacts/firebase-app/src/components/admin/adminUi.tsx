import React from 'react';
import { AlertCircle } from 'lucide-react';

export const pageShellClassName =
  'rounded-[28px] border border-slate-800 bg-slate-950/90 shadow-[0_24px_80px_rgba(15,23,42,0.4)]';

export const AdminPageHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 border-b border-slate-800/80 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
    <div className="space-y-2">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300/70">{eyebrow}</p> : null}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">{description}</p>
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

export const AdminPanel: React.FC<{ title?: string; subtitle?: string; children: React.ReactNode; className?: string }> = ({
  title,
  subtitle,
  children,
  className = '',
}) => (
  <section className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_14px_50px_rgba(15,23,42,0.28)] sm:p-5 ${className}`.trim()}>
    {title ? (
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
      </div>
    ) : null}
    {children}
  </section>
);

export const AdminStatCard: React.FC<{
  label: string;
  value: string;
  meta?: string;
  accent?: 'orange' | 'blue' | 'emerald' | 'violet' | 'amber' | 'rose';
}> = ({ label, value, meta, accent = 'orange' }) => {
  const accents: Record<string, string> = {
    orange: 'from-orange-500/20 via-orange-500/10 to-transparent text-orange-100 ring-orange-400/20',
    blue: 'from-sky-500/20 via-sky-500/10 to-transparent text-sky-100 ring-sky-400/20',
    emerald: 'from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-100 ring-emerald-400/20',
    violet: 'from-violet-500/20 via-violet-500/10 to-transparent text-violet-100 ring-violet-400/20',
    amber: 'from-amber-500/20 via-amber-500/10 to-transparent text-amber-100 ring-amber-400/20',
    rose: 'from-rose-500/20 via-rose-500/10 to-transparent text-rose-100 ring-rose-400/20',
  };

  return (
    <div className={`rounded-3xl border border-slate-800 bg-gradient-to-br p-4 ring-1 shadow-[0_18px_48px_rgba(15,23,42,0.28)] ${accents[accent]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{label}</p>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
      {meta ? <p className="mt-2 text-sm text-slate-300">{meta}</p> : null}
    </div>
  );
};

export const AdminFilters: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:flex-row sm:flex-wrap sm:items-center">
    {children}
  </div>
);

export const AdminInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 ${props.className ?? ''}`.trim()}
  />
));

AdminInput.displayName = 'AdminInput';

export const AdminSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>((props, ref) => (
  <select
    ref={ref}
    {...props}
    className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 ${props.className ?? ''}`.trim()}
  />
));

AdminSelect.displayName = 'AdminSelect';

export const AdminTableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="hidden overflow-x-auto lg:block">{children}</div>
);

export const AdminTableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-slate-900/95 text-left text-xs uppercase tracking-[0.22em] text-slate-400">{children}</thead>
);

export const AdminEmptyState: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 px-4 py-14 text-center">
    <AlertCircle className="h-8 w-8 text-slate-500" />
    <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
  </div>
);

export const LoadingPulse: React.FC<{ label?: string }> = ({ label = 'Loading live data...' }) => (
  <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-4 text-sm text-slate-300">
    <span className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
    <span>{label}</span>
  </div>
);

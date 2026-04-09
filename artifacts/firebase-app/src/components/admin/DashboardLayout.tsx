import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Bell,
  BriefcaseBusiness,
  CarFront,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PackageSearch,
  Search,
  Truck,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { usePlatformContent } from '../../platformContent';

const sidebarLinks = [
  { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: PackageSearch },
  { to: '/admin/rides', label: 'Rides', icon: CarFront },
  { to: '/admin/vendors', label: 'Vendors', icon: BriefcaseBusiness },
  { to: '/admin/service-bookings', label: 'Service Bookings', icon: ClipboardList },
  { to: '/admin/delivery-partners', label: 'Delivery Partners', icon: Truck },
  { to: '/admin/drivers', label: 'Drivers', icon: Users },
];

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { content } = usePlatformContent();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-slate-900 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-200 ring-1 ring-orange-400/20">
            {content.branding.logoUrl ? (
              <img src={content.branding.logoUrl} alt={content.branding.appName} className="h-8 w-8 rounded-xl object-cover" />
            ) : (
              <LayoutDashboard className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Operations Admin</p>
            <p className="text-sm text-orange-200/80">{content.branding.appName}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Track live demand, monitor supply-side health, and keep every customer-facing workflow moving.
        </p>
      </div>

      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-orange-500 text-white shadow-[0_16px_36px_rgba(249,115,22,0.35)]'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                ].join(' ')
              }
              end={link.to === '/admin/overview'}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Mobile-ready console</p>
        <p className="mt-2 leading-6 text-slate-400">
          Each section is being rendered for large screens and phone-size monitoring so the ops team can move between desk and field without losing visibility.
        </p>
      </div>
    </div>
  );
};

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentSection = useMemo(
    () => sidebarLinks.find((link) => location.pathname.startsWith(link.to))?.label ?? 'Admin',
    [location.pathname],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-r border-slate-800 bg-slate-950/95 px-6 py-6 lg:block">
          <SidebarContent />
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-300/70">Admin dashboard</p>
                    <h1 className="text-lg font-semibold text-white sm:text-xl">{currentSection}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-400" />
                  </button>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-white">Operations Admin</p>
                      <p className="text-xs text-slate-400">Realtime control room</p>
                    </div>
                    <UserCircle2 className="h-8 w-8 text-orange-300" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  placeholder="Search dashboard context, IDs, customers, or vendors..."
                  type="text"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="flex-1 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="h-full w-[88vw] max-w-sm border-l border-slate-800 bg-slate-950 px-5 py-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300/70">Navigation</p>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </aside>
        </div>
      ) : null}
    </div>
  );
};

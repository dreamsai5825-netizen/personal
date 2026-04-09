import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, formatDateTime, matchesSearch, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const partnerStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

interface DeliveryPartnerRecord {
  id: string;
  partnerId: string;
  name: string;
  phone: string;
  status: string;
  zone: string;
  createdAt: unknown;
}

export const DeliveryPartnerManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const { items: partners, loading, error } = useRealtimeCollection<DeliveryPartnerRecord>('deliveryPartners', (raw, id) => ({
    id,
    partnerId: stringValue(raw.partnerId, id),
    name: stringValue(raw.name, raw.fullName, raw.partnerName, 'Partner'),
    phone: stringValue(raw.phone, raw.phoneNumber, 'No phone'),
    status: stringValue(raw.status, 'pending'),
    zone: stringValue(raw.zone, raw.city, raw.location, 'Unassigned zone'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const filteredPartners = useMemo(
    () =>
      partners
        .filter((partner) => matchesSearch(deferredSearch, partner.partnerId, partner.name, partner.phone, partner.zone, partner.id))
        .filter((partner) => (status ? partner.status === status : true))
        .filter((partner) => dateMatchesFilter(partner.createdAt, date)),
    [date, deferredSearch, partners, status],
  );

  const stats = useMemo(
    () => ({
      total: partners.length,
      active: partners.filter((partner) => partner.status === 'active').length,
      inactive: partners.filter((partner) => partner.status === 'inactive').length,
      pending: partners.filter((partner) => partner.status === 'pending').length,
    }),
    [partners],
  );

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Logistics Desk"
        title="Delivery Partner Management"
        description="Track the live delivery fleet with clean partner cards for mobile screens and an updated desktop queue for operational review."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live delivery partners..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total Partners" value={stats.total.toString()} meta="All delivery profiles in Firestore" accent="orange" />
          <AdminStatCard label="Active" value={stats.active.toString()} meta="Currently available for assignments" accent="emerald" />
          <AdminStatCard label="Inactive" value={stats.inactive.toString()} meta="Temporarily unavailable" accent="rose" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Awaiting onboarding or approval" accent="amber" />
        </div>

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by partner ID, name, zone..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {partnerStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState
            title="Delivery partners could not be loaded"
            description="The realtime delivery partner listener failed. Check Firestore collection access for deliveryPartners."
          />
        ) : filteredPartners.length === 0 && !loading ? (
          <AdminEmptyState
            title="No delivery partners match the filters"
            description="Clear the filters or widen the date range to see more partner profiles."
          />
        ) : (
          <AdminPanel title="Live Delivery Partner Roster" subtitle="Touch-friendly for phones and detailed enough for desktop review">
            <div className="space-y-3 lg:hidden">
              {filteredPartners.map((partner) => (
                <button
                  key={partner.id}
                  type="button"
                  onClick={() => navigate(`/admin/delivery-partners/${partner.id}`)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-orange-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{partner.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{partner.partnerId}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(partner.status)}`}>{partner.status}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Phone</p>
                      <p className="mt-1 text-white">{partner.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Zone</p>
                      <p className="mt-1 text-white">{partner.zone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                      <p className="mt-1 text-white">{formatDateTime(partner.createdAt)}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                    View partner
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Partner</th>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Zone</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{partner.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{partner.partnerId}</td>
                      <td className="px-4 py-4 text-sm text-slate-200">{partner.phone}</td>
                      <td className="px-4 py-4 text-sm text-slate-200">{partner.zone}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(partner.status)}`}>{partner.status}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(partner.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button
                          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-400"
                          onClick={() => navigate(`/admin/delivery-partners/${partner.id}`)}
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AdminTableWrapper>
          </AdminPanel>
        )}
      </div>
    </div>
  );
};

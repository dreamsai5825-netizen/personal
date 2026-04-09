import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, formatDateTime, matchesSearch, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const vendorStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

interface GroceryVendorRecord {
  id: string;
  vendorId: string;
  name: string;
  ownerName: string;
  vendorType: string;
  status: string;
  createdAt: unknown;
}

export const GroceryVendors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const { items: vendors, loading, error } = useRealtimeCollection<GroceryVendorRecord>('vendors', (raw, id) => ({
    id,
    vendorId: stringValue(raw.vendorId, id),
    name: stringValue(raw.businessName, raw.storeName, raw.name, 'Vendor'),
    ownerName: stringValue(raw.ownerName, raw.contactName, 'Owner'),
    vendorType: stringValue(raw.vendorType, raw.type, raw.category, ''),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const filteredVendors = useMemo(
    () =>
      vendors
        .filter((vendor) => vendor.vendorType.toLowerCase().includes('grocery') || vendor.vendorId.toLowerCase().startsWith('grocery'))
        .filter((vendor) => matchesSearch(deferredSearch, vendor.vendorId, vendor.name, vendor.ownerName, vendor.id))
        .filter((vendor) => (status ? vendor.status === status : true))
        .filter((vendor) => dateMatchesFilter(vendor.createdAt, date)),
    [date, deferredSearch, status, vendors],
  );

  const stats = useMemo(
    () => ({
      total: filteredVendors.length,
      active: filteredVendors.filter((vendor) => vendor.status === 'active').length,
      pending: filteredVendors.filter((vendor) => vendor.status === 'pending').length,
    }),
    [filteredVendors],
  );

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Vendor Detail View"
        title="Grocery Vendors"
        description="A realtime list of grocery-side vendors with a cleaner review flow on both desktop and mobile screens."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to grocery vendors..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <AdminStatCard label="Grocery Vendors" value={stats.total.toString()} meta="All matched grocery vendor records" accent="blue" />
          <AdminStatCard label="Active" value={stats.active.toString()} meta="Currently live on the platform" accent="emerald" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Awaiting approval or activation" accent="amber" />
        </div>

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by vendor ID, name, owner..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {vendorStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState title="Grocery vendors could not be loaded" description="The realtime vendor listener failed for the vendors collection." />
        ) : filteredVendors.length === 0 && !loading ? (
          <AdminEmptyState title="No grocery vendors match the filters" description="Try clearing the search or reviewing the vendor typing data in Firestore." />
        ) : (
          <AdminPanel title="Grocery Vendor Queue" subtitle="Responsive list of live grocery-side vendor documents">
            <div className="space-y-3 lg:hidden">
              {filteredVendors.map((vendor) => (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => navigate(`/admin/vendors/${vendor.id}`)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-sky-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{vendor.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{vendor.vendorId}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(vendor.status)}`}>{vendor.status}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Owner</p>
                      <p className="mt-1 text-white">{vendor.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                      <p className="mt-1 text-white">{formatDateTime(vendor.createdAt)}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                    View vendor
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Vendor</th>
                    <th className="px-4 py-4">Vendor ID</th>
                    <th className="px-4 py-4">Owner</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{vendor.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{vendor.vendorId}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{vendor.ownerName}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(vendor.status)}`}>{vendor.status}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(vendor.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400" onClick={() => navigate(`/admin/vendors/${vendor.id}`)}>
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

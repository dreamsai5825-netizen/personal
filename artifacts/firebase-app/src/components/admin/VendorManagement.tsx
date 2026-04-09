import React, { useMemo } from 'react';
import { ArrowRight, ShoppingCart, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminPageHeader, AdminPanel, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { formatDateTime, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

interface VendorRecord {
  id: string;
  name: string;
  ownerName: string;
  vendorType: string;
  status: string;
  createdAt: unknown;
}

export const VendorManagement: React.FC = () => {
  const navigate = useNavigate();
  const { items: vendors, loading, error } = useRealtimeCollection<VendorRecord>('vendors', (raw, id) => ({
    id,
    name: stringValue(raw.businessName, raw.storeName, raw.name, 'Vendor'),
    ownerName: stringValue(raw.ownerName, raw.contactName, raw.name, 'Owner'),
    vendorType: stringValue(raw.vendorType, raw.type, raw.category, 'general'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const stats = useMemo(
    () => ({
      total: vendors.length,
      active: vendors.filter((vendor) => vendor.status === 'active').length,
      pending: vendors.filter((vendor) => vendor.status === 'pending').length,
      food: vendors.filter((vendor) => vendor.vendorType.toLowerCase().includes('food')).length,
      grocery: vendors.filter((vendor) => vendor.vendorType.toLowerCase().includes('grocery')).length,
    }),
    [vendors],
  );

  const recentVendors = useMemo(() => vendors.slice().reverse().slice(0, 8), [vendors]);

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Supply Desk"
        title="Vendor Management"
        description="A live supply-side view of the vendor network, with instant counts, richer categorization, and phone-friendly vendor review cards."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live vendors..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Total Vendors" value={stats.total.toString()} meta="All vendor records synced to Firestore" accent="violet" />
          <AdminStatCard label="Active" value={stats.active.toString()} meta="Currently available on platform" accent="emerald" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Awaiting activation or review" accent="amber" />
          <AdminStatCard label="Food" value={stats.food.toString()} meta="Food-side vendors in the network" accent="orange" />
          <AdminStatCard label="Grocery" value={stats.grocery.toString()} meta="Grocery-side vendors in the network" accent="blue" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AdminPanel title="Vendor Category Shortcuts" subtitle="Jump directly into the deeper food and grocery vendor management views">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                className="group rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-slate-950 p-5 text-left transition hover:border-orange-400/50"
                onClick={() => navigate('/admin/vendors/food')}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-200 ring-1 ring-orange-400/20">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xl font-semibold text-white">Food Vendors</p>
                <p className="mt-2 text-sm text-slate-300">Open the detailed food vendor screen with current approvals and operational visibility.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                  Open food vendors
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </button>

              <button
                type="button"
                className="group rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-500/15 via-sky-500/5 to-slate-950 p-5 text-left transition hover:border-sky-400/50"
                onClick={() => navigate('/admin/vendors/grocery')}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/20">
                  <Store className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xl font-semibold text-white">Grocery Vendors</p>
                <p className="mt-2 text-sm text-slate-300">Jump into the grocery vendor roster and review live vendor status from the category-specific screen.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                  Open grocery vendors
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          </AdminPanel>

          <AdminPanel title="Recent Vendor Activity" subtitle="Latest vendor documents now visible without a manual refresh">
            {error ? (
              <AdminEmptyState
                title="Vendors could not be loaded"
                description="The realtime vendor listener failed. Check Firestore collection access for vendors."
              />
            ) : recentVendors.length === 0 && !loading ? (
              <AdminEmptyState
                title="No vendors have been synced yet"
                description="As vendor profiles are added to Firestore they will appear here automatically."
              />
            ) : (
              <>
                <div className="space-y-3 lg:hidden">
                  {recentVendors.map((vendor) => (
                    <div key={vendor.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{vendor.name}</p>
                          <p className="mt-1 text-sm text-slate-400">{vendor.ownerName}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(vendor.status)}`}>{vendor.status}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Type</p>
                          <p className="mt-1 capitalize text-white">{vendor.vendorType}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                          <p className="mt-1 text-white">{formatDateTime(vendor.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <AdminTableWrapper>
                  <table className="min-w-full overflow-hidden rounded-3xl">
                    <AdminTableHead>
                      <tr>
                        <th className="px-4 py-4">Vendor</th>
                        <th className="px-4 py-4">Owner</th>
                        <th className="px-4 py-4">Type</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4">Created</th>
                      </tr>
                    </AdminTableHead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                      {recentVendors.map((vendor) => (
                        <tr key={vendor.id} className="transition hover:bg-slate-900/80">
                          <td className="px-4 py-4 font-semibold text-white">{vendor.name}</td>
                          <td className="px-4 py-4 text-sm text-slate-300">{vendor.ownerName}</td>
                          <td className="px-4 py-4 text-sm capitalize text-slate-200">{vendor.vendorType}</td>
                          <td className="px-4 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(vendor.status)}`}>{vendor.status}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(vendor.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AdminTableWrapper>
              </>
            )}
          </AdminPanel>
        </div>
      </div>
    </div>
  );
};

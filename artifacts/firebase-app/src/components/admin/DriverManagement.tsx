import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, formatDateTime, matchesSearch, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const driverStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

interface DriverRecord {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  createdAt: unknown;
}

export const DriverManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const { items: drivers, loading, error } = useRealtimeCollection<DriverRecord>('drivers', (raw, id) => ({
    id,
    driverId: stringValue(raw.driverId, id),
    name: stringValue(raw.name, raw.fullName, raw.driverName, 'Driver'),
    phone: stringValue(raw.phone, raw.phoneNumber, 'No phone'),
    vehicleType: stringValue(raw.vehicleType, raw.vehicle, raw.type, 'vehicle'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const filteredDrivers = useMemo(
    () =>
      drivers
        .filter((driver) => matchesSearch(deferredSearch, driver.driverId, driver.name, driver.phone, driver.vehicleType, driver.id))
        .filter((driver) => (status ? driver.status === status : true))
        .filter((driver) => dateMatchesFilter(driver.createdAt, date)),
    [date, deferredSearch, drivers, status],
  );

  const stats = useMemo(
    () => ({
      total: drivers.length,
      active: drivers.filter((driver) => driver.status === 'active').length,
      inactive: drivers.filter((driver) => driver.status === 'inactive').length,
      pending: drivers.filter((driver) => driver.status === 'pending').length,
    }),
    [drivers],
  );

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Driver Desk"
        title="Driver Management"
        description="Monitor driver availability, onboarding, and vehicle coverage with realtime Firestore updates and layouts that stay usable on phones."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live drivers..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total Drivers" value={stats.total.toString()} meta="All driver profiles in Firestore" accent="blue" />
          <AdminStatCard label="Active" value={stats.active.toString()} meta="Currently eligible for ride assignments" accent="emerald" />
          <AdminStatCard label="Inactive" value={stats.inactive.toString()} meta="Not available right now" accent="rose" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Awaiting onboarding or review" accent="amber" />
        </div>

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by driver ID, name, phone, vehicle..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {driverStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState
            title="Drivers could not be loaded"
            description="The realtime driver listener failed. Check Firestore access for the drivers collection."
          />
        ) : filteredDrivers.length === 0 && !loading ? (
          <AdminEmptyState
            title="No drivers match the filters"
            description="Try broadening the filters or clearing the search field to see more driver records."
          />
        ) : (
          <AdminPanel title="Live Driver Roster" subtitle="A cleaner queue for admin review across desktop and phone view">
            <div className="space-y-3 lg:hidden">
              {filteredDrivers.map((driver) => (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => navigate(`/admin/drivers/${driver.id}`)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-sky-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{driver.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{driver.driverId}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(driver.status)}`}>{driver.status}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Phone</p>
                      <p className="mt-1 text-white">{driver.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Vehicle</p>
                      <p className="mt-1 capitalize text-white">{driver.vehicleType}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                      <p className="mt-1 text-white">{formatDateTime(driver.createdAt)}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                    View driver
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Driver</th>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Phone</th>
                    <th className="px-4 py-4">Vehicle</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{driver.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{driver.driverId}</td>
                      <td className="px-4 py-4 text-sm text-slate-200">{driver.phone}</td>
                      <td className="px-4 py-4 text-sm capitalize text-slate-200">{driver.vehicleType}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(driver.status)}`}>{driver.status}</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(driver.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                          onClick={() => navigate(`/admin/drivers/${driver.id}`)}
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

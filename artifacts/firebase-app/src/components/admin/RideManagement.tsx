import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, formatCurrency, formatDateTime, matchesSearch, numberValue, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const rideStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'driver_arriving', label: 'Driver Arriving' },
  { value: 'on_trip', label: 'On Trip' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface AdminRideRecord {
  id: string;
  rideId: string;
  vehicleType: string;
  status: string;
  customerName: string;
  driverName: string;
  fare: number;
  createdAt: unknown;
}

export const RideManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const { items: rides, loading, error } = useRealtimeCollection<AdminRideRecord>('rides', (raw, id) => ({
    id,
    rideId: stringValue(raw.rideId, id),
    vehicleType: stringValue(raw.vehicleType, raw.type, 'ride'),
    status: stringValue(raw.status, 'requested'),
    customerName: stringValue(raw.customerName, raw.userName, raw.userId, 'Rider'),
    driverName: stringValue(raw.driverName, raw.driverId, 'Unassigned'),
    fare: numberValue(raw.fare, raw.amount, raw.totalFare),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const filteredRides = useMemo(
    () =>
      rides
        .filter((ride) => matchesSearch(deferredSearch, ride.rideId, ride.vehicleType, ride.customerName, ride.driverName, ride.id))
        .filter((ride) => (status ? ride.status === status : true))
        .filter((ride) => dateMatchesFilter(ride.createdAt, date)),
    [date, deferredSearch, rides, status],
  );

  const stats = useMemo(
    () => ({
      total: rides.length,
      requested: rides.filter((ride) => ride.status === 'requested').length,
      active: rides.filter((ride) => ['accepted', 'driver_arriving', 'on_trip'].includes(ride.status)).length,
      completed: rides.filter((ride) => ride.status === 'completed').length,
      cancelled: rides.filter((ride) => ride.status === 'cancelled').length,
    }),
    [rides],
  );

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Mobility Desk"
        title="Ride Management"
        description="Live ride operations with ride-state monitoring, responsive action cards, and a cleaner dispatch-friendly layout for desktop and phone."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live rides..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Total Rides" value={stats.total.toString()} meta="All ride requests currently in Firestore" accent="blue" />
          <AdminStatCard label="Requested" value={stats.requested.toString()} meta="Waiting for assignment or acceptance" accent="amber" />
          <AdminStatCard label="Active" value={stats.active.toString()} meta="Accepted, arriving, or on trip" accent="orange" />
          <AdminStatCard label="Completed" value={stats.completed.toString()} meta="Successfully finished rides" accent="emerald" />
          <AdminStatCard label="Cancelled" value={stats.cancelled.toString()} meta="Rides that did not complete" accent="rose" />
        </div>

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by ride ID, rider, driver, vehicle..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {rideStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState
            title="Rides could not be loaded"
            description="The realtime ride listener failed. Check Firestore connectivity and collection rules."
          />
        ) : filteredRides.length === 0 && !loading ? (
          <AdminEmptyState
            title="No rides match the current filters"
            description="Adjust your search, date, or status filter to see more ride activity."
          />
        ) : (
          <AdminPanel title="Live Ride Queue" subtitle="Optimized for both large-screen dispatching and quick mobile checks">
            <div className="space-y-3 lg:hidden">
              {filteredRides.map((ride) => (
                <button
                  key={ride.id}
                  type="button"
                  onClick={() => navigate(`/admin/rides/${ride.id}`)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-sky-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{ride.rideId}</p>
                      <p className="mt-1 text-sm text-slate-400">{ride.customerName} - {ride.driverName}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(ride.status)}`}>
                      {rideStatusOptions.find((option) => option.value === ride.status)?.label ?? ride.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Vehicle</p>
                      <p className="mt-1 capitalize text-white">{ride.vehicleType}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fare</p>
                      <p className="mt-1 text-white">{ride.fare ? formatCurrency(ride.fare) : 'Pending'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                      <p className="mt-1 text-white">{formatDateTime(ride.createdAt)}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-300">
                    View ride
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Ride</th>
                    <th className="px-4 py-4">Rider / Driver</th>
                    <th className="px-4 py-4">Vehicle</th>
                    <th className="px-4 py-4">Fare</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredRides.map((ride) => (
                    <tr key={ride.id} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{ride.rideId}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        <p>{ride.customerName}</p>
                        <p className="mt-1 text-slate-500">{ride.driverName}</p>
                      </td>
                      <td className="px-4 py-4 text-sm capitalize text-slate-200">{ride.vehicleType}</td>
                      <td className="px-4 py-4 text-sm text-slate-200">{ride.fare ? formatCurrency(ride.fare) : 'Pending'}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(ride.status)}`}>
                          {rideStatusOptions.find((option) => option.value === ride.status)?.label ?? ride.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(ride.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button
                          className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
                          onClick={() => navigate(`/admin/rides/${ride.id}`)}
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

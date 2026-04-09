import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, formatDateTime, matchesSearch, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const bookingStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface AdminServiceBooking {
  id: string;
  bookingId: string;
  serviceType: string;
  status: string;
  customerName: string;
  workerName: string;
  createdAt: unknown;
}

export const ServiceBookingMonitoring: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const { items: bookings, loading, error } = useRealtimeCollection<AdminServiceBooking>('serviceBookings', (raw, id) => ({
    id,
    bookingId: stringValue(raw.bookingId, id),
    serviceType: stringValue(raw.serviceType, raw.category, 'service'),
    status: stringValue(raw.status, 'pending'),
    customerName: stringValue(raw.customerName, raw.userName, raw.userId, 'Customer'),
    workerName: stringValue(raw.workerName, raw.providerName, raw.serviceWorkerName, 'Unassigned'),
    createdAt: raw.createdAt ?? raw.scheduledDate ?? raw.updatedAt ?? null,
  }));

  const filteredBookings = useMemo(
    () =>
      bookings
        .filter((booking) => matchesSearch(deferredSearch, booking.bookingId, booking.serviceType, booking.customerName, booking.workerName, booking.id))
        .filter((booking) => (status ? booking.status === status : true))
        .filter((booking) => dateMatchesFilter(booking.createdAt, date)),
    [bookings, date, deferredSearch, status],
  );

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === 'pending').length,
      assigned: bookings.filter((booking) => booking.status === 'assigned').length,
      progress: bookings.filter((booking) => booking.status === 'in_progress').length,
      completed: bookings.filter((booking) => booking.status === 'completed').length,
    }),
    [bookings],
  );

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Services Desk"
        title="Service Booking Management"
        description="Live service request monitoring with mobile-friendly cards for field review, plus cleaner booking filters and status tracking."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live service bookings..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Total Bookings" value={stats.total.toString()} meta="All service bookings in Firestore" accent="violet" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Waiting for review or confirmation" accent="amber" />
          <AdminStatCard label="Assigned" value={stats.assigned.toString()} meta="Matched to a service worker" accent="blue" />
          <AdminStatCard label="In Progress" value={stats.progress.toString()} meta="Currently underway" accent="orange" />
          <AdminStatCard label="Completed" value={stats.completed.toString()} meta="Finished service jobs" accent="emerald" />
        </div>

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by booking ID, service, customer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {bookingStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState
            title="Service bookings could not be loaded"
            description="The realtime booking subscription failed. Check Firestore access for the serviceBookings collection."
          />
        ) : filteredBookings.length === 0 && !loading ? (
          <AdminEmptyState
            title="No service bookings match the filters"
            description="Try clearing your search or selecting a broader status/date range."
          />
        ) : (
          <AdminPanel title="Live Service Queue" subtitle="One view for desktop operations and mobile follow-up">
            <div className="space-y-3 lg:hidden">
              {filteredBookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => navigate(`/admin/service-bookings/${booking.id}`)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-violet-400/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{booking.bookingId}</p>
                      <p className="mt-1 text-sm text-slate-400">{booking.customerName} - {booking.workerName}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(booking.status)}`}>
                      {bookingStatusOptions.find((option) => option.value === booking.status)?.label ?? booking.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Service</p>
                      <p className="mt-1 capitalize text-white">{booking.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                      <p className="mt-1 text-white">{formatDateTime(booking.createdAt)}</p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-300">
                    View booking
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Booking</th>
                    <th className="px-4 py-4">Customer / Worker</th>
                    <th className="px-4 py-4">Service</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="transition hover:bg-slate-900/80">
                      <td className="px-4 py-4 font-semibold text-white">{booking.bookingId}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">
                        <p>{booking.customerName}</p>
                        <p className="mt-1 text-slate-500">{booking.workerName}</p>
                      </td>
                      <td className="px-4 py-4 text-sm capitalize text-slate-200">{booking.serviceType}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(booking.status)}`}>
                          {bookingStatusOptions.find((option) => option.value === booking.status)?.label ?? booking.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(booking.createdAt)}</td>
                      <td className="px-4 py-4">
                        <button
                          className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-400"
                          onClick={() => navigate(`/admin/service-bookings/${booking.id}`)}
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

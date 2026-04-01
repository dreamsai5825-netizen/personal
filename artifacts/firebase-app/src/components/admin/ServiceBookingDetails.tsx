import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const bookingStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const ServiceBookingDetails: React.FC = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, 'serviceBookings', bookingId!));
      setBooking(snap.exists() ? snap.data() : null);
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  const handleAction = (action: string) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setEvent({ type: 'success', message: `${action} succeeded!` });
      } else {
        setEvent({ type: 'error', message: `${action} failed!` });
      }
      setTimeout(() => setEvent(null), 2000);
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Service Booking Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DetailCard label="Booking ID" value={booking.bookingId || bookingId} />
          <DetailCard label="User" value={booking.userId} />
          <DetailCard label="Service" value={booking.serviceType} />
          <DetailCard label="Provider" value={booking.providerId || 'N/A'} />
          <DetailCard label="Status" value={bookingStatusOptions.find(s => s.value === booking.status)?.label || booking.status} />
          <DetailCard label="Amount" value={`₹${booking.amount}`} />
          <DetailCard label="Booked At" value={booking.createdAt ? booking.createdAt.replace('T', ' ').slice(0, 16) : ''} />
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Assign Provider')}>Assign Provider</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Update Status')}>Update Status</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Cancel Booking')}>Cancel Booking</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Refund')}>Refund</button>
        </div>
      </div>
      {event && (
        <div className={`fixed inset-0 flex items-center justify-center z-50`}>
          <div className={`bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[300px] ${event.type === 'success' ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
            <div className={`text-4xl ${event.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{event.type === 'success' ? '✔️' : '❌'}</div>
            <div className="text-lg font-bold">{event.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCard: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow flex flex-col">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="font-semibold text-lg break-all">{value}</span>
  </div>
);

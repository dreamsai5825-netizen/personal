import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const rideStatusOptions = [
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'driver_arriving', label: 'Driver Arriving' },
  { value: 'on_trip', label: 'On Trip' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const RideDetails: React.FC = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchRide = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, 'rides', rideId!));
      setRide(snap.exists() ? snap.data() : null);
      setLoading(false);
    };
    fetchRide();
  }, [rideId]);

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
  if (!ride) return <div>Ride not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Ride Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DetailCard label="Ride ID" value={ride.rideId || rideId} />
          <DetailCard label="User" value={ride.userId} />
          <DetailCard label="Driver" value={ride.driverId || 'N/A'} />
          <DetailCard label="Vehicle Type" value={ride.vehicleType} />
          <DetailCard label="Pickup" value={ride.pickupLocation} />
          <DetailCard label="Drop" value={ride.dropLocation} />
          <DetailCard label="Amount" value={`₹${ride.amount}`} />
          <DetailCard label="Status" value={rideStatusOptions.find(s => s.value === ride.status)?.label || ride.status} />
          <DetailCard label="Requested At" value={ride.createdAt ? ride.createdAt.replace('T', ' ').slice(0, 16) : ''} />
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Assign Driver')}>Assign Driver</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Update Status')}>Update Status</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Cancel Ride')}>Cancel Ride</button>
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

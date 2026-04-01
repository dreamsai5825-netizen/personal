import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const bookingStatusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'confirmed', label: 'Confirmed' },
	{ value: 'assigned', label: 'Assigned' },
	{ value: 'in_progress', label: 'In Progress' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'cancelled', label: 'Cancelled' },
];

export const ServiceBookingMonitoring: React.FC = () => {
	const [bookings, setBookings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchBookings = async () => {
			setLoading(true);
			let q = collection(db, 'serviceBookings');
			let allBookings = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
			if (search) allBookings = allBookings.filter(b => (b.bookingId || b.id).toLowerCase().includes(search.toLowerCase()));
			if (status) allBookings = allBookings.filter(b => b.status === status);
			if (date) allBookings = allBookings.filter(b => b.createdAt && b.createdAt.startsWith(date));
			setBookings(allBookings);
			setLoading(false);
		};
		fetchBookings();
	}, [search, status, date]);

	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-2xl font-bold mb-6">Service Booking Management</h2>
			{/* Filter Card */}
			<div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
				<input
					className="border rounded px-3 py-2 w-48"
					placeholder="Search Booking Number"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
					{bookingStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
				</select>
				<input
					type="date"
					className="border rounded px-3 py-2"
					value={date}
					onChange={e => setDate(e.target.value)}
				/>
			</div>
			{/* Data Table */}
			{loading ? <div>Loading...</div> : (
				<div className="overflow-x-auto">
					<table className="min-w-full border rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-gray-100">
								<th className="border px-4 py-2">Booking ID</th>
								<th className="border px-4 py-2">Service</th>
								<th className="border px-4 py-2">Status</th>
								<th className="border px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{bookings.map(booking => (
								<tr key={booking.id} className="hover:bg-blue-50 cursor-pointer">
									<td className="border px-4 py-2">{booking.bookingId || booking.id}</td>
									<td className="border px-4 py-2 capitalize">{booking.serviceType}</td>
									<td className="border px-4 py-2 capitalize">{bookingStatusOptions.find(s => s.value === booking.status)?.label || booking.status}</td>
									<td className="border px-4 py-2 flex gap-2">
										<button className="bg-blue-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/service-bookings/${booking.id}`)}>View</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};
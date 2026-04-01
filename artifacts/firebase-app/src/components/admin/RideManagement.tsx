import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const rideStatusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'requested', label: 'Requested' },
	{ value: 'accepted', label: 'Accepted' },
	{ value: 'driver_arriving', label: 'Driver Arriving' },
	{ value: 'on_trip', label: 'On Trip' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'cancelled', label: 'Cancelled' },
];

export const RideManagement: React.FC = () => {
	const [rides, setRides] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRides = async () => {
			setLoading(true);
			let q = collection(db, 'rides');
			let allRides = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
			if (search) allRides = allRides.filter(r => (r.rideId || r.id).toLowerCase().includes(search.toLowerCase()));
			if (status) allRides = allRides.filter(r => r.status === status);
			if (date) allRides = allRides.filter(r => r.createdAt && r.createdAt.startsWith(date));
			setRides(allRides);
			setLoading(false);
		};
		fetchRides();
	}, [search, status, date]);

	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-2xl font-bold mb-6">Ride Management</h2>
			{/* Filter Card */}
			<div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
				<input
					className="border rounded px-3 py-2 w-48"
					placeholder="Search Ride Number"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
					{rideStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
								<th className="border px-4 py-2">Ride ID</th>
								<th className="border px-4 py-2">Type</th>
								<th className="border px-4 py-2">Status</th>
								<th className="border px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{rides.map(ride => (
								<tr key={ride.id} className="hover:bg-blue-50 cursor-pointer">
									<td className="border px-4 py-2">{ride.rideId || ride.id}</td>
									<td className="border px-4 py-2 capitalize">{ride.vehicleType}</td>
									<td className="border px-4 py-2 capitalize">{rideStatusOptions.find(s => s.value === ride.status)?.label || ride.status}</td>
									<td className="border px-4 py-2 flex gap-2">
										<button className="bg-blue-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/rides/${ride.id}`)}>View</button>
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
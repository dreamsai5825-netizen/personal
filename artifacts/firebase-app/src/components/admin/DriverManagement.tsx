import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const driverStatusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'pending', label: 'Pending' },
];

export const DriverManagement: React.FC = () => {
	const [drivers, setDrivers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchDrivers = async () => {
			setLoading(true);
			let q = collection(db, 'drivers');
			let allDrivers = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
			if (search) allDrivers = allDrivers.filter(d => (d.driverId || d.id).toLowerCase().includes(search.toLowerCase()));
			if (status) allDrivers = allDrivers.filter(d => d.status === status);
			if (date) allDrivers = allDrivers.filter(d => d.createdAt && d.createdAt.startsWith(date));
			setDrivers(allDrivers);
			setLoading(false);
		};
		fetchDrivers();
	}, [search, status, date]);

	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-2xl font-bold mb-6">Driver Management</h2>
			{/* Filter Card */}
			<div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
				<input
					className="border rounded px-3 py-2 w-48"
					placeholder="Search Driver ID"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
					{driverStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
								<th className="border px-4 py-2">Driver ID</th>
								<th className="border px-4 py-2">Name</th>
								<th className="border px-4 py-2">Status</th>
								<th className="border px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{drivers.map(driver => (
								<tr key={driver.id} className="hover:bg-blue-50 cursor-pointer">
									<td className="border px-4 py-2">{driver.driverId || driver.id}</td>
									<td className="border px-4 py-2 capitalize">{driver.name}</td>
									<td className="border px-4 py-2 capitalize">{driverStatusOptions.find(s => s.value === driver.status)?.label || driver.status}</td>
									<td className="border px-4 py-2 flex gap-2">
										<button className="bg-blue-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/drivers/${driver.id}`)}>View</button>
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
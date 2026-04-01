import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const partnerStatusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'pending', label: 'Pending' },
];

export const DeliveryPartnerManagement: React.FC = () => {
	const [partners, setPartners] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [status, setStatus] = useState('');
	const [date, setDate] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPartners = async () => {
			setLoading(true);
			let q = collection(db, 'deliveryPartners');
			let allPartners = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
			if (search) allPartners = allPartners.filter(p => (p.partnerId || p.id).toLowerCase().includes(search.toLowerCase()));
			if (status) allPartners = allPartners.filter(p => p.status === status);
			if (date) allPartners = allPartners.filter(p => p.createdAt && p.createdAt.startsWith(date));
			setPartners(allPartners);
			setLoading(false);
		};
		fetchPartners();
	}, [search, status, date]);

	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-2xl font-bold mb-6">Delivery Partner Management</h2>
			{/* Filter Card */}
			<div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
				<input
					className="border rounded px-3 py-2 w-48"
					placeholder="Search Partner ID"
					value={search}
					onChange={e => setSearch(e.target.value)}
				/>
				<select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
					{partnerStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
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
								<th className="border px-4 py-2">Partner ID</th>
								<th className="border px-4 py-2">Name</th>
								<th className="border px-4 py-2">Status</th>
								<th className="border px-4 py-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{partners.map(partner => (
								<tr key={partner.id} className="hover:bg-blue-50 cursor-pointer">
									<td className="border px-4 py-2">{partner.partnerId || partner.id}</td>
									<td className="border px-4 py-2 capitalize">{partner.name}</td>
									<td className="border px-4 py-2 capitalize">{partnerStatusOptions.find(s => s.value === partner.status)?.label || partner.status}</td>
									<td className="border px-4 py-2 flex gap-2">
										<button className="bg-blue-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/delivery-partners/${partner.id}`)}>View</button>
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
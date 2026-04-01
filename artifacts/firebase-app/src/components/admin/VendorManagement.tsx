import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const vendorStatusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'active', label: 'Active' },
	{ value: 'inactive', label: 'Inactive' },
	{ value: 'pending', label: 'Pending' },
];

export const VendorManagement: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="bg-white rounded-xl shadow p-6">
			<h2 className="text-2xl font-bold mb-6">Vendor Management</h2>
			<div className="flex gap-6 mb-8">
				<div
					className="flex-1 cursor-pointer rounded-xl p-6 shadow-md border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
					onClick={() => navigate('/admin/vendors/food')}
				>
					<div className="text-3xl font-bold text-orange-600 mb-2">Food Vendors</div>
					<div className="text-gray-500">See all food vendors</div>
				</div>
				<div
					className="flex-1 cursor-pointer rounded-xl p-6 shadow-md border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-all duration-200"
					onClick={() => navigate('/admin/vendors/grocery')}
				>
					<div className="text-3xl font-bold text-green-600 mb-2">Grocery Vendors</div>
					<div className="text-gray-500">See all grocery vendors</div>
				</div>
			</div>
		</div>
	);
};
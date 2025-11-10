import React from 'react';
import MenuCard from '../components/MenuCard';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTools, FaShoppingBag, FaStore, FaReceipt } from 'react-icons/fa';
import { MdOutlineBuild } from 'react-icons/md';

const cards = [
	{
		key: 'customer',
		title: 'Customer Entry',
		icon: <FaUser />,
		actions: [
			{ label: 'Add Record', path: '/customer/create' },
			{ label: 'Update Record', path: '/customer/update' },
		],
	},
	{
		key: 'warranty',
		title: 'Warranty Replacement / Repair',
		icon: <FaTools />,
		actions: [
			{ label: 'Create SRF', path: '/warranty/create_srf' },
			{ label: 'Create CNF Challan', path: '/warranty/create_cnf' },
			{ label: 'Print SRF', path: '/warranty/print_srf' },
			{ label: 'Print CNF Challan', path: '/warranty/print_cnf' },
			{ label: 'Update SRF', path: '/warranty/update_srf' },
		],
	},
	{
		key: 'out_of_warranty',
		title: 'Out of Warranty Repair',
		icon: <MdOutlineBuild />,
		actions: [
			{ label: 'Create SRF', path: '/oow/create_srf' },
			{ label: 'Print SRF', path: '/oow/print_srf' },
			{ label: 'Update SRF', path: '/oow/update_srf' },
			{ label: 'Settle SRF', path: '/oow/settle_srf' },
			{ label: 'Create Vendor Challan', path: '/oow/create_vendor_challan' },
			{ label: 'Print Vendor Challan', path: '/oow/print_vendor_challan' },
			{ label: 'Print Estimate', path: '/oow/print_estimate' },
			{ label: 'Settle Vendor', path: '/oow/settle_vendor' },
		],
	},
	{
		key: 'market',
		title: 'Direct Market Replacement',
		icon: <FaShoppingBag />,
		actions: [
			{ label: 'Add Record', path: '/market/create' },
			{ label: 'Update Record', path: '/market/update' },
		],
	},
	{
		key: 'retail',
		title: 'Retail Sales / Services',
		icon: <FaStore />,
		actions: [
			{ label: 'Add Record', path: '/retail/create' },
			{ label: 'Update Record', path: '/retail/update' },
			{ label: 'Settle Record', path: '/retail/settle' },
			{ label: 'Print Receipt', path: '/retail/print_receipt' },
		],
	},
	{
		key: 'challan',
		title: 'Road Challan',
		icon: <FaReceipt />,
		actions: [
			{ label: 'Create Challan', path: '/challan/create' },
			{ label: 'Print Challan', path: '/challan/print' },
		],
	},
];

const MenuDashboard = () => {
	const navigate = useNavigate();
	// const { metrics, loading, error } = useMetrics();

	return (
		// Using flex and max-height to prevent scrolling
		<div className="flex flex-col min-h-[calc(100vh-7rem)] pt-8 px-6 md:px-10 lg:px-20 bg-[#f0f4f8]">
			<div className="relative mb-6">
				<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm" 
					style={{fontFamily: 'Montserrat, sans-serif'}}>
					Menu Dashboard
				</h2>
				<div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
				<div className="absolute -bottom-2 left-0 w-1/4 h-1 bg-gradient-to-r from-blue-400 to-transparent animate-pulse"></div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 flex-grow">
				{cards.map(({ key, title, icon, actions }) => (
					<MenuCard
						key={key}
						title={title}
						icon={icon}
						actions={actions}
					/>
				))}
			</div>
		</div>
	);
};

export default MenuDashboard;

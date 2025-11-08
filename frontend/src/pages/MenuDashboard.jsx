import React from 'react';
import MenuCard from '../components/MenuCard';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTools, FaShoppingBag, FaStore, FaReceipt } from 'react-icons/fa';
import { MdOutlineBuild } from 'react-icons/md';

const cards = [
	{ key: 'customer', title: 'Customer Entry', icon: <FaUser /> , navigateTo: '/not-available' },
	{ key: 'warranty', title: 'Warranty Replacement / Repair', icon: <FaTools />, navigateTo: '/not-available' },
	{ key: 'out_of_warranty', title: 'Out of Warranty Repair', icon: <MdOutlineBuild /> , navigateTo: '/not-available'},
	{ key: 'market', title: 'Direct Market Replacement', icon: <FaShoppingBag /> , navigateTo: '/not-available'},
	{ key: 'retail', title: 'Retail Sales / Services', icon: <FaStore /> , navigateTo: '/not-available'},
	{ key: 'challan', title: 'Road Challan', icon: <FaReceipt /> , navigateTo: '/not-available'},
];

const MenuDashboard = () => {
	const navigate = useNavigate();
	// const { metrics, loading, error } = useMetrics();

	return (
		// Using flex and max-height to prevent scrolling
		<div className="flex flex-col h-[calc(100vh-7rem)] pt-8 px-6 md:px-10 lg:px-20 bg-[#f0f4f8]">
			<div className="relative mb-6">
				<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm" 
					style={{fontFamily: 'Montserrat, sans-serif'}}>
					Menu Dashboard
				</h2>
				<div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
				<div className="absolute -bottom-2 left-0 w-1/4 h-1 bg-gradient-to-r from-blue-400 to-transparent animate-pulse"></div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 flex-grow overflow-hidden">
				{cards.map(({ key, title, icon , navigateTo }) => (
					<MenuCard
						key={key}
						title={title}
						icon={icon}
						onClick={() => navigate(navigateTo)}
					>
					</MenuCard>
				))}
			</div>
		</div>
	);
};

export default MenuDashboard;

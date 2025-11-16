import React from "react";
import MenuCard from "../components/MenuCard";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaTools,
  FaShoppingBag,
  FaStore,
  FaReceipt,
} from "react-icons/fa";
import { MdOutlineBuild } from "react-icons/md";
import CustomerChart from "../charts/CustomerChart";
import ChallanChart from "../charts/ChallanChart";
import MarketStatusChart from "../charts/MarketStatusChart";
import WarrantyStatusChart from "../charts/WarrantyStatusChart";
import OutOfWarrantyStatusChart from "../charts/OutOfWarrantyStatusChart";
import OutOfWarrantyTimeline from "../charts/OutOfWarrantyTimeline";
import WarrantySRFDeliveryTimelineChart from "../charts/WarrantySRFDeliveryTimelineChart";
import RetailDivisionDonutChart from "../charts/RetailDivisionDonutChart";
import RetailSettledPieChart from "../charts/RetailSettledPieChart";
import { useDashboardData } from "../hooks/useDashboardData";
import SpinnerLoading from "../components/SpinnerLoading";

const cards = [
  {
    key: "customer",
    title: "Customer Entry",
    icon: <FaUser />,
    bgColor: "#ffe4ec", // light pink
    actions: [
      { label: "Add Record", path: "/customer/create" },
      { label: "Update Record", path: "/customer/update" },
    ],
  },
  {
    key: "warranty",
    title: "Warranty Replacement / Repair",
    icon: <FaTools />,
    bgColor: "#fff7e6", // light orange
    actions: [
      { label: "Create SRF", path: "/warranty/create_srf" },
      { label: "Create CNF Challan", path: "/warranty/create_cnf" },
      { label: "Print SRF", path: "/warranty/print_srf" },
      { label: "Print CNF Challan", path: "/warranty/print_cnf" },
      { label: "Update SRF", path: "/warranty/update_srf" },
    ],
  },
  {
    key: "out_of_warranty",
    title: "Out of Warranty Repair",
    icon: <MdOutlineBuild />,
    bgColor: "#e6fff7", // light teal
    actions: [
      { label: "Create SRF", path: "/oow/create_srf" },
      { label: "Print SRF", path: "/oow/print_srf" },
      { label: "Update SRF", path: "/oow/update_srf" },
      { label: "Settle SRF", path: "/oow/settle_srf" },
      { label: "Create Vendor Challan", path: "/oow/create_vendor_challan" },
      { label: "Print Vendor Challan", path: "/oow/print_vendor_challan" },
      { label: "Print Estimate", path: "/oow/print_estimate" },
      { label: "Settle Vendor", path: "/oow/settle_vendor" },
    ],
  },
  {
    key: "market",
    title: "Direct Market Replacement",
    icon: <FaShoppingBag />,
    bgColor: "#f0f4f8", // light lime
    actions: [
      { label: "Add Record", path: "/market/create" },
      { label: "Update Record", path: "/market/update" },
    ],
  },
  {
    key: "challan",
    title: "Road Challan",
    icon: <FaReceipt />,
    bgColor: "#faf6c0ff", // light yellow
    actions: [
      { label: "Create Challan", path: "/challan/create" },
      { label: "Print Challan", path: "/challan/print" },
    ],
  },
  {
    key: "retail",
    title: "Retail Sales / Services",
    icon: <FaStore />,
    bgColor: "#e7d7f8ff", // light purple
    actions: [
      { label: "Add Record", path: "/retail/create" },
      { label: "Update Record", path: "/retail/update" },
      { label: "Settle Record", path: "/retail/settle" },
      { label: "Print Receipt", path: "/retail/print_receipt" },
    ],
  },
];

const MenuDashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useDashboardData();

  return (
    // Using flex and max-height to prevent scrolling
    <div className="flex flex-col min-h-[calc(100vh-7rem)] pt-8 px-6 md:px-10 lg:px-20 bg-[#fff] mb-5">
      <div className="relative mb-6">
        <h2
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Menu Dashboard
        </h2>
        <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
        <div className="absolute -bottom-2 left-0 w-1/4 h-1 bg-gradient-to-r from-blue-400 to-transparent animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-grow min-w-0 w-full">
        {cards.map(({ key, title, icon, actions, bgColor }) => (
          <MenuCard
            key={key}
            title={title}
            icon={icon}
            actions={actions}
            bgColor={bgColor}
            className="min-h-[300px] max-w-full w-full"
          >
            {key === "customer" && (
              <CustomerChart data={data} loading={loading} error={error} />
            )}
            {key === "challan" && (
              <ChallanChart data={data} loading={loading} error={error} />
            )}
            {key === "retail" && (
              <div className="flex flex-col md:flex-row gap-0 items-start justify-start w-full">
                {loading ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text="Loading Retail Data ..." />
                  </div>
                ) : error ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text={`Error Loading ...`} />
                  </div>
                ) : (
                  <>
                    <div className="w-full md:px-0">
                      <RetailDivisionDonutChart data={data} />
                    </div>
                    <div className="w-full md:px-0">
                      <RetailSettledPieChart data={data} />
                    </div>
                  </>
                )}
              </div>
            )}
            {key === "market" && (
              <div className="mt-2">
                <MarketStatusChart
                  data={data}
                  loading={loading}
                  error={error}
                />
              </div>
            )}
            {key === "warranty" && (
              <div className="flex flex-col md:flex-row gap-0 items-start justify-start w-full">
                {loading ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text="Loading Warranty Data ..." />
                  </div>
                ) : error ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text={`Error Loading ...`} />
                  </div>
                ) : (
                  <>
                    <div className="w-full md:w-2/5 md:pr-0 md:px-0">
                      <WarrantyStatusChart data={data} />
                    </div>
                    <div className="w-full md:w-3/5 md:pl-0 md:px-0">
                      <WarrantySRFDeliveryTimelineChart data={data} />
                    </div>
                  </>
                )}
              </div>
            )}
            {key === "out_of_warranty" && (
              <div className="flex flex-col md:flex-row gap-0 items-start justify-start w-full">
                {loading ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text="Loading Out of Warranty Data ..." />
                  </div>
                ) : error ? (
                  <div className="w-full flex justify-center items-center">
                    <SpinnerLoading text={`Error Loading ...`} />
                  </div>  
                ) : (
                  <>
                    <div className="w-full md:w-2/3 md:pr-0 md:px-0">
                      <OutOfWarrantyTimeline data={data} />
                    </div>
                    <div className="w-full md:w-1/3 md:pl-0 md:px-0">
                      <OutOfWarrantyStatusChart data={data} />
                    </div>
                  </>
                )}
              </div>
            )}
          </MenuCard>
        ))}
      </div>
    </div>
  );
};

export default MenuDashboard;

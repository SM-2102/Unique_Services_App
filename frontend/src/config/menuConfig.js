// Centralized menu and card actions config for NavBar and MenuDashboardPage
import {
  FaUser,
  FaTools,
  FaShoppingBag,
  FaStore,
  FaReceipt,
} from "react-icons/fa";
import { MdOutlineBuild } from "react-icons/md";

export const menuConfig = [
  {
    key: "customer",
    title: "Customer Entry",
    icon: FaUser,
    bgColor: "#ffe4ec",
    actions: [
      { label: "Add Record", path: "/customer-create" },
      { label: "Update Record", path: "/customer-update" },
    ],
  },
  {
    key: "warranty",
    title: "Warranty Replacement / Repair",
    icon: FaTools,
    bgColor: "#fff7e6",
    actions: [
      { label: "Create SRF", path: "/warranty-create_srf" },
      { label: "Create CNF Challan", path: "/warranty-create_cnf" },
      { label: "Print SRF", path: "/warranty-print_srf" },
      { label: "Print CNF Challan", path: "/warranty-print_cnf" },
      { label: "Update SRF", path: "/warranty-update_srf" },
      { label: "Enquiry", path: "/warranty-enquiry", showInDashboard: false },
    ],
  },
  {
    key: "out_of_warranty",
    title: "Out of Warranty Repair",
    icon: MdOutlineBuild,
    bgColor: "#e6fff7",
    actions: [
      { label: "Create SRF", path: "/oow-create_srf" },
      { label: "Print SRF", path: "/oow-print_srf" },
      { label: "Update SRF", path: "/oow-update_srf" },
      { label: "Settle SRF", path: "/oow-settle_srf" },
      { label: "Create Vendor Challan", path: "/oow-create_vendor_challan" },
      { label: "Print Vendor Challan", path: "/oow-print_vendor_challan" },
      { label: "Print Estimate", path: "/oow-print_estimate" },
      { label: "Settle Vendor", path: "/oow-settle_vendor" },
      { label: "Enquiry", path: "/oow-enquiry", showInDashboard: false },
    ],
  },
  {
    key: "market",
    title: "Direct Market Replacement",
    icon: FaShoppingBag,
    bgColor: "#f0f4f8",
    actions: [
      { label: "Add Record", path: "/market-create" },
      { label: "Update Record", path: "/market-update" },
      { label: "Enquiry", path: "/market-enquiry", showInDashboard: false },
    ],
  },
  {
    key: "challan",
    title: "Road Challan",
    icon: FaReceipt,
    bgColor: "#faf6c0ff",
    actions: [
      { label: "Create Challan", path: "/challan-create" },
      { label: "Print Challan", path: "/challan-print" },
    ],
  },
  {
    key: "retail",
    title: "Retail Sales / Services",
    icon: FaStore,
    bgColor: "#e7d7f8ff",
    actions: [
      { label: "Add Record", path: "/retail-create" },
      { label: "Update Record", path: "/retail-update" },
      { label: "Settle Record", path: "/retail-settle" },
      { label: "Print Receipt", path: "/retail-print_receipt" },
      { label: "Enquiry", path: "/retail-enquiry", showInDashboard: false },
    ],
  },
];

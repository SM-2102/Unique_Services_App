
import React, { useEffect, useState } from "react";
// Inline Filter component with filter fields
import { Container } from "@mui/material";
import { marketEnquiry as fetchMarketEnquiry } from "../services/marketEnquiryService";
import { fetchMasterNames } from "../services/masterNamesService";
import { fetchMarketDeliveredBy } from "../services/marketDeliveredByService";
import EnquiryTable from "../components/EnquiryTable";
import ShowToast from "../components/Toast";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const columns = [
	{ key: "mcode", label: "Material Code" },
	{ key: "name", label: "Name" },
	{ key: "division", label: "Division" },
	{ key: "invoice_number", label: "Invoice Number" },
	{ key: "invoice_date", label: "Invoice Date" },
	{ key: "quantity", label: "Quantity" },
	{ key: "delivery_date", label: "Delivery Date" },
	{ key: "delivery_by", label: "Delivered By" },
];

const divisionOptions = [
	"FANS",
	"PUMP",
	"LIGHT",
	"SDA",
	"IWH",
	"SWH",
	"COOLER",
	"OTHERS",
];

const Filter = ({ open = false, onToggle, finalStatus, setFinalStatus, name, setName, division, setDivision, deliveryDate, setDeliveryDate, fromDeliveryDate, setFromDeliveryDate, toDeliveryDate, setToDeliveryDate, deliveredBy, setDeliveredBy, invoiceDate, setInvoiceDate, onSearch, masterNames, deliveredByOptions }) => {
	const [nameSuggestions, setNameSuggestions] = useState([]);
	const [showNameSuggestions, setShowNameSuggestions] = useState(false);
	const nameSuggestionClickedRef = React.useRef(false);

	const [deliveredBySuggestions, setDeliveredBySuggestions] = useState([]);
	const [showDeliveredBySuggestions, setShowDeliveredBySuggestions] = useState(false);
	const deliveredBySuggestionClickedRef = React.useRef(false);

	// Name suggestions
	useEffect(() => {
		if (nameSuggestionClickedRef.current) {
			setShowNameSuggestions(false);
			setNameSuggestions([]);
			nameSuggestionClickedRef.current = false;
			return;
		}
		if (name && masterNames && masterNames.length > 0) {
			const filtered = masterNames.filter((n) =>
				n.toLowerCase().startsWith(name.toLowerCase())
			);
			setNameSuggestions(filtered);
			setShowNameSuggestions(filtered.length > 0);
		} else {
			setShowNameSuggestions(false);
		}
	}, [name, masterNames]);

	// Delivered By suggestions
	useEffect(() => {
		if (deliveredBySuggestionClickedRef.current) {
			setShowDeliveredBySuggestions(false);
			setDeliveredBySuggestions([]);
			deliveredBySuggestionClickedRef.current = false;
			return;
		}
		if (deliveredBy && deliveredByOptions && deliveredByOptions.length > 0) {
			const filtered = deliveredByOptions.filter((d) =>
				d.toLowerCase().startsWith(deliveredBy.toLowerCase())
			);
			setDeliveredBySuggestions(filtered);
			setShowDeliveredBySuggestions(filtered.length > 0);
		} else {
			setShowDeliveredBySuggestions(false);
		}
	}, [deliveredBy, deliveredByOptions]);

	return (
		       <>
				   <div
					   className={`fixed right-0 w-65 max-w-[90vw] z-[1200] transition-transform duration-300
						   ${open ? "translate-x-0" : "translate-x-full"} bg-black/10 backdrop-blur-xl shadow-2xl
						   top-[88px] bottom-[0px] rounded-l-md overflow-hidden flex flex-col animate-fade-in`}
					   style={{ maxHeight: 'calc(100vh - 88px)', overflowY: 'auto' }}
				   >
					   <div style={{ padding: 15, marginTop: 5 }}>
					       {/* Elegant filter fields */}
					       <div style={{ marginBottom: 16, position: "relative" }}>
						       <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14, marginBottom: 4, display: 'block' }}>Customer Name</label>
									<input
									    type="text"
									    value={name}
									    onChange={e => setName(e.target.value)}
									    placeholder="Name"
									    style={{
										width: "100%",
										padding: "6px 10px",
										border: "1px solid #d1d5db",
										borderRadius: 6,
										fontSize: 14,
										background: "#f7f9fc",
										transition: "border 0.2s",
										outline: "none",
										boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
									    }}
									    onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
									    onBlur={e => {
										if (!nameSuggestionClickedRef.current) {
										    setShowNameSuggestions(false);
										}
									    }}
									/>
									{showNameSuggestions && (
									    <ul
										style={{
										    position: "absolute",
										    top: "100%",
										    left: 0,
										    zIndex: 10,
										    background: "#fff",
										    border: "0.5px solid #d1d5db",
										    borderRadius: "0.25rem",
										    boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
										    width: "100%",
										    maxHeight: 160,
										    overflowY: "auto",
										    margin: 0,
										    padding: 0,
										    listStyle: "none",
										}}
									    >
										{nameSuggestions.map((n) => (
										    <li
											key={n}
											style={{ padding: "6px 10px", cursor: "pointer", fontSize: 14, color: '#0a1825ff', borderBottom: '1px solid #f0f0f0' }}
											onMouseDown={() => {
											    nameSuggestionClickedRef.current = true;
											    setName(n);
											    setShowNameSuggestions(false);
											    setNameSuggestions([]);
											}}
										    >
											{n}
										    </li>
										))}
									    </ul>
									)}
					       </div>
					       <div style={{ marginBottom: 16 }}>
							   <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								   <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14 , width: 150}}>Division</label>
								   <select value={division} onChange={e => setDivision(e.target.value)} style={{
									   padding: "4px 8px",
									   border: "1px solid #d1d5db",
									   borderRadius: 6,
									   fontSize: 14,
									   background: "#f7f9fc",
									   outline: "none",
									   boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
									   width: "100%",
								   }}>
									   <option value="">All</option>
									   {divisionOptions.map(opt => (
									   <option key={opt} value={opt}>{opt}</option>
									   ))}
								   </select>
							   </div>
					       </div>
							       <div style={{ marginBottom: 16 }}>
								       <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14, marginBottom: 4, display: 'block' }}>Delivery Date</label>
								       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
									       <span style={{ minWidth: 83, fontSize: 13, color: '#333' }}>From</span>
									       <input type="date" value={fromDeliveryDate} onChange={e => setFromDeliveryDate(e.target.value)} style={{
										       flex: 1,
										       padding: "4px 8px",
										       border: "1px solid #d1d5db",
										       borderRadius: 6,
										       fontSize: 14,
										       background: "#f7f9fc",
										       outline: "none",
										       boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
									       }} />
								       </div>
								       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									       <span style={{ minWidth: 83, fontSize: 13, color: '#333' }}>To</span>
									       <input type="date" value={toDeliveryDate} onChange={e => setToDeliveryDate(e.target.value)} style={{
										       flex: 1,
										       padding: "4px 8px",
										       border: "1px solid #d1d5db",
										       borderRadius: 6,
										       fontSize: 14,
										       background: "#f7f9fc",
										       outline: "none",
										       boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
									       }} />
								       </div>
							       </div>
						       <div style={{ marginBottom: 16 }}>
							       <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14, marginBottom: 4, display: 'block' }}>Delivered By</label>
									<div style={{ position: "relative" }}>
										<input
											type="text"
											value={deliveredBy}
											onChange={e => setDeliveredBy(e.target.value)}
											placeholder="Name"
											style={{
												width: "100%",
												padding: "4px 8px",
												border: "1px solid #d1d5db",
												borderRadius: 6,
												fontSize: 14,
												background: "#f7f9fc",
												outline: "none",
												boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
											}}
											onFocus={e => e.target.style.border = "1.5px solid #1976d2"}
											onBlur={e => {
												if (!deliveredBySuggestionClickedRef.current) {
													setShowDeliveredBySuggestions(false);
												}
											}}
										/>
										{showDeliveredBySuggestions && (
											<ul
												style={{
													position: "absolute",
													top: "100%",
													left: 0,
													zIndex: 10,
													background: "#fff",
													border: "0.5px solid #d1d5db",
													borderRadius: "0.25rem",
													boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
													width: "100%",
													maxHeight: 160,
													overflowY: "auto",
													margin: 0,
													padding: 0,
													listStyle: "none",
												}}
											>
												{deliveredBySuggestions.map((d) => (
													<li
														key={d}
														style={{ padding: "6px 10px", cursor: "pointer", fontSize: 14, color: '#0a1825ff', borderBottom: '1px solid #f0f0f0' }}
														onMouseDown={() => {
															deliveredBySuggestionClickedRef.current = true;
															setDeliveredBy(d);
															setShowDeliveredBySuggestions(false);
															setDeliveredBySuggestions([]);
														}}
													>
														{d}
													</li>
												))}
											</ul>
										)}
									</div>
						       </div>
							   <div style={{ marginBottom: 16 }}>
								   <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
									   <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14, width: 150 }}>Invoice Date</label>
									   <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} style={{
										   padding: "4px 8px",
										   border: "1px solid #d1d5db",
										   borderRadius: 6,
										   fontSize: 14,
										   background: "#f7f9fc",
										   outline: "none",
										   boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
										   width: "100%"
									   }} />
								   </div>
							   </div>
						   <div style={{ marginBottom: 16 }}>
							   <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
								   <label style={{ fontWeight: 600, color: '#1976d2', letterSpacing: 0.5, fontSize: 14, width: 150 }}>Final Status</label>
								   <select value={finalStatus} onChange={e => setFinalStatus(e.target.value)} style={{
									   padding: "4px 8px",
									   border: "1px solid #d1d5db",
									   borderRadius: 6,
									   fontSize: 14,
									   background: "#f7f9fc",
									   outline: "none",
									   boxShadow: "0 1px 2px rgba(25, 118, 210, 0.04)",
									   width: "100%"
								   }}>
									   <option value="">All</option>
									   <option value="Y">Completed</option>
									   <option value="N">Pending</option>
								   </select>
							   </div>
						   </div>
					       {/* Centered Search Button */}
					       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
						       <button onClick={onSearch} style={{
							       padding: "8px 32px",
							       background: "linear-gradient(90deg, #1976d2 60%, #1565c0 100%)",
							       color: "#fff",
							       border: "none",
							       borderRadius: 20,
							       fontWeight: "bold",
							       fontSize: 15,
							       boxShadow: "0 2px 8px rgba(25,118,210,0.08)",
							       cursor: "pointer",
							       letterSpacing: 1,
							       transition: "background 0.2s, box-shadow 0.2s",
						       }}>Search</button>
					       </div>
				       </div>
			       </div>
			       <div
				       onClick={onToggle}
				       className={`fixed top-1/3 -translate-y-1/2 z-[3000] flex items-center gap-2 bg-blue-900 text-white shadow-lg cursor-pointer
					       px-4 py-3 rounded-l-xl select-none transition-all duration-300 ${open ? "right-65" : "right-0"}`}
				       title="Toggle Filter Bar"
			       >
				       {open ? (
					 <FaChevronRight className="text-base" />
					       ) : (
					 <FaChevronLeft className="text-base" />
					       )}
				       <span className="text-md font-bold">Filter</span>
			       </div>
		       </>
	       );
};

const MarketEnquiryPage = () => {
	// Filter states for master_enquiry params
	const [finalStatus, setFinalStatus] = useState("");
	const [name, setName] = useState("");
	const [division, setDivision] = useState("");
	const [fromDeliveryDate, setFromDeliveryDate] = useState("");
	const [toDeliveryDate, setToDeliveryDate] = useState("");
	const [deliveredBy, setDeliveredBy] = useState("");
	const [invoiceDate, setInvoiceDate] = useState("");

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false); // Don't load on mount
	const [error, setError] = useState(null);
	const [filterOpen, setFilterOpen] = useState(true);
	const [searched, setSearched] = useState(false);
	const [masterNames, setMasterNames] = useState([]);
	const [deliveredByOptions, setDeliveredByOptions] = useState([]);

	// Fetch master names for autocomplete on mount
	useEffect(() => {
		let mounted = true;
		fetchMasterNames()
			.then((data) => {
				if (mounted && Array.isArray(data)) setMasterNames(data);
			})
			.catch(() => {
				setMasterNames([]);
			});
		return () => {
			mounted = false;
		};
	}, []);

	// Fetch delivered by options for autocomplete on mount
	useEffect(() => {
		let mounted = true;
		fetchMarketDeliveredBy()
			.then((data) => {
				if (mounted && Array.isArray(data)) setDeliveredByOptions(data);
			})
			.catch(() => {
				setDeliveredByOptions([]);
			});
		return () => {
			mounted = false;
		};
	}, []);

	// Handler for search button
	const handleSearch = async () => {
		setLoading(true);
		setError(null);
		setSearched(true);
		setFilterOpen(false);
		try {
			// Update fetchMarketEnquiry to accept params
			const params = {};
			if (finalStatus) params.final_status = finalStatus;
			if (name) params.name = name;
			if (division) params.division = division;
			if (fromDeliveryDate) params.from_delivery_date = fromDeliveryDate;
			if (toDeliveryDate) params.to_delivery_date = toDeliveryDate;
			if (deliveredBy) params.delivered_by = deliveredBy;
			if (invoiceDate) params.invoice_date = invoiceDate;
			const res = await fetchMarketEnquiry(params);
			setData(res);
		} catch (err) {
			setError(err.message || "Failed to fetch data");
			setData([]);
		}
		setLoading(false);
	};

	return (
			   <Container maxWidth="xl" sx={{ mt: 4 }}>
					   {/* Filter Bar for searching/filtering UI */}
				<Filter
					open={filterOpen}
					onToggle={() => setFilterOpen((prev) => !prev)}
					finalStatus={finalStatus}
					setFinalStatus={setFinalStatus}
					name={name}
					setName={setName}
					division={division}
					setDivision={setDivision}
					fromDeliveryDate={fromDeliveryDate}
					setFromDeliveryDate={setFromDeliveryDate}
					toDeliveryDate={toDeliveryDate}
					setToDeliveryDate={setToDeliveryDate}
					deliveredBy={deliveredBy}
					setDeliveredBy={setDeliveredBy}
					invoiceDate={invoiceDate}
					setInvoiceDate={setInvoiceDate}
					onSearch={handleSearch}
					masterNames={masterNames}
					deliveredByOptions={deliveredByOptions}
				/>
					   {/* Results or placeholder */}
						  {error ? (
								  <ShowToast type="error" 
									   message="Cannot load Market Enquiry data"
									   resolution="Try again later" />
							  ) : (
								  <>
									  <EnquiryTable
											  data={data}
											  columns={columns}
											  title="Market Enquiry List"
											  noDataMessage={searched && data.length === 0 ? (
													  <tr>
														  <td colSpan={columns.length} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', padding: '24px 0' }}>
															  No record found
														  </td>
													  </tr>
											  ) : null}
									  />
								  </>
							  )}
			   </Container>
	   );
};

export default MarketEnquiryPage;

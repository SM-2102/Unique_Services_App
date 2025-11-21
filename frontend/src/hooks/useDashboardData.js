// Custom hook for fetching dashboard data

import { useState, useEffect } from "react";
import API_ENDPOINTS from "../config/api";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.MENU_DASHBOARD, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err);
      // Set fallback data in case of error
      setData({
        customer: { number_of_customers: 0, top_customers: [] },
        challan: { number_of_challans: 0, number_of_items: 0 },
        retail: { division_wise_donut: [], settled_vs_unsettled_pie_chart: [] },
        market: { status_per_division_stacked_bar_chart: [] },
        warranty: {
          division_wise_pending_completed_bar_graph: [],
          srf_vs_delivery_month_wise_bar_graph: [],
        },
        out_of_warranty: {
          srf_receive_vs_delivery_bar_graph: [],
          final_status_bar_graph: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchDashboardData };
};

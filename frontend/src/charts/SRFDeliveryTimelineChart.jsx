// SRF vs Delivery Timeline Chart
import React, { useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

const SRFDeliveryTimelineChart = () => {
  const { data, loading, error } = useDashboardData();
  const [chartData, setChartData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    if (data?.warranty?.srf_vs_delivery_month_wise_bar_graph) {
      const timelineData = data.warranty.srf_vs_delivery_month_wise_bar_graph.map(item => {
        const srfDate = new Date(item.srf_date);
        const deliveryDate = new Date(item.delivery_date);
        const daysDiff = Math.ceil((deliveryDate - srfDate) / (1000 * 60 * 60 * 24));
        
        return {
          ...item,
          daysDifference: daysDiff,
          srfMonth: srfDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          deliveryMonth: deliveryDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
      });
      
      // Calculate monthly statistics
      const monthStats = timelineData.reduce((acc, item) => {
        const month = item.srfMonth;
        if (!acc[month]) {
          acc[month] = { count: 0, totalDays: 0, avgDays: 0 };
        }
        acc[month].count++;
        acc[month].totalDays += item.daysDifference;
        acc[month].avgDays = Math.round(acc[month].totalDays / acc[month].count);
        return acc;
      }, {});
      
      setChartData(timelineData);
      setMonthlyStats(monthStats);
    }
  }, [data]);

  if (loading) return <div className="text-center py-4">Loading delivery timeline...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading timeline data</div>;

  const getStatusColor = (days) => {
    if (days <= 7) return 'bg-green-500';
    if (days <= 14) return 'bg-yellow-500';
    if (days <= 21) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusText = (days) => {
    if (days <= 7) return 'Fast';
    if (days <= 14) return 'Normal';
    if (days <= 21) return 'Slow';
    return 'Delayed';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">SRF vs Delivery Timeline</h3>
      
      {/* Monthly Summary */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-700">Monthly Average Processing Days</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(monthlyStats).map(([month, stats]) => (
            <div key={month} className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-600">{month}</div>
              <div className="text-lg font-bold text-blue-600">{stats.avgDays} days</div>
              <div className="text-xs text-gray-500">{stats.count} records</div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Records */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <h4 className="text-md font-medium mb-2 text-gray-700">Recent Records</h4>
        {chartData.slice(-10).map((item, index) => (
          <div key={`${item.srf_number}-${index}`} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex-1">
              <div className="font-medium text-sm">{item.srf_number}</div>
              <div className="text-xs text-gray-500">
                SRF: {new Date(item.srf_date).toLocaleDateString()} → 
                Delivery: {new Date(item.delivery_date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{item.daysDifference} days</span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(item.daysDifference)}`}></div>
              <span className="text-xs text-gray-600">{getStatusText(item.daysDifference)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>≤7 days (Fast)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>8-14 days (Normal)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>15-21 days (Slow)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>&gt;21 days (Delayed)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRFDeliveryTimelineChart;
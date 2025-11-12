// Market Status Stacked Bar Chart
import React, { useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

const MarketStatusChart = () => {
  const { data, loading, error } = useDashboardData();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data?.market?.status_per_division_stacked_bar_chart) {
      // Group data by division
      const groupedData = data.market.status_per_division_stacked_bar_chart.reduce((acc, item) => {
        const division = item.division;
        if (!acc[division]) {
          acc[division] = { division, Y: 0, N: 0 };
        }
        acc[division][item.final_status] = item.count;
        return acc;
      }, {});
      
      setChartData(Object.values(groupedData));
    }
  }, [data]);

  if (loading) return <div className="text-center py-4">Loading market status data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading market status data</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Market Status per Division</h3>
      <div className="space-y-4">
        {chartData.map((item) => {
          const total = item.Y + item.N;
          const yPercentage = total > 0 ? (item.Y / total) * 100 : 0;
          const nPercentage = total > 0 ? (item.N / total) * 100 : 0;
          
          return (
            <div key={item.division} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{item.division}</span>
                <span className="text-sm text-gray-500">Total: {total}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
                <div 
                  className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${yPercentage}%` }}
                >
                  {item.Y > 0 && `${item.Y}`}
                </div>
                <div 
                  className="bg-red-500 h-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${nPercentage}%` }}
                >
                  {item.N > 0 && `${item.N}`}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                  Completed: {item.Y} ({yPercentage.toFixed(1)}%)
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                  Pending: {item.N} ({nPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketStatusChart;
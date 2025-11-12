// Out of Warranty Final Status Chart
import React, { useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';

const OutOfWarrantyStatusChart = () => {
  const { data, loading, error } = useDashboardData();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data?.out_of_warranty?.final_status_bar_graph) {
      // Group data by division
      const groupedData = data.out_of_warranty.final_status_bar_graph.reduce((acc, item) => {
        const division = item.division;
        if (!acc[division]) {
          acc[division] = { division, COMPLETED: 0, PENDING: 0 };
        }
        acc[division][item.status] = item.count;
        return acc;
      }, {});
      
      setChartData(Object.values(groupedData));
    }
  }, [data]);

  if (loading) return <div className="text-center py-4">Loading out-of-warranty data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading out-of-warranty data</div>;

  const maxTotal = Math.max(...chartData.map(item => item.COMPLETED + item.PENDING));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Out of Warranty Status</h3>
      <div className="space-y-4">
        {chartData.map((item) => {
          const total = item.COMPLETED + item.PENDING;
          const completedPercentage = total > 0 ? (item.COMPLETED / total) * 100 : 0;
          const pendingPercentage = total > 0 ? (item.PENDING / total) * 100 : 0;
          
          return (
            <div key={item.division} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 min-w-[80px]">{item.division}</span>
                <span className="text-sm text-gray-500">Total: {total}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-8 flex overflow-hidden">
                <div 
                  className="bg-blue-500 h-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${completedPercentage}%` }}
                >
                  {item.COMPLETED > 0 && `${item.COMPLETED}`}
                </div>
                <div 
                  className="bg-orange-500 h-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${pendingPercentage}%` }}
                >
                  {item.PENDING > 0 && `${item.PENDING}`}
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  Completed: {item.COMPLETED} ({completedPercentage.toFixed(1)}%)
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>
                  Pending: {item.PENDING} ({pendingPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfWarrantyStatusChart;
// Warranty Division Bar Chart
import React, { useEffect, useState } from 'react';

const WarrantyStatusChart = ({ data, loading, error }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data?.warranty?.division_wise_pending_completed_bar_graph) {
      // Group data by division
      const groupedData = data.warranty.division_wise_pending_completed_bar_graph.reduce((acc, item) => {
        const division = item.division;
        if (!acc[division]) {
          acc[division] = { division, Y: 0, N: 0 };
        }
        acc[division][item.settlement] = item.count;
        return acc;
      }, {});
      
      setChartData(Object.values(groupedData));
    }
  }, [data]);

  if (loading) return <div className="text-center py-4">Loading warranty data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error loading warranty data</div>;

  const maxTotal = Math.max(...chartData.map(item => item.Y + item.N));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Warranty Settlement Status</h3>
      <div className="space-y-4">
        {chartData.map((item) => {
          const total = item.Y + item.N;
          const completedWidth = maxTotal > 0 ? (item.Y / maxTotal) * 100 : 0;
          const pendingWidth = maxTotal > 0 ? (item.N / maxTotal) * 100 : 0;
          
          return (
            <div key={item.division} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700 min-w-[80px]">{item.division}</span>
                <span className="text-sm text-gray-500">Total: {total}</span>
              </div>
              
              <div className="space-y-1">
                {/* Completed Bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 w-16">Settled:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${completedWidth}%` }}
                    >
                      {item.Y > 0 && (
                        <span className="text-xs text-white font-semibold">{item.Y}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pending Bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-600 w-16">Pending:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-red-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${pendingWidth}%` }}
                    >
                      {item.N > 0 && (
                        <span className="text-xs text-white font-semibold">{item.N}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span>Settled</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyStatusChart;
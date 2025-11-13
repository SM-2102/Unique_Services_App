// Market Status Stacked Bar Chart
import React, { useEffect, useState } from 'react';
import SpinnerLoading from '../components/SpinnerLoading';

const MarketStatusChart = ({ data, loading, error }) => {
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


  // Tooltip state (must be before any return)
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, value: '', label: '' });

  // Helper to show tooltip
  const handleMouseOver = (e, value, label) => {
    setTooltip({
      show: true,
      x: e.clientX,
      y: e.clientY,
      value,
      label,
    });
  };
  const handleMouseOut = () => setTooltip({ ...tooltip, show: false });

  // Animation state for each bar: animate green first, then red
  const [barStates, setBarStates] = useState([]);
  const animationRanRef = React.useRef('');
  useEffect(() => {
    const chartKey = JSON.stringify(chartData);
    if (animationRanRef.current === chartKey) return;
    animationRanRef.current = chartKey;
    setBarStates(chartData.map(() => ({ green: false, red: false })));
    chartData.forEach((_, idx) => {
      setTimeout(() => {
        setBarStates(prev => {
          const next = [...prev];
          if (next[idx]) next[idx] = { ...next[idx], green: true };
          return next;
        });
        setTimeout(() => {
          setBarStates(prev => {
            const next = [...prev];
            if (next[idx]) next[idx] = { ...next[idx], red: true };
            return next;
          });
        }, 700);
      }, idx * 200);
    });
  }, [chartData]);

  if (loading) {
    return (
      <div>
        <SpinnerLoading text="Loading Market Status Data ..." />
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <SpinnerLoading text="Error Loading ..." />
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] p-3 rounded-lg relative ml-[-14px]">
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="pointer-events-none fixed z-50 px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold bg-white text-gray-900 border border-gray-200"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10, minWidth: 70, textAlign: 'center', letterSpacing: '0.01em' }}
        >
          <span className="block">{tooltip.label}</span>
          <span className="block font-bold">{tooltip.value}</span>
        </div>
      )}
      <div className="flex flex-row items-start justify-start gap-8">
        {/* Horizontal bars and labels */}
        <div className="flex flex-col gap-1.5 w-full max-w-xl">
          {chartData.map((item, idx) => {
            const total = item.Y + item.N;
            const yPercentage = total > 0 ? (item.Y / total) * 100 : 0;
            const nPercentage = total > 0 ? (item.N / total) * 100 : 0;
            const barState = barStates[idx] || { green: false, red: false };
            return (
              <div key={item.division} className="flex items-center">
                {/* Fixed width label */}
                <span className="text-xs font-medium text-gray-700 text-right mr-2" style={{width: '45px', flexShrink: 0, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                  {item.division}
                </span>
                {/* Stacked horizontal bar: green left, red right */}
                <div className="relative flex flex-row h-5 w-[160px] rounded overflow-hidden border border-gray-200 bg-gray-100">
                  {/* Completed (Y) - green left */}
                  <div
                    className="bg-green-500 h-full transition-all duration-700 cursor-pointer relative"
                    style={{
                      width: barState.green ? `${yPercentage}%` : 0,
                      transitionDelay: '0ms',
                    }}
                    onMouseOver={e => handleMouseOver(e, `${yPercentage.toFixed(1)}%`, 'Completed')}
                    onMouseOut={handleMouseOut}
                  ></div>
                  {/* Pending (N) - red right */}
                  <div
                    className="bg-red-500 h-full transition-all duration-700 cursor-pointer relative"
                    style={{
                      width: barState.red ? `${nPercentage}%` : 0,
                      transitionDelay: '0ms',
                    }}
                    onMouseOver={e => handleMouseOver(e, `${nPercentage.toFixed(1)}%`, 'Pending')}
                    onMouseOut={handleMouseOut}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Legend on the right */}
        <div className="flex flex-col justify-start items-start ml-2 mt-1 gap-1 min-w-[60px]">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-3 h-3 bg-green-500 rounded"></span>
            <span className="text-xs text-gray-700">Completed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-3 h-3 bg-red-500 rounded"></span>
            <span className="text-xs text-gray-700">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStatusChart;
// Division-wise Donut Chart for Retail Data
import React, { useEffect, useState, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import SpinnerLoading from '../components/SpinnerLoading';

ChartJS.register(ArcElement, Tooltip, Legend);


const DivisionDonutChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (data?.retail?.division_wise_donut) {
      setChartData(data.retail.division_wise_donut);
    }
  }, [data]);

  useEffect(() => {
    const chartCanvas = chartRef.current?.querySelector('canvas');
    if (!chartCanvas) return;
    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);
    chartCanvas.addEventListener('mouseenter', handleEnter);
    chartCanvas.addEventListener('mouseleave', handleLeave);
    return () => {
      chartCanvas.removeEventListener('mouseenter', handleEnter);
      chartCanvas.removeEventListener('mouseleave', handleLeave);
    };
  }, [chartRef.current]);


  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  const labels = chartData.map((item) => item.division);
  const dataValues = chartData.map((item) => item.count);
  const backgroundColors = [
    '#2563eb', // blue
    '#22c55e', // green
    '#eab308', // yellow
    '#a21caf', // purple
    '#ef4444', // red
    '#6366f1', // indigo
    '#ec4899', // pink
    '#6b7280', // gray
    '#f59e42', // orange
    '#14b8a6', // teal
  ];

  const chartDataObj = {
    labels,
    datasets: [
      {
        label: 'Division Count',
        data: dataValues,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: '#fff',
        borderWidth: 0,
        hoverOffset: 16,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percent}%)`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#0f172a',
        borderColor: '#2563eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
      datalabels: {
        display: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutBounce',
    },
    // Hide default segment value labels if present (Chart.js v4+)
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff',
        // Remove any default label rendering
        // Chart.js v4+ may use "labels" plugin for segment values
        // This disables it if present
        labels: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ background: '#e7d7f8ff' }} className="p-3 rounded-lg flex flex-col items-center">
      <div ref={chartRef} className="relative w-25 h-25 md:w-28 md:h-28 flex items-center justify-center mb-4">
        <Doughnut data={chartDataObj} options={options} />
        {!isHovering && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className="text-[10px] font-semibold text-gray-800">Total</span>
            <span className="font-bold text-base md:text-lg text-blue-800">{total}</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-1">
        {labels.map((label, idx) => (
          <div key={label} className="px-1.5 py-0.5 rounded text-[7px] font-medium" style={{background: backgroundColors[idx % backgroundColors.length], color: '#fff'}}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DivisionDonutChart;
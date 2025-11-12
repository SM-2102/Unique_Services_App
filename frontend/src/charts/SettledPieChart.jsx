// Settled vs Unsettled Pie Chart for Retail Data
import React, { useEffect, useState } from 'react';
import SpinnerLoading from '../components/SpinnerLoading';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SettledPieChart = ({ data, loading, error }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data?.retail?.settled_vs_unsettled_pie_chart) {
      setChartData(data.retail.settled_vs_unsettled_pie_chart);
    }
  }, [data]);

    if (loading) {
        return (
        <div>
            <SpinnerLoading text="Loading Retail Pie Chart ..." />
        </div>
        );
    } 
    if (error) return <div className="text-center py-4 text-red-500">Error loading settlement data</div>;

  const total = Object.values(chartData).reduce((sum, value) => sum + value, 0);
  const statusData = [
    {
      label: 'Not Received',
      value: chartData.not_received || 0,
      color: '#ef4444', // red
    },
    {
      label: 'Not Settled',
      value: chartData.received_not_settled || 0,
      color: '#4c08eaff', // blue
    },
    {
      label: 'Settled',
      value: chartData.settled || 0,
      color: '#22c55e', // green
    },
  ];

  const pieData = {
    labels: statusData.map((s) => s.label),
    datasets: [
      {
        data: statusData.map((s) => s.value),
        backgroundColor: statusData.map((s) => s.color),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 16,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#0f172a',
        borderColor: '#22c55e',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
      datalabels: {
        display: function(context) {
          // Only show label for the "Settled" part
          return context.dataIndex === 2 && total > 0 && context.dataset.data[2] > 0;
        },
        formatter: function(value, context) {
          // Show settled percentage only
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return percent > 0 ? percent + '%' : '';
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        align: 'center',
        anchor: 'center',
        backgroundColor: '#22c55e',
        borderRadius: 6,
        padding: 4,
        clip: true,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutBounce',
    },
  };

  return (
    <div className="bg-white p-3 rounded-lg flex flex-col items-center">
      {/* <h3 className="text-lg font-bold mb-4 text-gray-800 tracking-wide" style={{fontFamily: 'Montserrat, Poppins, sans-serif'}}>Settlement Status</h3> */}
      <div className="w-25 h-25 md:w-28 md:h-28">
        <Pie data={pieData} options={options} />
      </div>
    </div>
  );
};

export default SettledPieChart;
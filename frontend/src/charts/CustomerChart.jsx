// Chart for Customer Card

import React, { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SpinnerLoading from '../components/SpinnerLoading';
import { FaUsers } from 'react-icons/fa';


const stylishFont = {
  fontFamily: 'Poppins, Montserrat, "Segoe UI", Arial, sans-serif',
  letterSpacing: '0.03em',
};

const gradientTextStyle = {
  background: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 50%, #ffb347 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  fontSize: '3rem',
  lineHeight: 1.1,
  letterSpacing: '0.04em',
  transition: 'transform 0.2s',
};

const listEntryAnim = {
  animation: 'fadeInName 0.5s ease forwards',
  opacity: 0,
};



const CustomerChart = ({ data, loading, error }) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const [listVisible, setListVisible] = useState(false);
  const target = data?.customer?.number_of_customers || 0;
  // Convert top_customers object to array of { name, value }
  const topCustomersObj = data?.customer?.top_customers || {};
  const topCustomersArr = Object.entries(topCustomersObj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  // Only log once for debugging, not on every render
  // useEffect(() => { console.log("Customer List:", topCustomers); }, []);

  useEffect(() => {
    if (target > 0) {
      let start = 0;
      const duration = 1300; // ms
      const step = Math.ceil(target / (duration / 20));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(intervalRef.current);
        } else {
          setCount(start);
        }
      }, 20);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [target]);


  // Chart.js registration
  useEffect(() => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[120px]">
        <SpinnerLoading text="Loading Customer Data ..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-row items-center justify-left px-8 gap-2 py-5">
        <span className="text-xl md:text-3xl font-medium text-red-500" style={stylishFont}>
          Error loading data
        </span>
      </div>
    );
  }


  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {/* Icon and Main Metric */}
      <div className="flex flex-row items-center group transition-transform duration-200 hover:scale-105 ml-0" tabIndex={0}>
        <span
          style={gradientTextStyle}
          className="main-metric group-hover:scale-100 transition-transform duration-200 mt-2"
        >
          {count}+
        </span>
        <span
          className="text-xl md:text-3xl font-medium ml-3"
          style={{ ...stylishFont, color: '#3a7bd5', fontWeight: 600 }}
        >
          Customers
        </span>
      </div>


      {/* Vertical Bar Chart for Top Customers beside label */}
      {topCustomersArr.length > 0 && (
        <div className="w-full flex flex-row items-center justify-center ml-6">
          {/* Rotated label on the left */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 180, minWidth: 40, marginRight: 0 }}>
            <span
              className="text-base md:text-lg font-semibold"
              style={{
                ...stylishFont,
                background: 'linear-gradient(90deg, #ff416c 0%, #3a7bd5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.07rem',
                transform: 'rotate(-90deg)',
                display: 'inline-block',
                fontSize: '1rem',
                fontWeight: 700,
                textShadow: '0 2px 12px rgba(255, 65, 108, 0.10)',
                whiteSpace: 'nowrap',
                borderBottom: '2.5px solid #ff416c',
              }}
            >
              Top Customers
            </span>
          </div>
          {/* Vertical Bar Chart */}
          <div style={{ width: 750, height: 150, background: 'rgba(255,255,255,0.95)', borderRadius: 16}}>
            <Bar
              data={{
                labels: topCustomersArr.map((c) => c.name),
                datasets: [
                  {
                    label: 'Count',
                    data: topCustomersArr.map((c) => c.value),
                    backgroundColor: [
                      'rgba(255,65,108,0.85)',
                      'rgba(58,123,213,0.85)',
                      'rgba(255,196,0,0.85)',
                      'rgba(0,210,255,0.85)',
                      'rgba(255,75,43,0.85)'
                    ],
                    borderRadius: 10,
                    borderSkipped: false,
                    maxBarThickness: 70,
                  },
                ],
              }}
              options={{
                indexAxis: 'y', // vertical bars
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 1200,
                  easing: 'easeOutQuart',
                  delay: (context) => context.dataIndex * 180,
                },
                plugins: {
                  legend: { display: false },
                  datalabels: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: (ctx) => `${ctx.parsed.x} Records`,
                    },
                    backgroundColor: 'rgba(246, 250, 255, 0.95)',
                    titleColor: '#021bacff',
                    bodyColor: '#203cdbff',
                    borderColor: '#0e095fff',
                    borderWidth: 1,
                    padding: 12,
                    caretSize: 8,
                  },
                },
                scales: {
                  x: {
                    display: false, // Hide x axis labels
                    grid: { display: false, drawBorder: false },
                  },
                  y: {
                    display: true,
                    grid: { display: false, drawBorder: true },
                    ticks: {
                      color: '#3a7bd5',
                      font: { size: 10, weight: 'bold', family: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif' },
                      padding: 8,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Keyframes for fade-in names */}
      <style>{`
        .main-metric { text-shadow: 0 2px 12px rgba(255, 65, 108, 0.10); }
        .group:hover .main-metric { transform: scale(1.08); }
        canvas { border-radius: 16px; }
      `}</style>
    </div>
  );
};

export default CustomerChart;

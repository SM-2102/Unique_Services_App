// Chart for Customer Card

import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register Chart.js elements at the top-level (best practice)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

const stylishFont = {
  fontFamily: 'Poppins, Montserrat, "Segoe UI", Arial, sans-serif',
  letterSpacing: "0.03em",
};

const gradientTextStyle = {
  background: "linear-gradient(90deg, #ff416c 0%, #ff4b2b 50%, #ffb347 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 800,
  fontSize: "3rem",
  lineHeight: 1.1,
  letterSpacing: "0.04em",
  transition: "transform 0.2s",
};

const listEntryAnim = {
  animation: "fadeInName 0.5s ease forwards",
  opacity: 0,
};

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

const CustomerChart = ({ data }) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const target = data?.customer?.number_of_customers || 0;
  // Convert top_customers object to array of { name, value }
  const topCustomersObj = data?.customer?.top_customers || {};
  const topCustomersArr = Object.entries(topCustomersObj)
    .map(([name, value]) => ({ name: toTitleCase(name), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  useEffect(() => {
    if (target > 0) {
      let start = 0;
      const duration = 500; // ms
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

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div
        className="flex flex-row flex-wrap items-end group transition-transform duration-200 hover:scale-105 ml-0 w-full max-w-[700px] px-2"
        style={{ minWidth: 0 }}
        tabIndex={0}
      >
        <span
          style={{
            ...gradientTextStyle,
            fontSize: "2.5rem",
            minWidth: 0,
            wordBreak: "break-word",
            flexShrink: 1,
          }}
          className="main-metric group-hover:scale-100 transition-transform duration-200"
        >
          {count}+
        </span>
        <span
          className="text-xl md:text-3xl font-medium ml-3 truncate"
          style={{
            ...stylishFont,
            color: "#3a7bd5",
            fontWeight: 600,
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          Customers
        </span>
      </div>

      {/* Vertical Bar Chart for Top Customers beside label */}
      {topCustomersArr.length > 0 && (
        <div className="w-full flex flex-col items-center justify-center">
          <div
            style={{
              width: "100%",
              minWidth: 0,
              maxWidth: "100%",
              height: 170,
              background: "#ffe4ec",
              borderRadius: 16,
              overflow: "hidden",
              display: "block",
              position: "relative",
              margin: 0,
              padding: 0,
              boxSizing: "border-box",
            }}
          >
            {/* Watermark background */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "140%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0.4,
                fontSize: "2.8rem",
                fontWeight: 900,
                fontFamily: "Poppins, Montserrat, Segoe UI, Arial, sans-serif",
                color: "#3a7bd5",
                textAlign: "center",
                userSelect: "none",
                whiteSpace: "pre-line",
                textShadow: "0 2px 12px #ff416c, 0 0 2px #fff",
                background: "none",
                transform: "translate(-50%, -50%) rotate(-24deg)",
              }}
            >
              Top Customers
            </div>
            <div
              style={{
                width: "100%",
                height: "100%",
                minWidth: 0,
                position: "relative",
                zIndex: 2,
                margin: 0,
                padding: 0,
                overflow: "hidden",
              }}
            >
              <Bar
                data={{
                  labels: topCustomersArr.map((c) => c.name),
                  datasets: [
                    {
                      label: "Count",
                      data: topCustomersArr.map((c) => c.value),
                      backgroundColor: [
                        "rgba(255,65,108,0.85)",
                        "rgba(58,123,213,0.85)",
                        "rgba(255,196,0,0.85)",
                        "rgba(0,210,255,0.85)",
                        "rgba(255,75,43,0.85)",
                      ],
                      borderRadius: 9,
                      borderSkipped: false,
                      maxBarThickness: 40,
                    },
                  ],
                }}
                options={{
                  indexAxis: "y", // vertical bars
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 1200,
                    easing: "easeOutQuart",
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
                      backgroundColor: "rgba(246, 250, 255, 0.95)",
                      titleColor: "#021bacff",
                      bodyColor: "#203cdbff",
                      borderColor: "#0e095fff",
                      borderWidth: 1,
                      padding: 8,
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
                      grid: { display: false, drawBorder: false },
                      ticks: {
                        color: "#01010aff",
                        font: {
                          size: 11,
                          weight: "bold",
                          family:
                            "Poppins, Montserrat, Segoe UI, Arial, sans-serif",
                        },
                      },
                      afterFit: (axis) => {
                        axis.width += 20; // Shift y-axis labels 20px to the right
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Keyframes for fade-in names */}
      <style>{`
        .main-metric { text-shadow: 0 2px 12px rgba(255, 65, 108, 0.10); }
        .group:hover .main-metric { transform: scale(1.08); }
        canvas { border-radius: 16px; }
        @media (max-width: 600px) {
          .main-metric { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
};

export default CustomerChart;

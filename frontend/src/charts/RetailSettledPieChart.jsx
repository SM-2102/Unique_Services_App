// Settled vs Unsettled Pie Chart for Retail Data
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const RetailSettledPieChart = ({ data }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data?.retail?.settled_vs_unsettled_pie_chart) {
      setChartData(data.retail.settled_vs_unsettled_pie_chart);
    }
  }, [data]);

  const total = Object.values(chartData).reduce((sum, value) => sum + value, 0);
  const statusData = [
    {
      label: "Not Received",
      value: chartData.not_received || 0,
      color: "#ef4444", // red
    },
    {
      label: "Not Settled",
      value: chartData.received_not_settled || 0,
      color: "#4c08eaff", // blue
    },
    {
      label: "Settled",
      value: chartData.settled || 0,
      color: "#22c55e", // green
    },
  ];

  const pieData = {
    labels: statusData.map((s) => s.label),
    datasets: [
      {
        data: statusData.map((s) => s.value),
        backgroundColor: statusData.map((s) => s.color),
        borderColor: "#fff",
        borderWidth: 0,
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
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          },
        },
        backgroundColor: "#fff",
        titleColor: "#0f172a",
        bodyColor: "#0f172a",
        borderColor: "#22c55e",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
      datalabels: {
        display: function (context) {
          // Only show label for the "Settled" part
          return (
            context.dataIndex === 2 && total > 0 && context.dataset.data[2] > 0
          );
        },
        formatter: function (value, context) {
          // Show settled percentage only
          const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return percent > 0 ? percent + "%" : "";
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        align: "center",
        anchor: "center",
        backgroundColor: "#22c55e",
        borderRadius: 6,
        padding: 4,
        clip: true,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: "easeOutBounce",
    },
  };

  return (
    <div
      style={{ background: "#e7d7f8ff" }}
      className="p-3 rounded-lg flex flex-col items-center w-full h-full min-h-0 min-w-0 overflow-hidden"
    >
      <div
        className="relative w-full aspect-square max-w-full flex items-center justify-center overflow-hidden"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        <Pie
          data={pieData}
          options={options}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default RetailSettledPieChart;

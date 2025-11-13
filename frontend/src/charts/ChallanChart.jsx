// Chart for Challan Card
import React, { useEffect, useRef, useState } from 'react';
import SpinnerLoading from '../components/SpinnerLoading';

const stylishFont = {
  fontFamily: 'Poppins, Montserrat, "Segoe UI", Arial, sans-serif',
  letterSpacing: '0.03em',
};

const ChallanChart = ({ data, loading, error }) => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const target = data?.challan?.number_of_challans || 0;
  const itemsCount = data?.challan?.number_of_items || 0;

  useEffect(() => {
    if (target > 0) {
      let start = 0;
      const duration = 1300; // ms
      const step = Math.ceil(target / (duration / 20));
      
      // Clear previous interval if it exists
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

  if (loading) {
    return (
      <div>
        <SpinnerLoading text="Loading Challan Data ..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-left justify-center px-2 py-0">
        <span className="text-xl md:text-3xl font-medium text-red-500 py-2" style={stylishFont}>
          Error loading data
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-left justify-center px-2 py-0">
      <span
        className="text-xl md:text-4xl font-semibold text-green-800 py-2"
        style={stylishFont}
      >
        {count}+
        <span className="ml-1 text-xl md:text-3xl font-medium text-green-700" style={stylishFont}>Challan Records</span>
      </span>
      <span
        className="text-xl md:text-xl font-medium mt-1 px-9"
        style={{...stylishFont, color: '#0960ecff'}}
      >
        {itemsCount}+ Items Dispatched
      </span>
    </div>
  );
};

export default ChallanChart;

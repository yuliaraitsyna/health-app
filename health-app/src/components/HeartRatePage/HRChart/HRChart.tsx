import React, { useRef } from "react";
import { HeartData } from "../../HeartData/HeartData";

const HRChart: React.FC<{ data: HeartData[] }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={chartRef} id="heartRateChart"></canvas>;
};

export { HRChart };

import React, { useEffect, useRef } from "react";
import { HeartData } from "../../HeartData/HeartData";
import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";

Chart.register(...registerables);

const HRChart: React.FC<{ data: HeartData[] }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = data.map((item) => item.startDate.toLocaleDateString());
    const values = data.map((item) => item.value);

    const chartData: ChartData<"line"> = {
        labels: labels,
        datasets: [
          {
            label: "Heart Rate",
            data: values,
          },
        ],
    };

    const config: ChartConfiguration = {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Heart rate statistics'
            }
          }
        },
    };

    chartInstanceRef.current = new Chart(chartRef.current, config);
  }, [data]);

  return <canvas ref={chartRef} id="heartRateChart"></canvas>;
};

export { HRChart };

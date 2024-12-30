import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { StressData } from "../../../HeartData/HeartData";
import { useEffect, useRef } from "react";

import styles from '../Chart.module.css'

Chart.register(...registerables);

const StressChart: React.FC<{data: StressData[]}> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        console.log(data)
        if(!chartRef.current) return;

        if(chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const labels = data.map((item) => item.startDate.toLocaleDateString());
        const values = data.map((item) => item.deviation ? item.deviation : 0);

        const chartData: ChartData<"bar"> = {
            labels: labels,
            datasets: [
                {
                    label: "Stress deviation rate",
                    data: values,
                    backgroundColor: '#b290ff',
                },
            ],
        };

        const config: ChartConfiguration = {
            type: "bar",
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Stress deviation statistics'
                    },
                },
            },
        };

        chartInstanceRef.current =  new Chart(chartRef.current, config);

    }, [data]);

    return <canvas ref={chartRef} id="heartRateChart" className={styles['chart']}></canvas>
}

export { StressChart }
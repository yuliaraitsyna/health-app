import { Chart, ChartConfiguration, ChartData, registerables } from "chart.js";
import { StressData } from "../../../HeartData/HeartData";
import { useEffect, useRef } from "react";

import styles from '../Chart.module.css'

Chart.register(...registerables);

const StressChart: React.FC<{data: StressData[]}> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
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

    return <canvas ref={chartRef} id="stressChart" className={styles['chart']}></canvas>
}

const StressStateChart: React.FC<{data: StressData[]}> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if(!chartRef.current) return;

        if(chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const labels = ['Bad', 'Warning', 'Normal', 'Good', 'Perfect'];
        const stateCounts = labels.map((label) =>
            data.filter((item) => item.stressState === label).length
        );

        const colors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
        ];

        const chartData: ChartData<"bar"> = {
            labels: labels,
            datasets: [
                {
                    label: "Stress state",
                    data: stateCounts,
                    backgroundColor: colors,
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
                        text: 'Stress state statistics'
                    },
                },
            },
        };

        chartInstanceRef.current =  new Chart(chartRef.current, config);

    }, [data]);

    return <canvas ref={chartRef} id="stressStateChart" className={styles['chart']}></canvas>
}

export { StressChart, StressStateChart }
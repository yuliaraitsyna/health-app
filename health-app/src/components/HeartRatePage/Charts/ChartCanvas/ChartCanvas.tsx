import { useEffect, useRef } from "react"
import { Chart, ChartConfiguration, registerables } from "chart.js"

import styles from '../Chart.module.css'
import { ChartDataType, ChartVariant } from "./types/types"

Chart.register(...registerables)

interface ChartProps {
    data: ChartDataType,
    chartVariant: ChartVariant,
    chartType: "line" | "bar",
    colors?: string | string[]
}

const ChartCanvas: React.FC<ChartProps> = ({ data, chartVariant, chartType, colors }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        let labels;
        let values;

        switch (chartVariant) {
            case (ChartVariant.HEART_CHART):
                labels = data.map((item) => item.startDate.toLocaleDateString());
                values = data.map((item) => item.value);
                break;
            case (ChartVariant.STRESS_LEVELS_CHART):
                labels = ['Bad', 'Warning', 'Normal', 'Good', 'Perfect'];

                values = labels.map((label) =>
                    data.filter((item) => {
                        if ("stressState" in item) {
                            return item.stressState === label;
                        } else {
                            throw new Error("invalid data type for chart");
                        }
                    }).length
                );           

                break;
            case (ChartVariant.STRESS_DEVIATION_CHART):
                labels = data.map((item) => item.startDate.toLocaleDateString());
                values = data.map((item) => {
                    if('deviation' in item) {
                        return item.deviation ? item.deviation : 0
                    }
                    else {
                        throw new Error('invalid data type for chart')
                    }
                });
                break;
            default:
                throw new TypeError("invalid chart variant type")
        };

        if(!labels || !values) {
            console.log(labels, values)
            throw new Error('labels or values are undefined')
        }

        const config: ChartConfiguration = {
            type: chartType,
            data: {
                labels: labels,
                datasets: [
                    {
                        label: chartVariant.toString(),
                        data: values,
                        backgroundColor: colors
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: chartVariant.toString()
                    },
                },
            },
        };

        chartInstanceRef.current = new Chart(chartRef.current, config);
    }, [chartType, chartVariant, colors, data]);

    return <canvas ref={chartRef} className={styles['chart']}></canvas>
}

export { ChartCanvas }
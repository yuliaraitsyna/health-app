import { HeartData, StressData } from "../../../../HeartData/HeartData";

export enum ChartVariant {
    HEART_CHART = 'Heart rate',
    STRESS_LEVELS_CHART = 'Stress levels',
    STRESS_DEVIATION_CHART = 'Stress deviation'
};

export type ChartDataType = StressData[] | HeartData[];
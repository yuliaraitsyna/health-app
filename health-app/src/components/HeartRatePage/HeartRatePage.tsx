import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { HeartData, StaminaData, StressData } from "../HeartData/HeartData";
import { DatePickerComponent } from "../DatePicker/DatePicker";
import { Period } from "../DatePicker/Period";
import { AvgHeartRate } from "./AvgHeartRate/AvgHeartRate";
import { StaminaRate } from "./StaminaRate/StaminaRate";
import { ChartCanvas } from "./Charts/ChartCanvas/ChartCanvas";
import { ChartVariant } from "./Charts/ChartCanvas/types/types";

import styles from './HeartRatePage.module.css'

const LOCAL_STORAGE_KEY = "selectedPeriod";

enum FetchType {
    HEART = '/heart_rate',
    STRESS = '/heart_rate/stress',
    STAMINA = '/heart_rate/stamina'
}

const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(255, 205, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
];

const HeartRatePage = () => {
    const [heartData, setHeartData] = useState<HeartData[]>([]);
    const [stressData, setStressData] = useState<StressData[]>([]);
    const [avgHR, setAvgHR] = useState<number>(0);
    const deferredValue = useDeferredValue(heartData);
    const deferredStressData = useDeferredValue(stressData);
    const [period, setPeriod] = useState<Period>({ startDate: null, endDate: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [staminaData, setStaminaData] = useState<StaminaData | null>(null)

    useEffect(() => {
        const storedPeriod = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedPeriod) {
            const parsedPeriod = JSON.parse(storedPeriod);
            const start = parsedPeriod.startDate ? new Date(parsedPeriod.startDate) : null;
            const end = parsedPeriod.endDate ? new Date(parsedPeriod.endDate) : null;
            setPeriod({ startDate: start, endDate: end });
        } else {
            fetchData(FetchType.HEART);
            fetchData(FetchType.STRESS);
        }

        fetchData(FetchType.STAMINA);
    }, []);

    useEffect(() => {
        if (period.startDate && period.endDate) {
            fetchData(FetchType.STRESS, period.startDate, period.endDate);
            fetchData(FetchType.HEART, period.startDate, period.endDate);
        }
    }, [period]);

    const handleDateSent = useCallback((date: Period) => {
        setPeriod(date);
    }, []);

    const fetchData = async (fetchType: FetchType, startDate?: Date | null, endDate?: Date | null) => {
        try {
            let url: string = `http://localhost:8000${fetchType}`;

            if (startDate && endDate) {
                const start = startDate.toISOString();
                const end = endDate.toISOString();
                url += `?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
              });

            if (!response.ok) {
                setErrorMessage(`Failed to fetch ${fetchType} data. Please, try again.`);
                throw new Error(`Failed to fetch ${fetchType} data`);
            }

            const data = await response.json();

            if (fetchType === FetchType.HEART) {
                if (data && Array.isArray(data.heart_data)) {
                    const formattedData: HeartData[] = data.heart_data.map(
                        (item: HeartData, index: number) => ({
                            startDate: new Date(item.startDate),
                            endDate: new Date(item.endDate),
                            value: item.value,
                            deviation: data.stress_data ? data.stress_data[index]?.deviation || 0 : 0,
                        })
                    );
                    setHeartData(formattedData);
                }
                if (data.avg_heart_rate) {
                    setAvgHR(Math.round(data.avg_heart_rate));
                }
            } else if (fetchType === FetchType.STRESS) {
                if (data && Array.isArray(data.stress_data)) {
                    const formattedStressData: StressData[] = data.stress_data.map((item: StressData) => ({
                        startDate: new Date(item.startDate),
                        value: item.value,
                        deviation: item.deviation,
                        stressState: item.stressState,
                    }));
                    setStressData(formattedStressData);
                }
            } else if (fetchType === FetchType.STAMINA) {
                if (data && Array.isArray(data.physical_stamina)) {
                    const formattedData: StaminaData = {
                        value: data.physical_stamina[0],
                        state: data.physical_stamina[1]
                    };
                    setStaminaData(formattedData);
                }
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching data. Please, try again.");
            console.error(`Error fetching ${fetchType} data:`, error);
        }
    };

    return (
        <div className={styles['page']}>
            <Typography variant="h3" m={"10px"}>Heart rate data</Typography>
            <AvgHeartRate heartRate={avgHR}></AvgHeartRate>
            <StaminaRate value={staminaData?.value} state={staminaData?.state}></StaminaRate>
            {errorMessage ? <Typography variant="body1" color="red">{errorMessage}</Typography> : null}
            <DatePickerComponent onDateSent={handleDateSent} initialPeriod={period} />
            <ChartCanvas data={deferredValue} chartType="line" chartVariant={ChartVariant.HEART_CHART}/>
            <ChartCanvas data={deferredStressData} chartType="bar" chartVariant={ChartVariant.STRESS_LEVELS_CHART} colors={colors}/>
            <ChartCanvas data={deferredStressData} chartType="bar" chartVariant={ChartVariant.STRESS_DEVIATION_CHART}/>
        </div>
    );
};

export { HeartRatePage };

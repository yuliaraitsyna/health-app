import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { HRChart } from "./Charts/HRChart/HRChart";
import { HeartData, StressData } from "../HeartData/HeartData";
import { DatePickerComponent } from "../DatePicker/DatePicker";
import { Period } from "../DatePicker/Period";
import { AvgHeartRate } from "./AvgHeartRate/AvgHeartRate";

import styles from './HeartRatePage.module.css'
import { StressChart } from "./Charts/StressChart/StressChart";

const LOCAL_STORAGE_KEY = "selectedPeriod";

enum FetchType {
    HEART = '/heart_rate',
    STRESS = '/heart_rate/stress'
}

const HeartRatePage = () => {
    const [heartData, setHeartData] = useState<HeartData[]>([]);
    const [stressData, setStressData] = useState<StressData[]>([]);
    const [avgHR, setAvgHR] = useState<number>(0);
    const deferredValue = useDeferredValue(heartData);
    const deferredStressData = useDeferredValue(stressData);
    const [period, setPeriod] = useState<Period>({ startDate: null, endDate: null });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            let url: string = `http://192.168.0.161:8000${fetchType}`;

            if (startDate && endDate) {
                const start = startDate.toISOString();
                const end = endDate.toISOString();
                url += `?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
            }

            const response = await fetch(url);
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
            {errorMessage ? <Typography variant="body1" color="red">{errorMessage}</Typography> : null}
            <DatePickerComponent onDateSent={handleDateSent} initialPeriod={period} />
            <HRChart data={deferredValue} />
            <StressChart data={deferredStressData}/>
        </div>
    );
};

export { HeartRatePage };

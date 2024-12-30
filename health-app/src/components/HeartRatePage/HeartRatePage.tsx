import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { HRChart } from "./HRChart/HRChart";
import { HeartData } from "../HeartData/HeartData";
import { DatePickerComponent } from "../DatePicker/DatePicker";
import { Period } from "../DatePicker/Period";

const LOCAL_STORAGE_KEY = "selectedPeriod";

interface HeartDataItem {
    start_date: string;
    end_date: string;
    value: number;
}

const HeartRatePage = () => {
    const [heartData, setHeartData] = useState<HeartData[]>([]);
    const deferredValue = useDeferredValue(heartData);
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
            fetchHeartData();
        }
    }, []);

    useEffect(() => {
        if (period.startDate && period.endDate) {
            fetchHeartData(period.startDate, period.endDate);
        }
    }, [period]);

    const handleDateSent = useCallback((date: Period) => {
        setPeriod(date);
    }, []);

    const fetchHeartData = async (startDate?: Date | null, endDate?: Date | null) => {
        try {
            let url = "http://192.168.0.161:8000/heart_rate";

            if (startDate && endDate) {
                const start = startDate.toISOString();
                const end = endDate.toISOString();
                url += `?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                setErrorMessage("Response was not ok. Please, try again.");
                throw new Error("Failed to fetch heart data");
            }

            const data = await response.json();

            if (data && Array.isArray(data.heart_data)) {
                const formattedData: HeartData[] = data.heart_data.map((item: HeartDataItem) => ({
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    value: item.value,
                }));

                setHeartData(formattedData);
            } else {
                setErrorMessage("Something went wrong. Please, try again.");
                console.error("Heart data is not in the expected format");
            }
        } catch (error) {
            setErrorMessage("Error fetching heart data. Please, try again.");
            console.error("Error fetching heart data:", error);
        }
    };

    return (
        <>
            <Typography variant="h3">Heart rate data</Typography>
            {errorMessage ? <Typography variant="body1" color="red">{errorMessage}</Typography> : null}
            <DatePickerComponent onDateSent={handleDateSent} initialPeriod={period} />
            <HRChart data={deferredValue} />
        </>
    );
};

export { HeartRatePage };

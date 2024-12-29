import { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { HRChart } from "./HRChart/HRChart";
import { HeartData } from "../HeartData/HeartData";
import { DatePickerComponent } from "../DatePicker/DatePicker";
import { Period } from "../DatePicker/Period";

const HeartRatePage = () => {
    const [heartData, setHeartData] = useState<HeartData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [period, setPeriod] = useState<Period | null>(null);

    useEffect(() => {
        if (period) {
            fetchHeartData(period.startDate, period.endDate);
        } else {
            fetchHeartData();
        }
    }, [period]);

    const handleDateChoice = (date: Period) => {
        setPeriod(date);
    }

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
                throw new Error("Failed to fetch heart data");
            }

            const data = await response.json();

            if (data && Array.isArray(data.heart_data)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedData: HeartData[] = data.heart_data.map((item: any) => ({
                    startDate: new Date(item.start_date),
                    endDate: new Date(item.end_date),
                    value: item.value,
                }));

                setHeartData(formattedData);

            } else {
                console.error("Heart data is not in the expected format");
            }

        } catch (error) {
            console.error("Error fetching heart data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Typography variant="h3">Heart rate data</Typography>
            <DatePickerComponent onDateSent={handleDateChoice}></DatePickerComponent>
            {loading ? <CircularProgress /> : <HRChart data={heartData} />}
        </>
    );
};

export { HeartRatePage };

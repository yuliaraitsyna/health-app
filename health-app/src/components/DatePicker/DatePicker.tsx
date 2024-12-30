import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { Period } from "./Period";

import styles from './DatePicker.module.css'

interface DatePickerComponentProps {
  onDateSent: (date: Period) => void;
  initialPeriod: Period;
}

const LOCAL_STORAGE_KEY = "selectedPeriod";

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateSent, initialPeriod }) => {
  const [startDate, setStartDate] = useState<Date | null>(initialPeriod.startDate);
  const [endDate, setEndDate] = useState<Date | null>(initialPeriod.endDate);

  useEffect(() => {
    setStartDate(initialPeriod.startDate);
    setEndDate(initialPeriod.endDate);
  }, [initialPeriod]);
  
  useEffect(() => {
    if (startDate && endDate) {
      const period: Period = { startDate, endDate };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(period));
      onDateSent(period);
    }
  }, [startDate, endDate, onDateSent]);

  return (
    <div className={styles['date-pickers']}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                className={styles['date-picker']}
            />
            <DatePicker
                label="End Date"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                className={styles['date-picker']}
            />
        </LocalizationProvider>
    </div>
  );
};

export { DatePickerComponent };

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { Period } from "./Period";

interface DatePickerComponentProps {
  onDateSent: (date: Period) => void;
  initialPeriod: Period;
}

const LOCAL_STORAGE_KEY = "selectedPeriod";

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateSent, initialPeriod }) => {
  const [startDate, setStartDate] = useState<Date | null>(initialPeriod.startDate);
  const [endDate, setEndDate] = useState<Date | null>(initialPeriod.endDate);

  useEffect(() => {
    if (startDate && endDate) {
      const period: Period = { startDate, endDate };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(period));
      onDateSent(period);
    }
  }, [startDate, endDate, onDateSent]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Start Date"
        value={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <DatePicker
        label="End Date"
        value={endDate}
        onChange={(date) => setEndDate(date)}
      />
    </LocalizationProvider>
  );
};

export { DatePickerComponent };

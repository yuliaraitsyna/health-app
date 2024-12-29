import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import { Period } from './Period';

interface DatePickerComponentProps {
  onDateSent: (date: Period) => void;
}

const LOCAL_STORAGE_KEY = 'selectedPeriod';

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ onDateSent }) => {
  const [period, setPeriod] = useState<Period>({ startDate: null, endDate: null });

  useEffect(() => {
    const storedPeriod = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedPeriod) {
      const parsedPeriod = JSON.parse(storedPeriod);
      setPeriod({ startDate: new Date(parsedPeriod.startDate), endDate: new Date(parsedPeriod.endDate)});
    }
  }, []);

  useEffect(() => {
    if (period.startDate && period.endDate) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(period));
    }
  }, [period]);

  const handleDateChoice = (date: Date | null, isStart: boolean) => {
    if (isStart) {
      setPeriod((prev) => ({ ...prev, startDate: date }));
    } else {
      setPeriod((prev) => ({ ...prev, endDate: date }));
    }

    if (period) {
        onDateSent(period);
      }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Start Date"
        value={period.startDate}
        onChange={(date) => handleDateChoice(date, true)}
      />
      <DatePicker
        label="End Date"
        value={period.endDate}
        onChange={(date) => handleDateChoice(date, false)}
      />
    </LocalizationProvider>
  );
};

export { DatePickerComponent };

from heart_rate import calculate_recovery, calculate_stress_level, filter_heart_data_by_period
from heart_rate import calclulate_avg_heart_rate
from data_reader import get_heart_data, get_hr_1min, get_hr_max, get_rhr_baseline, get_rhr_current, parse_data, get_hrv
from datetime import datetime, timedelta, timezone
import pandas as pd

# utc_plus_3 = timezone(timedelta(hours=3))

# start_date = datetime(2024, 1, 6, tzinfo=utc_plus_3)
# end_date = datetime(2024, 1, 7, tzinfo=utc_plus_3)

# filtered_heart_data = filter_heart_data_by_period(start_date, end_date, heart_data)

# print(filtered_heart_data)

# print(calclulate_avg_heart_rate(heart_data))

# rhr = 70  # Resting heart rate (example)


# rhr = calclulate_avg_heart_rate(heart_data)
# stress_data = calculate_stress_level(heart_data, rhr)

# print(stress_data)

# hrv = get_hrv(health_data)

# print("Heart Rate Variability (HRV):", hrv)

# rhr_current = get_rhr_current(heart_data)
# rhr_baseline = get_rhr_baseline(heart_data)
# age = 20  # Example age
# hr_max = get_hr_max(age)
# hr_1min = get_hr_1min(heart_data)

# print("Resting Heart Rate (Current):", rhr_current)
# print("Resting Heart Rate (Baseline):", rhr_baseline)
# print("Max Heart Rate (HR Max):", hr_max)
# print("Heart Rate 1 Minute After Exertion (HR 1min):", hr_1min)

# print(calculate_recovery(hrv, rhr_current, rhr_baseline, hr_max, hr_1min, age))
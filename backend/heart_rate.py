from datetime import datetime
import pandas as pd

from backend.data_reader import get_heart_data, get_hr_1min, get_hr_max, get_hrv, get_rhr_baseline, get_rhr_current

def filter_heart_data_by_period(start_date: datetime, end_date: datetime, rates):
    df = pd.DataFrame(rates)
    return df[(df['start_date'] >= start_date) & (df['end_date'] <= end_date)]

def calclulate_avg_heart_rate(rates):
    return rates['value'].astype(float).mean()

def determine_stress_state(score):
    if score > 80:
        return "Bad"
    elif 60 < score <= 80:
        return "Warning"
    elif 40 < score <= 60:
        return "Normal"
    elif 20 < score <= 40:
        return "Good"
    else:
        return "Perfect"

def calculate_stress_level(df, rhr):
    if 'value' not in df.columns:
        raise ValueError("Missing 'value' column in the input data.")
    
    df['value'] = df['value'].astype(float)
    
    df['deviation'] = (abs(df['value'] - rhr) / rhr) * 100
    df['stress_state'] = df['deviation'].apply(determine_stress_state)
    return df

def get_hrv_age_norm(age):
    if age < 18:
        raise ValueError("Age must be 18 or older.")
    elif 18 <= age <= 25:
        return 45
    elif 26 <= age <= 35:
        return 42
    elif 36 <= age <= 45:
        return 40
    elif 46 <= age <= 55:
        return 38
    elif 56 <= age <= 65:
        return 35
    else:
        return 30
    
def calculate_physical_stamina(health_data, age=20):
    try:
        heart_data = get_heart_data(health_data)
        
        hrv = get_hrv(health_data)
        hrv_norm = get_hrv_age_norm(age)
        rhr_current = get_rhr_current(heart_data)
        rhr_baseline = get_rhr_baseline(heart_data)
        hr_max = get_hr_max(age)
        hr_1min = get_hr_1min(heart_data)

        if not (hrv and hrv_norm and rhr_baseline and hr_1min):
            return None, "Invalid health data"

        hrv_weight = 0.5
        rhr_deviation_weight = 0.2
        hr_diff_weight = 0.25
        age_weight = 0.15

        hrv_ratio = hrv / hrv_norm
        rhr_deviation = (float(rhr_current) - rhr_baseline) / rhr_baseline
        hr_diff_ratio = (hr_max - hr_1min) / hr_1min
        age_factor = age / 100

        recovery_score = (
            hrv_weight * hrv_ratio
            - rhr_deviation_weight * rhr_deviation
            - hr_diff_weight * hr_diff_ratio
            + age_weight * age_factor
        ) * 100

        if recovery_score > 80:
            return round(recovery_score, 2), "Perfect"
        elif 60 <= recovery_score <= 80:
            return round(recovery_score, 2), "Good"
        elif 40 <= recovery_score < 60:
            return round(recovery_score, 2), "Normal"
        elif 20 <= recovery_score < 40:
            return round(recovery_score, 2), "Warning"
        else:
            return round(recovery_score, 2), "Bad"

    except Exception as e:
        return None, f"Error: {e}"

from datetime import datetime
import pandas as pd

from backend.data_reader import get_heart_data, get_hr_1min, get_hr_max, get_hrv, get_rhr_baseline, get_rhr_current

def filter_data_by_period(start_date: datetime, end_date: datetime, rates):
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

def calculate_stress_level(health_data, age=20):
    heart_data = get_heart_data(health_data)
    
    hrv_data = get_hrv(health_data)
    print(hrv_data)
    hrv_norm = get_hrv_age_norm(age)
    print(hrv_norm)
    rhr = get_rhr_baseline(heart_data)
    print(rhr)
    
    if 'value' not in heart_data.columns:
        raise ValueError("Missing 'value' column in the input data.")
    
    heart_data['value'] = heart_data['value'].astype(float)

    hrv_deviation = (hrv_data / hrv_norm) * 100
    
    heart_data['deviation'] = (abs(heart_data['value'] - rhr) / rhr) * 100
    heart_data['stress_state'] = heart_data['deviation'].apply(determine_stress_state)
    
    combined_stress = heart_data['deviation'] * 0.5 + hrv_deviation * 0.5
    combined_stress_level = combined_stress.apply(determine_stress_state)
    
    heart_data['combined_stress'] = combined_stress
    heart_data['combined_stress_state'] = combined_stress_level

    return heart_data

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

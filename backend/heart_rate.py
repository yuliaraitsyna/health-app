from datetime import datetime
import pandas as pd

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

def calculate_recovery(hrv, rhr_current, rhr_baseline, hr_max, hr_1min, age):
    hrv_weight = 0.7
    rhr_deviation_weight = 0.1
    hr_diff_weight = 0.2
    age_weight = 0.05

    if hr_max is None:
        hr_max = 220 - age

    deviation = rhr_current - rhr_baseline

    recovery_score = (
        hrv_weight * hrv
        - rhr_deviation_weight * deviation
        - hr_diff_weight * (hr_max - hr_1min)
        + age_weight * age
    )
    
    if recovery_score > 80:
        return "Perfect"
    elif 60 <= recovery_score <= 80:
        return "Good"
    elif 40 <= recovery_score < 60:
        return "Normal"
    elif 20 <= recovery_score < 40:
        return "Warning"
    else:
        return "Bad"

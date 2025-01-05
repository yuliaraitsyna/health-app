from datetime import datetime
import xml.etree.ElementTree as ET
import pandas as pd

def parse_data(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    data = []

    for record in root.findall('Record'):
        record_type = record.get('type')
        start_date = record.get('startDate')
        end_date = record.get('endDate')
        value = record.get('value')

        if record_type in ('HKQuantityTypeIdentifierHeartRate', 
                           'HKQuantityTypeIdentifierHeartRateVariabilitySDNN'):
            try:
                start_date = datetime.strptime(start_date, '%Y-%m-%d %H:%M:%S %z')
                end_date = datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S %z')
            except ValueError as e:
                raise ValueError(f"Date parsing error: {e}")

            data.append({
                'type': record_type,
                'start_date': start_date,
                'end_date': end_date,
                'value': float(value) if value is not None else None
            })

    df = pd.DataFrame(data)
    return df

def get_heart_data(data):
    df = pd.DataFrame(data)

    df['start_date'] = pd.to_datetime(df['start_date'])
    df['end_date'] = pd.to_datetime(df['start_date'])

    heart_data = df[df['type'] == 'HKQuantityTypeIdentifierHeartRate']
    return heart_data

def get_hrv(data):
    df = pd.DataFrame(data)

    hrv_data = df[df['type'] == 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN']

    if hrv_data.empty:
        return None
    
    return hrv_data['value'].astype(float).mean()

def get_rhr_current(heart_data):
    if heart_data.empty:
        return None
    latest_heart_rate = heart_data.iloc[-1]
    return latest_heart_rate['value']

def get_rhr_baseline(heart_data):
    if heart_data.empty:
        return None

    heart_data['value'] = pd.to_numeric(heart_data['value'], errors='coerce')
    resting_data = heart_data[heart_data['value'] < 80]

    return resting_data['value'].mean() if not resting_data.empty else None

def get_hr_max(age):
    return 220 - age

def get_hr_1min(heart_data):
    if heart_data.empty:
        return None

    last_exertion_index = heart_data['value'].idxmax()
    cooldown_data = heart_data.iloc[last_exertion_index + 1:last_exertion_index + 2]
    return cooldown_data['value'].mean() if not cooldown_data.empty else None
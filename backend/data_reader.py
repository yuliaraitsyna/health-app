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

        if record_type == 'HKQuantityTypeIdentifierHeartRate':
            data.append({
                'type': record_type,
                'start_date': start_date,
                'end_date': end_date,
                'value': value
            })

        elif record_type == 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN':
            data.append({
                'type': record_type,
                'start_date': start_date,
                'end_date': end_date,
                'value': value
            })

    return data

def get_heart_data(data):
    df = pd.DataFrame(data)

    df['start_date'] = pd.to_datetime(df['start_date'])
    df['end_date'] = pd.to_datetime(df['start_date'])

    heart_data = df[df['type'] == 'HKQuantityTypeIdentifierHeartRate']
    return heart_data


def get_hrv(data):
    df = pd.DataFrame(data)

    hrv_data = df[df['type'] == 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN']

    # Print and verify HRV data
    print(hrv_data)
    return hrv_data['value'].astype(float).mean()

def get_rhr_current(heart_data):
    """Returns the current heart rate as the most recent heart rate value."""
    if heart_data.empty:
        return None
    latest_heart_rate = heart_data.iloc[-1]  # Get the last row, assuming the data is sorted by time
    return latest_heart_rate['value']

def get_rhr_baseline(heart_data):
    """Calculates the baseline resting heart rate, using a period of rest (e.g., sleep or inactivity)."""
    # Assuming that resting heart rate is the average of heart rates during sleep or rest periods
    # This is a simple approximation; you might want to improve this logic
    resting_data = heart_data[heart_data['value'] < 80]  # Example threshold for resting heart rate
    return resting_data['value'].mean() if not resting_data.empty else None

def get_hr_max(age):
    """Returns the maximum heart rate based on age using the formula 220 - age."""
    return 220 - age

def get_hr_1min(heart_data):
    """Returns the heart rate 1 minute after exertion."""
    if heart_data.empty:
        return None

    # Assuming the heart data has a pattern of exertion followed by a cooldown
    last_exertion_index = heart_data['value'].idxmax()  # The point of maximum heart rate (exertion)
    cooldown_data = heart_data.iloc[last_exertion_index + 1:last_exertion_index + 2]  # Get data for the next minute
    return cooldown_data['value'].mean() if not cooldown_data.empty else None
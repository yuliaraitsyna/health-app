from backend.data_reader import parse_data
import pandas as pd

health_data = parse_data("./export.xml")

df = pd.DataFrame(health_data)

df['start_date'] = pd.to_datetime(df['start_date'])
df['end_date'] = pd.to_datetime(df['start_date'])

heart_data = df[df['type'] == 'HKQuantityTypeIdentifierHeartRate']
avg_heart_rate = df['value'].astype(float).mean()

print(avg_heart_rate)
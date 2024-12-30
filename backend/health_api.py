from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Query
from backend.data_reader import parse_data, get_heart_data
from backend.heart_rate import filter_heart_data_by_period
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

health_data = parse_data("backend/export.xml")

def transform_data(data):
    if isinstance(data, dict):
        import pandas as pd
        data = pd.DataFrame(data)

    transformed = []

    for _, row in data.iterrows():
        record = {
            "start_date": row.get("start_date", None),
            "end_date": row.get("end_date", None),
            "value": row.get("value", None),
        }
        transformed.append(record)

    return transformed

@app.get("/heart_rate")
def get_heart_data_query(
    start_date: datetime = Query(None, description="Start date"),
    end_date: datetime = Query(None, description="End date")
):
    
    if start_date and end_date and start_date > end_date:
        raise HTTPException (
            status_code=400,
            detail="End date can't be earlier than start date"
        )
    
    try:  
        heart_data = get_heart_data(health_data)

        if(start_date and end_date):
            utc_plus_3 = timezone(timedelta(hours=3))

            start_date = start_date.astimezone(utc_plus_3) if start_date.tzinfo is None else start_date
            end_date = end_date.astimezone(utc_plus_3) if end_date.tzinfo is None else end_date

            heart_data = filter_heart_data_by_period(start_date, end_date, heart_data)

        if(heart_data.shape[0] > 1000 & heart_data.shape[0] < 5000):
            records_number = int(heart_data.shape[0] / 100)
        elif(heart_data.shape[0] > 5000):
            records_number = int(heart_data.shape[0] / 1000)
        else:
            records_number = 1

        transformed_data = transform_data(heart_data[::records_number][['start_date', 'end_date', 'value']])

        
        return {"heart_data": transformed_data}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error occured: {str(e)}"
        )
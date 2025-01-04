from datetime import datetime, timedelta, timezone
from typing import List, Union
from fastapi import FastAPI, HTTPException, Query
from backend.data_reader import get_hrv, parse_data, get_heart_data
from backend.heart_rate import calclulate_avg_heart_rate, calculate_stress_level, filter_heart_data_by_period
from fastapi.middleware.cors import CORSMiddleware
from dataclasses import dataclass
from datetime import date
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    
)

health_data = parse_data("backend/export.xml")

def modify_response_data(data):
    if isinstance(data, dict):
        data = pd.DataFrame(data)
        
    data_columns = data.columns
    
    print(data_columns)
    
    if isinstance(data, pd.DataFrame):
        required_columns_heart = {'start_date', 'end_date', 'value'}
        required_columns_stress = {'start_date', 'value', 'deviation', 'stress_state'}
    
        if required_columns_heart.issubset(data_columns):
            transformed = data[['start_date', 'end_date', 'value']].rename(
                columns={
                    'start_date': 'startDate',
                    'end_date': 'endDate',
                    'value': 'value'
                }
            ).to_dict(orient="records")
            return transformed
        
        elif required_columns_stress.issubset(data_columns):
            transformed = data[['start_date', 'value', 'deviation', 'stress_state']].rename(
                columns={
                    'start_date': 'startDate',
                    'value': 'value',
                    'deviation': 'deviation',
                    'stress_state': 'stressState'
                }
            ).to_dict(orient="records")
            return transformed
        else:
            raise TypeError(
                "no valid columns where found for data modification"
            )
            
    raise TypeError(
        "unsupported data type"
    )
    
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

        filtered_heart_data = heart_data[::records_number][['start_date', 'end_date', 'value']]
        transformed_data = modify_response_data(filtered_heart_data)
        avg_heart_data = calclulate_avg_heart_rate(filtered_heart_data)
        
        return {"heart_data": transformed_data, "avg_heart_rate": avg_heart_data}
    
    except TypeError as te:
        raise HTTPException(
            status_code=400,
            detail=f"Type error: {str(te)}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error occured: {str(e)}"
        )

@app.get("/heart_rate/stress")
def get_stress_data(
    start_date: datetime = Query(None, description="Start date"),
    end_date: datetime = Query(None, description="End date")
):

    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="End date can't be earlier than start date"
        )

    try:
        heart_data = get_heart_data(health_data)

        if start_date and end_date:
            utc_plus_3 = timezone(timedelta(hours=3))

            start_date = start_date.astimezone(utc_plus_3) if start_date.tzinfo is None else start_date
            end_date = end_date.astimezone(utc_plus_3) if end_date.tzinfo is None else end_date

            heart_data = filter_heart_data_by_period(start_date, end_date, heart_data)

        avg_heart_rate = calclulate_avg_heart_rate(heart_data)
        stress_levels = calculate_stress_level(heart_data, avg_heart_rate)
        
        if(heart_data.shape[0] > 1000 & heart_data.shape[0] < 5000):
            records_number = int(heart_data.shape[0] / 100)
        elif(heart_data.shape[0] > 5000):
            records_number = int(heart_data.shape[0] / 1000)
        else:
            records_number = 1

        stress_levels = stress_levels[::records_number]
        
        stress_data = modify_response_data(stress_levels[['start_date', 'value', 'deviation', 'stress_state']])
        
        return {"stress_data": stress_data}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error occurred: {str(e)}"
        )

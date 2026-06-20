import os
import random
from datetime import datetime, date, time
from typing import Optional, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from supabase import create_client, Client
from dotenv import load_dotenv

# Load local .env if present (useful for local development)
load_dotenv()

app = FastAPI(title="Sweet Heart Backend", version="1.0.0")

# Enable CORS for frontend deployments (GitHub Pages and localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you can restrict this to your github pages domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Print a warning but don't crash immediately so Vercel builds can proceed
    print("Warning: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

SHOPKEEPER_PASSWORD = os.getenv("APP_SHOPKEEPER_PASSWORD", "102003")


# DTO Schemas
class LoginRequest(BaseModel):
    password: str = Field(..., min_length=1)

class BookingRequest(BaseModel):
    name: str = Field(..., max_length=100)
    phone: str = Field(...)
    cakeName: str = Field(..., alias="cakeName")
    requiredDate: str = Field(..., description="YYYY-MM-DD")
    requiredTime: str = Field(..., description="HH:MM or HH:MM:SS")
    query: Optional[str] = None

    class Config:
        populate_by_name = True

    @field_validator("requiredDate")
    @classmethod
    def validate_date(cls, v):
        try:
            parsed_date = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("requiredDate must be in YYYY-MM-DD format")
        
        if parsed_date <= date.today():
            raise ValueError("Booking date must be at least 1 day in the future.")
        return v


class BookingResponse(BaseModel):
    id: int
    name: str
    phone: str
    cakeName: str
    requiredDate: str
    requiredTime: str
    query: Optional[str] = None
    pin: str
    createdAt: str
    daysLeft: int
    urgencyColor: str


# Helper functions
def calculate_urgency(required_date_str: str):
    try:
        req_date = datetime.strptime(required_date_str, "%Y-%m-%d").date()
    except ValueError:
        # Fallback if format differs
        req_date = datetime.fromisoformat(required_date_str).date()
        
    today = date.today()
    days_left = (req_date - today).days

    if days_left <= 0:
        color = "rb"
    elif days_left == 1:
        color = "rr"
    elif days_left == 2:
        color = "ry"
    else:
        color = "rg"
        
    return days_left, color


def to_response_dto(booking: dict) -> BookingResponse:
    # Supabase returns columns in snake_case or whatever is configured.
    # Let's map db columns to camelCase expected by FrontEnd.
    req_date = booking.get("required_date")
    req_time = booking.get("required_time")
    
    # Format time to HH:MM if it has seconds
    if req_time and len(req_time) > 5:
        req_time = req_time[:5]
        
    days_left, color = calculate_urgency(req_date)
    
    # Format createdAt ISO string
    created_at = booking.get("created_at", "")
    
    return BookingResponse(
        id=booking.get("id"),
        name=booking.get("name"),
        phone=booking.get("phone"),
        cakeName=booking.get("cake_name"),
        requiredDate=req_date,
        requiredTime=req_time,
        query=booking.get("query"),
        pin=booking.get("pin"),
        createdAt=created_at,
        daysLeft=days_left,
        urgencyColor=color
    )


def generate_unique_pin() -> str:
    if not supabase:
        return str(random.randint(100000, 999999))
        
    while True:
        pin = str(random.randint(100000, 999999))
        # Check if exists
        res = supabase.table("bookings").select("id").eq("pin", pin).execute()
        if not res.data:
            return pin


@app.get("/api")
def root():
    return {"message": "Sweet Heart Cake Shop API is online"}


@app.post("/api/auth/login")
def login(request: LoginRequest):
    if request.password == SHOPKEEPER_PASSWORD:
        return {
            "success": True,
            "message": "Access granted. Welcome, Shopkeeper!"
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"success": False, "message": "Incorrect password. Access denied."}
    )


@app.post("/api/bookings", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(dto: BookingRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client is not configured.")

    # Validate phone format pattern simple check (like ^[+]?[0-9 ]{7,20}$)
    # We can perform additional validations if needed.
    
    pin = generate_unique_pin()
    
    booking_data = {
        "name": dto.name,
        "phone": dto.phone,
        "cake_name": dto.cakeName,
        "required_date": dto.requiredDate,
        "required_time": dto.requiredTime,
        "query": dto.query,
        "pin": pin
    }
    
    try:
        res = supabase.table("bookings").insert(booking_data).execute()
        if not res.data:
            raise HTTPException(status_code=500, detail="Failed to save booking.")
        return to_response_dto(res.data[0])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/bookings", response_model=List[BookingResponse])
def get_all_bookings():
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client is not configured.")
        
    try:
        res = supabase.table("bookings").select("*").order("required_date", desc=False).execute()
        return [to_response_dto(b) for b in res.data]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/bookings/{id}", response_model=BookingResponse)
def get_booking_by_id(id: int):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client is not configured.")
        
    try:
        res = supabase.table("bookings").select("*").eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail=f"Booking not found with id: {id}")
        return to_response_dto(res.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/api/bookings/{id}", response_model=BookingResponse)
def update_booking(id: int, dto: BookingRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client is not configured.")
        
    booking_data = {
        "name": dto.name,
        "phone": dto.phone,
        "cake_name": dto.cakeName,
        "required_date": dto.requiredDate,
        "required_time": dto.requiredTime,
        "query": dto.query
    }
    
    try:
        res = supabase.table("bookings").update(booking_data).eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail=f"Booking not found with id: {id}")
        return to_response_dto(res.data[0])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/bookings/{id}")
def delete_booking(id: int):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database client is not configured.")
        
    try:
        res = supabase.table("bookings").delete().eq("id", id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail=f"Booking not found with id: {id}")
        return {"message": "Booking deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

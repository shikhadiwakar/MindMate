# backend/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import sqlite3
import asyncio
import json
from datetime import datetime, timedelta
import uvicorn
from contextlib import asynccontextmanager
import hashlib
import os
import uuid

# Authentication imports
from auth_service import (
    UserLogin, UserSignup, Token, 
    verify_password, get_password_hash, create_access_token,
    verify_token
)

# Import our modules
from models import *
from database import DatabaseManager

# Simple AI service placeholder
class AIService:
    async def initialize(self):
        print("AI service initialized (placeholder)")
    
    async def chat(self, user_id: str, message: str, context: dict):
        return f"Thanks for your message: {message}. I'm here to help with your wellness journey!"
    
    async def generate_daily_insights(self, user_id: str, checkin_id: str):
        return "Great job on completing your check-in today!"
    
    async def analyze_food_mood_correlation(self, user_id: str, days: int):
        return []
    
    async def generate_weekly_summary(self, user_id: str):
        return "You're doing great this week!"
    
    async def get_meal_suggestions(self, user_id: str, mood: str, energy_level: int):
        return ["Try some fruits for natural energy", "Consider a balanced meal with protein"]
    
    async def get_mindful_practices(self, user_id: str, current_mood: str):
        return ["5-minute breathing exercise", "Short gratitude practice"]
    
    async def generate_journal_reflection(self, content: str):
        return "Your thoughts show self-awareness and growth."

# Initialize services
db_manager = DatabaseManager()
ai_service = AIService()
security = HTTPBearer(auto_error=False)

# Configuration
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db_manager.init_db()
    await ai_service.initialize()
    yield
    # Shutdown
    await db_manager.close()

app = FastAPI(
    title="MindMate API",
    description="Personalized mental wellness and mindful eating companion",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return "anonymous"
    
    user_id = verify_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = await db_manager.get_user(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user_id

# Authentication Routes
@app.post("/api/auth/signup", response_model=Token)
async def signup(user_data: UserSignup):
    try:
        # Check if user already exists
        existing_user = await db_manager.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash the password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user data for database
        user_create_data = UserCreate(
            name=user_data.name,
            email=user_data.email,
            password=hashed_password,
            age=user_data.age,
            dietary_preferences=user_data.preferences
        )
        
        # Create user in database
        user_id = await db_manager.create_user(user_create_data)
        user = await db_manager.get_user(user_id)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_id)}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

# Replace the existing login endpoint in main.py with this:

@app.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        # Get user by email
        user = await db_manager.get_user_by_email(user_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(user_data.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user["id"])}, expires_delta=access_token_expires
        )
        
        # Calculate streak (simple implementation)
        streak = 1  # You can implement proper streak calculation later
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "has_completed_onboarding": user.get("has_completed_onboarding", False)
            },
            streak=streak  # Add streak to response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@app.post("/api/auth/refresh", response_model=Token)
async def refresh_token(user_id: str = Depends(get_current_user)):
    try:
        user = await db_manager.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_id)}, expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user={
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@app.post("/api/auth/logout")
async def logout(user_id: str = Depends(get_current_user)):
    return {"message": "Successfully logged out"}


# Add this endpoint after the logout endpoint in main.py (around line 175)

@app.get("/api/auth/me")
async def get_current_user_profile(user_id: str = Depends(get_current_user)):
    """Get current authenticated user's profile"""
    try:
        user = await db_manager.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age"),
            "dietary_preferences": user.get("dietary_preferences", []),
            "mental_health_goals": user.get("mental_health_goals", []),
            "dietary_restrictions": user.get("dietary_restrictions", []),
            "timezone": user.get("timezone", "UTC"),
            "has_completed_onboarding": user.get("has_completed_onboarding", False)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user profile: {str(e)}"
        )

# Basic Routes
@app.get("/")
async def root():
    return {"message": "MindMate API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# User Management
@app.get("/api/users/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    user = await db_manager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/profile")
async def update_profile(user_data: UserUpdate, user_id: str = Depends(get_current_user)):
    await db_manager.update_user(user_id, user_data)
    user = await db_manager.get_user(user_id)
    return user

# Daily Check-ins
@app.post("/api/checkins")
async def create_checkin(checkin: CheckinCreate, user_id: str = Depends(get_current_user)):
    checkin_id = await db_manager.create_checkin(user_id, checkin)
    
    # Generate AI insights
    try:
        insights = await ai_service.generate_daily_insights(user_id, checkin_id)
        await db_manager.save_insights(user_id, checkin_id, insights)
    except Exception as e:
        print(f"Failed to generate insights: {e}")
    
    result = await db_manager.get_checkin(checkin_id)
    return result

@app.get("/api/checkins")
async def get_checkins(
    user_id: str = Depends(get_current_user),
    limit: int = 10,
    offset: int = 0
):
    checkins = await db_manager.get_user_checkins(user_id, limit, offset)
    return checkins

@app.get("/api/checkins/today")
async def get_today_checkin(
    checkin_type: str,
    user_id: str = Depends(get_current_user)
):
    checkin = await db_manager.get_today_checkin(user_id, checkin_type)
    return checkin

# Food Logging
from fastapi import Request

# Food Logging
from fastapi import Request

@app.post("/api/food-logs")
async def create_food_log(
    request: Request,
    user_id: str = Depends(get_current_user)
):
    body = await request.json()
    print("🔍 Raw incoming JSON:", body)

    # then try to validate manually
    food_log = FoodLogCreate(**body)

    log_id = await db_manager.create_food_log(user_id, food_log)
    result = await db_manager.get_food_log(log_id)
    return result



@app.get("/api/food-logs")
async def get_food_logs(
    user_id: str = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    logs = await db_manager.get_user_food_logs(user_id, limit, offset)
    return logs

@app.post("/api/chat")
async def chat_with_ai(chat_request: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        # Validate input
        if not chat_request.message or not chat_request.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        message = chat_request.message.strip()
        
        # Get user context for personalized responses
        user_context = await db_manager.get_user_context(user_id)
        
        # Generate AI response
        ai_response = await ai_service.chat(
            user_id=user_id,
            message=message,
            context=user_context
        )
        
        # Ensure response is not empty
        if not ai_response or not ai_response.strip():
            ai_response = "I'm here to listen. Could you tell me more about what's on your mind?"
        
        # Save conversation
        await db_manager.save_conversation(user_id, message, ai_response.strip())
        
        return {
            "message": ai_response.strip(),
            "timestamp": datetime.utcnow()
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="I'm having trouble responding right now. Please try again.")

@app.get("/api/chat/history")
async def get_chat_history(
    user_id: str = Depends(get_current_user),
    limit: int = 50
):
    try:
        history = await db_manager.get_conversation_history(user_id, limit)
        # Filter out any conversations with empty messages
        valid_history = [
            conv for conv in history 
            if conv.get('user_message', '').strip() and conv.get('ai_response', '').strip()
        ]
        return valid_history
    except Exception as e:
        print(f"Error getting chat history: {e}")
        return []

# Insights & Analytics
@app.get("/api/insights/mood-trends")
async def get_mood_trends(
    user_id: str = Depends(get_current_user),
    days: int = 30
):
    trends = await db_manager.get_mood_trends(user_id, days)
    return {"trends": trends}

@app.get("/api/insights/food-mood-correlation")
async def get_food_mood_correlation(
    user_id: str = Depends(get_current_user),
    days: int = 30
):
    correlations = await ai_service.analyze_food_mood_correlation(user_id, days)
    return {"correlations": correlations}

@app.get("/api/insights/weekly-summary")
async def get_weekly_summary(user_id: str = Depends(get_current_user)):
    summary = await ai_service.generate_weekly_summary(user_id)
    return {"summary": summary}

# Suggestions
@app.get("/api/suggestions/meals")
async def get_meal_suggestions(
    mood: Optional[str] = None,
    energy_level: Optional[int] = None,
    user_id: str = Depends(get_current_user)
):
    suggestions = await ai_service.get_meal_suggestions(user_id, mood, energy_level)
    return {"suggestions": suggestions}

@app.get("/api/suggestions/mindful-practices")
async def get_mindful_practices(
    current_mood: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    practices = await ai_service.get_mindful_practices(user_id, current_mood)
    return {"practices": practices}

# Journal
@app.post("/api/journal")
async def create_journal_entry(entry: JournalCreate, user_id: str = Depends(get_current_user)):
    entry_id = await db_manager.create_journal_entry(user_id, entry)
    
    # Generate AI reflection
    try:
        reflection = await ai_service.generate_journal_reflection(entry.content)
        await db_manager.save_journal_reflection(entry_id, reflection)
    except Exception as e:
        print(f"Failed to generate journal reflection: {e}")
    
    result = await db_manager.get_journal_entry(entry_id)
    return result

@app.get("/api/journal")
async def get_journal_entries(
    user_id: str = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    entries = await db_manager.get_user_journal_entries(user_id, limit, offset)
    return entries

# Emergency Resources
@app.get("/api/emergency/resources")
async def get_emergency_resources(user_id: str = Depends(get_current_user)):
    # In production, this would be location-based
    resources = {
        "helplines": [
            {"name": "National Suicide Prevention Lifeline", "number": "988", "available": "24/7"},
            {"name": "Crisis Text Line", "number": "Text HOME to 741741", "available": "24/7"},
            {"name": "NAMI Helpline", "number": "1-800-950-NAMI", "available": "Mon-Fri 10am-10pm ET"}
        ],
        "grounding_techniques": [
            "5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
            "Deep breathing: Inhale for 4, hold for 4, exhale for 6",
            "Progressive muscle relaxation: Tense and release each muscle group"
        ]
    }
    return resources

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
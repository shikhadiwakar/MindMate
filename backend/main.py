# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
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

# Import our modules
from models import *
from database import DatabaseManager
from ai_service import AIService

# Initialize services
db_manager = DatabaseManager()
ai_service = AIService()
security = HTTPBearer(auto_error=False)

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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple auth (in production, use proper JWT)
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return "anonymous"
    return credentials.credentials  # In production, validate JWT

@app.get("/")
async def root():
    return {"message": "MindMate API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# User Management
@app.post("/api/users/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    user_id = await db_manager.create_user(user_data)
    user = await db_manager.get_user(user_id)
    return user

@app.get("/api/users/profile", response_model=UserResponse)
async def get_profile(user_id: str = Depends(get_current_user)):
    user = await db_manager.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/api/users/profile", response_model=UserResponse)
async def update_profile(user_data: UserUpdate, user_id: str = Depends(get_current_user)):
    await db_manager.update_user(user_id, user_data)
    user = await db_manager.get_user(user_id)
    return user

# Daily Check-ins
@app.post("/api/checkins", response_model=CheckinResponse)
async def create_checkin(checkin: CheckinCreate, user_id: str = Depends(get_current_user)):
    checkin_id = await db_manager.create_checkin(user_id, checkin)
    
    # Generate AI insights if this is an evening checkin
    if checkin.checkin_type == "evening":
        try:
            insights = await ai_service.generate_daily_insights(user_id, checkin_id)
            await db_manager.save_insights(user_id, checkin_id, insights)
        except Exception as e:
            print(f"Failed to generate insights: {e}")
    
    result = await db_manager.get_checkin(checkin_id)
    return result

@app.get("/api/checkins", response_model=List[CheckinResponse])
async def get_checkins(
    user_id: str = Depends(get_current_user),
    limit: int = 10,
    offset: int = 0
):
    checkins = await db_manager.get_user_checkins(user_id, limit, offset)
    return checkins

@app.get("/api/checkins/today", response_model=Optional[CheckinResponse])
async def get_today_checkin(
    checkin_type: str,
    user_id: str = Depends(get_current_user)
):
    checkin = await db_manager.get_today_checkin(user_id, checkin_type)
    return checkin

# Food Logging
@app.post("/api/food-logs", response_model=FoodLogResponse)
async def create_food_log(food_log: FoodLogCreate, user_id: str = Depends(get_current_user)):
    log_id = await db_manager.create_food_log(user_id, food_log)
    result = await db_manager.get_food_log(log_id)
    return result

@app.get("/api/food-logs", response_model=List[FoodLogResponse])
async def get_food_logs(
    user_id: str = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0
):
    logs = await db_manager.get_user_food_logs(user_id, limit, offset)
    return logs

# AI Chat
@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(chat_request: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        # Get user context for personalized responses
        user_context = await db_manager.get_user_context(user_id)
        
        # Generate AI response
        ai_response = await ai_service.chat(
            user_id=user_id,
            message=chat_request.message,
            context=user_context
        )
        
        # Save conversation
        await db_manager.save_conversation(user_id, chat_request.message, ai_response)
        
        return ChatResponse(
            message=ai_response,
            timestamp=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.get("/api/chat/history", response_model=List[ConversationResponse])
async def get_chat_history(
    user_id: str = Depends(get_current_user),
    limit: int = 50
):
    history = await db_manager.get_conversation_history(user_id, limit)
    return history

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
@app.post("/api/journal", response_model=JournalResponse)
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

@app.get("/api/journal", response_model=List[JournalResponse])
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
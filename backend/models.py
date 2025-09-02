# backend/models.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class MoodType(str, Enum):
    VERY_LOW = "very_low"
    LOW = "low" 
    NEUTRAL = "neutral"
    GOOD = "good"
    EXCELLENT = "excellent"

class CheckinType(str, Enum):
    MORNING = "morning"
    EVENING = "evening"
    CUSTOM = "custom"

class EnergyLevel(int, Enum):
    VERY_LOW = 1
    LOW = 2
    MODERATE = 3
    HIGH = 4
    VERY_HIGH = 5

# User Models
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = Field(None, pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    age: Optional[int] = Field(None, ge=13, le=120)
    password: str
    dietary_preferences: Optional[List[str]] = []
    dietary_restrictions: Optional[List[str]] = []
    mental_health_goals: Optional[List[str]] = []
    timezone: Optional[str] = "UTC"

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=13, le=120)
    dietary_preferences: Optional[List[str]] = None
    dietary_restrictions: Optional[List[str]] = None
    mental_health_goals: Optional[List[str]] = None
    timezone: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str]
    age: Optional[int]
    dietary_preferences: List[str]
    dietary_restrictions: List[str]
    mental_health_goals: List[str]
    timezone: str
    created_at: datetime
    updated_at: datetime

# Check-in Models
class CheckinCreate(BaseModel):
    checkin_type: CheckinType
    mood: MoodType
    energy_level: EnergyLevel = Field(..., ge=1, le=5)
    stress_level: int = Field(..., ge=1, le=10)
    hunger_level: int = Field(..., ge=1, le=10)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=1000)
    gratitude: Optional[str] = Field(None, max_length=500)

class CheckinResponse(BaseModel):
    id: str
    user_id: str
    checkin_type: CheckinType
    mood: MoodType
    energy_level: int
    stress_level: int
    hunger_level: int
    sleep_quality: Optional[int]
    notes: Optional[str]
    gratitude: Optional[str]
    created_at: datetime

# Food Log Models
class FoodLogCreate(BaseModel):
    meal_type: str = Field(..., pattern=r'^(breakfast|lunch|dinner|snack)$')
    food_items: List[str] = Field(..., min_items=1)
    portion_size: Optional[str] = None
    hunger_before: int = Field(..., ge=1, le=10)
    hunger_after: int = Field(..., ge=1, le=10)
    emotions_before: Optional[List[str]] = []
    emotions_after: Optional[List[str]] = []
    mindful_eating_score: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=1000)
    photo_url: Optional[str] = None

class FoodLogResponse(BaseModel):
    id: str
    user_id: str
    meal_type: str
    food_items: List[str]
    portion_size: Optional[str]
    hunger_before: int
    hunger_after: int
    emotions_before: List[str]
    emotions_after: List[str]
    mindful_eating_score: Optional[int]
    notes: Optional[str]
    photo_url: Optional[str]
    created_at: datetime

# Chat Models
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[Dict[str, Any]] = {}

class ChatResponse(BaseModel):
    message: str
    timestamp: datetime

class ConversationResponse(BaseModel):
    id: str
    user_id: str
    user_message: str
    ai_response: str
    created_at: datetime

# Journal Models
class JournalCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: str = Field(..., min_length=1, max_length=5000)
    mood: Optional[MoodType] = None
    tags: Optional[List[str]] = []
    is_private: bool = True

class JournalResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str]
    content: str
    mood: Optional[MoodType]
    tags: List[str]
    is_private: bool
    ai_reflection: Optional[str]
    created_at: datetime
    updated_at: datetime

# Insights Models
class MoodTrend(BaseModel):
    date: str
    mood: MoodType
    energy_level: int
    stress_level: int

class FoodMoodCorrelation(BaseModel):
    food_item: str
    mood_impact: float
    frequency: int
    confidence: float

class WeeklySummary(BaseModel):
    week_start: str
    week_end: str
    avg_mood: float
    mood_trend: str
    top_emotions: List[str]
    mindful_eating_score: float
    key_insights: List[str]
    recommendations: List[str]

# Suggestion Models
class MealSuggestion(BaseModel):
    name: str
    description: str
    ingredients: List[str]
    mood_benefit: str
    prep_time: int
    difficulty: str

class MindfulPractice(BaseModel):
    name: str
    description: str
    duration: int
    difficulty: str
    benefits: List[str]
    instructions: List[str]

# Analytics Models
class UserContext(BaseModel):
    recent_mood: Optional[MoodType] = None
    avg_energy: Optional[float] = None
    avg_stress: Optional[float] = None
    common_emotions: List[str] = []
    dietary_patterns: List[str] = []
    goals: List[str] = []
    recent_challenges: List[str] = []

# Database Models (internal)
class DatabaseCheckin(BaseModel):
    id: str
    user_id: str
    checkin_type: str
    mood: str
    energy_level: int
    stress_level: int
    hunger_level: int
    sleep_quality: Optional[int]
    notes: Optional[str]
    gratitude: Optional[str]
    created_at: str

class DatabaseFoodLog(BaseModel):
    id: str  
    user_id: str
    meal_type: str
    food_items: str  # JSON string
    portion_size: Optional[str]
    hunger_before: int
    hunger_after: int
    emotions_before: str  # JSON string
    emotions_after: str  # JSON string
    mindful_eating_score: Optional[int]
    notes: Optional[str]
    photo_url: Optional[str]
    created_at: str

class DatabaseUser(BaseModel):
    id: str
    name: str
    email: Optional[str]
    age: Optional[int]
    dietary_preferences: str  # JSON string
    dietary_restrictions: str  # JSON string
    mental_health_goals: str  # JSON string
    timezone: str
    created_at: str
    updated_at: str

# Update CheckinCreate model in models.py - Add missing fields
class CheckinCreate(BaseModel):
    checkin_type: CheckinType
    mood: MoodType
    energy_level: EnergyLevel = Field(..., ge=1, le=5)
    stress_level: int = Field(..., ge=1, le=10)
    hunger_level: int = Field(..., ge=1, le=10)
    sleep_quality: Optional[int] = Field(None, ge=1, le=10)
    # Add these missing fields that database expects:
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    exercise_minutes: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=1000)
    gratitude: Optional[str] = Field(None, max_length=500)

class FoodLogCreate(BaseModel):
    meal_type: str = Field(..., pattern=r'^(breakfast|lunch|dinner|snack)$')
    food_name: str = Field(..., min_length=1)   # ✅ required (DB requires NOT NULL)
    
    portion_size: Optional[str] = None
    calories: Optional[int] = Field(None, ge=0)
    
    # Hunger levels (need DB columns!)
    hunger_before: Optional[int] = Field(None, ge=1, le=10)
    hunger_after: Optional[int] = Field(None, ge=1, le=10)
    
    # Moods (already in DB)
    mood_before: Optional[int] = Field(None, ge=1, le=10)
    mood_after: Optional[int] = Field(None, ge=1, le=10)
    
    # Extra fields (require DB migration if you want persistence)
    emotions_before: Optional[List[str]] = []
    emotions_after: Optional[List[str]] = []
    mindful_eating_score: Optional[int] = Field(None, ge=1, le=10)
    notes: Optional[str] = Field(None, max_length=1000)
    photo_url: Optional[str] = None

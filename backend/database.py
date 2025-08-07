# backend/database.py
import sqlite3
import aiosqlite
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from models import *

class DatabaseManager:
    def __init__(self, db_path: str = "mindmate.db"):
        self.db_path = db_path
        
    async def init_db(self):
        """Initialize database with all tables"""
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    age INTEGER,
                    dietary_preferences TEXT DEFAULT '[]',
                    dietary_restrictions TEXT DEFAULT '[]',
                    mental_health_goals TEXT DEFAULT '[]',
                    timezone TEXT DEFAULT 'UTC',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS checkins (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    checkin_type TEXT NOT NULL,
                    mood TEXT NOT NULL,
                    energy_level INTEGER NOT NULL,
                    stress_level INTEGER NOT NULL,
                    hunger_level INTEGER NOT NULL,
                    sleep_quality INTEGER,
                    notes TEXT,
                    gratitude TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS food_logs (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    meal_type TEXT NOT NULL,
                    food_items TEXT NOT NULL,
                    portion_size TEXT,
                    hunger_before INTEGER NOT NULL,
                    hunger_after INTEGER NOT NULL,
                    emotions_before TEXT DEFAULT '[]',
                    emotions_after TEXT DEFAULT '[]',
                    mindful_eating_score INTEGER,
                    notes TEXT,
                    photo_url TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    user_message TEXT NOT NULL,
                    ai_response TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS journal_entries (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    title TEXT,
                    content TEXT NOT NULL,
                    mood TEXT,
                    tags TEXT DEFAULT '[]',
                    is_private BOOLEAN DEFAULT 1,
                    ai_reflection TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            """)
            
            await db.execute("""
                CREATE TABLE IF NOT EXISTS insights (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    checkin_id TEXT,
                    insight_type TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (checkin_id) REFERENCES checkins (id)
                )
            """)
            
            # Create indexes for better performance
            await db.execute("CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, created_at)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, created_at)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user_date ON conversations(user_id, created_at)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_journal_user_date ON journal_entries(user_id, created_at)")
            
            await db.commit()

    async def close(self):
        """Close database connections"""
        pass  # aiosqlite handles connections automatically

    # User Management
    async def create_user(self, user_data: UserCreate) -> str:
        user_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO users (id, name, email, age, dietary_preferences, 
                                 dietary_restrictions, mental_health_goals, timezone, 
                                 created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id, user_data.name, user_data.email, user_data.age,
                json.dumps(user_data.dietary_preferences or []),
                json.dumps(user_data.dietary_restrictions or []),
                json.dumps(user_data.mental_health_goals or []),
                user_data.timezone, now, now
            ))
            await db.commit()
        
        return user_id

    async def get_user(self, user_id: str) -> Optional[UserResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM users WHERE id = ?", (user_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                
                return UserResponse(
                    id=row['id'],
                    name=row['name'],
                    email=row['email'],
                    age=row['age'],
                    dietary_preferences=json.loads(row['dietary_preferences']),
                    dietary_restrictions=json.loads(row['dietary_restrictions']),
                    mental_health_goals=json.loads(row['mental_health_goals']),
                    timezone=row['timezone'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at'])
                )

    async def update_user(self, user_id: str, user_data: UserUpdate):
        updates = []
        values = []
        
        if user_data.name is not None:
            updates.append("name = ?")
            values.append(user_data.name)
        if user_data.age is not None:
            updates.append("age = ?")
            values.append(user_data.age)
        if user_data.dietary_preferences is not None:
            updates.append("dietary_preferences = ?")
            values.append(json.dumps(user_data.dietary_preferences))
        if user_data.dietary_restrictions is not None:
            updates.append("dietary_restrictions = ?")
            values.append(json.dumps(user_data.dietary_restrictions))
        if user_data.mental_health_goals is not None:
            updates.append("mental_health_goals = ?")
            values.append(json.dumps(user_data.mental_health_goals))
        if user_data.timezone is not None:
            updates.append("timezone = ?")
            values.append(user_data.timezone)
        
        if not updates:
            return
        
        updates.append("updated_at = ?")
        values.append(datetime.utcnow().isoformat())
        values.append(user_id)
        
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(query, values)
            await db.commit()

    # Check-ins
    async def create_checkin(self, user_id: str, checkin: CheckinCreate) -> str:
        checkin_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO checkins (id, user_id, checkin_type, mood, energy_level,
                                    stress_level, hunger_level, sleep_quality, notes,
                                    gratitude, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                checkin_id, user_id, checkin.checkin_type.value, checkin.mood.value,
                checkin.energy_level.value, checkin.stress_level, checkin.hunger_level,
                checkin.sleep_quality, checkin.notes, checkin.gratitude, now
            ))
            await db.commit()
        
        return checkin_id

    async def get_checkin(self, checkin_id: str) -> Optional[CheckinResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM checkins WHERE id = ?", (checkin_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                
                return CheckinResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    checkin_type=CheckinType(row['checkin_type']),
                    mood=MoodType(row['mood']),
                    energy_level=row['energy_level'],
                    stress_level=row['stress_level'],
                    hunger_level=row['hunger_level'],
                    sleep_quality=row['sleep_quality'],
                    notes=row['notes'],
                    gratitude=row['gratitude'],
                    created_at=datetime.fromisoformat(row['created_at'])
                )

    # Food Logs
    async def create_food_log(self, user_id: str, food_log: FoodLogCreate) -> str:
        log_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO food_logs (id, user_id, meal_type, food_items, portion_size,
                                     hunger_before, hunger_after, emotions_before, 
                                     emotions_after, mindful_eating_score, notes, 
                                     photo_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log_id, user_id, food_log.meal_type, json.dumps(food_log.food_items),
                food_log.portion_size, food_log.hunger_before, food_log.hunger_after,
                json.dumps(food_log.emotions_before or []),
                json.dumps(food_log.emotions_after or []),
                food_log.mindful_eating_score, food_log.notes, food_log.photo_url, now
            ))
            await db.commit()
        
        return log_id

    async def get_food_log(self, log_id: str) -> Optional[FoodLogResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM food_logs WHERE id = ?", (log_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                
                return FoodLogResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    meal_type=row['meal_type'],
                    food_items=json.loads(row['food_items']),
                    portion_size=row['portion_size'],
                    hunger_before=row['hunger_before'],
                    hunger_after=row['hunger_after'],
                    emotions_before=json.loads(row['emotions_before']),
                    emotions_after=json.loads(row['emotions_after']),
                    mindful_eating_score=row['mindful_eating_score'],
                    notes=row['notes'],
                    photo_url=row['photo_url'],
                    created_at=datetime.fromisoformat(row['created_at'])
                )

    async def get_user_food_logs(self, user_id: str, limit: int = 20, offset: int = 0) -> List[FoodLogResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM food_logs WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            """, (user_id, limit, offset)) as cursor:
                rows = await cursor.fetchall()
                
                return [FoodLogResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    meal_type=row['meal_type'],
                    food_items=json.loads(row['food_items']),
                    portion_size=row['portion_size'],
                    hunger_before=row['hunger_before'],
                    hunger_after=row['hunger_after'],
                    emotions_before=json.loads(row['emotions_before']),
                    emotions_after=json.loads(row['emotions_after']),
                    mindful_eating_score=row['mindful_eating_score'],
                    notes=row['notes'],
                    photo_url=row['photo_url'],
                    created_at=datetime.fromisoformat(row['created_at'])
                ) for row in rows]

    # Conversations
    async def save_conversation(self, user_id: str, user_message: str, ai_response: str) -> str:
        conversation_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO conversations (id, user_id, user_message, ai_response, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (conversation_id, user_id, user_message, ai_response, now))
            await db.commit()
        
        return conversation_id

    async def get_conversation_history(self, user_id: str, limit: int = 50) -> List[ConversationResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM conversations WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ?
            """, (user_id, limit)) as cursor:
                rows = await cursor.fetchall()
                
                return [ConversationResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    user_message=row['user_message'],
                    ai_response=row['ai_response'],
                    created_at=datetime.fromisoformat(row['created_at'])
                ) for row in rows]

    # Journal
    async def create_journal_entry(self, user_id: str, entry: JournalCreate) -> str:
        entry_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO journal_entries (id, user_id, title, content, mood, tags,
                                           is_private, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                entry_id, user_id, entry.title, entry.content,
                entry.mood.value if entry.mood else None,
                json.dumps(entry.tags or []), entry.is_private, now, now
            ))
            await db.commit()
        
        return entry_id

    async def save_journal_reflection(self, entry_id: str, reflection: str):
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                UPDATE journal_entries SET ai_reflection = ?, updated_at = ?
                WHERE id = ?
            """, (reflection, datetime.utcnow().isoformat(), entry_id))
            await db.commit()

    async def get_journal_entry(self, entry_id: str) -> Optional[JournalResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM journal_entries WHERE id = ?", (entry_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                
                return JournalResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    title=row['title'],
                    content=row['content'],
                    mood=MoodType(row['mood']) if row['mood'] else None,
                    tags=json.loads(row['tags']),
                    is_private=bool(row['is_private']),
                    ai_reflection=row['ai_reflection'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at'])
                )

    async def get_user_journal_entries(self, user_id: str, limit: int = 20, offset: int = 0) -> List[JournalResponse]:
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM journal_entries WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            """, (user_id, limit, offset)) as cursor:
                rows = await cursor.fetchall()
                
                return [JournalResponse(
                    id=row['id'],
                    user_id=row['user_id'],
                    title=row['title'],
                    content=row['content'],
                    mood=MoodType(row['mood']) if row['mood'] else None,
                    tags=json.loads(row['tags']),
                    is_private=bool(row['is_private']),
                    ai_reflection=row['ai_reflection'],
                    created_at=datetime.fromisoformat(row['created_at']),
                    updated_at=datetime.fromisoformat(row['updated_at'])
                ) for row in rows]

    # Insights
    async def save_insights(self, user_id: str, checkin_id: str, insights: str):
        insight_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO insights (id, user_id, checkin_id, insight_type, content, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (insight_id, user_id, checkin_id, "daily", insights, now))
            await db.commit()

    # Analytics
    async def get_mood_trends(self, user_id: str, days: int = 30) -> List[Dict[str, Any]]:
        start_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT date(created_at) as date, mood, energy_level, stress_level
                FROM checkins 
                WHERE user_id = ? AND created_at >= ?
                ORDER BY created_at
            """, (user_id, start_date)) as cursor:
                rows = await cursor.fetchall()
                
                return [dict(row) for row in rows]

    async def get_user_context(self, user_id: str) -> UserContext:
        # Get recent mood and patterns
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            
            # Recent checkin
            async with db.execute("""
                SELECT mood, energy_level, stress_level FROM checkins 
                WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
            """, (user_id,)) as cursor:
                recent_checkin = await cursor.fetchone()
            
            # Common emotions from food logs
            async with db.execute("""
                SELECT emotions_before, emotions_after FROM food_logs 
                WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
            """, (user_id,)) as cursor:
                emotion_rows = await cursor.fetchall()
            
            # User goals
            async with db.execute("""
                SELECT mental_health_goals FROM users WHERE id = ?
            """, (user_id,)) as cursor:
                user_row = await cursor.fetchone()
        
        # Process emotions
        all_emotions = []
        for row in emotion_rows:
            if row['emotions_before']:
                all_emotions.extend(json.loads(row['emotions_before']))
            if row['emotions_after']:
                all_emotions.extend(json.loads(row['emotions_after']))
        
        # Count emotion frequency
        emotion_counts = {}
        for emotion in all_emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        common_emotions = sorted(emotion_counts.keys(), key=emotion_counts.get, reverse=True)[:5]
        
        return UserContext(
            recent_mood=MoodType(recent_checkin['mood']) if recent_checkin else None,
            avg_energy=recent_checkin['energy_level'] if recent_checkin else None,
            avg_stress=recent_checkin['stress_level'] if recent_checkin else None,
            common_emotions=common_emotions,
            goals=json.loads(user_row['mental_health_goals']) if user_row else []
        )


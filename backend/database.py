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
        try:
            async with aiosqlite.connect(self.db_path) as db:
                # Users table with authentication
                await db.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        email TEXT UNIQUE,
                        password TEXT,
                        age INTEGER,
                        preferences TEXT DEFAULT '[]',
                        goals TEXT DEFAULT '[]',
                        dietary_restrictions TEXT DEFAULT '[]',
                        timezone TEXT DEFAULT 'UTC',
                        created_at TEXT NOT NULL,
                        updated_at TEXT NOT NULL,
                        has_completed_onboarding BOOLEAN DEFAULT 0
                    )
                """)
                
                await db.execute("""
                    CREATE TABLE IF NOT EXISTS checkins (
                        id TEXT PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        checkin_type TEXT NOT NULL,
                        mood INTEGER NOT NULL,
                        energy_level INTEGER NOT NULL,
                        stress_level INTEGER NOT NULL,
                        sleep_hours REAL,
                        exercise_minutes INTEGER,
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
                        food_name TEXT NOT NULL,
                        meal_type TEXT NOT NULL,
                        portion_size TEXT,
                        calories INTEGER,
                        mood_before INTEGER,
                        mood_after INTEGER,
                        notes TEXT,
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
                        mood INTEGER,
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
                await db.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
                await db.execute("CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, created_at)")
                await db.execute("CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON food_logs(user_id, created_at)")
                await db.execute("CREATE INDEX IF NOT EXISTS idx_conversations_user_date ON conversations(user_id, created_at)")
                await db.execute("CREATE INDEX IF NOT EXISTS idx_journal_user_date ON journal_entries(user_id, created_at)")
                
                await db.commit()
                print("Database initialized successfully")
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise

    async def close(self):
        """Close database connections"""
        pass  # aiosqlite handles connections automatically

    # User Management
    async def create_user(self, user_data: UserCreate) -> str:
        user_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO users (id, name, email, password, age, preferences, 
                                 goals, dietary_restrictions, timezone, 
                                 created_at, updated_at, has_completed_onboarding)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id, user_data.name, user_data.email, user_data.password,
                user_data.age, json.dumps(user_data.dietary_preferences or []),
                json.dumps(user_data.mental_health_goals or []), 
                json.dumps(user_data.dietary_restrictions or []), 
                user_data.timezone or 'UTC', now, now, False
            ))
            await db.commit()
        
        return user_id

    async def get_user(self, user_id: str):
        """Get user by ID - Returns dict format"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                db.row_factory = aiosqlite.Row
                async with db.execute("SELECT * FROM users WHERE id = ?", (user_id,)) as cursor:
                    row = await cursor.fetchone()
                    if row:
                        user_dict = dict(row)
                        # Parse JSON fields
                        user_dict['dietary_preferences'] = json.loads(user_dict.get('preferences', '[]'))
                        user_dict['mental_health_goals'] = json.loads(user_dict.get('goals', '[]'))
                        user_dict['dietary_restrictions'] = json.loads(user_dict.get('dietary_restrictions', '[]'))
                        return user_dict
                    return None
        except Exception as e:
            print(f"Database error getting user: {e}")
            return None

    async def get_user_by_email(self, email: str):
        """Get user by email address"""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                db.row_factory = aiosqlite.Row
                async with db.execute("SELECT * FROM users WHERE email = ?", (email,)) as cursor:
                    row = await cursor.fetchone()
                    if row:
                        user_dict = dict(row)
                        user_dict['dietary_preferences'] = json.loads(user_dict.get('preferences', '[]'))
                        user_dict['mental_health_goals'] = json.loads(user_dict.get('goals', '[]'))
                        user_dict['dietary_restrictions'] = json.loads(user_dict.get('dietary_restrictions', '[]'))
                        return user_dict
                    return None
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None

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
            updates.append("preferences = ?")
            values.append(json.dumps(user_data.dietary_preferences))
        if user_data.dietary_restrictions is not None:
            updates.append("dietary_restrictions = ?")
            values.append(json.dumps(user_data.dietary_restrictions))
        if user_data.mental_health_goals is not None:
            updates.append("goals = ?")
            values.append(json.dumps(user_data.mental_health_goals))
        
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

    async def get_checkin(self, checkin_id: str):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM checkins WHERE id = ?", (checkin_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                return dict(row)

    async def get_user_checkins(self, user_id: str, limit: int = 10, offset: int = 0):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM checkins WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            """, (user_id, limit, offset)) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]

    async def get_today_checkin(self, user_id: str, checkin_type: str):
        today = datetime.utcnow().date().isoformat()
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM checkins 
                WHERE user_id = ? AND checkin_type = ? AND date(created_at) = ?
                ORDER BY created_at DESC LIMIT 1
            """, (user_id, checkin_type, today)) as cursor:
                row = await cursor.fetchone()
                if row:
                    return dict(row)
                return None

    # Fix create_checkin method in database.py (around line 232)
    async def create_checkin(self, user_id: str, checkin) -> str:
        checkin_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO checkins (id, user_id, checkin_type, mood, energy_level,
                                    stress_level, sleep_hours, exercise_minutes, 
                                    notes, gratitude, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                checkin_id, user_id, checkin.checkin_type, checkin.mood,
                checkin.energy_level, checkin.stress_level, 
                getattr(checkin, 'sleep_hours', None), 
                getattr(checkin, 'exercise_minutes', None),
                getattr(checkin, 'notes', None), 
                getattr(checkin, 'gratitude', None),
                now
            ))
            await db.commit()
        
        return checkin_id

    # Fix create_food_log method in database.py (around line 283)
    async def create_food_log(self, user_id: str, food_log) -> str:
        log_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO food_logs (id, user_id, food_name, meal_type, portion_size,
                                    calories, mood_before, mood_after, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log_id, user_id, 
                getattr(food_log, 'food_name', None),
                getattr(food_log, 'meal_type', None),
                getattr(food_log, 'portion_size', None), 
                getattr(food_log, 'calories', None), 
                getattr(food_log, 'mood_before', None),
                getattr(food_log, 'mood_after', None), 
                getattr(food_log, 'notes', None), 
                now
            ))
            await db.commit()
        
        return log_id

    async def get_food_log(self, log_id: str):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM food_logs WHERE id = ?", (log_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                return dict(row)

    async def get_user_food_logs(self, user_id: str, limit: int = 20, offset: int = 0):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM food_logs WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            """, (user_id, limit, offset)) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]

    # Conversations
    async def save_conversation(self, user_id: str, user_message: str, ai_response: str) -> str:
        # Validate inputs before saving
        if not user_message or not user_message.strip():
            raise ValueError("User message cannot be empty")
        if not ai_response or not ai_response.strip():
            raise ValueError("AI response cannot be empty")
        
        conversation_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO conversations (id, user_id, user_message, ai_response, created_at)
                VALUES (?, ?, ?, ?, ?)
            """, (conversation_id, user_id, user_message.strip(), ai_response.strip(), now))
            await db.commit()
        
        return conversation_id

    async def get_conversation_history(self, user_id: str, limit: int = 50):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM conversations 
                WHERE user_id = ? 
                AND user_message IS NOT NULL 
                AND ai_response IS NOT NULL
                AND trim(user_message) != '' 
                AND trim(ai_response) != ''
                ORDER BY created_at DESC 
                LIMIT ?
            """, (user_id, limit)) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]

    # Journal
    async def create_journal_entry(self, user_id: str, entry) -> str:
        entry_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("""
                INSERT INTO journal_entries (id, user_id, title, content, mood, tags,
                                           is_private, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                entry_id, user_id, entry.title, entry.content,
                entry.mood, json.dumps(entry.tags or []), 
                entry.is_private, now, now
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

    async def get_journal_entry(self, entry_id: str):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM journal_entries WHERE id = ?", (entry_id,)) as cursor:
                row = await cursor.fetchone()
                if not row:
                    return None
                result = dict(row)
                result['tags'] = json.loads(result.get('tags', '[]'))
                return result

    async def get_user_journal_entries(self, user_id: str, limit: int = 20, offset: int = 0):
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("""
                SELECT * FROM journal_entries WHERE user_id = ? 
                ORDER BY created_at DESC LIMIT ? OFFSET ?
            """, (user_id, limit, offset)) as cursor:
                rows = await cursor.fetchall()
                result = []
                for row in rows:
                    row_dict = dict(row)
                    row_dict['tags'] = json.loads(row_dict.get('tags', '[]'))
                    result.append(row_dict)
                return result

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
    async def get_mood_trends(self, user_id: str, days: int = 30):
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

    async def get_user_context(self, user_id: str):
        # Simple implementation - return basic context
        return {
            "recent_mood": None,
            "avg_energy": None,
            "avg_stress": None,
            "common_emotions": [],
            "goals": []
        }
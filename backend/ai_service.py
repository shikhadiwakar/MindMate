# backend/ai_service.py
import json
import asyncio
import aiohttp
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi.responses import StreamingResponse

async def generate_stream(text: str):
    for word in text.split():
        yield word + " "
        await asyncio.sleep(0.05)

# Import models with error handling
try:
    from models import UserContext, MealSuggestion, MindfulPractice
except ImportError as e:
    logger.error(f"Import error for models: {e}")
    # Create minimal model classes if import fails
    class UserContext:
        def __init__(self, recent_mood=None, common_emotions=None, eating_patterns=None):
            self.recent_mood = recent_mood
            self.common_emotions = common_emotions or []
            self.eating_patterns = eating_patterns or []
    
    class MealSuggestion:
        def __init__(self, name, description, ingredients, mood_benefit, prep_time, difficulty):
            self.name = name
            self.description = description
            self.ingredients = ingredients
            self.mood_benefit = mood_benefit
            self.prep_time = prep_time
            self.difficulty = difficulty
    
    class MindfulPractice:
        def __init__(self, name, description, duration, difficulty, benefits, instructions):
            self.name = name
            self.description = description
            self.duration = duration
            self.difficulty = difficulty
            self.benefits = benefits
            self.instructions = instructions

class AIService:
    def __init__(self, ollama_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_url
        self.model_name = "llama3.2:3b"
        self.initialized = False
        
    async def initialize(self):
        """Initialize and check Ollama availability"""
        try:
            timeout = aiohttp.ClientTimeout(total=5)  # Shorter timeout
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(f"{self.ollama_url}/api/tags") as response:
                    if response.status == 200:
                        models = await response.json()
                        model_names = [model['name'] for model in models.get('models', [])]
                        
                        if self.model_name not in model_names:
                            logger.info(f"Model {self.model_name} not found. Available models: {model_names}")
                            # Try to use any available model
                            if model_names:
                                self.model_name = model_names[0]
                                logger.info(f"Using available model: {self.model_name}")
                            else:
                                logger.warning("No models available, will use fallback responses")
                                self.initialized = False
                                return False
                        
                        self.initialized = True
                        logger.info(f"AI Service initialized with {self.model_name}")
                        return True
                    else:
                        logger.error(f"Ollama server returned status {response.status}")
                        self.initialized = False
                        return False
        except Exception as e:
            logger.error(f"Failed to initialize AI service: {e}")
            logger.info("Will use fallback responses")
            self.initialized = False
            return False

    async def chat(self, user_id: str, message: str, context: UserContext = None) -> str:
        """Generate conversational AI response"""
        
        # Always ensure we return a non-empty response
        if not message or not message.strip():
            return "I'm here to listen. What would you like to talk about?"
        
        if not self.initialized:
            return self._get_fallback_response(message)
        
        try:
            # Build system prompt
            system_prompt = """You are a compassionate AI wellness companion. You provide empathetic, supportive responses to help users with mental health and mindful eating. Keep responses warm, concise (2-3 sentences), and encouraging. Never provide medical advice."""
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message.strip()}
            ]
            
            data = {
                "model": self.model_name,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 200  # Shorter responses
                }
            }
            
            timeout = aiohttp.ClientTimeout(total=15)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(f"{self.ollama_url}/api/chat", json=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        ai_response = result.get('message', {}).get('content', '').strip()
                        
                        # Fallback if empty response
                        if not ai_response:
                            return self._get_fallback_response(message)
                        
                        return ai_response
                    else:
                        logger.error(f"Ollama API error: {response.status}")
                        return self._get_fallback_response(message)
                        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return self._get_fallback_response(message)
    
    async def _pull_model(self):
        """Pull the model if not available"""
        async with aiohttp.ClientSession() as session:
            data = {"name": self.model_name}
            async with session.post(f"{self.ollama_url}/api/pull", json=data) as response:
                if response.status == 200:
                    print(f"Successfully pulled {self.model_name}")
                else:
                    print(f"Failed to pull {self.model_name}")

    async def _generate_response(self, prompt: str, system_prompt: str = None) -> str:
        """Generate response using Ollama"""
        if not self.initialized:
            logger.warning("AI Service not initialized, using fallback response")
            return self._get_fallback_response(prompt)
        
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        data = {
            "model": self.model_name,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 500
            }
        }
        
        try:
            timeout = aiohttp.ClientTimeout(total=30)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(f"{self.ollama_url}/api/chat", json=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        return result['message']['content'].strip()
                    else:
                        logger.error(f"Ollama API error: {response.status}")
                        return "I'm having trouble connecting right now. Please try again in a moment."
        except asyncio.TimeoutError:
            logger.error("Ollama request timed out")
            return "I'm taking a bit longer to respond than usual. Please try again."
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return self._get_fallback_response(prompt)
    
    def _get_fallback_response(self, prompt: str) -> str:
        """Enhanced fallback responses"""
        prompt_lower = prompt.lower()
        
        # Emotion-based responses
        if any(word in prompt_lower for word in ['sad', 'depressed', 'down', 'low', 'upset']):
            return "I hear that you're feeling down right now. Your feelings are completely valid. What's been weighing on your mind lately?"
        
        elif any(word in prompt_lower for word in ['anxious', 'worried', 'stressed', 'panic', 'overwhelmed']):
            return "I can sense you're feeling anxious or stressed. Let's take this one step at a time. What's making you feel this way right now?"
        
        elif any(word in prompt_lower for word in ['angry', 'frustrated', 'mad', 'annoyed']):
            return "It sounds like you're feeling frustrated. That's understandable - we all have moments like this. What's been bothering you?"
        
        elif any(word in prompt_lower for word in ['happy', 'good', 'great', 'amazing', 'wonderful']):
            return "I'm so glad to hear you're feeling good! What's been going well for you today?"
        
        elif any(word in prompt_lower for word in ['food', 'eat', 'meal', 'hungry', 'craving']):
            return "I'd love to help you explore your relationship with food. What's on your mind about eating today?"
        
        elif any(word in prompt_lower for word in ['help', 'advice', 'what should i']):
            return "I'm here to support you through whatever you're facing. Tell me more about what kind of help you're looking for today."
        
        else:
            return "I'm here to listen and support you. What's on your mind today?"

    async def chat(self, user_id: str, message: str, context: UserContext = None) -> str:
        """Generate conversational AI response"""
        
        try:
            # Handle None context
            if context is None:
                context = UserContext()
            
            # Build context for the LLM
            context_info = []
            
            if hasattr(context, 'recent_mood') and context.recent_mood:
                mood_value = getattr(context.recent_mood, 'value', str(context.recent_mood))
                context_info.append(f"Recent mood: {mood_value}")
            
            if hasattr(context, 'common_emotions') and context.common_emotions:
                context_info.append(f"Common emotions: {', '.join(context.common_emotions)}")
            
            if hasattr(context, 'eating_patterns') and context.eating_patterns:
                context_info.append(f"Eating patterns: {', '.join(context.eating_patterns)}")
            
            context_str = " | ".join(context_info) if context_info else "No previous context available"
            
            system_prompt = f"""You are a compassionate AI assistant specializing in mental health support and mindful eating. You provide empathetic, non-judgmental responses that help users process their emotions and develop healthier relationships with food and themselves.

Key principles:
- Always be empathetic and validating
- Never provide medical or therapeutic advice
- Focus on mindfulness, self-awareness, and gentle guidance  
- Encourage professional help when appropriate
- Use a warm, conversational tone
- Keep responses concise but meaningful (2-3 paragraphs max)

User context: {context_str}

Respond to the user's message with care and understanding."""

            return await self._generate_response(message, system_prompt)
        
        except Exception as e:
            logger.error(f"Error in chat method: {e}")
            return "I'm here to support you. Please tell me more about what's on your mind today."

    async def generate_daily_insights(self, user_id: str, checkin_id: str) -> str:
        """Generate insights based on daily check-in data"""
        
        system_prompt = """You are generating a brief, encouraging insight for someone who just completed their daily mental health check-in. Focus on:
- Acknowledging their commitment to self-awareness
- Highlighting the value of consistent check-ins
- Keeping it positive and motivating
- 1-2 sentences maximum"""
        
        prompt = "Generate an encouraging insight for someone who just completed their daily check-in."
        
        return await self._generate_response(prompt, system_prompt)

    async def generate_journal_reflection(self, content: str) -> str:
        """Generate AI reflection on journal entry"""
        
        system_prompt = """You are providing a compassionate reflection on someone's journal entry. Your role is to:
- Validate their emotions and experiences
- Offer gentle insights or observations
- Highlight their strengths or growth
- Encourage continued self-reflection
- Keep response to 2-3 sentences
- Never give advice, just reflect back what you observe"""
        
        prompt = f"Please provide a gentle, validating reflection on this journal entry: {content}"
        
        return await self._generate_response(prompt, system_prompt)

    async def get_meal_suggestions(self, user_id: str, mood: Optional[str] = None, energy_level: Optional[int] = None) -> List[MealSuggestion]:
        """Get personalized meal suggestions"""
        
        mood_energy_context = ""
        if mood:
            mood_energy_context += f"Current mood: {mood}. "
        if energy_level:
            mood_energy_context += f"Energy level: {energy_level}/5. "
        
        system_prompt = f"""You are a mindful eating coach. Suggest 2 specific, simple meals that would be nourishing for someone with: {mood_energy_context}

Focus on:
- Meals that support emotional and physical wellbeing
- Simple ingredients and preparation
- How the meal might help their current state
- Practical, accessible options

Format your response as JSON with this structure:
[
  {{
    "name": "Meal Name",
    "description": "Brief description",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "mood_benefit": "How this helps their current state", 
    "prep_time": 15,
    "difficulty": "easy"
  }}
]"""
        
        prompt = "Suggest 2 nourishing meals for this person's current state."
        
        response = await self._generate_response(prompt, system_prompt)
        
        try:
            meals_data = json.loads(response)
            suggestions = []
            for meal in meals_data:
                suggestions.append(MealSuggestion(
                    name=meal.get('name', 'Nourishing Meal'),
                    description=meal.get('description', ''),
                    ingredients=meal.get('ingredients', []),
                    mood_benefit=meal.get('mood_benefit', ''),
                    prep_time=meal.get('prep_time', 10),
                    difficulty=meal.get('difficulty', 'easy')
                ))
            return suggestions
        except:
            # Fallback to simple suggestions if JSON parsing fails
            return await self._get_fallback_meal_suggestions(mood, energy_level)

    async def _get_fallback_meal_suggestions(self, mood: Optional[str], energy_level: Optional[int]) -> List[MealSuggestion]:
        """Fallback meal suggestions if LLM response can't be parsed"""
        suggestions = [
            MealSuggestion(
                name="Comfort Bowl",
                description="Warm, nourishing bowl with your favorite ingredients",
                ingredients=["quinoa", "roasted vegetables", "avocado", "tahini"],
                mood_benefit="Balanced nutrition for steady energy and mood",
                prep_time=20,
                difficulty="easy"
            ),
            MealSuggestion(
                name="Mindful Smoothie",
                description="Nutrient-rich smoothie you can sip slowly",
                ingredients=["banana", "berries", "spinach", "almond milk", "chia seeds"],
                mood_benefit="Easy to digest while providing steady energy",
                prep_time=5,
                difficulty="easy"
            )
        ]
        return suggestions

    async def get_mindful_practices(self, user_id: str, current_mood: Optional[str] = None) -> List[MindfulPractice]:
        """Get personalized mindfulness practices"""
        
        mood_context = f"Current mood: {current_mood}" if current_mood else "General wellbeing"
        
        system_prompt = f"""You are a mindfulness instructor. Suggest 2 specific mindfulness practices for someone with: {mood_context}

Focus on:
- Practices appropriate for their current emotional state
- Clear, step-by-step instructions
- Realistic time commitments
- Specific benefits

Format as JSON:
[
  {{
    "name": "Practice Name",
    "description": "What this practice involves",
    "duration": 5,
    "difficulty": "easy",
    "benefits": ["benefit1", "benefit2"],
    "instructions": ["step1", "step2", "step3"]
  }}
]"""
        
        prompt = "Suggest 2 appropriate mindfulness practices for this person."
        
        response = await self._generate_response(prompt, system_prompt)
        
        try:
            practices_data = json.loads(response)
            practices = []
            for practice in practices_data:
                practices.append(MindfulPractice(
                    name=practice.get('name', 'Mindful Practice'),
                    description=practice.get('description', ''),
                    duration=practice.get('duration', 5),
                    difficulty=practice.get('difficulty', 'easy'),
                    benefits=practice.get('benefits', []),
                    instructions=practice.get('instructions', [])
                ))
            return practices
        except:
            # Fallback practices
            return await self._get_fallback_practices(current_mood)

    async def _get_fallback_practices(self, current_mood: Optional[str]) -> List[MindfulPractice]:
        """Fallback mindfulness practices"""
        practices = [
            MindfulPractice(
                name="3-Minute Breathing Space",
                description="Quick mindfulness reset for busy moments",
                duration=3,
                difficulty="easy",
                benefits=["reduces stress", "increases awareness"],
                instructions=[
                    "Sit comfortably and close your eyes",
                    "Notice your breath without changing it",
                    "When mind wanders, gently return to breath"
                ]
            ),
            MindfulPractice(
                name="Body Check-In",
                description="Brief scan of physical sensations",
                duration=5,
                difficulty="easy",
                benefits=["increases body awareness", "releases tension"],
                instructions=[
                    "Start at the top of your head",
                    "Slowly scan down through your body",
                    "Notice any tension or sensations",
                    "Breathe into areas that need attention"
                ]
            )
        ]
        return practices

    async def generate_weekly_summary(self, user_id: str) -> str:
        """Generate weekly summary insights"""
        
        system_prompt = """Generate an encouraging weekly summary for someone who has been tracking their mental health and eating habits. Focus on:
- Acknowledging their commitment to self-care
- Highlighting the value of consistent tracking
- Encouraging continued growth
- Keep it warm and supportive (2-3 sentences)"""
        
        prompt = "Create a positive weekly summary for someone committed to their wellbeing journey."
        
        return await self._generate_response(prompt, system_prompt)
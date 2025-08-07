# MindMate - Setup Guide

MindMate is a personalized mental wellness and mindful eating companion built with Python FastAPI backend and React frontend.

## 🏗️ Project Structure

```
mindmate/
├── backend/
│   ├── main.py              # FastAPI main application
│   ├── models.py            # Pydantic models
│   ├── database.py          # Database manager
│   ├── ai_service.py        # AI service for chat and insights
│   ├── requirements.txt     # Python dependencies
│   └── mindmate.db         # SQLite database (created automatically)
└── frontend/
    ├── src/
    │   ├── App.js          # Main React application
    │   └── index.js        # React entry point
    ├── public/
    ├── package.json        # Node.js dependencies
    └── tailwind.config.js  # Tailwind CSS configuration
```

## 🚀 Backend Setup (Python FastAPI)

### 1. Create Backend Directory and Virtual Environment

```bash
mkdir mindmate
cd mindmate
mkdir backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

Create the `requirements.txt` file with the provided content, then:

```bash
pip install -r requirements.txt
```

### 3. Create Python Files

Create the following files in the `backend/` directory:
- `main.py` - Main FastAPI application
- `models.py` - Pydantic data models
- `database.py` - Database management
- `ai_service.py` - AI service for chat and insights

Copy the provided code into each respective file.

### 4. Run the Backend

```bash
python main.py
```

The backend API will be available at `http://localhost:8000`

You can view the interactive API documentation at `http://localhost:8000/docs`

## 🎨 Frontend Setup (React + Tailwind CSS)

### 1. Create React Application

```bash
# From the main mindmate directory
cd ..  # Go back to main directory
npx create-react-app frontend
cd frontend
```

### 2. Install Additional Dependencies

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Update CSS

Replace the contents of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
```

### 5. Replace App.js

Replace the contents of `src/App.js` with the provided MindMate React component.

### 6. Update package.json

Add the proxy configuration to connect to the backend:

```json
{
  "proxy": "http://localhost:8000"
}
```

### 7. Run the Frontend

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Development Workflow

### Starting Both Services

1. **Backend** (Terminal 1):
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py
```

2. **Frontend** (Terminal 2):
```bash
cd frontend
npm start
```

## 🌟 Key Features

### ✅ Implemented Features

1. **User Management**
   - User registration and profiles
   - Personalized settings and preferences

2. **Daily Check-ins**
   - Morning and evening mood tracking
   - Energy, stress, and hunger level monitoring
   - Sleep quality tracking
   - Gratitude journaling

3. **AI Companion Chat**
   - Empathetic conversational AI
   - Context-aware responses based on user data
   - Mood-specific support and suggestions

4. **Food Logging**
   - Meal tracking with emotions
   - Mindful eating scoring
   - Before/after hunger levels

5. **Journal System**
   - Private journaling with AI reflections
   - Mood tagging and categorization
   - Insights generation

6. **Analytics Dashboard**
   - Mood trends visualization
   - Food-mood correlation analysis
   - Weekly summaries and insights

7. **Personalized Suggestions**
   - Mood-based meal recommendations
   - Mindful practices tailored to current state
   - CBT-style prompts and exercises

8. **Emergency Resources**
   - Crisis helplines and contacts
   - Quick grounding techniques
   - Breathing exercises

### 🎯 Core Technologies

**Backend:**
- FastAPI for high-performance API
- SQLite for local data storage
- Pydantic for data validation
- Template-based AI responses (ready for LLM integration)

**Frontend:**
- React 18 with hooks
- Tailwind CSS for styling
- Lucide React for icons
- Responsive mobile-first design

## 🔮 Future Enhancements

### AI/ML Integration
- Local LLM integration (Mistral 7B, Phi-2, or Qwen)
- Emotion classification models
- Advanced pattern recognition

### Advanced Features
- Community features and anonymous sharing
- Advanced analytics and visualizations
- Integration with wearable devices
- Notification system
- Multi-language support

### Privacy & Security
- End-to-end encryption
- Enhanced authentication (JWT)
- Data export capabilities
- GDPR compliance features

## 📱 Usage Guide

1. **Daily Routine**:
   - Start with morning check-in
   - Log meals throughout the day
   - Use AI chat for support
   - Complete evening check-in with gratitude

2. **Weekly Review**:
   - Check insights dashboard
   - Review mood trends
   - Adjust goals based on patterns

3. **Crisis Support**:
   - Use emergency button for immediate resources
   - Access grounding techniques
   - Connect with crisis helplines

## 🔒 Privacy & Data

- All data stored locally in SQLite database
- No external data sharing by default
- Anonymous mode available
- User controls all personal information


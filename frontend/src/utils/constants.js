// utils/constants.js

export const MOOD_OPTIONS = [
  { value: 'very_low', label: '😞', title: 'Very Low', color: 'from-red-400 to-red-600', textColor: 'text-red-100' },
  { value: 'low', label: '😔', title: 'Low', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-100' },
  { value: 'neutral', label: '😐', title: 'Neutral', color: 'from-gray-400 to-gray-600', textColor: 'text-gray-100' },
  { value: 'good', label: '😊', title: 'Good', color: 'from-green-400 to-green-600', textColor: 'text-green-100' },
  { value: 'excellent', label: '😄', title: 'Excellent', color: 'from-blue-400 to-blue-600', textColor: 'text-blue-100' },
];

export const MEAL_EMOJIS = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎'
};

export const MEAL_TYPES = [
  { type: 'breakfast', emoji: '🌅' },
  { type: 'lunch', emoji: '☀️' },
  { type: 'dinner', emoji: '🌙' },
  { type: 'snack', emoji: '🍎' }
];

export const TABS_CONFIG = [
  { id: 'checkin', label: 'Check-in', icon: 'Heart', gradient: 'from-pink-500 to-rose-500' },
  { id: 'chat', label: 'Chat', icon: 'MessageCircle', gradient: 'from-blue-500 to-purple-500' },
  { id: 'journal', label: 'Journal', icon: 'BookOpen', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'insights', label: 'Insights', icon: 'BarChart3', gradient: 'from-green-500 to-blue-500' },
];

export const EMERGENCY_RESOURCES = {
  title: '🆘 Emergency Support',
  description: 'If you\'re in crisis or need immediate support, these resources are here for you.',
  helplines: [
    { name: 'National Suicide Prevention Lifeline', number: '988' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741' },
    { name: 'NAMI Helpline', number: '1-800-950-NAMI' }
  ],
  techniques: [
    {
      title: '🧘 5-4-3-2-1 Grounding',
      description: 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.'
    },
    {
      title: '🫁 Box Breathing',
      description: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle 4-6 times to calm your nervous system.'
    }
  ]
};

// Updated constants file with breathing exercises and streak messages

export const MOTIVATIONAL_MESSAGES = [
  "You're doing great! Every small step counts towards your wellness. 🌟",
  "Remember to take deep breaths and be kind to yourself today. 💙",
  "Your mental health matters. Thank you for prioritizing it! 🧠",
  "Each check-in is a moment of self-care. Keep it up! ✨",
  "You're building healthy habits that will serve you well. 💪",
  "Today is a new opportunity to nurture your well-being. 🌱",
  "Your consistency is inspiring! You're on the right path. 🎯",
  "Take a moment to appreciate how far you've come. 🏆",
  "Self-care isn't selfish - you deserve this attention. 💕",
  "Every day you choose wellness is a victory worth celebrating! 🎉"
];

export const STREAK_MOTIVATIONAL_MESSAGES = [
  "What an amazing start to your wellness journey! 🌟",
  "You're building momentum - keep going! 🚀",
  "Consistency is key, and you're mastering it! 🔑",
  "Your dedication is truly inspiring! 💪",
  "Look at you creating healthy habits! 🌱",
  "You're proving that small steps lead to big changes! 👣",
  "Your commitment to wellness is remarkable! ⭐",
  "Every day you choose yourself is a win! 🏆",
  "You're becoming the person you want to be! ✨",
  "Your future self will thank you for this dedication! 💖",
  "Incredible! You're a wellness warrior! ⚡",
  "Your consistency is your superpower! 🦸‍♀️",
  "Amazing work! You're unstoppable! 🌟",
  "You've turned wellness into a lifestyle! 🎯",
  "Legendary dedication! You're an inspiration! 👑"
];

export const BREATHING_TECHNIQUES = {
  '4-7-8': {
    name: '4-7-8 Relaxation Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. Perfect for relaxation and sleep.',
    inhale: 4,
    hold: 7,
    exhale: 8,
    totalCycles: 4,
    difficulty: 'Beginner',
    duration: '2-3 minutes',
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
    icon: '🌙',
    color: 'from-blue-400 to-cyan-400'
  },
  'box': {
    name: 'Box Breathing',
    description: 'Equal counts for all phases. Used by Navy SEALs for focus and calm.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    hold2: 4,
    totalCycles: 5,
    difficulty: 'Intermediate',
    duration: '3-4 minutes',
    benefits: ['Enhances focus', 'Reduces stress', 'Improves performance'],
    icon: '📦',
    color: 'from-purple-400 to-blue-400'
  },
  'simple': {
    name: 'Simple Deep Breathing',
    description: 'Basic deep breathing technique, perfect for beginners.',
    inhale: 4,
    hold: 0,
    exhale: 6,
    totalCycles: 6,
    difficulty: 'Beginner',
    duration: '3-5 minutes',
    benefits: ['Easy to learn', 'Quick relaxation', 'Boosts energy'],
    icon: '🌿',
    color: 'from-green-400 to-teal-400'
  },
  'triangle': {
    name: 'Triangle Breathing',
    description: 'Three-phase breathing for balance and centering.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    totalCycles: 6,
    difficulty: 'Beginner',
    duration: '3-4 minutes',
    benefits: ['Improves balance', 'Increases focus', 'Calms mind'],
    icon: '🔺',
    color: 'from-indigo-400 to-purple-400'
  }
};

export const MOOD_LABELS = [
  { value: 1, label: 'Terrible', emoji: '😢', color: 'text-red-600' },
  { value: 2, label: 'Bad', emoji: '😞', color: 'text-red-500' },
  { value: 3, label: 'Poor', emoji: '😔', color: 'text-orange-600' },
  { value: 4, label: 'Low', emoji: '😕', color: 'text-orange-500' },
  { value: 5, label: 'Okay', emoji: '😐', color: 'text-yellow-600' },
  { value: 6, label: 'Fair', emoji: '🙂', color: 'text-yellow-500' },
  { value: 7, label: 'Good', emoji: '😊', color: 'text-green-500' },
  { value: 8, label: 'Great', emoji: '😄', color: 'text-green-600' },
  { value: 9, label: 'Amazing', emoji: '😁', color: 'text-green-700' },
  { value: 10, label: 'Perfect', emoji: '🤩', color: 'text-green-800' }
];

export const ENERGY_LEVELS = [
  { value: 1, label: 'Exhausted', emoji: '😴', color: 'text-red-600' },
  { value: 2, label: 'Drained', emoji: '😪', color: 'text-red-500' },
  { value: 3, label: 'Tired', emoji: '😌', color: 'text-orange-500' },
  { value: 4, label: 'Low', emoji: '😑', color: 'text-yellow-500' },
  { value: 5, label: 'Moderate', emoji: '🙂', color: 'text-blue-500' },
  { value: 6, label: 'Good', emoji: '😊', color: 'text-green-400' },
  { value: 7, label: 'High', emoji: '😄', color: 'text-green-500' },
  { value: 8, label: 'Energetic', emoji: '🤗', color: 'text-green-600' },
  { value: 9, label: 'Vibrant', emoji: '🤩', color: 'text-green-700' },
  { value: 10, label: 'Electric', emoji: '⚡', color: 'text-yellow-400' }
];

export const STRESS_LEVELS = [
  { value: 1, label: 'Calm', emoji: '😌', color: 'text-green-600' },
  { value: 2, label: 'Relaxed', emoji: '😊', color: 'text-green-500' },
  { value: 3, label: 'Peaceful', emoji: '🙂', color: 'text-green-400' },
  { value: 4, label: 'Mild', emoji: '😐', color: 'text-yellow-400' },
  { value: 5, label: 'Noticeable', emoji: '😕', color: 'text-yellow-500' },
  { value: 6, label: 'Moderate', emoji: '😟', color: 'text-orange-400' },
  { value: 7, label: 'High', emoji: '😰', color: 'text-orange-500' },
  { value: 8, label: 'Intense', emoji: '😨', color: 'text-red-400' },
  { value: 9, label: 'Severe', emoji: '😫', color: 'text-red-500' },
  { value: 10, label: 'Overwhelming', emoji: '😵', color: 'text-red-600' }
];

export const JOURNAL_PROMPTS = [
  "What are three things you're grateful for today?",
  "How did you practice self-care today?",
  "What challenged you today, and how did you handle it?",
  "Describe a moment that made you smile today.",
  "What would you tell a friend who was feeling the way you feel right now?",
  "What's one thing you learned about yourself today?",
  "How did you show kindness to yourself or others today?",
  "What are you looking forward to tomorrow?",
  "What emotions did you experience today, and what triggered them?",
  "If today had a theme, what would it be and why?",
  "What's something you accomplished today, no matter how small?",
  "How did your body feel today? What did it need?",
  "What would make tomorrow even better?",
  "What patterns do you notice in your thoughts or feelings lately?",
  "How did you connect with others today?"
];



export const WELLNESS_TIPS = [
  {
    category: "Sleep",
    tips: [
      "Maintain a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Keep your bedroom cool and dark",
      "Avoid screens 1 hour before bed"
    ]
  },
  {
    category: "Stress Management",
    tips: [
      "Practice deep breathing exercises",
      "Take regular breaks throughout the day",
      "Try progressive muscle relaxation",
      "Engage in activities you enjoy"
    ]
  },
  {
    category: "Physical Health",
    tips: [
      "Stay hydrated throughout the day",
      "Take short walks, especially outdoors",
      "Stretch regularly if you sit a lot",
      "Eat nutritious, regular meals"
    ]
  },
  {
    category: "Mental Health",
    tips: [
      "Practice gratitude daily",
      "Connect with supportive friends/family",
      "Limit negative news consumption",
      "Celebrate small victories"
    ]
  }
];

export const DARK_MODE_STYLES = {
  background: 'bg-gray-900',
  cardBackground: 'bg-gray-800',
  text: 'text-gray-100',
  secondaryText: 'text-gray-300',
  border: 'border-gray-700',
  hover: 'hover:bg-gray-700'
};

export const LIGHT_MODE_STYLES = {
  background: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
  cardBackground: 'bg-white',
  text: 'text-gray-900',
  secondaryText: 'text-gray-600',
  border: 'border-gray-200',
  hover: 'hover:bg-gray-50'
};
import React, { useState, useEffect } from 'react';

// Mock BreathingExercise component for demonstration
const BreathingExercise = ({ technique, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            setPhase(current => {
              if (current === 'inhale') return 'hold';
              if (current === 'hold') return 'exhale';
              return 'inhale';
            });
            return technique === '4-7-8' ? (phase === 'hold' ? 7 : 4) : 4;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, phase, technique]);

  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className={`w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000 flex items-center justify-center
          ${phase === 'inhale' ? 'border-blue-400 scale-110 bg-blue-50' : 
            phase === 'hold' ? 'border-purple-400 scale-105 bg-purple-50' : 
            'border-green-400 scale-95 bg-green-50'}`}>
          <span className="text-2xl font-bold">{count}</span>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg capitalize font-medium">{phase}</p>
        <button
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive && onComplete) {
              setTimeout(() => onComplete(), 5000);
            }
          }}
          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
        >
          {isActive ? 'Pause' : 'Start Exercise'}
        </button>
      </div>
    </div>
  );
};

const BreathingTab = ({ user = { name: 'Friend' } }) => {
  const [selectedTechnique, setSelectedTechnique] = useState('4-7-8');
  const [completedSessions, setCompletedSessions] = useState(3);
  const [particles, setParticles] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Create floating particles animation
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const techniques = [
    {
      id: '4-7-8',
      name: '4-7-8 Twilight',
      description: 'Drift into serenity like moonlight on water',
      duration: '2-3 min',
      difficulty: 'Zen',
      icon: '🌙',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      bgGradient: 'from-indigo-50 to-purple-50',
      benefits: ['Melts anxiety away', 'Dream-like sleep', 'Nervous system reset'],
      color: 'indigo'
    },
    {
      id: 'box',
      name: 'Warrior\'s Focus',
      description: 'Channel your inner strength with tactical breathing',
      duration: '3-4 min',
      difficulty: 'Elite',
      icon: '⚡',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'from-orange-50 to-red-50',
      benefits: ['Laser focus', 'Stress immunity', 'Peak performance'],
      color: 'orange'
    },
    {
      id: 'simple',
      name: 'Forest Whisper',
      description: 'Breathe like the ancient trees, simple and profound',
      duration: '3-5 min',
      difficulty: 'Natural',
      icon: '🌿',
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      bgGradient: 'from-green-50 to-teal-50',
      benefits: ['Instant calm', 'Energy renewal', 'Mind clarity'],
      color: 'green'
    }
  ];

  const handleCompleteExercise = () => {
    setCompletedSessions(prev => prev + 1);
    // Trigger celebration animation
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const selectedTech = techniques.find(t => t.id === selectedTechnique);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white dark:bg-blue-200 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float ${particle.speed + 3}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Breathe
              </span>
              <span className="block text-3xl md:text-4xl font-light text-gray-600 dark:text-gray-300 mt-2">
                {getGreeting()}, {user.name} ✨
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-lg text-gray-600 dark:text-gray-300">
              <span>Your sanctuary of calm awaits</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        {completedSessions > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    {completedSessions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Today</div>
                  <div className="text-2xl">🏆</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                    {Math.floor(completedSessions * 3.5)}min
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Invested</div>
                  <div className="text-2xl">⏰</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                    {completedSessions >= 5 ? 'Zen' : completedSessions >= 3 ? 'Flow' : 'Rising'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current State</div>
                  <div className="text-2xl">🧘‍♀️</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technique Gallery */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            Choose Your Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techniques.map((technique) => (
              <div
                key={technique.id}
                onClick={() => setSelectedTechnique(technique.id)}
                className={`group cursor-pointer relative overflow-hidden rounded-3xl shadow-2xl 
                  transform transition-all duration-500 hover:scale-105 hover:rotate-1
                  ${selectedTechnique === technique.id 
                    ? 'ring-4 ring-purple-400 scale-105 rotate-1' 
                    : 'hover:shadow-3xl'
                  }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${technique.bgGradient} opacity-90`}></div>
                
                {/* Content */}
                <div className="relative z-10 p-8 space-y-6">
                  {/* Icon & Title */}
                  <div className="text-center space-y-4">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                      {technique.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {technique.name}
                      </h3>
                      <p className="text-sm text-gray-600 italic">
                        {technique.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Duration:</span>
                      <span className="font-semibold text-gray-800 bg-white/50 px-3 py-1 rounded-full">
                        {technique.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Level:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white
                        bg-gradient-to-r ${technique.gradient}`}>
                        {technique.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Unlocks:</div>
                    <div className="space-y-2">
                      {technique.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-${technique.color}-500`}></div>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedTechnique === technique.id && (
                    <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Breathing Exercise */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 overflow-hidden">
            {/* Header Bar */}
            <div className={`h-3 bg-gradient-to-r ${selectedTech?.gradient}`}></div>
            
            {/* Exercise Content */}
            <div className="p-12">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {selectedTech?.name} Experience
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Close your eyes, breathe deeply, and let go
                </p>
              </div>
              
              <BreathingExercise 
                technique={selectedTechnique} 
                onComplete={handleCompleteExercise}
              />
            </div>
          </div>
        </div>

        {/* Wisdom Tips */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 rounded-3xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center space-x-3">
                <span>✨</span>
                <span>Ancient Wisdom, Modern Practice</span>
                <span>✨</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🏔️', tip: 'Find your sacred space - even a corner will do', color: 'blue' },
                { icon: '🌸', tip: 'Posture like a mountain - grounded yet reaching', color: 'pink' },
                { icon: '👁️', tip: 'Soften your gaze, turn attention inward', color: 'purple' },
                { icon: '🌊', tip: 'Let thoughts flow like clouds across the sky', color: 'teal' },
                { icon: '🕰️', tip: 'Little and often - consistency over intensity', color: 'indigo' },
                { icon: '🛡️', tip: 'Honor your limits - this is self-care, not challenge', color: 'green' }
              ].map((item, index) => (
                <div key={index} className={`bg-white/70 dark:bg-gray-800/70 rounded-2xl p-6 backdrop-blur-sm
                  border border-${item.color}-200 hover:border-${item.color}-400 transition-all duration-300
                  transform hover:scale-105`}>
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{item.icon}</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default BreathingTab;
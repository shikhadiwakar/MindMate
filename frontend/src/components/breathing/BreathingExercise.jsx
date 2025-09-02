import React, { useState, useEffect, useCallback } from 'react';

const BreathingExercise = ({ technique = '4-7-8', onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const techniques = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, totalCycles: 4, name: '4-7-8 Relaxation' },
    'box': { inhale: 4, hold: 4, exhale: 4, hold2: 4, totalCycles: 5, name: 'Box Breathing' },
    'simple': { inhale: 4, hold: 0, exhale: 6, totalCycles: 6, name: 'Simple Deep Breathing' }
  };
  
  const currentTechnique = techniques[technique];
  
  const startExercise = useCallback(() => {
    setIsActive(true);
    setPhase('inhale');
    setCycleCount(0);
    setTimeRemaining(currentTechnique.inhale);
  }, [currentTechnique.inhale]);
  
  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setCycleCount(0);
    setTimeRemaining(0);
  };
  
  const completeExercise = () => {
    setIsActive(false);
    setPhase('complete');
    if (onComplete) onComplete();
  };
  
  useEffect(() => {
    if (!isActive || phase === 'ready' || phase === 'complete') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next phase
          switch (phase) {
            case 'inhale':
              if (currentTechnique.hold > 0) {
                setPhase('hold');
                return currentTechnique.hold;
              } else {
                setPhase('exhale');
                return currentTechnique.exhale;
              }
            case 'hold':
              if (technique === 'box' && !currentTechnique.hold2Used) {
                setPhase('exhale');
                return currentTechnique.exhale;
              } else {
                setPhase('exhale');
                return currentTechnique.exhale;
              }
            case 'exhale':
              if (technique === 'box') {
                setPhase('hold2');
                return currentTechnique.hold2;
              } else {
                // Complete cycle
                setCycleCount(prevCount => {
                  const newCount = prevCount + 1;
                  if (newCount >= currentTechnique.totalCycles) {
                    completeExercise();
                    return newCount;
                  } else {
                    setPhase('inhale');
                    setTimeRemaining(currentTechnique.inhale);
                    return newCount;
                  }
                });
                return currentTechnique.inhale;
              }
            case 'hold2':
              // Complete cycle for box breathing
              setCycleCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount >= currentTechnique.totalCycles) {
                  completeExercise();
                  return newCount;
                } else {
                  setPhase('inhale');
                  return currentTechnique.inhale;
                }
              });
              return currentTechnique.inhale;
            default:
              return prev - 1;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, phase, currentTechnique, technique, completeExercise]);
  
  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Ready to begin?';
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'hold2': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'complete': return 'Well Done!';
      default: return '';
    }
  };
  
  const getCircleScale = () => {
    switch (phase) {
      case 'inhale': return 'scale-125';
      case 'hold': return 'scale-125';
      case 'hold2': return 'scale-75';
      case 'exhale': return 'scale-75';
      default: return 'scale-100';
    }
  };
  
  const getCircleColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-blue-400';
      case 'hold2': return 'from-purple-400 to-blue-400';
      case 'exhale': return 'from-green-400 to-teal-400';
      case 'complete': return 'from-yellow-400 to-orange-400';
      default: return 'from-gray-400 to-gray-500';
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
      {/* Breathing Circle */}
      <div className="relative">
        <div 
          className={`w-64 h-64 rounded-full bg-gradient-to-br ${getCircleColor()} 
            ${getCircleScale()} transition-all duration-1000 ease-in-out 
            shadow-2xl flex items-center justify-center`}
        >
          <div className="text-white text-center">
            <div className="text-2xl font-bold mb-2">{getPhaseText()}</div>
            {isActive && phase !== 'complete' && (
              <div className="text-4xl font-mono">{timeRemaining}</div>
            )}
          </div>
        </div>
        
        {/* Floating particles animation */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white bg-opacity-60 rounded-full
                  animate-ping`}
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${20 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Progress and Info */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {currentTechnique.name}
        </h3>
        
        {isActive && phase !== 'complete' && (
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Cycle {cycleCount + 1} of {currentTechnique.totalCycles}
          </div>
        )}
        
        {phase === 'complete' && (
          <div className="space-y-2">
            <div className="text-lg text-green-600 dark:text-green-400">
              🌟 Exercise Complete! 🌟
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Great job! You've completed {currentTechnique.totalCycles} breathing cycles.
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex space-x-4">
        {!isActive && phase !== 'complete' && (
          <button
            onClick={startExercise}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 
              rounded-full font-semibold hover:shadow-lg transform hover:scale-105 
              transition-all duration-300"
          >
            Start Breathing
          </button>
        )}
        
        {isActive && (
          <button
            onClick={stopExercise}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 
              rounded-full font-semibold hover:shadow-lg transform hover:scale-105 
              transition-all duration-300"
          >
            Stop
          </button>
        )}
        
        {phase === 'complete' && (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setPhase('ready');
                setCycleCount(0);
              }}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 
                rounded-full font-semibold hover:shadow-lg transform hover:scale-105 
                transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      
      {/* Technique Info */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
        {technique === '4-7-8' && "Inhale for 4, hold for 7, exhale for 8. Perfect for relaxation and sleep."}
        {technique === 'box' && "Inhale, hold, exhale, hold - each for 4 seconds. Great for focus and calm."}
        {technique === 'simple' && "Simple deep breathing. Inhale for 4, exhale for 6. Perfect for beginners."}
      </div>
    </div>
  );
};

export default BreathingExercise;
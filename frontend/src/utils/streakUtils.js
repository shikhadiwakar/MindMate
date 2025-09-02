// Streak calculation and management utilities

export const calculateStreak = (checkInDates) => {
  if (!checkInDates || checkInDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = checkInDates.sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(sortedDates[i]);
    checkDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (checkDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getStreakMilestone = (streak) => {
  if (streak >= 365) return { level: 'legend', emoji: '🏆', title: 'Wellness Legend' };
  if (streak >= 100) return { level: 'master', emoji: '👑', title: 'Wellness Master' };
  if (streak >= 50) return { level: 'champion', emoji: '🌟', title: 'Wellness Champion' };
  if (streak >= 30) return { level: 'warrior', emoji: '⚡', title: 'Wellness Warrior' };
  if (streak >= 14) return { level: 'achiever', emoji: '🎯', title: 'Wellness Achiever' };
  if (streak >= 7) return { level: 'builder', emoji: '🔥', title: 'Streak Builder' };
  if (streak >= 3) return { level: 'starter', emoji: '🌱', title: 'Wellness Starter' };
  return { level: 'beginner', emoji: '✨', title: 'New Journey' };
};

export const getStreakMessage = (streak) => {
  const messages = {
    1: "Amazing start! Every journey begins with a single step. 🌟",
    3: "Three days strong! You're building a powerful habit. 🔥",
    7: "One week milestone! Your dedication is inspiring. 🎉",
    14: "Two weeks of consistency! You're on fire! ⚡",
    30: "30 days of wellness! You're a true champion! 🏆",
    50: "50 days! Your commitment is extraordinary! 👑",
    100: "100 days! You've achieved wellness mastery! 🌟✨",
    365: "One full year! You are a wellness legend! 🏆👑🌟"
  };
  
  if (messages[streak]) {
    return messages[streak];
  }
  
  // Generate messages for other milestones
  if (streak % 50 === 0) return `${streak} days of pure dedication! Keep shining! ✨`;
  if (streak % 25 === 0) return `${streak} days and counting! You're unstoppable! 🚀`;
  if (streak % 10 === 0) return `${streak} days strong! Your consistency amazes us! 💪`;
  
  return `${streak} days of wellness! Keep up the amazing work! 🌈`;
};

export const shouldShowStreakPopup = (currentStreak, lastShownStreak) => {
  // Show popup for first day, weekly milestones, and special milestones
  if (currentStreak === 1) return true;
  if (currentStreak % 7 === 0 && currentStreak > lastShownStreak) return true;
  if ([3, 14, 30, 50, 100, 365].includes(currentStreak) && currentStreak > lastShownStreak) return true;
  return false;
};
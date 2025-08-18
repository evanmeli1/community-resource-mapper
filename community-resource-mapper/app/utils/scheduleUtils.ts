interface Schedule {
  [key: string]: string; // e.g., { "monday": "9-17", "tuesday": "closed" }
}

export function isOpenNow(schedule: Schedule): boolean {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + (currentMinute / 60); // Convert to decimal hours

  const todaySchedule = schedule[currentDay];
  
  if (!todaySchedule || todaySchedule === 'closed') {
    return false;
  }

  // Handle different time formats
  if (todaySchedule.includes('-')) {
    const [startTime, endTime] = todaySchedule.split('-');
    const start = parseTimeString(startTime);
    const end = parseTimeString(endTime);
    
    if (start !== null && end !== null) {
      return currentTime >= start && currentTime <= end;
    }
  }

  return false;
}

function parseTimeString(timeStr: string): number | null {
  const cleaned = timeStr.trim();
  
  // Handle formats like "9:00", "09:00", "9", "17:30"
  if (cleaned.includes(':')) {
    const [hours, minutes] = cleaned.split(':').map(Number);
    return hours + (minutes / 60);
  } else {
    // Just hours like "9" or "17"
    const hours = parseInt(cleaned);
    return isNaN(hours) ? null : hours;
  }
}

export function getOpenStatus(schedule: Schedule): string {
  if (isOpenNow(schedule)) {
    return 'open';
  } else {
    return 'closed';
  }
}

export function getNextOpenTime(schedule: Schedule): string {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Check if opens later today
  const currentDay = dayNames[now.getDay()];
  const todaySchedule = schedule[currentDay];
  
  if (todaySchedule && todaySchedule !== 'closed' && todaySchedule.includes('-')) {
    const [startTime] = todaySchedule.split('-');
    return `Opens at ${startTime} today`;
  }
  
  // Check tomorrow and beyond
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (now.getDay() + i) % 7;
    const day = dayNames[dayIndex];
    const daySchedule = schedule[day];
    
    if (daySchedule && daySchedule !== 'closed') {
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      return `Opens ${dayName}`;
    }
  }
  
  return 'Schedule unavailable';
}
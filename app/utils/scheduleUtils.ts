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

function formatTime(timeDecimal: number): string {
  const hours = Math.floor(timeDecimal);
  const minutes = Math.round((timeDecimal - hours) * 60);
  
  if (hours === 0) return `12:${minutes.toString().padStart(2, '0')}am`;
  if (hours < 12) return `${hours}:${minutes.toString().padStart(2, '0')}am`;
  if (hours === 12) return `12:${minutes.toString().padStart(2, '0')}pm`;
  return `${hours - 12}:${minutes.toString().padStart(2, '0')}pm`;
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

// Get current status with user-friendly text and midnight cutoff logic
export function getStatusDisplay(schedule: Schedule): {
  isOpen: boolean;
  text: string;
  color: 'green' | 'red' | 'yellow' | 'orange' | 'gray';
} {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + (currentMinute / 60);

  const todaySchedule = schedule[currentDay];
  
  // No schedule data
  if (!todaySchedule) {
    return {
      isOpen: false,
      text: 'Hours unknown',
      color: 'gray'
    };
  }

  // Closed today
  if (todaySchedule === 'closed') {
    const nextOpen = findNextOpenDay(schedule, now);
    return {
      isOpen: false,
      text: nextOpen || 'Closed today',
      color: 'red'
    };
  }

  // Parse today's time ranges (handles both single "9-17" and multi "8-9,12-13:30,16-17:30")
  const timeRanges = todaySchedule.split(',').map(range => {
    if (range.includes('-')) {
      const [startTime, endTime] = range.split('-');
      const start = parseTimeString(startTime);
      const end = parseTimeString(endTime);
      return { start, end, startTime, endTime };
    }
    return null;
  }).filter(Boolean) as Array<{start: number; end: number; startTime: string; endTime: string}>;

  if (timeRanges.length === 0) {
    return {
      isOpen: false,
      text: 'Hours unavailable',
      color: 'gray'
    };
  }

  // Check if currently in any time range
  for (const range of timeRanges) {
    if (currentTime >= range.start && currentTime <= range.end) {
      const closingTimeFormatted = formatTime(range.end);
      const minutesUntilClose = (range.end - currentTime) * 60;
      
      if (minutesUntilClose <= 30) {
        return {
          isOpen: true,
          text: `Closes soon (${closingTimeFormatted})`,
          color: 'yellow'
        };
      } else {
        return {
          isOpen: true,
          text: `Open until ${closingTimeFormatted}`,
          color: 'green'
        };
      }
    }
  }

  // Not currently open - find next opening
  const futureRanges = timeRanges.filter(range => currentTime < range.start);
  
  if (futureRanges.length > 0) {
    // Find the earliest future opening today
    const nextRange = futureRanges.reduce((earliest, range) => 
      range.start < earliest.start ? range : earliest
    );
    
    const hoursUntilOpen = nextRange.start - currentTime;
    const openingTimeFormatted = formatTime(nextRange.start);
    
    // Color based on time until opening
    let color: 'yellow' | 'orange';
    if (hoursUntilOpen <= 3) {
      color = 'yellow'; // Opens soon
    } else {
      color = 'orange'; // Opens later today
    }
    
    return {
      isOpen: false,
      text: `Opens ${openingTimeFormatted}`,
      color: color
    };
  }

  // No more openings today - check tomorrow
  const nextOpen = findNextOpenDay(schedule, now);
  return {
    isOpen: false,
    text: nextOpen || 'Closed',
    color: 'red'
  };
}

function findNextOpenDay(schedule: Schedule, currentDate: Date): string | null {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Check tomorrow and beyond (up to 7 days)
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    
    const dayIndex = nextDate.getDay();
    const day = dayNames[dayIndex];
    const daySchedule = schedule[day];
    
    if (daySchedule && daySchedule !== 'closed') {
      // Get first opening time of that day
      const firstRange = daySchedule.split(',')[0];
      if (firstRange.includes('-')) {
        const [startTime] = firstRange.split('-');
        const start = parseTimeString(startTime);
        
        if (start !== null) {
          const timeFormatted = formatTime(start);
          
          // Check if next opening is tomorrow or later
          const tomorrow = new Date(currentDate);
          tomorrow.setDate(currentDate.getDate() + 1);
          
          if (nextDate.toDateString() === tomorrow.toDateString()) {
            return `Opens tomorrow ${timeFormatted}`;
          } else {
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            return `Opens ${dayName} ${timeFormatted}`;
          }
        }
      }
    }
  }
  
  return null;
}
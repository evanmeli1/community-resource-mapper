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
  
  if (!todaySchedule) {
    return false;
  }

  const cleaned = todaySchedule.trim().toLowerCase();

  if (cleaned === 'closed' || cleaned === 'by appointment') {
    return false;
  }

  if (cleaned === 'open 24 hours' || cleaned === '0:00-23:59') {
    return true;
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
  const cleaned = timeStr.trim().toLowerCase();

  // Handle special cases
  if (cleaned === "closed" || cleaned === "by appointment" || cleaned === "open 24 hours") {
    return null;
  }

  // Match formats like "9", "9:30", "9 am", "9:30 pm", "12:00 pm"
  const match = cleaned.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const meridian = match[3];

  if (meridian === "pm" && hours < 12) hours += 12;
  if (meridian === "am" && hours === 12) hours = 0;

  return hours + minutes / 60;
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
  
  if (todaySchedule) {
    const cleaned = todaySchedule.trim().toLowerCase();

    if (cleaned === 'open 24 hours' || cleaned === '0:00-23:59') {
      return 'Open 24 Hours';
    }

    if (cleaned === 'by appointment') {
      return 'Call to confirm hours';
    }

    if (cleaned !== 'closed' && todaySchedule.includes('-')) {
      const [startTime] = todaySchedule.split('-');
      return `Opens at ${startTime} today`;
    }
  }
  
  // Check tomorrow and beyond
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (now.getDay() + i) % 7;
    const day = dayNames[dayIndex];
    const daySchedule = schedule[day];
    
    if (daySchedule) {
      const cleaned = daySchedule.trim().toLowerCase();

      if (cleaned === 'open 24 hours' || cleaned === '0:00-23:59') {
        return `Opens ${day.charAt(0).toUpperCase() + day.slice(1)} (24 Hours)`;
      }

      if (cleaned === 'by appointment') {
        return 'Call to confirm hours';
      }

      if (cleaned !== 'closed' && daySchedule.includes('-')) {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        return `Opens ${dayName}`;
      }
    }
  }
  
  return 'Call to confirm hours';
}

export function getStatusDisplay(schedule: Schedule): {
  isOpen: boolean;
  text: string;
  color: 'green' | 'red' | 'yellow' | 'orange' | 'gray';
} {
  // Handle completely missing or empty schedule
  if (!schedule || Object.keys(schedule).length === 0) {
    return {
      isOpen: false,
      text: 'Call to confirm hours',
      color: 'gray'
    };
  }

  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour + (currentMinute / 60);

  const todaySchedule = schedule[currentDay];
  
  if (!todaySchedule) {
    const nextOpen = findNextOpenDay(schedule, now);
    return {
      isOpen: false,
      text: nextOpen || 'Call to confirm hours',
      color: 'red'
    };
  }

  const cleaned = todaySchedule.trim().toLowerCase();

  // Handle scenarios
  if (cleaned === 'closed') {
    const nextOpen = findNextOpenDay(schedule, now);
    return {
      isOpen: false,
      text: nextOpen || 'Call to confirm hours',
      color: nextOpen ? 'red' : 'gray'
    };
  }

  if (cleaned === 'open 24 hours' || cleaned === '0:00-23:59') {
    return {
      isOpen: true,
      text: 'Open 24 Hours',
      color: 'green'
    };
  }

  if (cleaned === 'by appointment') {
    return {
      isOpen: false,
      text: 'Call to confirm hours',
      color: 'gray'
    };
  }

  // Parse today's time ranges (supports multi-ranges separated by commas)
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
      text: 'Call to confirm hours',
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

  // Not currently open - find next opening today
  const futureRanges = timeRanges.filter(range => currentTime < range.start);
  
  if (futureRanges.length > 0) {
    const nextRange = futureRanges.reduce((earliest, range) => 
      range.start < earliest.start ? range : earliest
    );
    
    const hoursUntilOpen = nextRange.start - currentTime;
    const openingTimeFormatted = formatTime(nextRange.start);
    
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
    text: nextOpen || 'Call to confirm hours',
    color: nextOpen ? 'red' : 'gray'
  };
}

function findNextOpenDay(schedule: Schedule, currentDate: Date): string | null {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    
    const dayIndex = nextDate.getDay();
    const day = dayNames[dayIndex];
    const daySchedule = schedule[day];
    
    if (daySchedule) {
      const cleaned = daySchedule.trim().toLowerCase();

      if (cleaned === 'closed') continue;

      if (cleaned === 'open 24 hours' || cleaned === '0:00-23:59') {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);
        
        if (nextDate.toDateString() === tomorrow.toDateString()) {
          return `Opens tomorrow (24 Hours)`;
        } else {
          return `Opens ${dayName} (24 Hours)`;
        }
      }
      
      if (cleaned === 'by appointment') {
        return 'Call to confirm hours';
      }

      const firstRange = daySchedule.split(',')[0];
      if (firstRange.includes('-')) {
        const [startTime] = firstRange.split('-');
        const start = parseTimeString(startTime);
        
        if (start !== null) {
          const timeFormatted = formatTime(start);
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

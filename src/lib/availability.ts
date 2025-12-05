// Availability configuration for Shahan Ahmed
// All times are in America/New_York timezone

export interface TimeSlot {
  start: string; // Format: "HH:MM" (24-hour)
  end: string;
}

export interface DayAvailability {
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  slots: TimeSlot[];
  available: boolean;
}

export interface AvailabilityConfig {
  weeklySchedule: DayAvailability[];
  blackoutDates: string[]; // Format: "YYYY-MM-DD"
  slotDuration: number; // in minutes
  minLeadTime: number; // in hours (minimum hours before appointment)
  maxAdvanceBooking: number; // in days (how far in advance can book)
  bufferBetweenSlots: number; // in minutes
  maxAppointmentsPerDay: number;
}

// Default availability configuration
export const defaultAvailability: AvailabilityConfig = {
  weeklySchedule: [
    {
      day: 0, // Sunday
      available: false,
      slots: []
    },
    {
      day: 1, // Monday
      available: true,
      slots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]
    },
    {
      day: 2, // Tuesday
      available: true,
      slots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]
    },
    {
      day: 3, // Wednesday
      available: true,
      slots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]
    },
    {
      day: 4, // Thursday
      available: true,
      slots: [
        { start: '09:00', end: '12:00' },
        { start: '14:00', end: '17:00' }
      ]
    },
    {
      day: 5, // Friday
      available: true,
      slots: [
        { start: '09:00', end: '12:00' }
      ]
    },
    {
      day: 6, // Saturday
      available: false,
      slots: []
    }
  ],
  blackoutDates: [
    // Add holidays or unavailable dates here
    // Format: "YYYY-MM-DD"
    // Example: "2025-12-25", "2026-01-01"
  ],
  slotDuration: 30, // 30 minutes per appointment
  minLeadTime: 24, // Must book at least 24 hours in advance
  maxAdvanceBooking: 60, // Can book up to 60 days in advance
  bufferBetweenSlots: 15, // 15 minutes buffer between appointments
  maxAppointmentsPerDay: 4 // Maximum 4 appointments per day
};

/**
 * Generate available time slots for a given date
 */
export function generateTimeSlots(date: Date, config: AvailabilityConfig = defaultAvailability): string[] {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];
  
  // Check if date is blacked out
  if (config.blackoutDates.includes(dateStr)) {
    return [];
  }
  
  // Check if day is available
  const daySchedule = config.weeklySchedule.find(s => s.day === dayOfWeek);
  if (!daySchedule || !daySchedule.available) {
    return [];
  }
  
  const slots: string[] = [];
  
  // Generate slots for each time range
  daySchedule.slots.forEach(range => {
    const [startHour, startMin] = range.start.split(':').map(Number);
    const [endHour, endMin] = range.end.split(':').map(Number);
    
    const startTime = new Date(date);
    startTime.setHours(startHour, startMin, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);
    
    const currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + config.slotDuration);
      
      if (slotEnd <= endTime) {
        const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
        slots.push(timeStr);
      }
      
      // Move to next slot (with buffer)
      currentTime.setMinutes(currentTime.getMinutes() + config.slotDuration + config.bufferBetweenSlots);
    }
  });
  
  return slots;
}

/**
 * Check if a date is available for booking
 */
export function isDateAvailable(date: Date, config: AvailabilityConfig = defaultAvailability): boolean {
  const now = new Date();
  const dateStr = date.toISOString().split('T')[0];
  
  // Check if date is in the past
  if (date < now) {
    return false;
  }
  
  // Check minimum lead time
  const minTime = new Date(now);
  minTime.setHours(minTime.getHours() + config.minLeadTime);
  if (date < minTime) {
    return false;
  }
  
  // Check maximum advance booking
  const maxTime = new Date(now);
  maxTime.setDate(maxTime.getDate() + config.maxAdvanceBooking);
  if (date > maxTime) {
    return false;
  }
  
  // Check if date is blacked out
  if (config.blackoutDates.includes(dateStr)) {
    return false;
  }
  
  // Check if day is available
  const dayOfWeek = date.getDay();
  const daySchedule = config.weeklySchedule.find(s => s.day === dayOfWeek);
  if (!daySchedule || !daySchedule.available) {
    return false;
  }
  
  return true;
}

/**
 * Get available dates in a month range
 */
export function getAvailableDates(startDate: Date, endDate: Date, config: AvailabilityConfig = defaultAvailability): Date[] {
  const availableDates: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isDateAvailable(current, config)) {
      availableDates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return availableDates;
}


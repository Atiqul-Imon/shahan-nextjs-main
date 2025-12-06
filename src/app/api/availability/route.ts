import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Availability from '@/models/Availability';
import { verifyAccessToken } from '@/lib/auth';

/**
 * GET /api/availability
 * Get current availability settings (public for frontend, admin for editing)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get or create availability configuration
    let availability = await Availability.findOne();
    if (!availability) {
      // Create default configuration
      availability = new Availability({
        weeklySchedule: [
          { day: 0, available: false, slots: [] }, // Sunday
          { day: 1, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Monday
          { day: 2, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Tuesday
          { day: 3, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Wednesday
          { day: 4, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Thursday
          { day: 5, available: true, slots: [{ start: '09:00', end: '12:00' }] }, // Friday
          { day: 6, available: false, slots: [] } // Saturday
        ],
        blackoutDates: [],
        slotDuration: 30,
        minLeadTime: 24,
        maxAdvanceBooking: 60,
        bufferBetweenSlots: 15,
        maxAppointmentsPerDay: 4,
        timezone: 'America/New_York'
      });
      await availability.save();
    }
    
    return NextResponse.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { message: 'Failed to fetch availability settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/availability
 * Update availability settings (admin only)
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      weeklySchedule,
      blackoutDates,
      slotDuration,
      minLeadTime,
      maxAdvanceBooking,
      bufferBetweenSlots,
      maxAppointmentsPerDay,
      timezone
    } = body;

    // Validate required fields
    if (!weeklySchedule || !Array.isArray(weeklySchedule) || weeklySchedule.length !== 7) {
      return NextResponse.json(
        { message: 'Weekly schedule must contain exactly 7 days' },
        { status: 400 }
      );
    }

    // Validate slot duration
    if (slotDuration !== undefined && (slotDuration < 15 || slotDuration > 120)) {
      return NextResponse.json(
        { message: 'Slot duration must be between 15 and 120 minutes' },
        { status: 400 }
      );
    }

    // Validate min lead time
    if (minLeadTime !== undefined && (minLeadTime < 0 || minLeadTime > 168)) {
      return NextResponse.json(
        { message: 'Minimum lead time must be between 0 and 168 hours' },
        { status: 400 }
      );
    }

    // Validate max advance booking
    if (maxAdvanceBooking !== undefined && (maxAdvanceBooking < 1 || maxAdvanceBooking > 365)) {
      return NextResponse.json(
        { message: 'Maximum advance booking must be between 1 and 365 days' },
        { status: 400 }
      );
    }

    // Validate buffer between slots
    if (bufferBetweenSlots !== undefined && (bufferBetweenSlots < 0 || bufferBetweenSlots > 60)) {
      return NextResponse.json(
        { message: 'Buffer between slots must be between 0 and 60 minutes' },
        { status: 400 }
      );
    }

    // Validate max appointments per day
    if (maxAppointmentsPerDay !== undefined && (maxAppointmentsPerDay < 1 || maxAppointmentsPerDay > 50)) {
      return NextResponse.json(
        { message: 'Maximum appointments per day must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Validate time slots for each day
    for (const day of weeklySchedule) {
      if (day.available && day.slots && Array.isArray(day.slots)) {
        for (const slot of day.slots) {
          if (!slot.start || !slot.end) {
            return NextResponse.json(
              { message: `Time slot for day ${day.day} must have both start and end times` },
              { status: 400 }
            );
          }
          
          // Validate time format
          const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(slot.start) || !timeRegex.test(slot.end)) {
            return NextResponse.json(
              { message: `Time slot for day ${day.day} must be in HH:MM format (24-hour)` },
              { status: 400 }
            );
          }
          
          // Validate start < end
          const [startHour, startMin] = slot.start.split(':').map(Number);
          const [endHour, endMin] = slot.end.split(':').map(Number);
          const startMinutes = startHour * 60 + startMin;
          const endMinutes = endHour * 60 + endMin;
          
          if (startMinutes >= endMinutes) {
            return NextResponse.json(
              { message: `Time slot for day ${day.day}: start time must be before end time` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Validate blackout dates format
    if (blackoutDates && Array.isArray(blackoutDates)) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      for (const date of blackoutDates) {
        if (!dateRegex.test(date)) {
          return NextResponse.json(
            { message: `Blackout date "${date}" must be in YYYY-MM-DD format` },
            { status: 400 }
          );
        }
      }
    }

    // Get or create availability configuration
    let availability = await Availability.findOne();
    
    if (!availability) {
      availability = new Availability({
        weeklySchedule,
        blackoutDates: blackoutDates || [],
        slotDuration: slotDuration || 30,
        minLeadTime: minLeadTime || 24,
        maxAdvanceBooking: maxAdvanceBooking || 60,
        bufferBetweenSlots: bufferBetweenSlots || 15,
        maxAppointmentsPerDay: maxAppointmentsPerDay || 4,
        timezone: timezone || 'America/New_York'
      });
    } else {
      // Update existing configuration
      if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
      if (blackoutDates !== undefined) availability.blackoutDates = blackoutDates;
      if (slotDuration !== undefined) availability.slotDuration = slotDuration;
      if (minLeadTime !== undefined) availability.minLeadTime = minLeadTime;
      if (maxAdvanceBooking !== undefined) availability.maxAdvanceBooking = maxAdvanceBooking;
      if (bufferBetweenSlots !== undefined) availability.bufferBetweenSlots = bufferBetweenSlots;
      if (maxAppointmentsPerDay !== undefined) availability.maxAppointmentsPerDay = maxAppointmentsPerDay;
      if (timezone) availability.timezone = timezone;
    }

    await availability.save();

    return NextResponse.json({
      success: true,
      message: 'Availability settings updated successfully',
      data: availability
    });

  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json(
      { message: 'Failed to update availability settings' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { sendAppointmentEmail, sendAppointmentConfirmationEmail } from '@/lib/email';
import { isDateAvailable, generateTimeSlots, defaultAvailability } from '@/lib/availability';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `${ip}:appointments`;
    const rateLimitResult = checkRateLimit(rateLimitKey, RATE_LIMITS.contact);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, email, topic, details, date, time, timezone, website } = body;

    // Honeypot check
    if (website && website.trim() !== '') {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      );
    }

    // Validation
    if (!name || !email || !topic || !date || !time || !timezone) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { message: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Validate topic length
    if (topic.trim().length < 3 || topic.trim().length > 200) {
      return NextResponse.json(
        { message: 'Topic must be between 3 and 200 characters' },
        { status: 400 }
      );
    }

    // Validate details length if provided
    if (details && details.trim().length > 1000) {
      return NextResponse.json(
        { message: 'Details must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // Parse and validate date/time
    const appointmentDate = new Date(`${date}T${time}`);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    // Check if date is available
    if (!isDateAvailable(appointmentDate, defaultAvailability)) {
      return NextResponse.json(
        { message: 'Selected date is not available for booking' },
        { status: 400 }
      );
    }

    // Check if time slot is valid
    const availableSlots = generateTimeSlots(new Date(date), defaultAvailability);
    if (!availableSlots.includes(time)) {
      return NextResponse.json(
        { message: 'Selected time slot is not available' },
        { status: 400 }
      );
    }

    // Calculate end time (30 minutes after start)
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + defaultAvailability.slotDuration);

    // Check for overlapping appointments
    const overlapping = await Appointment.findOne({
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: appointmentDate }
        }
      ]
    });

    if (overlapping) {
      return NextResponse.json(
        { message: 'This time slot is already booked. Please select another time.' },
        { status: 409 }
      );
    }

    // Check daily appointment limit
    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(appointmentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dayAppointments = await Appointment.countDocuments({
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $gte: dayStart, $lte: dayEnd }
    });

    if (dayAppointments >= defaultAvailability.maxAppointmentsPerDay) {
      return NextResponse.json(
        { message: 'Maximum appointments reached for this day. Please select another date.' },
        { status: 409 }
      );
    }

    // Get client IP and user agent
    const ipAddress = ip;
    const userAgent = request.headers.get('user-agent') || '';

    // Create appointment
    const appointment = new Appointment({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic.trim(),
      details: details ? details.trim() : '',
      startTime: appointmentDate,
      endTime: endTime,
      timezone: timezone,
      status: 'pending',
      ipAddress,
      userAgent
    });

    await appointment.save();

    // Send emails
    try {
      await sendAppointmentEmail({
        name: appointment.name,
        email: appointment.email,
        topic: appointment.topic,
        details: appointment.details,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        timezone: appointment.timezone
      });

      await sendAppointmentConfirmationEmail({
        name: appointment.name,
        email: appointment.email,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        timezone: appointment.timezone,
        topic: appointment.topic
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Appointment request submitted successfully',
        appointmentId: appointment._id
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Appointment creation error:', error);

    return NextResponse.json(
      { message: 'Failed to create appointment. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { message: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get booked slots for the date
    const dateObj = new Date(date);
    const dayStart = new Date(dateObj);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateObj);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $gte: dayStart, $lte: dayEnd }
    }).select('startTime endTime');

    const bookedSlots = bookedAppointments.map(apt => {
      const start = new Date(apt.startTime);
      return `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
    });

    return NextResponse.json({ bookedSlots }, { status: 200 });

  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return NextResponse.json(
      { message: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}


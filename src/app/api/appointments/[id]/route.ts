import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/models/Appointment';
import { verifyAccessToken } from '@/lib/auth';
import { sendAppointmentConfirmationEmail } from '@/lib/email';

/**
 * GET /api/appointments/[id]
 * Get a specific appointment by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/appointments/[id]
 * Update appointment status and admin notes (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    const body = await request.json();
    const { status, adminNotes } = body;

    // Validate status if provided
    if (status && !['pending', 'confirmed', 'rejected', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be one of: pending, confirmed, rejected, cancelled' },
        { status: 400 }
      );
    }

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update status and set timestamp
    if (status && status !== appointment.status) {
      appointment.status = status;
      
      // Set appropriate timestamp
      if (status === 'confirmed') {
        appointment.confirmedAt = new Date();
      } else if (status === 'rejected') {
        appointment.rejectedAt = new Date();
      } else if (status === 'cancelled') {
        appointment.cancelledAt = new Date();
      }
    }

    // Update admin notes
    if (adminNotes !== undefined) {
      appointment.adminNotes = adminNotes;
    }

    await appointment.save();

    // Send confirmation email if status changed to confirmed
    if (status === 'confirmed' && appointment.status === 'confirmed') {
      try {
        await sendAppointmentConfirmationEmail({
          name: appointment.name,
          email: appointment.email,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          timezone: appointment.timezone,
          topic: appointment.topic
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id]
 * Delete an appointment (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { verifyAccessToken } from '@/lib/auth';

// GET single contact message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Contact message not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Error fetching contact message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch contact message'
    }, { status: 500 });
  }
}

// PUT update contact message status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const { status, adminNotes } = await request.json();

    // Validate status
    if (status && !['unread', 'read', 'replied'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status'
      }, { status: 400 });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Contact message not found'
      }, { status: 404 });
    }

    // Update fields
    const updateData: Record<string, unknown> = {};
    
    if (status) {
      updateData.status = status;
      
      // Set timestamps based on status
      if (status === 'read' && contact.status === 'unread') {
        updateData.readAt = new Date();
      } else if (status === 'replied') {
        updateData.repliedAt = new Date();
        if (!contact.readAt) {
          updateData.readAt = new Date();
        }
      }
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Contact message updated successfully',
      data: updatedContact
    });

  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update contact message'
    }, { status: 500 });
  }
}

// DELETE contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({
        success: false,
        message: 'Contact message not found'
      }, { status: 404 });
    }

    await Contact.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete contact message'
    }, { status: 500 });
  }
}

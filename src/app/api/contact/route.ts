import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, message, website } = body; // website is honeypot field

    // Honeypot check - if this field is filled, it's a bot
    if (website && website.trim() !== '') {
      return NextResponse.json({
        success: false,
        message: 'Message sent successfully! I will get back to you soon.'
      }, { status: 200 }); // Return success to confuse bots
    }

    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and message are required'
      }, { status: 400 });
    }

    // Input length validation to prevent abuse
    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return NextResponse.json({
        success: false,
        message: 'Input fields are too long. Please keep them within limits.'
      }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // Save to database
    const contactMessage = new Contact({
      name,
      email,
      message,
      ipAddress,
      userAgent,
      status: 'unread'
    });

    await contactMessage.save();

    // Send email notification
    try {
      await sendContactEmail({ name, email, message });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails, message is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    }, { status: 500 });
  }
}

// GET endpoint for admin to fetch contact messages
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // This should be protected by authentication in a real app
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    if (status && ['unread', 'read', 'replied'].includes(status)) {
      query.status = status;
    }

    // Get messages with pagination
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    // Get status counts
    const statusCounts = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const counts = {
      unread: 0,
      read: 0,
      replied: 0,
      total: 0
    };

    statusCounts.forEach(item => {
      counts[item._id as keyof typeof counts] = item.count;
      counts.total += item.count;
    });

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        counts
      }
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch messages'
    }, { status: 500 });
  }
} 
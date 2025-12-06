import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { isValidEmail, sanitizeString, INPUT_LIMITS } from '@/lib/validation';
import { getClientIp, getUserAgent, checkRequestSize } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check request size
    const contentLength = request.headers.get('content-length');
    const sizeCheck = checkRequestSize(contentLength, 10 * 1024); // 10KB max for contact form
    if (!sizeCheck.valid) {
      return NextResponse.json({
        success: false,
        message: sizeCheck.error || 'Request too large'
      }, { status: 413 });
    }

    const body = await request.json();
    const { name, email, message, website } = body; // website is honeypot field

    // Honeypot check - if this field is filled, it's a bot
    if (website && website.trim() !== '') {
      // Log potential bot attempt
      const ip = getClientIp(request);
      console.warn(`Potential bot detected from ${ip} - honeypot field filled`);
      
      return NextResponse.json({
        success: true, // Return success to confuse bots
        message: 'Message sent successfully! I will get back to you soon.'
      }, { status: 200 });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and message are required'
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email.toLowerCase());
    const sanitizedMessage = sanitizeString(message);

    // Validate name length
    if (!sanitizedName || sanitizedName.length < INPUT_LIMITS.name.min || sanitizedName.length > INPUT_LIMITS.name.max) {
      return NextResponse.json({
        success: false,
        message: `Name must be between ${INPUT_LIMITS.name.min} and ${INPUT_LIMITS.name.max} characters`
      }, { status: 400 });
    }

    // Validate email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Validate message length
    if (sanitizedMessage.length < INPUT_LIMITS.message.min || sanitizedMessage.length > INPUT_LIMITS.message.max) {
      return NextResponse.json({
        success: false,
        message: `Message must be between ${INPUT_LIMITS.message.min} and ${INPUT_LIMITS.message.max} characters`
      }, { status: 400 });
    }

    // Get client info
    const ipAddress = getClientIp(request);
    const userAgent = getUserAgent(request);

    // Save to database
    const contactMessage = new Contact({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      ipAddress,
      userAgent,
      status: 'unread'
    });

    await contactMessage.save();

    // Send email notification asynchronously - don't block response
    // This prevents email service delays from affecting user experience
    sendContactEmail({ name, email, message }).catch((emailError) => {
      console.error('Email sending failed:', emailError);
      // Log error but don't fail the request
    });

    // Return immediately without waiting for email
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

    // Optimize: Use single aggregation pipeline instead of multiple queries
    // This reduces database round trips from 3 to 1
    const [messagesResult, countsResult] = await Promise.all([
      // Get paginated messages
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance - returns plain JS objects
      // Get counts in parallel
      Contact.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const messages = messagesResult;
    const statusCounts = countsResult;

    // Calculate total from aggregation result instead of separate query
    const counts = {
      unread: 0,
      read: 0,
      replied: 0,
      total: 0
    };

    statusCounts.forEach(item => {
      const status = item._id as keyof typeof counts;
      if (status === 'unread' || status === 'read' || status === 'replied') {
        counts[status] = item.count;
      }
      counts.total += item.count;
    });

    // Use total from counts instead of separate countDocuments query
    const total = counts.total;

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
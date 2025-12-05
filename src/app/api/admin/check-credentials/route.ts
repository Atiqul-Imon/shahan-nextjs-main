import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth';

/**
 * GET /api/admin/check-credentials
 * Check current user's admin status and list all admin users
 */
export async function GET(request: NextRequest) {
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

    // Get current user
    const currentUser = await User.findById(decoded.userId).select('-password -access_token -refresh_token');
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all users (any authenticated user can see this)
    const allUsers = await User.find({})
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .lean();
    
    const adminUsers = allUsers.filter(u => u.role === 'admin');

    // Get all allowed registration emails
    const allowedEmails = [
      "imonatikulislam@gmail.com",
      "shahan24h@gmail.com",
      "atiqulimon.dev@gmail.com"
    ];

    // Check which allowed emails are registered
    const registeredAllowedEmails = await User.find({ 
      email: { $in: allowedEmails } 
    }).select('name email role createdAt').lean();

    return NextResponse.json({
      success: true,
      data: {
        currentUser: {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role || 'user',
          isAdmin: currentUser.role === 'admin'
        },
        adminUsers: adminUsers,
        allowedEmails: allowedEmails.map(email => {
          const user = registeredAllowedEmails.find(u => u.email === email);
          return {
            email,
            registered: !!user,
            role: user?.role || null,
            name: user?.name || null
          };
        }),
        totalAdmins: adminUsers.length,
        totalUsers: allUsers.length,
        message: 'All authenticated users have full access to dashboard features'
      }
    });

  } catch (error) {
    console.error('Error checking credentials:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


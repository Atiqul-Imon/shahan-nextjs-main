import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/auth';

/**
 * GET /api/admin/users
 * Get all users (admin only)
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

    // Verify user exists (any authenticated user can access)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all users (excluding passwords)
    const users = await User.find({})
      .select('-password -access_token -refresh_token')
      .sort({ createdAt: -1 })
      .lean();

    // Separate admins and regular users
    const admins = users.filter(u => u.role === 'admin');
    const regularUsers = users.filter(u => u.role !== 'admin' || !u.role);

    return NextResponse.json({
      success: true,
      data: {
        total: users.length,
        admins: admins.length,
        users: regularUsers.length,
        allUsers: users
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


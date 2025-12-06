import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({
        message: 'Refresh token is required',
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({
        message: 'Invalid or expired refresh token',
        success: false,
        error: true,
      }, { status: 401 });
    }

    // Check if user exists and token matches
    const user = await User.findOne({ _id: decoded.userId });
    if (!user || user.refresh_token !== refreshToken) {
      return NextResponse.json({
        message: 'Invalid refresh token',
        success: false,
        error: true,
      }, { status: 401 });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Update user with new tokens
    user.access_token = newAccessToken;
    user.refresh_token = newRefreshToken;
    await user.save();

    return NextResponse.json({
      message: 'Token refreshed successfully',
      success: true,
      error: false,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({
      message: 'Internal server error',
      success: false,
      error: true,
    }, { status: 500 });
  }
}


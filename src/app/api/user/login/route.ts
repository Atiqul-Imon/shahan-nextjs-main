import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({
        message: "Invalid password",
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Update user with tokens
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    await user.save();

    // Create response with token in cookie
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
        email: user.email,
        userId: user._id,
        name: user.name,
        role: user.role || 'user'
      },
    });

    // Set access token in httpOnly cookie for server-side middleware
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes (matches token expiry)
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      error: true,
    }, { status: 500 });
  }
}
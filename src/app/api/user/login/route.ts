import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth';
import { isValidEmail, sanitizeString, INPUT_LIMITS } from '@/lib/validation';
import { getClientIp, getUserAgent, checkRequestSize } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check request size
    const contentLength = request.headers.get('content-length');
    const sizeCheck = checkRequestSize(contentLength, 1024); // 1KB max for login
    if (!sizeCheck.valid) {
      return NextResponse.json({
        message: sizeCheck.error || 'Request too large',
        success: false,
        error: true,
      }, { status: 413 });
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required",
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeString(email.toLowerCase());
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({
        message: "Invalid email format",
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Validate password length
    if (password.length < INPUT_LIMITS.password.min || password.length > INPUT_LIMITS.password.max) {
      return NextResponse.json({
        message: `Password must be between ${INPUT_LIMITS.password.min} and ${INPUT_LIMITS.password.max} characters`,
        success: false,
        error: true,
      }, { status: 400 });
    }

    // Check if user exists
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json({
        message: "Invalid email or password",
        success: false,
        error: true,
      }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      const ip = getClientIp(request);
      const userAgent = getUserAgent(request);
      console.warn(`Failed login attempt for ${sanitizedEmail} from ${ip}`, { userAgent });
      
      return NextResponse.json({
        message: "Invalid email or password",
        success: false,
        error: true,
      }, { status: 401 });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Update user with tokens
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    await user.save();

    // Return token in response body for localStorage storage
    return NextResponse.json({
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

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      error: true,
    }, { status: 500 });
  }
}
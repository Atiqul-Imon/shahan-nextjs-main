import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { isValidEmail, sanitizeString, isValidPassword, INPUT_LIMITS } from '@/lib/validation';
import { checkRequestSize } from '@/lib/security';

const ALLOWED_EMAILS = [
  "imonatikulislam@gmail.com",
  "shahan24h@gmail.com",
  "atiqulimon.dev@gmail.com"
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check request size
    const contentLength = request.headers.get('content-length');
    const sizeCheck = checkRequestSize(contentLength, 1024); // 1KB max for registration
    if (!sizeCheck.valid) {
      return NextResponse.json({
        message: sizeCheck.error || 'Request too large',
        error: true,
        success: false,
      }, { status: 413 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({
        message: "Name, email, and password are required",
        error: true,
        success: false,
      }, { status: 400 });
    }

    // Sanitize and validate inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email.toLowerCase());

    // Validate name length
    if (!sanitizedName || sanitizedName.length < INPUT_LIMITS.name.min || sanitizedName.length > INPUT_LIMITS.name.max) {
      return NextResponse.json({
        message: `Name must be between ${INPUT_LIMITS.name.min} and ${INPUT_LIMITS.name.max} characters`,
        error: true,
        success: false,
      }, { status: 400 });
    }

    // Validate email
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({
        message: "Invalid email format",
        error: true,
        success: false,
      }, { status: 400 });
    }

    // Check if the email is in the allowed list
    if (!ALLOWED_EMAILS.includes(sanitizedEmail)) {
      return NextResponse.json({
        message: "Sorry, registration is restricted to authorized users only.",
        error: true,
        success: false,
      }, { status: 403 });
    }

    // Validate password strength
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({
        message: passwordValidation.errors.join('. '),
        error: true,
        success: false,
      }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: sanitizedEmail });

    if (existingUser) {
      return NextResponse.json({
        message: "A user is already registered with this email.",
        error: true,
        success: false,
      }, { status: 409 });
    }

    // Hash password with higher salt rounds for better security
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashPassword
    });

    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully.",
      error: false,
      success: true,
    }, { status: 201 });

  } catch (error) {
    console.error("Error in registerUser:", error);
    return NextResponse.json({
      message: "Something went wrong.",
      error: true,
      success: false,
    }, { status: 500 });
  }
} 
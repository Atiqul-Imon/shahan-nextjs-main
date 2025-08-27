import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

const ALLOWED_EMAILS = [
  "imonatikulislam@gmail.com",
  "shahan24h@gmail.com",
  "atiqulimon.dev@gmail.com"
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        message: "Hey, don't be lazy — name, email, and password are all required.",
        error: true,
        success: false,
      }, { status: 400 });
    }

    // Check if the email is in the allowed list
    if (!ALLOWED_EMAILS.includes(email)) {
      return NextResponse.json({
        message: "Sorry, registration is restricted to authorized users only.",
        error: true,
        success: false,
      }, { status: 403 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({
        message: "A user is already registered with this email.",
        error: true,
        success: false,
      }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
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
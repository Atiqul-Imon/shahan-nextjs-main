import { NextResponse } from 'next/server';

export async function POST() {
  // Token is stored in localStorage, cleared client-side
  return NextResponse.json({
    message: 'Logged out successfully',
    success: true,
  });
}


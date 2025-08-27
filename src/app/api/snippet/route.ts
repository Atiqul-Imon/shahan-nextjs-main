import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Snippet from '@/models/Snippet';
import { verifyAccessToken } from '@/lib/auth';

// GET all snippets
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const snippets = await Snippet.find().sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: snippets
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch snippets'
    }, { status: 500 });
  }
}

// POST new snippet
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { title, content, language } = await request.json();

    if (!title || !content || !language) {
      return NextResponse.json({
        success: false,
        message: 'Title, content, and language are required'
      }, { status: 400 });
    }

    const snippet = new Snippet({
      title,
      content,
      language
    });

    await snippet.save();

    return NextResponse.json({
      success: true,
      message: 'Snippet created successfully',
      data: snippet
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating snippet:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create snippet'
    }, { status: 500 });
  }
} 
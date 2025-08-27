import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Snippet from '@/models/Snippet';
import { verifyAccessToken } from '@/lib/auth';

// PUT update snippet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const snippet = await Snippet.findById(params.id);
    if (!snippet) {
      return NextResponse.json({
        success: false,
        message: 'Snippet not found'
      }, { status: 404 });
    }

    snippet.title = title || snippet.title;
    snippet.content = content || snippet.content;
    snippet.language = language || snippet.language;

    await snippet.save();

    return NextResponse.json({
      success: true,
      message: 'Snippet updated successfully',
      data: snippet
    });

  } catch (error) {
    console.error('Error updating snippet:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update snippet'
    }, { status: 500 });
  }
}

// DELETE snippet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const snippet = await Snippet.findById(params.id);
    if (!snippet) {
      return NextResponse.json({
        success: false,
        message: 'Snippet not found'
      }, { status: 404 });
    }

    await Snippet.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Snippet deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete snippet'
    }, { status: 500 });
  }
} 
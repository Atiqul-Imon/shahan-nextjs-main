import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get the file path
    const filePath = path.join(process.cwd(), 'public', 'resume', 'Shahan_Ahmed_Resume.pdf');
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Resume file not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Create response with proper headers for file download
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Shahan_Ahmed_Resume.pdf"',
        'Content-Length': fileBuffer.length.toString(),
      },
    });

    return response;
  } catch (error) {
    console.error('Error downloading resume:', error);
    return NextResponse.json(
      { error: 'Could not download the file' },
      { status: 500 }
    );
  }
} 
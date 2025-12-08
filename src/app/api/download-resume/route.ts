import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const RESUME_FILE_NAME = 'shahan_data_scientist_resume.pdf';

export async function GET() {
  try {
    // Get the file path
    const filePath = path.join(process.cwd(), 'public', 'resume', RESUME_FILE_NAME);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Resume file not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Create response with proper headers for file download
    const response = new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${RESUME_FILE_NAME}"`,
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
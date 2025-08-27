import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAccessToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

// GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({ status: 'published' }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects'
    }, { status: 500 });
  }
}

// POST new project
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    const status = formData.get('status') as string;
    const images = formData.getAll('images') as File[];

    if (!title || !description) {
      return NextResponse.json({
        message: 'Title and description are required'
      }, { status: 400 });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'portfolio-projects'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      uploadedImages.push({
        url: (result as CloudinaryUploadResult).secure_url,
        public_id: (result as CloudinaryUploadResult).public_id
      });
    }

    const project = new Project({
      title,
      description,
      technologies: technologies ? JSON.parse(technologies) : [],
      liveUrl,
      sourceUrl,
      status: status || 'draft',
      images: uploadedImages
    });

    await project.save();

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: project
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create project'
    }, { status: 500 });
  }
} 
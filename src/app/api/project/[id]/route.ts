import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAccessToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const project = await Project.findById(params.id);
    
    if (!project) {
      return NextResponse.json({
        success: false,
        message: 'Project not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch project'
    }, { status: 500 });
  }
}

// PUT update project
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

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    const status = formData.get('status') as string;
    const images = formData.getAll('images') as File[];

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({
        message: 'Project not found'
      }, { status: 404 });
    }

    // Upload new images to Cloudinary
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
        url: (result as any).secure_url,
        public_id: (result as any).public_id
      });
    }

    // Update project
    project.title = title || project.title;
    project.description = description || project.description;
    project.technologies = technologies ? JSON.parse(technologies) : project.technologies;
    project.liveUrl = liveUrl || project.liveUrl;
    project.sourceUrl = sourceUrl || project.sourceUrl;
    project.status = status || project.status;
    if (uploadedImages.length > 0) {
      project.images = [...project.images, ...uploadedImages];
    }

    await project.save();

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update project'
    }, { status: 500 });
  }
}

// DELETE project
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

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({
        message: 'Project not found'
      }, { status: 404 });
    }

    // Delete images from Cloudinary
    for (const image of project.images) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }
    }

    await Project.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete project'
    }, { status: 500 });
  }
} 
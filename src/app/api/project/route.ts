import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAccessToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { sanitizeString, INPUT_LIMITS, isValidUrl, validateFile } from '@/lib/validation';
import { verifyAuth, checkRequestSize } from '@/lib/security';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

// GET all projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Add pagination and limit to prevent large data fetches
    const url = new URL(request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100); // Max 100, default 50
    const skip = parseInt(url.searchParams.get('skip') || '0');
    
    // Use lean() for better performance - returns plain JS objects instead of Mongoose documents
    const projects = await Project.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select('title description technologies images liveUrl sourceUrl createdAt _id'); // Only select needed fields
    
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
    const auth = verifyAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ message: auth.error || 'Unauthorized' }, { status: 401 });
    }

    // Check request size (for file uploads, allow larger size)
    const contentLength = request.headers.get('content-length');
    const sizeCheck = checkRequestSize(contentLength, 50 * 1024 * 1024); // 50MB for file uploads
    if (!sizeCheck.valid) {
      return NextResponse.json({
        message: sizeCheck.error || 'Request too large'
      }, { status: 413 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const technologies = formData.get('technologies') as string;
    const liveUrl = formData.get('liveUrl') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    const status = formData.get('status') as string;
    const images = formData.getAll('images') as File[];

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json({
        message: 'Title and description are required'
      }, { status: 400 });
    }

    // Sanitize and validate inputs
    const sanitizedTitle = sanitizeString(title);
    const sanitizedDescription = sanitizeString(description);

    if (sanitizedTitle.length < INPUT_LIMITS.title.min || sanitizedTitle.length > INPUT_LIMITS.title.max) {
      return NextResponse.json({
        message: `Title must be between ${INPUT_LIMITS.title.min} and ${INPUT_LIMITS.title.max} characters`
      }, { status: 400 });
    }

    if (sanitizedDescription.length > INPUT_LIMITS.description.max) {
      return NextResponse.json({
        message: `Description must be no more than ${INPUT_LIMITS.description.max} characters`
      }, { status: 400 });
    }

    // Validate URLs if provided
    if (liveUrl && !isValidUrl(liveUrl)) {
      return NextResponse.json({
        message: 'Invalid live URL format'
      }, { status: 400 });
    }

    if (sourceUrl && !isValidUrl(sourceUrl)) {
      return NextResponse.json({
        message: 'Invalid source URL format'
      }, { status: 400 });
    }

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      return NextResponse.json({
        message: 'Status must be either "draft" or "published"'
      }, { status: 400 });
    }

    // Validate and limit number of images
    if (images.length > 10) {
      return NextResponse.json({
        message: 'Maximum 10 images allowed per project'
      }, { status: 400 });
    }

    // Validate each image file
    for (const image of images) {
      const fileValidation = validateFile(image, {
        maxSize: 5 * 1024 * 1024, // 5MB per image
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      });
      
      if (!fileValidation.valid) {
        return NextResponse.json({
          message: fileValidation.error || 'Invalid image file'
        }, { status: 400 });
      }
    }

    // Upload images to Cloudinary in parallel instead of sequentially
    // This significantly reduces time when uploading multiple images
    const uploadPromises = images.map(async (image) => {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'portfolio-projects'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        ).end(buffer);
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });

    // Wait for all uploads to complete in parallel
    const uploadedImages = await Promise.all(uploadPromises);

    // Parse and validate technologies
    let technologiesArray: string[] = [];
    if (technologies) {
      try {
        technologiesArray = JSON.parse(technologies);
        if (!Array.isArray(technologiesArray)) {
          return NextResponse.json({
            message: 'Technologies must be an array'
          }, { status: 400 });
        }
        if (technologiesArray.length > INPUT_LIMITS.technologies.max) {
          return NextResponse.json({
            message: `Maximum ${INPUT_LIMITS.technologies.max} technologies allowed`
          }, { status: 400 });
        }
        // Sanitize each technology
        technologiesArray = technologiesArray.map((tech: string) => sanitizeString(tech)).filter(Boolean);
      } catch {
        return NextResponse.json({
          message: 'Invalid technologies format'
        }, { status: 400 });
      }
    }

    const project = new Project({
      title: sanitizedTitle,
      description: sanitizedDescription,
      technologies: technologiesArray,
      liveUrl: liveUrl ? sanitizeString(liveUrl) : undefined,
      sourceUrl: sourceUrl ? sanitizeString(sourceUrl) : undefined,
      status: (status as 'draft' | 'published') || 'draft',
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
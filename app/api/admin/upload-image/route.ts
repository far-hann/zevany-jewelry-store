import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface UploadedFile {
  name: string;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}

export async function POST(req: NextRequest) {
  try {
    // Check if request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    
    // Collect all uploaded files
    const imageUrls: string[] = [];
    
    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }
    
    let fileFound = false;
    let validFileFound = false;
    // Process each file in the form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        fileFound = true;
        const file = value as UploadedFile;
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          console.error(`Invalid file type: ${file.type}`);
          continue; // Skip invalid file types, don't return immediately
        }
        validFileFound = true;
        // Generate a unique filename
        const filename = `${uuidv4()}_${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, filename);
        // Get the file content as ArrayBuffer
        const buffer = new Uint8Array(await file.arrayBuffer());
        // Write file to disk
        await writeFile(filePath, buffer);
        // Add the URL to the array (relative to public directory)
        const imageUrl = `/uploads/${filename}`;
        imageUrls.push(imageUrl);
      }
    }
    if (!fileFound) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }
    if (!validFileFound) {
      return NextResponse.json(
        { error: 'No valid image files uploaded. Supported types: jpeg, png, gif, webp.' },
        { status: 400 }
      );
    }
    // Return the URLs of the uploaded files
    return NextResponse.json({ 
      success: true,
      urls: imageUrls
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading files' },
      { status: 500 }
    );
  }
}

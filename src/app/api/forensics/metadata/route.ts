import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

interface ExifToolResult {
  [key: string]: any;
}

function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  // Keep only alphanumeric, dots, hyphens, and underscores
  let sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Prevent directory traversal
  sanitized = sanitized.replace(/\.\./g, '_');
  
  // Ensure filename is not empty after sanitization
  if (!sanitized || sanitized.length === 0) {
    sanitized = 'uploaded_file';
  }
  
  // Limit filename length
  if (sanitized.length > 200) {
    const ext = sanitized.substring(sanitized.lastIndexOf('.'));
    sanitized = sanitized.substring(0, 200 - ext.length) + ext;
  }
  
  return sanitized;
}

function generateUniqueFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename);
  const randomPrefix = randomBytes(8).toString('hex');
  return `${randomPrefix}_${sanitized}`;
}

export async function POST(request: Request) {
  let tempFilePath: string | null = null;

  try {
    // Parse FormData
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    // Extract file from FormData
    const file = formData.get('file');

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please upload a file using the "file" field' },
        { status: 400 }
      );
    }

    // Validate it's a File object
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file size (optional but recommended - 50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 50MB' },
        { status: 413 }
      );
    }

    // Generate safe filename and temp path
    const safeFilename = generateUniqueFilename(file.name);
    tempFilePath = join(tmpdir(), safeFilename);

    // Save file to temporary directory
    await writeFile(tempFilePath, buffer);

    // Execute ExifTool
    let stdout: string;
    try {
      const { stdout: output } = await execAsync(
        `exiftool -json -g "${tempFilePath}"`,
        { 
          maxBuffer: 5 * 1024 * 1024, // 5MB buffer
          timeout: 30000 // 30 second timeout
        }
      );
      stdout = output;
    } catch (execError: any) {
      // Check if ExifTool is not installed
      if (execError.code === 127 || execError.message.includes('not found')) {
        return NextResponse.json(
          { error: 'ExifTool is not installed on this system' },
          { status: 500 }
        );
      }

      // Check for timeout
      if (execError.killed || execError.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Metadata extraction timeout' },
          { status: 504 }
        );
      }

      // Generic execution error
      return NextResponse.json(
        { 
          error: 'Failed to extract metadata',
          details: execError.message.substring(0, 500)
        },
        { status: 500 }
      );
    }

    // Parse JSON output
    let results: ExifToolResult[];
    try {
      results = JSON.parse(stdout);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to parse ExifTool output' },
        { status: 500 }
      );
    }

    // ExifTool returns an array, get the first object
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'No metadata found in file' },
        { status: 404 }
      );
    }

    const metadata = results[0];

    // Return metadata
    return NextResponse.json({
      success: true,
      filename: file.name,
      size: buffer.length,
      metadata
    });

  } catch (error: any) {
    console.error('Metadata extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  } finally {
    // Critical: Always cleanup temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        // Log but don't fail the request if cleanup fails
        console.error('Failed to cleanup temporary file:', tempFilePath, cleanupError);
      }
    }
  }
}

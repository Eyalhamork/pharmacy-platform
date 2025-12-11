// app/api/cloudinary/signature/route.ts
// Server-side signed upload endpoint for enhanced security (optional)

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check if API secret is configured
    if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY) {
      return NextResponse.json(
        { error: 'Cloudinary API credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { folder = 'pharmacy/products', tags = [] } = body;

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Build params to sign
    const paramsToSign: Record<string, string | number> = {
      timestamp,
      folder,
    };

    if (tags.length > 0) {
      paramsToSign.tags = tags.join(',');
    }

    // Sort and create string to sign
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join('&');

    // Generate signature using SHA-1
    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + CLOUDINARY_API_SECRET)
      .digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: CLOUDINARY_API_KEY,
      folder,
      tags: tags.join(','),
    });
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}

// Delete endpoint for removing images from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    if (!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY) {
      return NextResponse.json(
        { error: 'Cloudinary API credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('signature', signature);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', timestamp.toString());

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    if (result.result === 'ok') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

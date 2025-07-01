import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
// Import directly using relative path
import { isAuthenticated, isAdmin } from '../../../../../src/utils/authUtils';
// If that doesn't work in build, try this alternative:
// import { isAuthenticated, isAdmin } from '@/src/utils/fixedImports';

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const headersList = headers();
    // Type casting to fix compatibility issue
    const authenticated = await isAuthenticated(headersList as any);
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isAdminUser = await isAdmin(authenticated.userId);
    
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // In a real implementation, this would fetch from your database
    // For now, we'll return mock data based on the ID
    const product = {
      id,
      name: id === '1' ? 'Diamond Ring' : 'Pearl Necklace',
      description: id === '1' 
        ? 'Beautiful diamond ring with 18K gold band' 
        : 'Elegant pearl necklace with silver clasp',
      price: id === '1' ? 3500 : 1200,
      originalPrice: id === '1' ? 4000 : undefined,
      category: id === '1' ? 'rings' : 'necklaces',
      subcategory: id === '1' ? 'Diamond' : 'Pearl',
      images: [
        id === '1' 
          ? '/images/jewelry/ring-1.jpg' 
          : '/images/jewelry/necklace-1.jpg'
      ],
      stock: id === '1' ? 5 : 8,
      isNew: id === '1',
      specifications: {
        'Material': id === '1' ? '18K Gold' : 'Silver',
        'Stone': id === '1' ? 'Diamond' : 'Pearl'
      },
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ product });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const headersList = headers();
    // Type casting to fix compatibility issue
    const authenticated = await isAuthenticated(headersList as any);
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isAdminUser = await isAdmin(authenticated.userId);
    
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse the request body
    const data = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'price', 'category'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // In a real implementation, this would update in your database
    // For now, we'll simulate updating a product
    const updatedProduct = {
      id,
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ success: true, product: updatedProduct });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const headersList = headers();
    // Type casting to fix compatibility issue
    const authenticated = await isAuthenticated(headersList as any);
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isAdminUser = await isAdmin(authenticated.userId);
    
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // In a real implementation, this would delete from your database
    // For now, we'll simulate successful deletion
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

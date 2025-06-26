import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated, isAdmin } from '../../../../../src/utils/authUtils';
import { getProductById, updateProduct, deleteProduct } from '../../../../../src/utils/db/productsDb';

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const headersList = headers();
    const authenticated = await isAuthenticated(headersList);
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isAdminUser = await isAdmin(authenticated.userId);
    
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch product from database
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
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
    const authenticated = await isAuthenticated(headersList);
    
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
      // Ensure uploaded images keep their correct paths
    const updatedData = {
      ...data,
      inStock: data.stock > 0,
      // Keep original image paths - don't modify uploaded image URLs
      images: Array.isArray(data.images) ? data.images : [],
      
      // Convert price to number if it's a string
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price
    };
      // Update product in database
    const updatedProduct = await updateProduct(id, updatedData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
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
    const authenticated = await isAuthenticated(headersList);
    
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const isAdminUser = await isAdmin(authenticated.userId);
    
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
      // Delete product from database
    const success = await deleteProduct(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

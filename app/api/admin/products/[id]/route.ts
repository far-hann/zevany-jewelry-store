import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { isAuthenticated, isAdmin } from '../../../../../src/utils/authUtils';
import { getProductById, updateProduct, deleteProduct } from '../../../../../src/utils/db/productsDb';
import { jwtVerify } from 'jose';

interface Params {
  id: string;
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
    const token = req.cookies.get('admin-token')?.value;
    if (!token) return false;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        return true;
    } catch (error) {
        return false;
    }
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
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
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
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
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
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

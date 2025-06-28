import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductById } from '@/src/utils/db/productsDb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const id = searchParams.get('id');

    // If requesting a specific product by ID
    if (id) {
      const product = await getProductById(id);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    // Get all products
    let products = await getAllProducts();

    // Filter by category if specified
    if (category) {
      products = products.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Limit results if specified
    if (limit && !isNaN(parseInt(limit))) {
      products = products.slice(0, parseInt(limit));
    }

    return NextResponse.json({ 
      success: true, 
      products, 
      total: products.length 
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // For admin - create new product
    const body = await request.json();
    
    // NOTE: This public API endpoint should not be used for creating products
    // Products should only be created through the admin API with authentication
    
    return NextResponse.json({
      success: false,
      message: 'Products should be created through the admin API'
    }, { status: 403 });
    
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
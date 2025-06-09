import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/src/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    
    // Filter products by category if specified (based on image path)
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter(product => 
        product.images[0]?.includes(`/${category.toLowerCase()}/`)
      );
    }
    
    // Limit results if specified
    if (limit) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length
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
    console.log('Product creation request:', body); // Using body to avoid unused variable error
    
    // TODO: Add authentication check
    // TODO: Add database integration
    
    return NextResponse.json({
      success: true,
      message: 'Product creation endpoint - to be implemented'
    });
    
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/src/utils/db/productsDb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const products = await getAllProducts();

    return NextResponse.json({ 
      success: true,
      products,
      message: products.length > 0 ? 'Products loaded successfully' : 'Using fallback product data'
    });
  } catch (error) {
    console.error('Error in test-supabase route:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch products',
      message: 'Check Supabase configuration'
    }, { status: 500 });
  }
}
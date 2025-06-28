import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/utils/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const id = searchParams.get('id');

    let query = supabaseAdmin.from('products').select('*');

    if (id) {
      const { data, error } = await query.eq('id', id).single();
      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        throw error;
      }
      return NextResponse.json({ success: true, product: data });
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (limit && !isNaN(parseInt(limit))) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, products: data, total: data.length });

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
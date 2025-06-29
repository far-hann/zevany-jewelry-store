import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const id = searchParams.get('id');

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase is not configured
      const mockProducts = [
        {
          id: '1',
          name: 'Diamond Solitaire Ring',
          description: 'Beautiful diamond ring',
          price: 2500,
          category: 'rings',
          images: ['/images/jewelry/rings/diamond-solitaire-ring.jpg'],
          stock: 10,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Gold Necklace',
          description: 'Elegant gold necklace',
          price: 1800,
          category: 'necklaces',
          images: ['/images/jewelry/necklaces/gold-pearl-necklace.jpg'],
          stock: 5,
          created_at: new Date().toISOString()
        }
      ];

      let filteredProducts = mockProducts;

      if (id) {
        const product = mockProducts.find(p => p.id === id);
        if (!product) {
          return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
      }

      if (category) {
        filteredProducts = mockProducts.filter(p => p.category === category);
      }

      if (limit && !isNaN(parseInt(limit))) {
        filteredProducts = filteredProducts.slice(0, parseInt(limit));
      }

      return NextResponse.json({ 
        success: true, 
        products: filteredProducts, 
        total: filteredProducts.length,
        note: 'Using mock data - Supabase not configured'
      });
    }

    // Use Supabase if configured
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      let query = supabase.from('products').select('*');

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

    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed', details: supabaseError.message },
        { status: 500 }
      );
    }

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
    const body = await request.json();
    
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
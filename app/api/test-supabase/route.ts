import { createClient } from '@/src/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products from Supabase:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  return NextResponse.json({ products });
}

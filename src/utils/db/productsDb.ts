import { supabaseAdmin } from '@/utils/supabase/admin';

// Update Product interface to match the one in types/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  originalPrice?: number | string;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  isNew?: boolean;
  specifications?: Record<string, string>;
  collection?: string;
  articleNo?: string;
  colors?: string[] | number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  createdAt: string;
  priceFormatted?: string;
  image?: string;
  details: {
    material: string;
    gemstone?: string;
    weight: string;
    dimensions: string;
    [key: string]: string | undefined;
  };
  [key: string]: unknown;
}

// Create new product
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const newProductData = {
    ...productData,
    id: newId,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([newProductData])
    .select()
    .single();

  if (error) {
    console.error('Error creating product in Supabase:', error);
    throw new Error('Failed to create product.');
  }

  return data as Product;
}

// Update product by ID
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product ${id} in Supabase:`, error);
    throw new Error('Failed to update product.');
  }

  return data as Product;
}

// Delete product by ID
export async function deleteProduct(id: string): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting product ${id} from Supabase:`, error);
    throw new Error('Failed to delete product.');
  }

  return { success: true };
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching all products from Supabase:', error);
    throw new Error('Failed to fetch products.');
  }

  // Process the data to ensure it matches the Product interface
  const processedProducts = data.map(product => {
    // Ensure details property exists with required fields
    const details = product.specifications || {};

    return {
      ...product,
      details: {
        material: details.material || product.material || 'Gold',
        gemstone: details.gemstone || product.gemstone || 'Diamond',
        weight: details.weight || product.weight || '0.10 ct',
        dimensions: details.dimensions || product.dimensions || '15mm',
        ...details,
      },
    };
  });

  return processedProducts as Product[];
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PostgREST error code for "Not a single row was returned"
      console.log(`Product with id ${id} not found.`);
      return null;
    }
    console.error(`Error fetching product ${id} from Supabase:`, error);
    throw new Error('Failed to fetch product.');
  }

  if (!data) return null;

  // Ensure details property exists with required fields
  const details = data.specifications || {};

  const processedProduct = {
    ...data,
    details: {
      material: details.material || data.material || 'Gold',
      gemstone: details.gemstone || data.gemstone || 'Diamond',
      weight: details.weight || data.weight || '0.10 ct',
      dimensions: details.dimensions || data.dimensions || '15mm',
      ...details,
    },
  };

  return processedProduct as Product;
}

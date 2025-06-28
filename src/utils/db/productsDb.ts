import { supabaseAdmin } from '@/utils/supabase/admin';
import { createFallbackClient, isSupabaseConfigured } from '@/utils/supabase/fallback';
import { products as fallbackProducts } from '@/data/products';

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

// Helper function to process product data
const processProduct = (product: any): Product => {
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
};

// Helper function to convert fallback products
const convertFallbackProduct = (product: any): Product => {
  return {
    ...product,
    price: typeof product.price === 'string' ? 
      parseFloat(product.price.replace(/[$,]/g, '')) : 
      product.price,
    originalPrice: product.originalPrice ? 
      (typeof product.originalPrice === 'string' ? 
        parseFloat(product.originalPrice.replace(/[$,]/g, '')) : 
        product.originalPrice) : 
      undefined,
    stock: product.stock || 10,
    createdAt: product.createdAt || new Date().toISOString(),
    details: {
      material: product.specifications?.material || 'Gold',
      gemstone: product.specifications?.color || 'Diamond',
      weight: product.specifications?.weight || '0.10 ct',
      dimensions: product.specifications?.stoneDiameter || '15mm',
    },
  };
};

// Create new product
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot create products in demo mode.');
  }

  const { details, inStock, isNew, isFeatured, ...createData } = productData;

  const newProductData = {
    ...createData,
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

  return processProduct(data);
}

// Update product by ID
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot update products in demo mode.');
  }

  const { details, inStock, isNew, isFeatured, ...updateData } = updates;

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product in Supabase:', error);
    throw new Error('Failed to update product.');
  }
  
  return processProduct(data);
}

// Delete product by ID
export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured. Cannot delete products in demo mode.');
  }

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product in Supabase:', error);
    return false;
  }
  return true;
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    console.log('Using fallback products data');
    return fallbackProducts.map(convertFallbackProduct);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching all products from Supabase:', error);
      console.log('Falling back to static products data');
      return fallbackProducts.map(convertFallbackProduct);
    }

    return data.map(processProduct);
  } catch (error) {
    console.error('Supabase connection failed, using fallback data:', error);
    return fallbackProducts.map(convertFallbackProduct);
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    console.log('Using fallback products data for product:', id);
    const product = fallbackProducts.find(p => p.id === id);
    return product ? convertFallbackProduct(product) : null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`Product with id ${id} not found in Supabase, checking fallback data`);
        const product = fallbackProducts.find(p => p.id === id);
        return product ? convertFallbackProduct(product) : null;
      }
      console.error(`Error fetching product ${id} from Supabase:`, error);
      const product = fallbackProducts.find(p => p.id === id);
      return product ? convertFallbackProduct(product) : null;
    }

    if (!data) {
      const product = fallbackProducts.find(p => p.id === id);
      return product ? convertFallbackProduct(product) : null;
    }

    return processProduct(data);
  } catch (error) {
    console.error('Supabase connection failed, using fallback data for product:', id, error);
    const product = fallbackProducts.find(p => p.id === id);
    return product ? convertFallbackProduct(product) : null;
  }
}
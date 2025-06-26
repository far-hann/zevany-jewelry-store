import { supabaseAdmin } from '@/utils/supabase/admin';
import fs from 'fs';
import path from 'path';
import { Product } from './productsDb';

// File path for the products database
const DB_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'dynamic-products.json');

async function migrateProducts() {
  try {
    console.log('Starting database migration...');

    // 1. Create the products table if it doesn't exist
    console.log('Creating products table...');
    const { error: createTableError } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          collection TEXT,
          article_no TEXT,
          price NUMERIC NOT NULL,
          original_price NUMERIC,
          images TEXT[],
          image TEXT,
          category TEXT,
          description TEXT,
          specifications JSONB,
          rating NUMERIC,
          review_count INTEGER,
          colors TEXT[],
          in_stock BOOLEAN DEFAULT true,
          is_new BOOLEAN,
          is_bestseller BOOLEAN,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          subcategory TEXT,
          stock INTEGER DEFAULT 100
        );
      `
    });

    if (createTableError) {
      console.error('Error creating table:', createTableError);
      return;
    }
    console.log('Products table created or already exists.');

    // 2. Read the product data from the JSON file
    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const products = JSON.parse(data);

    // 3. Transform and insert the data into Supabase
    console.log(`Preparing to insert ${products.length} products...`);
    const productsToInsert = products.map((p: any) => ({
      id: p.id.toString(),
      name: p.name,
      collection: p.collection,
      article_no: p.articleNo,
      price: p.price,
      original_price: p.originalPrice,
      images: p.images,
      image: p.image,
      category: p.category,
      description: p.description,
      specifications: p.specifications,
      rating: p.rating,
      review_count: p.reviewCount || p.reviews,
      colors: p.colors,
      in_stock: true, // Force all products to be in stock
      is_new: p.isNew,
      is_bestseller: p.isBestseller,
      created_at: p.createdAt,
      subcategory: p.subcategory,
      stock: 100, // Set stock to 100 for all products
      details: {
        material: p.specifications?.material || 'Gold',
        gemstone: p.specifications?.gemstone || 'Diamond',
        weight: p.specifications?.weight || '0.10 ct',
        dimensions: p.specifications?.dimensions || '15mm',
        ...p.specifications
      }
    }));

    // Upsert the data to avoid duplicates
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id' });

    if (insertError) {
      console.error('Error inserting data:', insertError);
    } else {
      // TypeScript-safe way to check the result
      const successCount = productsToInsert.length;
      console.log(`Successfully inserted/updated ${successCount} products`);
    }

    console.log('Database migration completed.');

  } catch (error) {
    console.error('An error occurred during migration:', error);
  }
}

// Run the migration
migrateProducts().then(() => {
  console.log('Migration script finished.');
  process.exit(0);
}).catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

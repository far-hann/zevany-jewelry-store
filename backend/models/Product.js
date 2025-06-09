// Mongoose Product model removed. Use Supabase/PostgreSQL queries instead.
// All product operations are now handled directly in routes with SQL queries.

module.exports = null;

// Function to get all products
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data;
}

// Function to get a product by ID
async function getProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

// Function to create a new product
async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([product]);

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return data[0];
}

// Function to update a product
async function updateProduct(productId, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId);

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data[0];
}

// Function to delete a product
async function deleteProduct(productId) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return null;
  }

  return data[0];
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

import { Star } from 'lucide-react'
import { products as staticProducts } from '@/data/products';
import { generateProductMetadata, generateProductJsonLd } from '@/utils/productSeo';
import { Metadata } from 'next';
import { Product } from '@/types/Product';
import ProductActions from './ProductActions';
import ProductGallery from './ProductGallery';
import ProductTabs from './ProductTabs';
import MobileProductPage from '@/components/MobileProductPage';
import { getProductById } from '@/utils/db/productsDb';

// Adapter function to convert product data to the Product type
// @ts-ignore - Ignoring type issues with product data
function adaptProduct(productData: any): Product {
  // Extract price as a number if it's a string
  let price = productData.price;
  if (typeof price === 'string') {
    price = parseFloat(price.replace(/[$,]/g, ''));
  }
  
  let originalPrice = productData.originalPrice;
  if (typeof originalPrice === 'string') {
    originalPrice = parseFloat(originalPrice.replace(/[$,]/g, ''));
  }
  
  // Create a formatted price string
  const priceString = typeof productData.price === 'string' ? 
    productData.price : 
    `$${price.toLocaleString()}`;

  // Ensure we have a details object with all required fields
  const specs = productData.specifications || {};
  
  // Return the product with all required fields
  return {
    ...productData,
    price,
    originalPrice,
    priceString,
    details: productData.details || {
      material: specs.material || 'Gold',
      gemstone: specs.color || 'Diamond',
      weight: specs.weight || specs.stoneDiameter || '0.10 ct',
      dimensions: specs.dimensions || specs.ringSize || '15mm'
    }
  } as Product;
}

// Generate metadata for SEO
// @ts-ignore - Ignoring type issues with Next.js page props
export async function generateMetadata(props: any): Promise<Metadata> {
  const { id } = props.params;
  
  // Try to get product from DB first
  let productData = await getProductById(id);
  
  // Fallback to static data if not found in DB
  if (!productData) {
    const staticProduct = staticProducts.find(p => p.id === id);
    if (staticProduct) {
      // Convert static product to match Product type
      const specifications: Record<string, string> = {};
      if (staticProduct.specifications) {
        Object.entries(staticProduct.specifications).forEach(([key, value]) => {
          if (value !== undefined) {
            specifications[key] = String(value);
          }
        });
      }

      productData = {
        ...staticProduct,
        category: staticProduct.collection?.toLowerCase() || 'jewelry',
        stock: staticProduct.inStock ? 10 : 0,
        createdAt: new Date().toISOString(),
        specifications,
        details: {
          material: specifications.material || 'Gold',
          gemstone: specifications.color || 'Diamond',
          weight: specifications.stoneDiameter || '0.10 ct',
          dimensions: specifications.ringSize || '15mm'
        }
      };
    }
  }
  
  if (!productData) {
    return {
      title: 'Product Not Found | ZEVANY Luxury Jewelry',
      description: 'The requested product could not be found.',
    }
  }
  
  const product = adaptProduct(productData);
  return generateProductMetadata(product);
}

// @ts-ignore - Ignoring type issues with Next.js page props
export default async function ProductPage(props: any) {
  const { id } = props.params;
  
  // Try to get product from DB first
  let productData = await getProductById(id);
  
  // Fallback to static data if not found in DB
  if (!productData) {
    const staticProduct = staticProducts.find((p) => p.id === id);
    if (staticProduct) {
      // Convert static product to match Product type
      const specifications: Record<string, string> = {};
      if (staticProduct.specifications) {
        Object.entries(staticProduct.specifications).forEach(([key, value]) => {
          if (value !== undefined) {
            specifications[key] = String(value);
          }
        });
      }
      
      productData = {
        ...staticProduct,
        category: staticProduct.collection?.toLowerCase() || 'jewelry',
        stock: staticProduct.inStock ? 10 : 0,
        createdAt: new Date().toISOString(),
        specifications,
        details: {
          material: specifications.material || 'Gold',
          gemstone: specifications.color || 'Diamond',
          weight: specifications.stoneDiameter || '0.10 ct',
          dimensions: specifications.ringSize || '15mm'
        }
      };
    }
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500" style={{ background: '#f5f3ea' }}>
        Product not found
      </div>
    );
  }
  
  const product = adaptProduct(productData);
  
  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileProductPage product={product} />
      </div>      
      
      {/* Desktop View */}
      <div className="hidden lg:block min-h-screen bg-white">
        {product && (
          <>
            {generateProductJsonLd(product)}
          </>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Product Images */}
            <ProductGallery product={product} />

            {/* Product Info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>                <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl text-gray-900 font-semibold">
                    {product.priceString ? 
                      String(product.priceString) : 
                      (typeof product.price === 'string' ? 
                        String(product.price) : 
                        (product.price ? `$${String(product.price)}` : '$0.00')
                      )
                    }
                  </p>
                  {product.originalPrice && (
                    <p className="text-xl text-gray-500 line-through">
                      {typeof product.originalPrice === 'string' ? 
                        String(product.originalPrice) : 
                        `$${String(product.originalPrice)}`
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div className="mt-6">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <Star
                        key={rating}
                        className={`h-5 w-5 ${
                          (product.rating || 5) > rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating || 5} out of 5 stars</p>
                  <a href="#reviews" className="ml-3 text-sm font-medium text-gray-600 hover:text-gray-500">
                    {product.reviews || 10} reviews
                  </a>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6 space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>

              {/* Add to Cart and Wishlist */}
              <div className="mt-10">
                <ProductActions product={product} />
              </div>
              
              {/* Product Details */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="space-y-4">
                  {product.collection && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Collection: </span>
                      <span className="text-sm text-gray-600">{product.collection}</span>
                    </div>
                  )}
                  {product.articleNo && (
                    <div>
                      <span className="text-sm font-medium text-gray-900">Article No: </span>
                      <span className="text-sm text-gray-600">{product.articleNo}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-900">Availability: </span>
                    <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <ProductTabs product={product} />
        </div>
      </div>
    </>
  );
}

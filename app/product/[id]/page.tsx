import { Star } from 'lucide-react'
import { products } from '@/data/products';
import { generateProductMetadata, generateProductJsonLd } from '@/utils/productSeo';
import { Metadata } from 'next';
import ProductActions from './ProductActions';
import ProductGallery from './ProductGallery';
import ProductTabs from './ProductTabs';
import MobileProductPage from '@/components/MobileProductPage';

// Generate metadata for SEO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any): Promise<Metadata> {
  const { id } = props.params;
  const product = products.find(p => p.id === id)
  if (!product) {
    return {
      title: 'Product Not Found | ZEVANY Luxury Jewelry',
      description: 'The requested product could not be found.',
    }
  }
  return generateProductMetadata(product)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProductPage(props: any) {
  const { id } = props.params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500" style={{ background: '#f5f3ea' }}>
        Product not found
      </div>
    );
  }  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileProductPage product={product} />
      </div>      {/* Desktop View */}
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
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center space-x-2">
                <p className="text-3xl text-gray-900 font-semibold">{product.price}</p>
                {product.originalPrice && (
                  <p className="text-xl text-gray-500 line-through">{product.originalPrice}</p>
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
                        product.rating > rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
                <a href="#reviews" className="ml-3 text-sm font-medium text-gray-600 hover:text-gray-500">
                  {product.reviews} reviews
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
                <div>
                  <span className="text-sm font-medium text-gray-900">Collection: </span>
                  <span className="text-sm text-gray-600">{product.collection}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Article No: </span>
                  <span className="text-sm text-gray-600">{product.articleNo}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">Availability: </span>
                  <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Product Tabs */}
        <ProductTabs product={product} />
      </div>
    </div>
    </>
  );
}

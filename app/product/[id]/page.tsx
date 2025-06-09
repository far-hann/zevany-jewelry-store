'use client'

import { use } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { products } from '@/data/products';
import { 
  addToCart, 
  addToWishlist, 
  removeFromWishlist, 
  getWishlist 
} from '@/utils/cartWishlist';
import ZoomableImage from '@/components/ZoomableImage';

// Sample product data - in a real app, this would come from a database
// const products = {
//   '1': {
//     id: '1',
//     name: 'Chroma Twist Pendant, Multicolored, Gold-tone plated',
//     collection: 'Chroma',
//     articleNo: '5692496',
//     price: '$2,299',
//     originalPrice: '$2,899',
//     images: [
//       '/images/jewelry/necklaces/gold-pearl-necklace.jpg',
//       '/images/jewelry/rings/diamond-solitaire-ring.jpg',
//       '/images/jewelry/earrings/diamond-drop-earrings.jpg',
//       '/images/jewelry/bracelets/tennis-bracelet.jpg',
//     ],
//     description: 'Whichever color you\'re feeling, this vivid Chroma Twist pendant can match the mood. The gold-tone plated design connects to the chain with a Swarovski ReCreated™ crystal in green. Below, the reversible design means you can display a Swarovski ReCreated™ crystal in blue or a vibrant crystal in pink. Flip the look to coordinate with your style and wear it alongside other Chroma Twist jewelry for a vision of all-over joy. Chroma Twist jewelry contains at least 50% Swarovski ReCreated™ crystals, and it is our first collection designed with circularity in mind.',
//     specifications: {
//       length: '42 - 49 cm',
//       motifSize: '2.3 x 1.3 cm',
//       material: 'Crystals, ReCreated™ Crystals, Gold-tone plated',
//       color: 'Multicolored',
//       claspType: 'Lobster',
//       countryOfOrigin: 'Thailand',
//       manufacturer: 'ZEVANY'
//     },
//     rating: 4.8,
//     reviews: 124,
//     colors: ['green', 'blue', 'pink'],
//     inStock: true
//   },
//   '2': {
//     id: '2',
//     name: 'Diamond Solitaire Ring, Classic Cut, Multicolored',
//     collection: 'Classic',
//     articleNo: '5692497',
//     price: '$2,500',
//     originalPrice: '$3,200',
//     images: [
//       '/images/jewelry/rings/diamond-solitaire-ring.jpg',
//       '/images/jewelry/rings/vintage-emerald-ring.jpg',
//       '/images/jewelry/rings/gold-wedding-band.jpg',
//     ],
//     description: 'A timeless classic that never goes out of style. This stunning diamond solitaire ring features a brilliant cut center stone set in a classic gold band. The multicolored brilliance captures light from every angle, creating an enchanting display of fire and sparkle. Perfect for engagements, anniversaries, or as a statement piece.',
//     specifications: {
//       ringSize: '6-8 (adjustable)',
//       stoneDiameter: '8mm',
//       material: 'Crystals, Gold-tone plated',
//       color: 'Multicolored',
//       setting: 'Prong',
//       countryOfOrigin: 'Thailand',
//       manufacturer: 'ZEVANY'
//     },
//     rating: 4.9,
//     reviews: 89,
//     colors: ['clear', 'multicolor'],
//     inStock: true
//   }
// }

type Props = {
  params: Promise<{ id: string }>
}

const tabs: { id: string; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'shipping', label: 'Shipping & returns' },
  { id: 'care', label: 'Care & maintenance' },
  { id: 'gift', label: 'Gift-giving services' },
  { id: 'appointment', label: 'Book an appointment' },
];

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Initialize wishlist state from localStorage
  useEffect(() => {
    if (product) {
      const wishlist = getWishlist();
      setIsWishlisted(wishlist.includes(product.id));
    }
  }, [product]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500" style={{ background: '#f5f3ea' }}>Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    // Dispatch custom event to update navbar counts
    window.dispatchEvent(new Event('cartWishlistUpdate'));
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
    setIsWishlisted(!isWishlisted);    // Dispatch custom event to update navbar counts
    window.dispatchEvent(new Event('cartWishlistUpdate'));
  };
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <span>Home</span> / <span>Jewelry</span> / <span className="text-gray-900">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden group border border-gray-200">
              <ZoomableImage
                src={product.images[selectedImageIndex]}
                alt={product.name}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-light text-gray-900 mb-2 leading-tight tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 font-serif">Collection: {product.collection}</p>
              <p className="text-sm text-gray-500 font-serif">Article no.: {product.articleNo}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-light text-gray-900 font-serif">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through font-serif">{product.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-serif">Price includes all taxes</p>
            </div>            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 font-medium font-serif"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`w-full border-2 py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium font-serif ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-gray-300 text-gray-900 hover:border-gray-900'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
            {/* Stock Status */}
            {product.inStock && (
              <p className="text-green-600 text-sm font-medium font-serif">✓ In Stock - Ships within 2-3 business days</p>
            )}
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="border-t border-gray-200">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-300 mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-base font-serif transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <p className="text-gray-700 leading-relaxed mb-6 font-serif" style={{ fontSize: '1.1rem' }}>{product.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 font-serif" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Specifications</h3>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <dt className="text-sm text-gray-600 w-1/3 capitalize font-serif">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </dt>
                        <dd className="text-sm text-gray-900 w-2/3 font-serif">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="prose max-w-none font-serif">
                <h3>Shipping Information</h3>
                <ul>
                  <li>Free standard shipping on orders over $100</li>
                  <li>Express shipping available (2-3 business days)</li>
                  <li>International shipping to select countries</li>
                  <li>All orders are fully insured</li>
                </ul>
                <h3>Return Policy</h3>
                <p>We offer a 30-day return policy for all unworn items in original packaging.</p>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="prose max-w-none font-serif">
                <h3>Care Instructions</h3>
                <ul>
                  <li>Clean with a soft, dry cloth</li>
                  <li>Avoid contact with water, perfume, and chemicals</li>
                  <li>Store in individual pouches to prevent scratching</li>
                  <li>Remove before swimming, showering, or exercising</li>
                </ul>
              </div>
            )}

            {activeTab === 'gift' && (
              <div className="prose max-w-none font-serif">
                <h3>Gift Services</h3>
                <ul>
                  <li>Complimentary gift wrapping available</li>
                  <li>Personal message cards included</li>
                  <li>Gift receipts provided upon request</li>
                  <li>Extended return period for gifts (60 days)</li>
                </ul>
              </div>
            )}

            {activeTab === 'appointment' && (
              <div className="prose max-w-none font-serif">
                <h3>Book a Personal Consultation</h3>
                <p>Schedule a one-on-one consultation with our jewelry experts to find the perfect piece.</p>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-serif">
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>
        </div>      </div>
    </div>
  )
}

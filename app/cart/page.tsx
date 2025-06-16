'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ShoppingBag, X, Plus, Minus, Gift, Package2 } from 'lucide-react'
import { products } from '@/data/products'
import { removeFromCart } from '@/utils/cartWishlist'
import Link from 'next/link'
import Image from 'next/image'

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  collection?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [giftPackaging, setGiftPackaging] = useState(false)
  const [giftNote, setGiftNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    try {
      // Get cart from localStorage and convert to CartItem format
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      // If it's just an array of IDs, convert it to full cart items
      if (storedCart.length > 0 && typeof storedCart[0] === 'string') {
        const cartProducts = products.filter(product => product && storedCart.includes(product.id))
        const fullCartItems = cartProducts.map(product => ({
          id: product.id,
          name: product.name || 'Unknown Product',
          image: (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : '/images/placeholder.jpg',
          price: product.price ? parseFloat(product.price.replace('$', '').replace(',', '')) : 0,
          quantity: 1,
          collection: product.collection || ''
        }))
        setCartItems(fullCartItems)
        // Update localStorage with full cart format
        localStorage.setItem('cart', JSON.stringify(fullCartItems))
      } else if (storedCart.length > 0) {
        // Validate existing cart items and add fallback images
        const validatedCartItems = storedCart.map((item: CartItem) => ({
          ...item,
          id: item.id || '',
          name: item.name || 'Unknown Product',
          image: (item.image && item.image.trim() && item.image !== '') ? item.image : '/images/placeholder.jpg',
          price: typeof item.price === 'number' ? item.price : 0,
          quantity: typeof item.quantity === 'number' ? item.quantity : 1,
          collection: item.collection || ''
        }))
        setCartItems(validatedCartItems)
      }
    } catch (error) {
      console.error('Error loading cart data:', error)
      // Reset cart if there's an error
      setCartItems([])
      localStorage.setItem('cart', '[]')
    }
  }, [])

  const updateCart = useCallback((updatedCart: CartItem[]) => {
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartWishlistUpdate'))
  }, [])

  const handleRemoveFromCart = useCallback((productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    updateCart(updatedCart)
    removeFromCart(productId) // Keep compatibility with existing cart utils
  }, [cartItems, updateCart])

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId)
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      const updatedCart = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
      updateCart(updatedCart)
      setIsLoading(false)
    }, 50) // Small delay to prevent rapid clicking issues
  }, [cartItems, updateCart, handleRemoveFromCart])

  const handleSizeChange = useCallback((productId: string, size: string) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, size } : item
    )
    updateCart(updatedCart)
  }, [cartItems, updateCart])

  const handleColorChange = useCallback((productId: string, color: string) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, color } : item
    )
    updateCart(updatedCart)
  }, [cartItems, updateCart])
  // Memoize expensive calculations
  const { subtotal, giftPackagingFee, total } = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 0 // Free shipping
    const giftPackagingFee = giftPackaging ? 5 : 0
    const total = subtotal + shipping + giftPackagingFee
    
    return { subtotal, giftPackagingFee, total }
  }, [cartItems, giftPackaging])
  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Shopping Cart</h1>
          <p className="text-xl text-gray-600 font-serif">Review and customize your selected jewelry pieces</p>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-medium text-gray-900 mb-2 font-serif">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 font-serif">Add some beautiful jewelry pieces to get started</p>
            <Link 
              href="/collections" 
              className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-serif"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, idx) => (
                <div key={`${item.id || idx}-${item.size || ''}-${item.color || ''}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && item.image.trim() ? (
                        <Image
                          src={item.image}
                          alt={item.name || 'Product Image'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 128px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Package2 className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700 font-serif mb-1">{item.name}</h3>
                          </Link>
                          {item.collection && (
                            <p className="text-sm text-gray-600 font-serif mb-2">{item.collection}</p>
                          )}
                          <p className="text-xl font-medium text-gray-900 font-serif">${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-4"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Size and Color Options */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Size</label>
                          <select
                            value={item.size || ''}
                            onChange={(e) => handleSizeChange(item.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Select Size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 font-serif">Color</label>
                          <select
                            value={item.color || ''}
                            onChange={(e) => handleColorChange(item.id, e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Select Color</option>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Rose Gold">Rose Gold</option>
                            <option value="White Gold">White Gold</option>
                          </select>
                        </div>
                      </div>
                        {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700 font-serif">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={isLoading}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium font-serif min-w-[40px] text-center">
                              {isLoading ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900 font-serif">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Gift Options */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Gift className="h-5 w-5 text-gray-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900 font-serif">Gift Options</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={giftPackaging}
                      onChange={(e) => setGiftPackaging(e.target.checked)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 mr-3"
                    />
                    <Package2 className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 font-serif">
                      Add premium gift packaging
                    </span>
                    <span className="ml-2 text-sm text-gray-500 font-serif">
                      (+$5.00 service fee)
                    </span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-serif">
                      Gift Note (Optional)
                    </label>
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Add a personal message for your gift recipient..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-serif focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 font-serif">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-serif">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-serif">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  {giftPackaging && (
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">Gift packaging</span>
                      <span className="text-gray-900">${giftPackagingFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-medium font-serif">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-serif text-center block"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/collections"
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-serif text-center block"
                >
                  Continue Shopping
                </Link>
              </div>            </div>
          </div>
        )}
      </div>
    </div>
  )
}

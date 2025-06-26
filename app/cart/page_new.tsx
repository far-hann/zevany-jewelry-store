'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, X, Plus, Minus, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  collection?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        
        if (storedCart.length > 0) {
          // If it's just an array of IDs, convert to full cart items
          if (typeof storedCart[0] === 'string' || typeof storedCart[0] === 'number') {
            const productPromises = storedCart.map(async (id: string) => {
              try {
                const response = await fetch(`/api/products?id=${id}`)
                if (response.ok) {
                  const data = await response.json()
                  const product = data.product
                  if (product) {
                    return {
                      id: product.id,
                      name: product.name,
                      image: product.image || (product.images && product.images[0]) || '/images/placeholder.jpg',
                      price: typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[$,]/g, '')) || 0,
                      quantity: 1,
                      collection: product.collection
                    }
                  }
                }
                return null
              } catch (error) {
                console.error('Error fetching product:', error)
                return null
              }
            })
            
            const cartProducts = await Promise.all(productPromises)
            const validCartItems = cartProducts.filter(item => item !== null) as CartItem[]
            setCartItems(validCartItems)
            
            // Update localStorage with full cart format
            localStorage.setItem('cart', JSON.stringify(validCartItems))
          } else {
            // Use existing cart items
            setCartItems(storedCart)
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error)
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  const updateCart = useCallback((updatedCart: CartItem[]) => {
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    // Update cart count in header
    const cartIds = updatedCart.map(item => item.id)
    localStorage.setItem('cart', JSON.stringify(cartIds))
    window.dispatchEvent(new Event('cartWishlistUpdate'))
  }, [])

  const handleRemoveFromCart = useCallback((productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    updateCart(updatedCart)
  }, [cartItems, updateCart])

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId)
      return
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }, [cartItems, updateCart, handleRemoveFromCart])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const total = subtotal // Free shipping

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f3ea' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light text-gray-900 mb-4 tracking-wide">Shopping Cart</h1>
          <p className="text-gray-600 font-serif">Review your selected luxury jewelry pieces</p>
        </div>
        
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-light text-gray-900 mb-2 font-serif">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 font-serif">Discover our exquisite jewelry collections</p>
            <Link 
              href="/collections" 
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-serif"
            >
              Browse Collections
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link href={`/product/${item.id}`}>
                            <h3 className="text-lg font-serif text-gray-900 hover:text-gray-700 mb-1">{item.name}</h3>
                          </Link>
                          {item.collection && (
                            <p className="text-sm text-gray-600 font-serif mb-2">{item.collection}</p>
                          )}
                          <p className="text-xl font-semibold text-gray-900 font-serif">
                            ${typeof item.price === 'number' ? item.price.toLocaleString() : '0.00'}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700 font-serif">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium font-serif min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 font-serif">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm sticky top-6">
                <h2 className="text-xl font-serif text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-base font-serif">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="text-gray-900">${subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-base font-serif">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-semibold font-serif">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-serif text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <Link
                    href="/collections"
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-serif text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

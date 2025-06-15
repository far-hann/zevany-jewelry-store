'use client'

import { useState, useEffect } from 'react'
import { Package, Clock, Truck, CheckCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    id: string
    name: string
    image: string
    price: number
    quantity: number
  }>
  trackingNumber?: string
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // In a real app, you'd get the user ID from auth context
      const response = await fetch('/api/orders/user-history')
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders)
      } else {
        setError(data.error || 'Failed to load orders')
      }    } catch {
      setError('Failed to load order history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <Package className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#f5f3ea' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">Order History</h1>
          <p className="text-xl text-gray-600">
            Track all your jewelry purchases and orders
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet. Start shopping to see your order history here.</p>
            <Link 
              href="/collections" 
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      <Link 
                        href={`/track-order?orderNumber=${order.orderNumber}`}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                              {/* Item image would go here */}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 text-sm">{item.name}</h5>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                          </div>
                          {order.trackingNumber && (
                            <div className="pt-2 border-t border-gray-200">
                              <span className="text-gray-600">Tracking:</span>
                              <p className="font-medium text-gray-900 text-xs break-all">{order.trackingNumber}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 space-y-2">
                          <Link 
                            href={`/track-order?orderNumber=${order.orderNumber}`}
                            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm text-center block"
                          >
                            Track Order
                          </Link>
                          {order.status === 'delivered' && (
                            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm">
                              Reorder
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/track-order" 
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Track an order without logging in →
          </Link>
        </div>
      </div>
    </div>
  )
}

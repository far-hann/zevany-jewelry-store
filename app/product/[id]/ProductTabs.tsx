'use client'

import { useState } from 'react'

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'shipping', label: 'Shipping & returns' },
  { id: 'care', label: 'Care & maintenance' },
  { id: 'gift', label: 'Gift-giving services' },
  { id: 'appointment', label: 'Book an appointment' },
]

interface ProductTabsProps {
  product: {
    description?: string
    specifications?: Record<string, string | undefined>
  }
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'Product description not available.'}
            </p>
            {product.specifications && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{value as string}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping & Returns</h3>
            <p className="text-gray-700">Free shipping on orders over $500. Returns accepted within 30 days.</p>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Care & Maintenance</h3>
            <p className="text-gray-700">Keep your jewelry looking beautiful with proper care and maintenance.</p>
          </div>
        )}

        {activeTab === 'gift' && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gift-Giving Services</h3>
            <p className="text-gray-700">Premium gift wrapping and personalized messages available.</p>
          </div>
        )}

        {activeTab === 'appointment' && (
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Book an Appointment</h3>
            <p className="text-gray-700">Schedule a personal consultation with our jewelry experts.</p>
          </div>
        )}
      </div>
    </div>
  )
}

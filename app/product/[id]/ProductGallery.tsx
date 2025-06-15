'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  product: {
    id: string
    name: string
    images: string[]
  }
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  return (
    <div className="lg:col-span-1">
      {/* Main Product Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-4">
        <Image
          src={product.images[selectedImageIndex]}
          alt={product.name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      
      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-colors ${
              selectedImageIndex === index ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} view ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 25vw, 12.5vw"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

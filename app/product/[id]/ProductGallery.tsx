'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  product: {
    id: string
    name: string
    images: string[]
  }
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  const handleZoomClose = () => {
    setIsZoomed(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  return (
    <>
      <div className="lg:col-span-1">
        {/* Main Product Image */}
        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 mb-4 group cursor-zoom-in">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            onClick={handleImageClick}
          />
          {/* Zoom Icon Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        </div>
        
        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square relative overflow-hidden rounded-lg bg-gray-100 border-2 transition-all duration-300 hover:scale-105 ${
                selectedImageIndex === index ? 'border-gray-900 shadow-lg' : 'border-transparent hover:border-gray-300'
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

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            {/* Close Button */}
            <button
              onClick={handleZoomClose}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            {/* Zoomed Image Container */}
            <div 
              className="relative overflow-hidden rounded-lg bg-white cursor-zoom-out"
              style={{ 
                width: 'min(90vw, 800px)', 
                height: 'min(90vh, 800px)',
                aspectRatio: '1/1'
              }}
              onClick={handleZoomClose}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={product.images[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 ease-out"
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: 'scale(2)'
                }}
                sizes="90vw"
                priority
              />
            </div>
            
            {/* Image Counter */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} of {product.images.length}
            </div>
            
            {/* Navigation Buttons for Zoom */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))
                  }}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))
                  }}
                  disabled={selectedImageIndex === product.images.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

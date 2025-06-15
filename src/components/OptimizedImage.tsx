'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  style?: React.CSSProperties
}

// Generate a minimal blur placeholder
const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
  if (typeof window === 'undefined') return ''
  
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    // Create a subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL()
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  onLoad,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [generatedBlurURL, setGeneratedBlurURL] = useState<string>('')
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Check if the image is SVG
  const isSVG = src.toLowerCase().endsWith('.svg')
  
  // If src is a string path and no blurDataURL is provided, force placeholder to 'empty'
  const isStaticImport = typeof src === 'object' && 'src' in src;
  const shouldUseBlur = placeholder === 'blur' && !isSVG && (isStaticImport || !!blurDataURL);
  const finalPlaceholder: 'blur' | 'empty' = (shouldUseBlur ? 'blur' : 'empty')

  useEffect(() => {
    if (typeof window !== 'undefined' && shouldUseBlur && !blurDataURL) {
      setGeneratedBlurURL(generateBlurDataURL())
    }
  }, [shouldUseBlur, blurDataURL])

  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  const handleError = () => {
    setHasError(true)
  }

  // Handle image loading errors
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      setImageSrc('/images/placeholder.jpg')
    }
  }

  // Only use generatedBlurURL on the client after hydration
  const blurURL = (typeof window !== 'undefined' && shouldUseBlur && !blurDataURL) ? generatedBlurURL : undefined

  // Fallback for broken images
  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height, ...style }}
      >
        <div className="text-gray-400 text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-xs">Image not found</p>
        </div>
      </div>
    )
  }  const imageProps = {
    src: imageSrc,
    alt,
    className: `transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    priority,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    loading: priority ? 'eager' : loading,
    placeholder: finalPlaceholder,
    ...(shouldUseBlur && { blurDataURL: blurDataURL || generatedBlurURL }),
    style,
    ...props,
  }
  // If SVG, never use fill, always require width/height
  if (isSVG) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 400}
        height={height || 200}
        className={imageProps.className}
        priority={priority}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : loading}
        placeholder={finalPlaceholder}
        style={style}
        {...props}
      />
    )
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes}
        alt={imageProps.alt || ''}
        placeholder={finalPlaceholder}
        blurDataURL={blurURL}
        onError={handleImageError}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      alt={imageProps.alt || ''}
      placeholder={finalPlaceholder}
      blurDataURL={blurURL}
      onError={handleImageError}
    />
  )
}

export default OptimizedImage
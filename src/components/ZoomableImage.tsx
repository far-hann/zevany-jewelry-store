import React, { useRef, useState } from "react";
import Image from "next/image";

export default function ZoomableImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Touch zoom for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 group ${className || ''}`}
        style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setZoomed(true)}
        onTouchEnd={() => setZoomed(false)}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        aria-label="Zoom product image"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-200"
          style={
            zoomed
              ? {
                  transform: `scale(2)`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  zIndex: 10,
                }
              : { transform: "scale(1)" }
          }
        />
        {/* Fullscreen button */}
        <button
          type="button"
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow text-xs text-gray-700 font-serif z-20"
          onClick={e => { e.stopPropagation(); setFullscreen(true); }}
          aria-label="View fullscreen"
        >
          Fullscreen
        </button>
        {/* Optional: Add a zoom icon overlay */}
        {!zoomed && (
          <div className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 shadow text-xs text-gray-700 font-serif pointer-events-none">
            Zoom
          </div>
        )}
      </div>
      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setFullscreen(false)}>
          <div className="relative w-full max-w-2xl aspect-square" onClick={e => e.stopPropagation()}>
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              style={{ background: 'black' }}
            />
            <button
              type="button"
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow text-gray-900 font-bold text-lg z-50"
              onClick={() => setFullscreen(false)}
              aria-label="Close fullscreen"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ImageZoom({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false 
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setIsZoomed(true);
    updateZoomPosition(e);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      updateZoomPosition(e);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setIsZoomed(false);
  };

  const updateZoomPosition = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  // Add global mouse up listener to handle cases where mouse is released outside the image
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
      setIsZoomed(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`transition-transform duration-200 ease-out ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
        }}
      />
      
      {/* Zoom indicator */}
      {isZoomed && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            Zoomed - Release to reset
          </div>
        </div>
      )}
    </div>
  );
} 
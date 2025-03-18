import React, { useEffect, useState, useRef } from 'react';

const TwitterEmbed = () => {
  // Specify the correct type for the ref (HTMLDivElement in this case)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 550, height: 400 });
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Keep aspect ratio similar to original dimensions
        const newWidth = Math.min(550, containerWidth - 40); // Add some padding
        const newHeight = Math.floor((newWidth / 550) * 400);
        
        setDimensions({ width: newWidth, height: newHeight });
      }
    };
    
    // Set dimensions on initial load
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Clean up
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <div className="w-full flex justify-center" ref={containerRef}>
      <div className="rounded-xl overflow-hidden shadow-xl bg-white">
        <iframe 
          src="https://platform.twitter.com/embed/Tweet.html?id=1894841403022209504" 
          width={dimensions.width}
          height={dimensions.height}
          allowFullScreen
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

export default TwitterEmbed;
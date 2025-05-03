import React, { useState, useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt"; // import the type

const LogoDisplay = ({ logoUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use the correct type for tiltRef
  const tiltRef = useRef(null);

  useEffect(() => {
    if (tiltRef.current && imageLoaded) {
      // Initialize VanillaTilt only if the image has loaded
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        "max-glare": 0.3,
        scale: 1.05,
      });

      return () => {
        if (tiltRef.current && tiltRef.current.vanillaTilt) {
          tiltRef.current.vanillaTilt.destroy();
        }
      };
    }
  }, [imageLoaded]);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageLoaded(true);

  return (
    <div ref={tiltRef} className="bg-blue-50/10 p-8 rounded-xl shadow-lg transform transition-all duration-500">
      <div className={`w-full aspect-square flex items-center justify-center bg-gray-800 rounded ${!imageLoaded ? 'block' : 'hidden'}`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <img
        src={logoUrl}
        alt="Logo"
        className={`w-full object-contain ${imageLoaded ? 'block' : 'hidden'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-blue-400 font-bold text-2xl">CPE</div>
        </div>
      )}
    </div>
  );
};

export default LogoDisplay;

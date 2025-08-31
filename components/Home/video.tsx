"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
  video: string;
  thumbnail: string;
  description: string;
};

// Sample product data
const products: Product[] = [
  {
    id: "1",
    slug: "oxidized-studs-earrings",
    title: "Set Of 12 Oxidized Designers Studs Earrings With Folding Jewelry Box",
    price: 2499,
    discountPrice: 1999,
    image: "/images/oxidized-earrings.jpg",
    video: "/videos/oxidized-earrings.mp4",
    thumbnail: "/thumbnails/oxidized-earrings.jpg",
    description: "Beautiful set of 12 designer oxidized stud earrings with premium folding jewelry box."
  },
  {
    id: "2",
    slug: "pink-lotus-set",
    title: "Elegant Pink Lotus Necklace & Earrings Set",
    price: 3499,
    discountPrice: 2799,
    image: "/images/pink-lotus.jpg",
    video: "/videos/pink-lotus.mp4",
    thumbnail: "/thumbnails/pink-lotus.jpg",
    description: "Exquisite pink lotus themed necklace and earrings set for special occasions."
  },
  {
    id: "3",
    slug: "gemstone-drop-earrings",
    title: "Layers of Gemstone Drop Earrings",
    price: 1899,
    image: "/images/gemstone-earrings.jpg",
    video: "/videos/gemstone-earrings.mp4",
    thumbnail: "/thumbnails/gemstone-earrings.jpg",
    description: "Elegant gemstone drop earrings with multiple layers for a sophisticated look."
  },
  {
    id: "4",
    slug: "floral-choker-set",
    title: "Antique Floral Choker Set with Stud Earrings",
    price: 2999,
    discountPrice: 2399,
    image: "/images/floral-choker.jpg",
    video: "/videos/floral-choker.mp4",
    thumbnail: "/thumbnails/floral-choker.jpg",
    description: "Vintage-inspired floral choker set with matching stud earrings."
  }
];

// Video Lightbox Component
function VideoLightbox({ isOpen, onClose, product, products }: { isOpen: boolean, onClose: () => void, product: Product | null, products: Product[] }) {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set current product index when product changes
  useEffect(() => {
    if (product) {
      const index = products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        setCurrentProductIndex(index);
      }
    }
  }, [product, products]);

  // Handle video play state
  useEffect(() => {
    if (isOpen && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isOpen, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const value = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(value);
    }
  };

  const navigateToProduct = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentProductIndex(prev => (prev > 0 ? prev - 1 : products.length - 1));
    } else {
      setCurrentProductIndex(prev => (prev < products.length - 1 ? prev + 1 : 0));
    }
    setIsPlaying(true);
    setProgress(0);
  };

  const currentProduct = products[currentProductIndex];

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Main Lightbox Container */}
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black rounded-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Video List */}
        <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto">
          <div className="p-4 grid grid-cols-2 md:grid-cols-1 gap-4">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className={`cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${
                  index === currentProductIndex ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => {
                  setCurrentProductIndex(index);
                  setIsPlaying(true);
                  setProgress(0);
                }}
              >
                <div className="relative aspect-video">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 bg-gray-900">
                  <p className="text-xs text-white font-medium truncate">{product.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Main Video */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Controls */}
          <div className="p-4 bg-gray-900 flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMute}
                className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                {isMuted ? (
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.047 3.062a.75.75 0 01.453.688v12.5a.75.75 0 01-1.264.546L5.203 13H2.667a.75.75 0 01-.7-.48A6.985 6.985 0 011.5 10c0-.887.165-1.737.468-2.52a.75.75 0 01.7-.48h2.535l4.033-3.796a.75.75 0 01.811-.142zM13.78 7.22a.75.75 0 10-1.06 1.06L14.44 10l-1.72 1.72a.75.75 0 001.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 001.06-1.06L16.56 10l1.72-1.72a.75.75 0 00-1.06-1.06L15.5 8.94l-1.72-1.72z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.5 3.75a.75.75 0 00-1.264-.546L5.203 7H2.667a.75.75 0 00-.7.48A6.985 6.985 0 001.5 10c0 .887.165 1.737.468 2.52.111.29.39.48.7.48h2.535l4.033 3.796a.75.75 0 001.264-.546V3.75zM16.45 5.05a.75.75 0 00-1.06 1.061 5.5 5.5 0 010 7.778.75.75 0 001.06 1.06 7 7 0 000-9.899z" />
                    <path d="M14.329 7.172a.75.75 0 00-1.061 1.06 2.5 2.5 0 010 3.536.75.75 0 001.06 1.06 4 4 0 000-5.656z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={togglePlay}
                className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.841z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 h-1">
            <div 
              className="bg-amber-500 h-1 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Video Player */}
          <div className="flex-1 relative">
            <video
              ref={videoRef}
              src={currentProduct.video}
              className="w-full h-full object-contain"
              muted={isMuted}
              onTimeUpdate={handleProgress}
              onEnded={() => setIsPlaying(false)}
              playsInline
              loop={false}
            />
            
            {/* Play button overlay when paused */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
                onClick={togglePlay}
              >
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => navigateToProduct('prev')}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button
            onClick={() => navigateToProduct('next')}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 p-2 text-white bg-gray-900/80 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Right Side - Product Info */}
        <div className="w-full md:w-1/4 bg-gray-900 p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-16 h-16 mb-3">
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-contain rounded-sm"
              />
            </div>
            <h3 className="text-white font-semibold text-center text-sm mb-2">{currentProduct.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold">₹{currentProduct.discountPrice || currentProduct.price}</span>
              {currentProduct.discountPrice && (
                <span className="text-gray-400 line-through text-sm">₹{currentProduct.price}</span>
              )}
            </div>
          </div>
          
          <button className="w-full py-3 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 transition-colors mb-4">
            Add To Cart
          </button>
          
          <div className="text-gray-300 text-sm">
            <p className="mb-3">{currentProduct.description}</p>
            <Link 
              href={`/product/${currentProduct.slug}`}
              className="text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center"
            >
              View Product Details
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopifyVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle video play state
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeVideo && isPlaying) {
          video.play().catch(() => {
            // Autoplay might be blocked by browser
            setIsPlaying(false);
          });
        } else {
          video.pause();
        }
      }
    });
  }, [activeVideo, isPlaying]);

  const handleVideoClick = (index: number, product: Product) => {
    setActiveVideo(index);
    setIsPlaying(true);
    setSelectedProduct(product);
    setIsLightboxOpen(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Scroll to active video
  useEffect(() => {
    if (containerRef.current) {
      const activeElement = containerRef.current.children[activeVideo] as HTMLElement;
      if (activeElement) {
        containerRef.current.scrollTo({
          left: activeElement.offsetLeft - containerRef.current.offsetLeft - 20,
          behavior: 'smooth'
        });
      }
    }
  }, [activeVideo]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Watch and Shop !!</h2>
          <p className="text-amber-600 font-medium">FUBS</p>
        </div>

        {/* Video Cards Container */}
        <div className="relative">
          <div 
            ref={containerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 mx-2 transition-all duration-300"
                style={{ width: '270px', margin: '0 6px' }}
              >
                <div 
                  className="bg-white rounded-md shadow-md overflow-hidden cursor-pointer border border-gray-100"
                  onClick={() => handleVideoClick(index, product)}
                >
                  {/* Video Container */}
                  <div className="relative" style={{ height: '386px' }}>
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.thumbnail})` }}
                    />
                    <video
                      src={product.video}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      style={{ display: activeVideo === index && isPlaying ? 'block' : 'none' }}
                    />
                    
                    {/* Play/Pause overlay */}
                    {activeVideo === index && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity"
                        onClick={togglePlay}
                        style={{ display: isPlaying ? 'none' : 'flex' }}
                      >
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Shopping cart icon */}
                    <div className="absolute top-2 right-2 z-10">
                      <div className="flex justify-end w-full">
                        <div className="flex justify-center items-center px-1.5 py-1.5 bg-black/40 rounded-3xl">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                            <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="relative bg-white text-black w-full pt-4 pb-3 px-2">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={45}
                        height={45}
                        className="rounded-sm shadow-sm object-contain"
                      />
                    </div>
                    <h3 className="text-xs font-semibold text-center mb-1 line-clamp-2 leading-tight">
                      {product.title}
                    </h3>
                    <div className="flex justify-center items-center mt-1">
                      {product.discountPrice ? (
                        <>
                          <span className="text-xs font-bold text-gray-900">₹{product.discountPrice}</span>
                          <span className="ml-1 text-xs text-gray-500 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-1 rounded-r-md shadow-md z-10 hidden md:block"
            onClick={() => setActiveVideo(prev => Math.max(0, prev - 1))}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-1 rounded-l-md shadow-md z-10 hidden md:block"
            onClick={() => setActiveVideo(prev => Math.min(products.length - 1, prev + 1))}
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-2">Unboxing</p>
          <p className="text-amber-600 font-medium text-xl">Love so!</p>
        </div>
      </div>

      {/* Video Lightbox */}
      <VideoLightbox 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
        product={selectedProduct} 
        products={products} 
      />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
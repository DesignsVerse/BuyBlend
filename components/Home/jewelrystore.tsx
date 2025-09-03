import Image from 'next/image';

const images = [
  {
    src: '/new/1.jpg',
    title: 'LUXURY GOLD',
    alt: 'Luxury gold jewelry collection'
  },
  {
    src: '/new/2.jpg',
    title: 'BESTSELLERS',
    alt: 'Bestselling jewelry pieces'
  },
  {
    src: '/new/3.jpg',
    title: 'DIAMOND ELEGANCE',
    alt: 'Diamond jewelry collection'
  },
  {
    src: '/new/5.jpg',
    title: 'EVERYDAY ESSENTIALS',
    alt: 'Essential daily wear jewelry'
  },
];

export default function JewelryStore() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <h2 className="text-center text-4xl md:text-5xl font-bold mb-12 text-gray-800 tracking-tight">
        THE JEWELRY STORE
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <div className="relative h-[420px] md:h-[500px] group overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 bg-gradient-to-r from-amber-900/80 to-amber-800/80 text-amber-100 font-semibold text-xl md:text-2xl px-6 py-3 rounded-xl shadow-md transition-all duration-300 group-hover:bg-amber-900">
            {images[0].title}
          </div>
        </div>
        {/* Center Column */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="relative h-[200px] md:h-[240px] group overflow-hidden rounded-2xl shadow-md">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-4 bottom-1/4 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md transition-all duration-300 group-hover:text-amber-200">
              {images[1].title}
            </div>
          </div>
          <div className="relative h-[200px] md:h-[240px] group overflow-hidden rounded-2xl shadow-md">
            <Image
              src={images[3].src}
              alt={images[3].alt}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-4 bottom-1/4 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md transition-all duration-300 group-hover:text-amber-200">
              {images[3].title}
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="relative h-[420px] md:h-[500px] group overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={images[2].src}
            alt={images[2].alt}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute bottom-6 inset-x-0 text-center bg-gradient-to-t from-gray-900/50 to-transparent text-white font-semibold text-xl md:text-2xl py-4 tracking-wide drop-shadow-lg transition-all duration-300 group-hover:text-amber-200">
            {images[2].title}
          </div>
        </div>
      </div>
    </div>
  );
}
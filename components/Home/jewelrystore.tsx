import Image from 'next/image';
import Link from 'next/link';

const images = [
  {
    src: '/new/1.jpg',
    title: 'KOREAN EARRINGS',
    alt: 'Korean style earrings collection',
    link: '/collection/earrings/korean'
  },
  {
    src: '/new/2.jpg',
    title: 'STUD EARRINGS',
    alt: 'Stud earrings collection',
    link: '/collection/earrings/stud'
  },
  {
    src: '/new/3.jpg',
    title: 'WESTERN EARRINGS',
    alt: 'Western style earrings collection',
    link: '/collection/earrings/western'
  },
  {
    src: '/new/5.jpg',
    title: 'JHUMKA COLLECTION',
    alt: 'Traditional jhumka earrings',
    link: '/collection/earrings'
  },
];

export default function JewelryStore() {
  return (
    <div className="hidden lg:block w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans mt-6">
      {/* Premium Header */}
      <div className="text-center mb-6">
        <div className="inline-block mb-4">
          <div className="h-px w-16 bg-amber-500 mx-auto mb-2"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight uppercase">
            THE JEWELRY STORE
          </h2>
          <div className="h-px w-16 bg-amber-500 mx-auto mt-2"></div>
        </div>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Discover our exclusive collection of premium jewelry, crafted with precision and elegance.
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column */}
        <Link href={images[0].link} className="block">
          <div className="relative h-[420px] md:h-[500px] group overflow-hidden cursor-pointer">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-6 left-6 bg-amber-900/90 text-amber-50 font-semibold text-xl md:text-2xl px-6 py-3 shadow-lg transition-all duration-500 group-hover:bg-amber-900 group-hover:translate-y-[-5px]">
              {images[0].title}
            </div>
          </div>
        </Link>
        
        {/* Center Column */}
        <div className="flex flex-col gap-6 md:gap-8">
          <Link href={images[1].link} className="block">
            <div className="relative h-[200px] md:h-[240px] group overflow-hidden cursor-pointer">
              <Image
                src={images[1].src}
                alt={images[1].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-x-0 bottom-4 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md transition-all duration-500 group-hover:text-amber-200 group-hover:translate-y-[-3px]">
                {images[1].title}
              </div>
            </div>
          </Link>
          
          <Link href={images[3].link} className="block">
            <div className="relative h-[200px] md:h-[240px] group overflow-hidden cursor-pointer">
              <Image
                src={images[3].src}
                alt={images[3].alt}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-x-0 bottom-4 text-center text-white font-bold text-lg md:text-xl tracking-wide drop-shadow-md transition-all duration-500 group-hover:text-amber-200 group-hover:translate-y-[-3px]">
                {images[3].title}
              </div>
            </div>
          </Link>
        </div>
        
        {/* Right Column */}
        <Link href={images[2].link} className="block">
          <div className="relative h-[420px] md:h-[500px] group overflow-hidden cursor-pointer">
            <Image
              src={images[2].src}
              alt={images[2].alt}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-700 group-hover:scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-6 inset-x-0 text-center text-white font-semibold text-xl md:text-2xl py-4 tracking-wide drop-shadow-lg transition-all duration-500 group-hover:text-amber-200 group-hover:translate-y-[-5px]">
              {images[2].title}
            </div>
          </div>
        </Link>
      </div>
      
     
    </div>
  );
}
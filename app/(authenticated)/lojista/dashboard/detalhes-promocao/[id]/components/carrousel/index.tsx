// components/SimpleCarousel.tsx
'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden">
      <div className="relative w-full h-[450px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex].id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full "
          >
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full shadow-xl object-cover h-[450px] rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles */}
      {/* <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-20 shadow-md hover:bg-white"
      >
        &larr;
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-20 shadow-md hover:bg-white"
      >
        &rarr;
      </button> */}

      {/* Paginação */}
      <div className="flex justify-center mt-6 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-5 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
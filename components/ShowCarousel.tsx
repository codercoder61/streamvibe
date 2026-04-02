'use client';

import { TVShow, getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ShowCarouselProps {
  title: string;
  shows: TVShow[];
}

export default function ShowCarousel({ title, shows }: ShowCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-foreground">{title}</h2>

        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <div className="bg-primary/80 hover:bg-primary rounded-full p-2 transition-colors">
              <ChevronLeft size={24} className="text-primary-foreground" />
            </div>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
          >
            {shows.map((show) => (
              <Link
                key={show.id}
                href={`/series/${show.id}`}
                className="flex-shrink-0 group/card transition-transform duration-300 hover:scale-105"
              >
                <div className="w-48 h-72 bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors shadow-lg hover:shadow-primary/50">
                  <div className="relative w-full h-full bg-muted">
                    <img
                      src={getImageUrl(show.poster_path)}
                      alt={show.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                        {show.name}
                      </h3>
                      <p className="text-gray-300 text-xs line-clamp-2">
                        {show.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <div className="bg-primary/80 hover:bg-primary rounded-full p-2 transition-colors">
              <ChevronRight size={24} className="text-primary-foreground" />
            </div>
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

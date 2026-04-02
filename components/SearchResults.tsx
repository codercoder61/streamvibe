'use client';

import { TVShow, getImageUrl } from '@/lib/tmdb';
import Link from 'next/link';

interface SearchResultsProps {
  results: TVShow[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-foreground">
          Search Results ({results.length})
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No shows found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((show) => (
              <Link
                key={show.id}
                href={`/series/${show.id}`}
                className="group transition-transform duration-300 hover:scale-105"
              >
                <div className="w-full aspect-[2/3] bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors shadow-lg hover:shadow-primary/50">
                  <div className="relative w-full h-full bg-muted">
                    <img
                      src={getImageUrl(show.poster_path)}
                      alt={show.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
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
        )}
      </div>
    </section>
  );
}

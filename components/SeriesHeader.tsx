'use client';

import { TVShow, getImageUrl } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface SeriesHeaderProps {
  show: TVShow;
}

export default function SeriesHeader({ show }: SeriesHeaderProps) {
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A';

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Poster */}
      <div className="flex-shrink-0">
        <div className="w-48 h-72 rounded-lg overflow-hidden shadow-2xl border border-border">
          <img
            src={getImageUrl(show.poster_path)}
            alt={show.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Series Info */}
      <div className="flex-1 text-foreground">
        <div className="mb-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{show.name}</h1>
          {show.tagline && (
            <p className="text-lg text-muted-foreground italic">
              &quot;{show.tagline}&quot;
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{show.vote_average.toFixed(1)}/10</span>
          </div>

          <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
            {year}
          </div>

          {show.number_of_seasons && (
            <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
            </div>
          )}

          {show.number_of_episodes && (
            <div className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
              {show.number_of_episodes} Episode{show.number_of_episodes !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Genres */}
        {show.genres && show.genres.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <div
                  key={genre.id}
                  className="px-3 py-1 border border-border rounded-lg text-sm text-foreground hover:border-primary transition-colors"
                >
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Synopsis
          </h3>
          <p className="text-foreground leading-relaxed max-w-2xl">
            {show.overview}
          </p>
        </div>
      </div>
    </div>
  );
}

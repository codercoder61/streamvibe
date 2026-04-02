'use client';

import { Episode, getImageUrl } from '@/lib/tmdb';
import { getStreamingUrl } from '@/lib/servers';
import { useState } from 'react';

interface EpisodeSelectorProps {
  episode: Episode;
  showId: number;
  selectedServer: string;
}

export default function EpisodeSelector({ episode, showId, selectedServer }: EpisodeSelectorProps) {
  const [iframeLoading, setIframeLoading] = useState(true);
  const streamingUrl = getStreamingUrl(showId, episode.season_number, episode.episode_number, selectedServer);

  return (
    <div className="mt-8 bg-card border border-border rounded-lg overflow-hidden">
      {/* Episode Info */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Season {episode.season_number}, Episode {episode.episode_number}: {episode.name}
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Air Date: {episode.air_date || 'TBA'}
        </p>
        <p className="text-foreground leading-relaxed">
          {episode.overview || 'No description available.'}
        </p>
      </div>

      {/* Player Container */}
      <div className="bg-background p-6">
        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
          {iframeLoading && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                <p className="mt-4 text-muted-foreground text-sm">Loading player...</p>
              </div>
            </div>
          )}
          <iframe
            src={streamingUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIframeLoading(false)}
            onError={() => setIframeLoading(false)}
            title={`${episode.name} - Season ${episode.season_number} Episode ${episode.episode_number}`}
          ></iframe>
        </div>
      </div>

      {/* Episode Still */}
      {episode.still_path && (
        <div className="p-6 border-t border-border">
          <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden">
            <img
              src={getImageUrl(episode.still_path)}
              alt={episode.name}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

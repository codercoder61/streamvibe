'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getShowDetails, getSeasons, getEpisodes, TVShow, Season, Episode, getImageUrl } from '@/lib/tmdb';
import SeriesHeader from '@/components/SeriesHeader';
import EpisodeSelector from '@/components/EpisodeSelector';
import ServerSelector from '@/components/ServerSelector';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SeriesPage() {
  const params = useParams();
  const id = params.id as string;
  const showId = parseInt(id);

  const [show, setShow] = useState<TVShow | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServer, setSelectedServer] = useState('server1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowData = async () => {
      setLoading(true);
      const details = await getShowDetails(showId);
      if (details) {
        setShow(details);
        const seasonList = await getSeasons(showId);
        setSeasons(seasonList);

        // Get episodes for first season
        if (seasonList.length > 0) {
          const firstSeasonEpisodes = await getEpisodes(showId, seasonList[0].season_number);
          setEpisodes(firstSeasonEpisodes);
        }
      }
      setLoading(false);
    };

    fetchShowData();
  }, [showId]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (seasons.length > 0) {
        const seasonEpisodes = await getEpisodes(showId, selectedSeason);
        setEpisodes(seasonEpisodes);
        setSelectedEpisode(1); // Reset to first episode when season changes
      }
    };

    fetchEpisodes();
  }, [selectedSeason, showId, seasons]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading series...</p>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Series not found</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-40">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft size={20} />
          Back
        </Link>
      </div>

      {/* Backdrop */}
      {show.backdrop_path && (
        <div className="relative h-64 sm:h-96 md:h-[500px] overflow-hidden">
          <img
            src={getImageUrl(show.backdrop_path)}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
        </div>
      )}

      <div className="relative -mt-32 sm:-mt-48 md:-mt-64 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Series Header */}
          <SeriesHeader show={show} />

          {/* Episode Selection */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Select Episode</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Season Selector */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  {seasons.map((season) => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Episode Selector */}
              {episodes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-3">
                    Episode
                  </label>
                  <select
                    value={selectedEpisode}
                    onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {episodes.map((episode) => (
                      <option key={episode.id} value={episode.episode_number}>
                        Ep. {episode.episode_number}: {episode.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Server Selector */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Server
                </label>
                <ServerSelector
                  selectedServer={selectedServer}
                  onServerChange={setSelectedServer}
                />
              </div>
            </div>
          </div>

          {/* Episode Details */}
          {episodes.length > 0 && (
            <EpisodeSelector
              episode={episodes[selectedEpisode - 1]}
              showId={showId}
              selectedServer={selectedServer}
            />
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getTrendingShows, getPopularShows, TVShow } from '@/lib/tmdb';
import Header from '@/components/Header';
import ShowCarousel from '@/components/ShowCarousel';
import SearchResults from '@/components/SearchResults';

export default function Home() {
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [popularShows, setPopularShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<TVShow[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [trending, popular] = await Promise.all([
        getTrendingShows(),
        getPopularShows(),
      ]);
      setTrendingShows(trending);
      setPopularShows(popular);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (query: string, results: TVShow[]) => {
    if (query.trim()) {
      setSearchResults(results);
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <main className="pt-20 pb-12">
        {isSearching ? (
          <SearchResults results={searchResults} />
        ) : (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                  <p className="mt-4 text-muted-foreground">Loading shows...</p>
                </div>
              </div>
            ) : (
              <>
                <ShowCarousel title="Trending Now" shows={trendingShows} />
                <ShowCarousel title="Popular" shows={popularShows} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

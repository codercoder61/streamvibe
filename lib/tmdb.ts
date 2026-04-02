const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmYzOTcwNGJhOTEwMjlkM2NhZDY3MzQwY2E2ODYwMCIsInN1YiI6IjY2MzZhNzk0OTU5MGUzMDEyM2JjNDlhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ImAuflKe7r_PCIM-jUc8wa9hCTYlwFWQqhQaIXgKVhI'
  },
  next: { revalidate: 3600 }
};
export interface TVShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genres?: Array<{ id: number; name: string }>;
  tagline?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  season_number: number;
}

async function fetchFromTMDB(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const response = await fetch(url.toString(), options);
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }
  return response.json();
}

export async function getTrendingShows(): Promise<TVShow[]> {
  try {
    const data = await fetchFromTMDB('/trending/tv/week');
    return data.results.slice(0, 10).map((show: any) => ({
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      overview: show.overview,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching trending shows:', error);
    return [];
  }
}

export async function getPopularShows(): Promise<TVShow[]> {
  try {
    const data = await fetchFromTMDB('/tv/popular');
    return data.results.slice(0, 10).map((show: any) => ({
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      overview: show.overview,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching popular shows:', error);
    return [];
  }
}

export async function searchShows(query: string): Promise<TVShow[]> {
  try {
    const data = await fetchFromTMDB('/search/tv', { query });
    return data.results.map((show: any) => ({
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      backdrop_path: show.backdrop_path,
      overview: show.overview,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
    }));
  } catch (error) {
    console.error('Error searching shows:', error);
    return [];
  }
}

export async function getShowDetails(id: number): Promise<TVShow | null> {
  try {
    const data = await fetchFromTMDB(`/tv/${id}`, { append_to_response: 'genres' });
    return {
      id: data.id,
      name: data.name,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      tagline: data.tagline,
      genres: data.genres,
      number_of_seasons: data.number_of_seasons,
      number_of_episodes: data.number_of_episodes,
    };
  } catch (error) {
    console.error('Error fetching show details:', error);
    return null;
  }
}

export async function getSeasons(id: number): Promise<Season[]> {
  try {
    const data = await fetchFromTMDB(`/tv/${id}`);
    return data.seasons.map((season: any) => ({
      id: season.id,
      season_number: season.season_number,
      name: season.name,
      episode_count: season.episode_count,
      air_date: season.air_date,
      poster_path: season.poster_path,
    }));
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }
}

export async function getEpisodes(id: number, seasonNumber: number): Promise<Episode[]> {
  try {
    const data = await fetchFromTMDB(`/tv/${id}/season/${seasonNumber}`);
    return data.episodes.map((episode: any) => ({
      id: episode.id,
      episode_number: episode.episode_number,
      name: episode.name,
      overview: episode.overview,
      air_date: episode.air_date,
      still_path: episode.still_path,
      season_number: episode.season_number,
    }));
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}

export function getImageUrl(path: string | null): string {
  if (!path) return '/placeholder.png';
  return `${IMAGE_BASE_URL}${path}`;
}

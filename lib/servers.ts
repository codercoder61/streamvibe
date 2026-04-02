export interface StreamingServer {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const STREAMING_SERVERS: StreamingServer[] = [
  {
    id: 'server1',
    name: 'Server 1',
    icon: '▶',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 'server4',
    name: 'Server 2',
    icon: '▶',
    color: 'from-orange-500 to-orange-700',
  },
];

// Mock function to get streaming URL based on show, season, episode and server
export function getStreamingUrl(
  showId: number,
  seasonNumber: number,
  episodeNumber: number,
  serverId: string
): string {
  // This is a mock implementation. In production, you would fetch real streaming URLs
  // For now, we'll use embed URLs from a demo streaming service
  
  const baseUrls: Record<string, string> = {
    server1: 'https://vidsrc.me/embed/tv/',
    server2: 'https://embed.sflix.com/embed/tv/',
    server3: 'https://vidsrc.to/embed/tv/',
    server4: 'https://multiembed.mov/?video_id=',
  };

  const baseUrl = baseUrls[serverId] || baseUrls.server1;

  // Format: showId-seasonNumber-episodeNumber
  if (serverId === 'server4') {
    return `${baseUrl}${showId}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;
  }

  return `${baseUrl}${showId}/${seasonNumber}/${episodeNumber}`;
}

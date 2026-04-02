'use client';

import { STREAMING_SERVERS } from '@/lib/servers';

interface ServerSelectorProps {
  selectedServer: string;
  onServerChange: (serverId: string) => void;
}

export default function ServerSelector({ selectedServer, onServerChange }: ServerSelectorProps) {
  return (
    <select
      value={selectedServer}
      onChange={(e) => onServerChange(e.target.value)}
      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
    >
      {STREAMING_SERVERS.map((server) => (
        <option key={server.id} value={server.id}>
          {server.name}
        </option>
      ))}
    </select>
  );
}

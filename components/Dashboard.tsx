import React, { useState, useEffect, useRef } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { YTMusicTrack, YTMusicPlaylist } from '../types';
import { youtubeMusicService } from '../services/youtubeMusicService';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<YTMusicPlaylist[]>([]);
  const [activeContent, setActiveContent] = useState<{ type: 'playlist' | 'search' | 'welcome'; data: YTMusicTrack[] }>({ type: 'welcome', data: [] });
  const [queue, setQueue] = useState<YTMusicTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    youtubeMusicService.getCharts()
      .then(setPlaylists)
      .catch(error => console.error("Failed to fetch charts:", error));
  }, []);

  const handlePlaylistSelect = (playlistId: string) => {
    youtubeMusicService.getPlaylistItems(playlistId)
      .then(tracks => {
        setActiveContent({ type: 'playlist', data: tracks });
      })
      .catch(error => console.error("Failed to get playlist items:", error));
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
        setActiveContent({ type: 'welcome', data: [] });
        return;
    }
    youtubeMusicService.search(query)
      .then(tracks => {
        setActiveContent({ type: 'search', data: tracks });
      })
      .catch(error => console.error("Failed to search tracks:", error));
  };

  const handleTrackPlay = (track: YTMusicTrack, contextTracks: YTMusicTrack[]) => {
    const trackIndexInContext = contextTracks.findIndex(t => t.videoId === track.videoId);
    setQueue(contextTracks);
    setCurrentTrackIndex(trackIndexInContext);
  };

  const playNext = () => {
    if (currentTrackIndex < queue.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const activeTrack = queue[currentTrackIndex] || null;

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col p-2 gap-2">
      <div className="flex-grow flex gap-2 overflow-hidden">
        <Sidebar playlists={playlists} onPlaylistSelect={handlePlaylistSelect} />
        <MainContent 
            activeContent={activeContent} 
            onPlay={handleTrackPlay}
            onSearch={handleSearch}
        />
      </div>
      <Player 
        activeTrack={activeTrack}
        onNext={playNext}
        onPrevious={playPrevious}
        onEnded={playNext}
      />
    </div>
  );
};

export default Dashboard;
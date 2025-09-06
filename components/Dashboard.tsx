import React, { useState, useEffect, useCallback } from 'react';
import { Playlist, Track } from '../types';
import { getFeaturedPlaylists, getPlaylistItems, searchTracks } from '../services/spotifyService';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeContent, setActiveContent] = useState<{ type: 'playlist' | 'search' | 'welcome'; data: any }>({ type: 'welcome', data: null });
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [trackQueue, setTrackQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  useEffect(() => {
    getFeaturedPlaylists()
      .then(data => setPlaylists(data.items))
      .catch(error => console.error("Failed to fetch featured playlists:", error));
  }, []);

  const handlePlaylistSelect = (playlistId: string) => {
    getPlaylistItems(playlistId)
      .then(data => {
        const tracks = data.items.map(item => item.track).filter(Boolean);
        setActiveContent({ type: 'playlist', data: { items: data.items, id: playlistId } });
        setTrackQueue(tracks);
        setActiveTrack(null);
        setCurrentTrackIndex(-1);
      })
      .catch(error => console.error("Failed to get playlist items:", error));
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
        setActiveContent({ type: 'welcome', data: null });
        setTrackQueue([]);
        return;
    }
    searchTracks(query)
      .then(data => {
        const tracks = data.tracks.items.filter(Boolean);
        setActiveContent({ type: 'search', data: tracks });
        setTrackQueue(tracks);
        setActiveTrack(null);
        setCurrentTrackIndex(-1);
      })
      .catch(error => console.error("Failed to search tracks:", error));
  };

  const handleTrackPlay = (track: Track, index: number) => {
    setActiveTrack(track);
    setCurrentTrackIndex(index);
  };

  const handleNextTrack = useCallback(() => {
    if (trackQueue.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % trackQueue.length;
      setCurrentTrackIndex(nextIndex);
      setActiveTrack(trackQueue[nextIndex]);
    }
  }, [currentTrackIndex, trackQueue]);

  const handlePreviousTrack = useCallback(() => {
    if (trackQueue.length > 0) {
      const prevIndex = (currentTrackIndex - 1 + trackQueue.length) % trackQueue.length;
      setCurrentTrackIndex(prevIndex);
      setActiveTrack(trackQueue[prevIndex]);
    }
  }, [currentTrackIndex, trackQueue]);

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
        onNext={handleNextTrack} 
        onPrevious={handlePreviousTrack} 
      />
    </div>
  );
};

export default Dashboard;

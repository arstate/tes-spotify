
import React, { useState, useEffect } from 'react';
import { Playlist, Track, UserProfile } from '../types';
import { getFeaturedPlaylists, getPlaylistItems, searchTracks, getUserProfile, logout, getStoredAccessToken, startOrResumePlayback } from '../services/spotifyService';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Player from './Player';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeContent, setActiveContent] = useState<{ type: 'playlist' | 'search' | 'welcome'; data: any }>({ type: 'welcome', data: null });
  
  // Spotify Player State
  // FIX: The type for the Spotify Player instance is `ISpotifyPlayer`, not `Spotify.Player`.
  const [player, setPlayer] = useState<ISpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<Spotify.PlaybackState | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    getUserProfile()
        .then(setUser)
        .catch(error => {
            console.error("Failed to fetch user profile:", error);
            // If the token is invalid, the service will handle logout.
        });
        
    getFeaturedPlaylists()
      .then(data => setPlaylists(data.items))
      .catch(error => console.error("Failed to fetch featured playlists:", error));

    // --- Initialize Spotify Web Playback SDK ---
    const token = getStoredAccessToken();
    if (!token) {
        logout();
        return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    
    window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new window.Spotify.Player({
            name: 'Spotify Clone Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });

        setPlayer(spotifyPlayer);

        spotifyPlayer.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            setIsPlayerReady(true);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            setIsPlayerReady(false);
        });

        spotifyPlayer.addListener('player_state_changed', (state) => {
            if (!state) {
                return;
            }
            setPlayerState(state);
        });

        spotifyPlayer.addListener('initialization_error', ({ message }) => { 
            console.error('Failed to initialize', message); 
        });
        spotifyPlayer.addListener('authentication_error', ({ message }) => { 
            console.error('Failed to authenticate', message);
            logout();
        });
        spotifyPlayer.addListener('account_error', ({ message }) => { 
            console.error('Failed to validate Spotify account', message);
        });

        spotifyPlayer.connect();
    };

    return () => {
      player?.disconnect();
    }
  }, []);

  const handlePlaylistSelect = (playlistId: string) => {
    getPlaylistItems(playlistId)
      .then(data => {
        setActiveContent({ type: 'playlist', data: { items: data.items, id: playlistId } });
      })
      .catch(error => console.error("Failed to get playlist items:", error));
  };

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
        setActiveContent({ type: 'welcome', data: null });
        return;
    }
    searchTracks(query)
      .then(data => {
        setActiveContent({ type: 'search', data: data.tracks.items });
      })
      .catch(error => console.error("Failed to search tracks:", error));
  };

  const handleTrackPlay = (track: Track, index: number, context: { type: 'playlist' | 'search', tracks: Track[], playlistId?: string }) => {
    if (!deviceId) {
      console.error("Player device is not ready.");
      alert("Spotify player is not ready. Please wait a moment and try again.");
      return;
    }

    if (context.type === 'playlist' && context.playlistId) {
      const playlistUri = `spotify:playlist:${context.playlistId}`;
      startOrResumePlayback(deviceId, { uri: playlistUri, offset: index });
    } else {
      const trackUris = context.tracks.map(t => t.uri);
      startOrResumePlayback(deviceId, { uri: track.uri }, trackUris.slice(index));
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col p-2 gap-2">
      <div className="flex-grow flex gap-2 overflow-hidden">
        <Sidebar playlists={playlists} onPlaylistSelect={handlePlaylistSelect} />
        <MainContent 
            user={user}
            onLogout={logout}
            activeContent={activeContent} 
            onPlay={handleTrackPlay}
            onSearch={handleSearch}
        />
      </div>
      <Player 
        player={player}
        playerState={playerState}
        isPlayerReady={isPlayerReady}
      />
    </div>
  );
};

export default Dashboard;

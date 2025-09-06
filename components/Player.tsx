
import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon } from './Icons';

interface PlayerProps {
  // FIX: The type for the Spotify Player instance is `ISpotifyPlayer`, not `Spotify.Player`.
  player: ISpotifyPlayer | null;
  playerState: Spotify.PlaybackState | null;
  isPlayerReady: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, playerState, isPlayerReady }) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    let interval: number;
    if (playerState && !playerState.paused) {
      interval = window.setInterval(() => {
        setCurrentProgress(prev => prev + 1000);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [playerState?.paused]);

  useEffect(() => {
    setCurrentProgress(playerState?.position || 0);
  }, [playerState?.position])


  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!isPlayerReady) {
    return (
        <div className="h-24 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center text-sm text-neutral-400">
            Connecting to Spotify Player...
        </div>
    );
  }

  const activeTrack = playerState?.track_window.current_track;
  const isPaused = playerState?.paused;
  const duration = playerState?.duration || 0;
  const progressPercent = duration > 0 ? (currentProgress / duration) * 100 : 0;
  
  if (!activeTrack) {
    return <div className="h-24 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center text-sm text-neutral-400">Select a song to play</div>;
  }

  return (
    <div className="h-24 bg-neutral-900 border-t border-neutral-800 grid grid-cols-3 items-center px-4">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 overflow-hidden">
        <img src={activeTrack.album?.images?.[0]?.url || ''} alt={activeTrack.name} className="h-14 w-14 flex-shrink-0" />
        <div className="truncate">
          <p className="font-semibold text-sm truncate">{activeTrack.name}</p>
          <p className="text-xs text-neutral-400 truncate">{activeTrack.artists?.map((a) => a.name).join(', ')}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-2">
            <button onClick={() => player?.previousTrack()} className="text-neutral-400 hover:text-white"><PreviousIcon /></button>
            <button onClick={() => player?.togglePlay()} className="bg-white text-black rounded-full p-2 hover:scale-105">
                {isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>
            <button onClick={() => player?.nextTrack()} className="text-neutral-400 hover:text-white"><NextIcon /></button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md text-xs text-neutral-400">
            <span>{formatTime(currentProgress)}</span>
            <div className="w-full bg-neutral-600 rounded-full h-1 group">
                <div className="bg-white h-1 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div></div>
    </div>
  );
};

export default Player;

import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon } from './Icons';
import { Track } from '../types';

interface PlayerProps {
  activeTrack: Track | null;
  onNext: () => void;
  onPrevious: () => void;
}

const Player: React.FC<PlayerProps> = ({ activeTrack, onNext, onPrevious }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current && activeTrack?.preview_url) {
        audioRef.current.src = activeTrack.preview_url;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(e => console.error("Playback error:", e));
    } else {
        setIsPlaying(false);
    }
  }, [activeTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !activeTrack?.preview_url) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!activeTrack) {
    return <div className="h-24 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center text-sm text-neutral-400">Select a song to play</div>;
  }
  
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="h-24 bg-neutral-900 border-t border-neutral-800 grid grid-cols-3 items-center px-4">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
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
            <button onClick={onPrevious} className="text-neutral-400 hover:text-white"><PreviousIcon /></button>
            <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105" disabled={!activeTrack.preview_url}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={onNext} className="text-neutral-400 hover:text-white"><NextIcon /></button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md text-xs text-neutral-400">
            <span>{formatTime(progress)}</span>
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

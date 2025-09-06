import React, { useRef, useState } from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { YTMusicTrack } from '../types';
import { PlayIcon, PauseIcon, NextIcon, PreviousIcon } from './Icons';

interface PlayerProps {
  activeTrack: YTMusicTrack | null;
  onNext: () => void;
  onPrevious: () => void;
  onEnded: () => void;
}

const Player: React.FC<PlayerProps> = ({ activeTrack, onNext, onPrevious, onEnded }) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    // YouTube Player API states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === 1) { // Playing
      setIsPlaying(true);
    } else { // Paused, ended, buffering, etc.
      setIsPlaying(false);
    }

    if (event.data === 0) { // Ended
        onEnded();
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };
  
  const opts: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  if (!activeTrack) {
    return <div className="h-24 bg-neutral-800 border-t border-neutral-700 flex items-center justify-center text-sm text-neutral-400">Select a song to play</div>;
  }

  return (
    <div className="h-24 bg-neutral-900 border-t border-neutral-800 grid grid-cols-3 items-center px-4 relative">
      <div style={{ position: 'absolute', top: '-1000px', left: '-1000px' }}>
         {activeTrack && <YouTube key={activeTrack.videoId} videoId={activeTrack.videoId} opts={opts} onReady={onPlayerReady} onStateChange={onPlayerStateChange} onEnd={onEnded} />}
      </div>
     
      {/* Current Track Info */}
      <div className="flex items-center gap-4 overflow-hidden">
        <img src={activeTrack.thumbnails?.[0]?.url || ''} alt={activeTrack.title} className="h-14 w-14 flex-shrink-0" />
        <div className="truncate">
          <p className="font-semibold text-sm truncate">{activeTrack.title}</p>
          <p className="text-xs text-neutral-400 truncate">{activeTrack.artists?.map((a) => a.name).join(', ')}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-2">
            <button onClick={onPrevious} className="text-neutral-400 hover:text-white"><PreviousIcon /></button>
            <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button onClick={onNext} className="text-neutral-400 hover:text-white"><NextIcon /></button>
        </div>
        {/* Progress bar removed for simplicity as it's complex to sync with the iframe player */}
      </div>
      
      <div></div>
    </div>
  );
};

export default Player;
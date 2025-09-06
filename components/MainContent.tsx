import React, { useState, useEffect } from 'react';
import { YTMusicTrack } from '../types';
import { SearchIcon, PlayIcon } from './Icons';

interface MainContentProps {
  activeContent: { type: 'playlist' | 'search' | 'welcome'; data: YTMusicTrack[] };
  onPlay: (track: YTMusicTrack, contextTracks: YTMusicTrack[]) => void;
  onSearch: (query: string) => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to YouTube Music Clone</h1>
        <p className="text-neutral-400">Select a chart from the library to get started, or use the search bar to find music.</p>
    </div>
);

const TrackList: React.FC<{ tracks: YTMusicTrack[], onPlay: (track: YTMusicTrack, contextTracks: YTMusicTrack[]) => void }> = ({ tracks, onPlay }) => {
    
    return (
        <div className="p-4">
            <div className="grid grid-cols-[32px_4fr_2fr_1fr] gap-4 text-neutral-400 border-b border-neutral-800 p-2 mb-4">
                <span className="text-center">#</span>
                <span>Title</span>
                <span>Album</span>
                <span className="justify-self-end pr-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>
            </div>
            {tracks.map((track, index) => (
                <div 
                    key={track.videoId ? `${track.videoId}-${index}` : index}
                    className="grid grid-cols-[32px_4fr_2fr_1fr] items-center gap-4 hover:bg-neutral-800 rounded p-2 group cursor-pointer"
                    onClick={() => track && onPlay(track, tracks)}
                    title={track?.title}
                >
                    <div className="relative flex items-center justify-center text-neutral-400 h-10">
                      <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white">
                        <PlayIcon />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 overflow-hidden">
                        <img src={track.thumbnails?.[0]?.url || ''} alt={track.title || 'Album Art'} className="h-10 w-10 flex-shrink-0" />
                        <div className="truncate">
                            <p className="text-white truncate">{track.title || 'Unknown Title'}</p>
                            <p className="text-sm text-neutral-400 truncate">{track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</p>
                        </div>
                    </div>
                    <span className="text-sm truncate text-neutral-400">{track.album?.name || 'Single'}</span>
                    <span className="text-sm text-neutral-400 justify-self-end pr-2">{track.duration}</span>
                </div>
            ))}
        </div>
    );
};


const MainContent: React.FC<MainContentProps> = ({ activeContent, onPlay, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Don't search for empty strings, but allow clearing the results
      onSearch(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);


  const renderContent = () => {
    switch (activeContent.type) {
      case 'playlist':
      case 'search': {
        const tracks = activeContent.data.filter(Boolean);
        if (tracks.length === 0 && activeContent.type === 'search') {
            return <div className="p-8 text-center text-neutral-400">No results found for "{searchTerm}".</div>
        }
        return <TrackList tracks={tracks} onPlay={onPlay} />;
      }
      case 'welcome':
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="flex-grow bg-neutral-900 rounded-lg overflow-y-auto">
      <div className="sticky top-0 bg-neutral-900/80 backdrop-blur-sm p-4 z-10 flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search for tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-800 rounded-full py-2 pl-10 pr-4 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default MainContent;
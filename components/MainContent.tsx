import React from 'react';
import { Track, PlaylistItem } from '../types';
import { SearchIcon, PlayIcon } from './Icons';

interface MainContentProps {
  activeContent: { type: 'playlist' | 'search' | 'welcome'; data: any };
  onPlay: (track: Track, index: number) => void;
  onSearch: (query: string) => void;
}

const WelcomeScreen: React.FC = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Spotify Clone</h1>
        <p className="text-neutral-400">Select a featured playlist from the library to get started, or use the search bar to find music previews.</p>
    </div>
);

const TrackList: React.FC<{ tracks: Track[], onPlay: (track: Track, index: number) => void }> = ({ tracks, onPlay }) => {
    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
    };

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
                    key={track?.id ? `${track.id}-${index}` : index}
                    className={`grid grid-cols-[32px_4fr_2fr_1fr] items-center gap-4 hover:bg-neutral-800 rounded p-2 group ${track?.preview_url ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                    onClick={() => track?.preview_url && track && onPlay(track, index)}
                    title={!track?.preview_url ? "Preview not available" : track?.name}
                >
                    <div className="relative flex items-center justify-center text-neutral-400 h-10">
                      <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                      {track?.preview_url && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white">
                          <PlayIcon />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 overflow-hidden">
                        <img src={track?.album?.images?.[0]?.url || ''} alt={track?.name || 'Album Art'} className="h-10 w-10 flex-shrink-0" />
                        <div className="truncate">
                            <p className="text-white truncate">{track?.name || 'Unknown Title'}</p>
                            <p className="text-sm text-neutral-400 truncate">{track?.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}</p>
                        </div>
                    </div>
                    <span className="text-sm truncate text-neutral-400">{track?.album?.name || 'Unknown Album'}</span>
                    <span className="text-sm text-neutral-400 justify-self-end pr-2">{formatDuration(track?.duration_ms || 0)}</span>
                </div>
            ))}
        </div>
    );
};


const MainContent: React.FC<MainContentProps> = ({ activeContent, onPlay, onSearch }) => {

  const renderContent = () => {
    switch (activeContent.type) {
      case 'playlist':
        const playlistTracks = activeContent.data.items.map((item: PlaylistItem) => item?.track).filter(Boolean);
        return <TrackList tracks={playlistTracks} onPlay={onPlay} />;
      case 'search':
        const searchTracks = activeContent.data.filter(Boolean);
        return <TrackList tracks={searchTracks} onPlay={onPlay} />;
      case 'welcome':
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="flex-grow bg-neutral-900 rounded-lg overflow-y-auto">
      <div className="sticky top-0 bg-neutral-900 p-4 z-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search for tracks..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-neutral-800 rounded-full py-2 pl-10 pr-4 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default MainContent;
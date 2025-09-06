import React from 'react';
import { YTMusicPlaylist } from '../types';
import { HomeIcon, LibraryIcon } from './Icons';

interface SidebarProps {
  playlists: YTMusicPlaylist[];
  onPlaylistSelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ playlists, onPlaylistSelect }) => {
  return (
    <div className="w-64 bg-black flex-shrink-0 flex flex-col">
        <div className="p-4 bg-neutral-900 rounded-lg mb-2">
            <ul>
                <li className="flex items-center gap-4 text-white font-bold cursor-pointer">
                    <HomeIcon />
                    <span>Home</span>
                </li>
            </ul>
        </div>
      <div className="flex-grow bg-neutral-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-4 text-white font-bold mb-4">
            <LibraryIcon />
            <span>Charts</span>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-2">
            <ul>
            {playlists.map((playlist) => (
                <li
                key={playlist.id}
                className="p-2 rounded-md hover:bg-neutral-800 cursor-pointer text-sm text-neutral-400 hover:text-white transition duration-200"
                onClick={() => onPlaylistSelect(playlist.id)}
                >
                {playlist.title}
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
export interface YTMusicThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YTMusicArtist {
  name: string;
  id: string | null;
}

export interface YTMusicAlbum {
  name: string | null;
  id: string | null;
}

export interface YTMusicTrack {
  videoId: string;
  title: string;
  artists: YTMusicArtist[];
  album: YTMusicAlbum | null;
  duration: string; // e.g., "3:45"
  thumbnails: YTMusicThumbnail[];
  resultType?: 'song' | 'video'; // From search results
}

export interface YTMusicPlaylist {
    id: string;
    title: string;
    itemCount: number;
    thumbnails: YTMusicThumbnail[];
}

// FIX: Added missing Spotify type definitions to resolve import errors.
// --- Spotify Types ---

export interface ImageObject {
  url: string;
  height?: number;
  width?: number;
}

export interface UserProfile {
  id: string;
  display_name: string;
  images: ImageObject[];
  email: string;
  country: string;
}

export interface PagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface Playlist {
  id: string;
  name: string;
  images: ImageObject[];
  description: string;
  uri: string;
  tracks: {
    total: number;
  };
}

export interface Artist {
  name: string;
}

export interface Album {
  name: string;
  images: ImageObject[];
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  uri: string;
  duration_ms: number;
}

export interface PlaylistItem {
  track: Track;
}

export interface SearchResults {
  tracks: PagingObject<Track>;
}

export interface FeaturedPlaylistsResponse {
    message: string;
    playlists: PagingObject<Playlist>;
}
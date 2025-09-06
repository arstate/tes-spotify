export interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string; };
  followers: { href: string; total: number; };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: Image[];
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
  };
  uri: string;
}

export interface PagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface PlaylistItem {
  track: Track;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  uri: string;
  preview_url: string | null;
}

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
}

export interface SearchResults {
  tracks: PagingObject<Track>;
}

export interface FeaturedPlaylistsResponse {
    playlists: PagingObject<Playlist>;
}

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

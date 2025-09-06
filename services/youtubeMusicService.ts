import { YTMusicTrack, YTMusicPlaylist } from '../types';

// --- MOCK DATA ---
// In a real application, this data would come from a backend server
// that uses a library like 'ytmusicapi' for Python or 'youtube-music-api' for Node.js.

const mockTracks: YTMusicTrack[] = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    artists: [{ name: 'Rick Astley', id: 'UC-k9uDb3_wXI8Uk_V-6_2nA' }],
    album: { name: 'Whenever You Need Somebody', id: 'MPREb_9nqnsn5FpUS' },
    duration: '3:32',
    thumbnails: [{ url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/sddefault.jpg', width: 640, height: 480 }],
    resultType: 'song'
  },
  {
    videoId: '3tmd-ClpJxA',
    title: 'Bohemian Rhapsody',
    artists: [{ name: 'Queen', id: 'UCiMhD4jzUqG-IgPzUmmytRQ' }],
    album: { name: 'A Night at the Opera', id: 'MPREb_39S0gS0gS3S' },
    duration: '5:55',
    thumbnails: [{ url: 'https://i.ytimg.com/vi/3tmd-ClpJxA/sddefault.jpg', width: 640, height: 480 }],
    resultType: 'song'
  },
  {
    videoId: 'hT_nvWreIhg',
    title: 'Africa',
    artists: [{ name: 'Toto', id: 'UC-k9uDb3_wXI8Uk_V-6_2nA' }],
    album: { name: 'Toto IV', id: 'MPREb_9nqnsn5FpUS' },
    duration: '4:55',
    thumbnails: [{ url: 'https://i.ytimg.com/vi/hT_nvWreIhg/sddefault.jpg', width: 640, height: 480 }],
    resultType: 'song'
  },
    {
    videoId: 'p-AmH1-yJoY',
    title: 'Laskar Pelangi',
    artists: [{ name: 'Nidji', id: 'UC_A2i21tmw2a1p91_wGuTjw' }],
    // FIX: Corrected a syntax error. A stray ']' was replaced with a '}'.
    album: { name: 'Top Up', id: 'MPREb_...' },
    duration: '3:52',
    thumbnails: [{ url: 'https://i.ytimg.com/vi/p-AmH1-yJoY/sddefault.jpg', width: 640, height: 480 }],
    resultType: 'song'
  },
  {
    videoId: '60ItHLz5WEA',
    title: 'Dan...',
    artists: [{ name: 'Sheila On 7', id: 'UCA6-e0n4v_PAA8wAYu5s3oA' }],
    // FIX: Corrected a syntax error. A stray ']' was replaced with a '}'.
    album: { name: 'Sheila On 7', id: 'MPREb_...' },
    duration: '4:49',
    thumbnails: [{ url: 'https://i.ytimg.com/vi/60ItHLz5WEA/sddefault.jpg', width: 640, height: 480 }],
    resultType: 'song'
  },
];

const mockPlaylists: YTMusicPlaylist[] = [
    {
        id: 'global-top-100',
        title: 'Global Top 100',
        itemCount: 5,
        thumbnails: [{ url: 'https://yt3.googleusercontent.com/9CL2c95t2s_gq_Gk-s6eAbN2TGA2n2e6g-cSo4Y-g_i1uQ-2DwnV-g5m-o-y9A8cT7o-Z9r-w=s576', width: 576, height: 576}]
    }
]

// --- MOCK API SERVICE ---
// This class simulates API calls to a backend.
// Replace the content of these methods with actual `fetch` calls to your real backend server.

class YouTubeMusicService {
  /**
   * IMPORTANT: This is a mock service.
   * In a real application, you would build a backend (e.g., in Node.js or Python)
   * that uses a YouTube Music API library. The frontend would then call your backend.
   * This mock simulates those calls and returns pre-defined data.
   */

  public async search(query: string): Promise<YTMusicTrack[]> {
    console.log(`[Mock API] Searching for: "${query}"`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, the backend would filter results. Here, we just return everything.
    if (!query) return [];
    return mockTracks.filter(track => track.title.toLowerCase().includes(query.toLowerCase()));
  }

  public async getCharts(): Promise<YTMusicPlaylist[]> {
    console.log('[Mock API] Fetching charts');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPlaylists;
  }
  
  public async getPlaylistItems(playlistId: string): Promise<YTMusicTrack[]> {
    console.log(`[Mock API] Fetching items for playlist: ${playlistId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Since this is a mock, we return the same list of tracks for any playlist ID.
    return mockTracks;
  }
}

// Export a singleton instance of the service
export const youtubeMusicService = new YouTubeMusicService();
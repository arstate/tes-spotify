import { PagingObject, Playlist, PlaylistItem, SearchResults, FeaturedPlaylistsResponse, Track } from '../types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Hardcoding credentials for the current development environment.
// Environment variables (`import.meta.env`) are not available without a build tool like Vite.
const clientId = "37906c3ef9ba4b658e29f86ee6309c8e";
const clientSecret = "1c742bc4b72844faaaf2ee1bcd8bb202";

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAppAccessToken(): Promise<string> {
    if (!clientId || !clientSecret) {
        throw new Error("Spotify Client ID or Client Secret is not set.");
    }

    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch access token: ${errorData.error_description}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in * 1000);
    return accessToken;
}


async function fetchWebApi<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
  const token = await getAppAccessToken();
  const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  if (res.status === 204) { // No Content
    return undefined as T;
  }
  return res.json();
}

export async function getFeaturedPlaylists(): Promise<PagingObject<Playlist>> {
  const data = await fetchWebApi<FeaturedPlaylistsResponse>('browse/featured-playlists?limit=50');
  return data.playlists;
}

export async function getPlaylistItems(playlistId: string): Promise<PagingObject<PlaylistItem>> {
    return fetchWebApi<PagingObject<PlaylistItem>>(`playlists/${playlistId}/tracks`);
}

export async function searchTracks(query: string): Promise<SearchResults> {
    return fetchWebApi<SearchResults>(`search?q=${encodeURIComponent(query)}&type=track&limit=20`);
}
import { PagingObject, Playlist, PlaylistItem, SearchResults, FeaturedPlaylistsResponse, Track, UserProfile } from '../types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const clientId = "37906c3ef9ba4b658e29f86ee6309c8e";
// Use the application's origin as the redirect URI
const redirectUri = window.location.origin;

// --- PKCE Helper Functions ---

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// --- Spotify Authentication Functions ---

export async function redirectToAuthCodeFlow() {
  const verifier = generateRandomString(128);
  const challengeBuffer = await sha256(verifier);
  const challenge = base64encode(challengeBuffer);

  localStorage.setItem("code_verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);
  params.append("scope", "user-read-private user-read-email playlist-read-private");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string): Promise<string> {
  const verifier = localStorage.getItem("code_verifier");
  if (!verifier) {
      throw new Error("Code verifier not found!");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });

  if (!result.ok) {
    const errorData = await result.json();
    throw new Error(`Failed to fetch access token: ${errorData.error_description}`);
  }

  const { access_token, expires_in, refresh_token } = await result.json();
  
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("token_expires_at", (Date.now() + expires_in * 1000).toString());
  localStorage.setItem("refresh_token", refresh_token);
  
  return access_token;
}

export function getStoredAccessToken(): string | null {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');
    if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
        return token;
    }
    // TODO: Implement token refresh logic here if refresh_token exists
    return null;
}

export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('code_verifier');
    window.location.reload();
}


// --- API Fetch Functions ---

async function fetchWebApi<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
  const token = getStoredAccessToken();
  if (!token) {
    // If no token, logout to force re-authentication
    logout();
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${SPOTIFY_API_BASE}/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) { // Unauthorized
      logout(); // Token is likely expired or invalid
      throw new Error('Unauthorized access - logging out.');
  }
  if (!res.ok) {
    throw new Error(`API request failed with status ${res.status}`);
  }
  if (res.status === 204) { // No Content
    return undefined as T;
  }
  return res.json();
}

export async function getUserProfile(): Promise<UserProfile> {
    return fetchWebApi<UserProfile>('me');
}

export async function getFeaturedPlaylists(): Promise<PagingObject<Playlist>> {
  const data = await fetchWebApi<FeaturedPlaylistsResponse>('browse/featured-playlists?limit=50');
  return data.playlists;
}

export async function getPlaylistItems(playlistId: string): Promise<PagingObject<PlaylistItem>> {
    return fetchWebApi<PagingObject<PlaylistItem>>(`playlists/${playlistId}/tracks?market=US`);
}

export async function searchTracks(query: string): Promise<SearchResults> {
    return fetchWebApi<SearchResults>(`search?q=${encodeURIComponent(query)}&type=track&limit=20&market=US`);
}
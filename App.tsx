import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { getAccessToken, redirectToAuthCodeFlow, getStoredAccessToken } from './services/spotifyService';

const LoginScreen: React.FC = () => (
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-4">Spotify Clone</h1>
        <p className="text-neutral-400 mb-8">Please log in to start listening.</p>
        <button 
            onClick={redirectToAuthCodeFlow}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition duration-300"
        >
            Log in with Spotify
        </button>
    </div>
);


const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(getStoredAccessToken());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    const handleAuth = async () => {
        if (code) {
            try {
                const accessToken = await getAccessToken(code);
                setToken(accessToken);
                
                // Clean up URL by removing the code parameter
                const url = new URL(window.location.href);
                url.search = '';
                window.history.replaceState({}, document.title, url);

            } catch (error) {
                console.error("Authentication failed:", error);
                // Optionally clear URL and show an error message
                 const url = new URL(window.location.href);
                 url.search = '';
                 window.history.replaceState({}, document.title, url);
            }
        }
    };

    handleAuth();
  }, []);


  return token ? <Dashboard /> : <LoginScreen />;
};

export default App;

import React, { useState, useEffect } from 'react';
import { audioAPI } from '../utils/api';
import './Explore.css';

const Explore = () => {
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicAudios();
  }, []);

  const fetchPublicAudios = async () => {
    try {
      const response = await audioAPI.getPublicAudios();
      setAudios(response.data);
    } catch (error) {
      console.error('Failed to fetch public audios');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (id) => {
    try {
      await audioAPI.trackPlay(id);
      setAudios(audios.map(a => 
        a._id === id ? { ...a, plays: a.plays + 1 } : a
      ));
    } catch (error) {
      console.error('Failed to track play');
    }
  };

  const shareOnWhatsApp = async (id, title) => {
    try {
      const response = await audioAPI.shareOnWhatsApp(id);
      window.open(response.data.whatsappLink, '_blank');
    } catch (error) {
      alert('Share failed');
    }
  };

  return (
    <div className="explore">
      <nav className="navbar-explore">
        <h1>🎵 AudiMeme - Explore</h1>
      </nav>

      <div className="container-explore">
        <h2>Discover Audio</h2>
        {loading ? (
          <p>Loading...</p>
        ) : audios.length === 0 ? (
          <p className="empty-state">No public audios yet</p>
        ) : (
          <div className="audios-grid">
            {audios.map(audio => (
              <div key={audio._id} className="audio-card">
                <div className="audio-header">
                  <h3>{audio.title}</h3>
                  <p className="artist">by @{audio.userId?.username}</p>
                </div>
                <p className="audio-desc">{audio.description}</p>
                <audio 
                  controls 
                  src={audio.audioUrl}
                  onPlay={() => playAudio(audio._id)}
                />
                <div className="audio-stats">
                  <span>👂 {audio.plays} plays</span>
                  <span>📅 {new Date(audio.createdAt).toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={() => shareOnWhatsApp(audio._id, audio.title)}
                  className="btn-whatsapp"
                >
                  📱 Share on WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;

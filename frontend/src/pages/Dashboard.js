import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { audioAPI } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyAudios();
  }, []);

  const fetchMyAudios = async () => {
    try {
      const response = await audioAPI.getMyAudios();
      setRecordings(response.data);
    } catch (error) {
      console.error('Failed to fetch recordings');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Please allow microphone access');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    if (!audioBlob || !title.trim()) {
      alert('Please add a title and record audio');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('title', title);
      formData.append('description', description);

      const response = await audioAPI.uploadAudio(formData);
      setRecordings([response.data.audio, ...recordings]);
      setAudioBlob(null);
      setTitle('');
      setDescription('');
      alert('Audio uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteRecording = async (id) => {
    if (!window.confirm('Delete this recording?')) return;
    
    try {
      await audioAPI.deleteAudio(id);
      setRecordings(recordings.filter(r => r._id !== id));
    } catch (error) {
      alert('Delete failed');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>🎵 AudiMeme</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="container">
        <div className="recording-section">
          <h2>Record Audio</h2>
          <div className="recorder-controls">
            {!isRecording ? (
              <button onClick={startRecording} className="btn-primary">
                🎙️ Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="btn-danger">
                ⏹️ Stop Recording
              </button>
            )}
          </div>

          {audioBlob && (
            <div className="audio-preview">
              <audio controls src={URL.createObjectURL(audioBlob)} />
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button 
                onClick={uploadRecording} 
                disabled={loading}
                className="btn-success"
              >
                {loading ? 'Uploading...' : '⬆️ Upload'}
              </button>
            </div>
          )}
        </div>

        <div className="recordings-section">
          <h2>Your Recordings</h2>
          {recordings.length === 0 ? (
            <p className="empty-state">No recordings yet. Start recording!</p>
          ) : (
            <div className="recordings-grid">
              {recordings.map(recording => (
                <div key={recording._id} className="recording-card">
                  <h3>{recording.title}</h3>
                  <p>{recording.description}</p>
                  <audio controls src={recording.audioUrl} />
                  <div className="card-stats">
                    <span>👂 {recording.plays}</span>
                    <span>📅 {new Date(recording.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => shareOnWhatsApp(recording._id, recording.title)}
                      className="btn-share"
                    >
                      📱 Share WhatsApp
                    </button>
                    <button 
                      onClick={() => deleteRecording(recording._id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

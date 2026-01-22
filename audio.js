const express = require('express');
const multer = require('multer');
const Audio = require('../models/Audio');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('File must be audio'));
    }
  }
});

// Upload audio (using base64 for simplicity, can integrate S3)
router.post('/upload', auth, upload.single('audio'), async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No audio file provided' });
    }

    // Convert to base64 for storage (or upload to S3)
    const audioBase64 = req.file.buffer.toString('base64');
    const audioUrl = `data:${req.file.mimetype};base64,${audioBase64}`;

    const audio = new Audio({
      userId: req.userId,
      title: title || 'Untitled Audio',
      description,
      audioUrl,
      fileSize: req.file.size,
      isPublic: isPublic !== 'false'
    });

    await audio.save();

    res.status(201).json({
      message: 'Audio uploaded successfully',
      audio: audio
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get user's audio files
router.get('/my-audios', auth, async (req, res) => {
  try {
    const audios = await Audio.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(audios);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all public audio files
router.get('/public', async (req, res) => {
  try {
    const audios = await Audio.find({ isPublic: true })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(audios);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get audio by ID
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id).populate('userId', 'username profilePicture');
    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    res.json(audio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete audio
router.delete('/:id', auth, async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    
    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }

    if (audio.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Audio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Audio deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate WhatsApp share link
router.post('/:id/share', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }

    const shareUrl = `${process.env.FRONTEND_URL}/audio/${req.params.id}`;
    const message = `Check out this audio: ${audio.title}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`${message} ${shareUrl}`)}`;

    audio.whatsappLink = whatsappLink;
    await audio.save();

    res.json({ whatsappLink });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track plays
router.post('/:id/play', async (req, res) => {
  try {
    const audio = await Audio.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    res.json(audio);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

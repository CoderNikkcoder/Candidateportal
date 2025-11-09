import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});


let gfs;
mongoose.connect('mongodb://localhost:27017/candidateportal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(' MongoDB Connected Successfully!');
  const db = mongoose.connection.db;
  gfs = new GridFSBucket(db, { bucketName: 'videos' });
  console.log('GridFSBucket initialized');
})
.catch(err => console.log('MongoDB Connection Error:', err));

const candidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  positionApplied: String,
  currentPosition: String,
  experience: Number,
  resume: Buffer,
  videoId: mongoose.Schema.Types.ObjectId
});

const Candidate = mongoose.model('Candidate', candidateSchema);

app.post('/api/candidates', upload.fields([
  { name: 'resume', maxCount: 1 }, 
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received submission...');
    
    if (!req.files?.resume || !req.files?.video) {
      return res.status(400).json({ error: 'Resume and video are required' });
    }

    const resumeFile = req.files.resume[0];
    const videoFile = req.files.video[0];

    if (resumeFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Resume must be PDF' });
    }
    if (resumeFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Resume must be < 5MB' });
    }

    
    console.log('📹 Uploading video to GridFS...');
    const videoId = new mongoose.Types.ObjectId();
    const uploadStream = gfs.openUploadStreamWithId(
      videoId,
      `video-${req.body.firstName}-${req.body.lastName}-${Date.now()}.webm`,
      { contentType: 'video/webm' }
    );

    uploadStream.write(videoFile.buffer);
    uploadStream.end();

    // Wait for upload to finish
    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    console.log('Video uploaded with ID:', videoId);

    const candidateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      positionApplied: req.body.positionApplied,
      currentPosition: req.body.currentPosition,
      experience: req.body.experience,
      resume: resumeFile.buffer,
      videoId: videoId
    };

    const candidate = new Candidate(candidateData);
    await candidate.save();

    console.log('Candidate saved:', candidateData.firstName);
    
    res.json({ 
      success: true, 
      candidateId: candidate._id,
      videoId: videoId
    });

  } catch (error) {
    console.log('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/video/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await mongoose.connection.db.collection('videos.files').find({ _id: fileId }).toArray();
    
    if (files.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.set('Content-Type', 'video/webm');
    const downloadStream = gfs.openDownloadStream(fileId);
    downloadStream.pipe(res);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-video/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ exists: false });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await mongoose.connection.db.collection('videos.files').find({ _id: fileId }).toArray();
    
    res.json({ 
      exists: files.length > 0,
      file: files[0] || null
    });
  } catch (error) {
    res.json({ exists: false, error: error.message });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const files = await mongoose.connection.db.collection('videos.files').find({}).toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log(' Server running on port 5000');
  console.log('Test video list: http://localhost:5000/api/videos');
});

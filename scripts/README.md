# ElevenLabs Clone - Flask API Backend

This directory contains the Flask API backend for the ElevenLabs clone application.

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. MongoDB Setup

Make sure you have MongoDB installed and running. You can:

- **Local MongoDB**: Install MongoDB locally and run `mongod`
- **MongoDB Atlas**: Use MongoDB Atlas cloud service
- **Docker**: Run MongoDB in a Docker container

\`\`\`bash
# Using Docker (optional)
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

### 3. Environment Variables (Optional)

Create a `.env` file or set environment variables:

\`\`\`bash
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=elevenlabs_clone
PORT=5000
FLASK_DEBUG=True
\`\`\`

### 4. Initialize Database

Run the database setup script to create sample data:

\`\`\`bash
python setup_database.py
\`\`\`

### 5. Start the Flask API

\`\`\`bash
python flask_api.py
\`\`\`

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API and database status

### Audio Management
- **GET** `/api/audio/<language>` - Get audio URL for specific language (english/arabic)
- **GET** `/api/audio` - List all available audio files
- **POST** `/api/audio` - Upload new audio file data

### Example Usage

\`\`\`bash
# Health check
curl http://localhost:5000/api/health

# Get English audio
curl http://localhost:5000/api/audio/english

# Get Arabic audio  
curl http://localhost:5000/api/audio/arabic

# Upload new audio data
curl -X POST http://localhost:5000/api/audio \
  -H "Content-Type: application/json" \
  -d '{"language": "english", "audio_url": "https://example.com/audio.mp3", "text": "Sample text"}'
\`\`\`

## Audio File Hosting

The API expects audio URLs to be publicly accessible. You can host your audio files on:

- **Cloud Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage
- **CDN**: Cloudflare, AWS CloudFront
- **File Hosting**: Dropbox, Google Drive (with public links)
- **Local Server**: Serve files from Flask static directory

## Integration with Next.js

The Next.js frontend will make requests to this Flask API. Make sure:

1. Flask API is running on `http://localhost:5000`
2. CORS is enabled (already configured)
3. Audio URLs are publicly accessible
4. MongoDB is connected and contains sample data

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongod --version`
- Check connection string in environment variables
- Test connection: `python setup_database.py`

### CORS Issues
- CORS is enabled for all origins in development
- For production, configure specific origins in Flask-CORS

### Audio Playback Issues
- Ensure audio URLs are publicly accessible
- Check browser console for network errors
- Verify audio file formats are supported (MP3, WAV, OGG)

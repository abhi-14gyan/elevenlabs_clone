# ElevenLabs Clone - Text to Speech Application

A modern text-to-speech application built with Next.js and Flask, supporting both English and Arabic languages with stage directions.

## 🌟 Features

- **Multi-language Support**: English and Arabic text-to-speech
- **Stage Directions**: Support for narrative stage directions like [sarcastically], [whispers], etc.
- **Modern UI**: Clean and responsive interface built with Next.js and Tailwind CSS
- **Audio Playback**: Real-time audio playback with controls
- **Download Functionality**: Download generated audio files
- **Database Integration**: MongoDB for storing text and audio metadata

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://elevenlabs-clone-kappa.vercel.app/)
- **Backend API**: [Deployed on Railway](https://web-production-e2459.up.railway.app/)


## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.16
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Icons**: Lucide React
- **Deployment**: Vercel

### Backend
- **Framework**: Flask 2.3.3
- **Database**: MongoDB
- **CORS**: Flask-CORS
- **Deployment**: Railway/Heroku

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── audio/         # Audio endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── admin-panel.tsx   # Admin interface
│   ├── header.tsx        # App header
│   ├── hero-section.tsx  # Hero section
│   └── text-to-speech-section.tsx # Main TTS interface
├── scripts/              # Backend scripts
│   ├── flask_api.py      # Flask API server
│   ├── README.md         # API documentation
│   └── requirements.txt  # Python dependencies
├── public/               # Static assets
│   ├── ElevenLabs_Text_to_Speech_audio_english.mp3
│   └── ElevenLabs_Text_to_Speech_audio_arabic.mp3
└── lib/                  # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.11+
- MongoDB (local or cloud)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elevenlabs-clone.git
   cd elevenlabs-clone
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configurations:
   ```env
   FLASK_API_URL=http://localhost:5000
   MONGO_URI=mongodb://localhost:27017/
   DATABASE_NAME=elevenlabs_clone
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the Flask API**
   ```bash
   cd scripts
   python flask_api.py
   ```

7. **Start the Next.js development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🌐 Deployment

### Deploy Backend (Flask API)

1. **Railway Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Heroku Deployment**
   ```bash
   # Install Heroku CLI and deploy
   heroku create your-flask-api
   git push heroku main
   ```

### Deploy Frontend (Next.js)

1. **Vercel Deployment**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables on Vercel**
   - `FLASK_API_URL`: Your deployed Flask API URL
   - `NEXT_PUBLIC_API_URL`: Your Vercel app URL

## 📡 API Endpoints

### Flask API

- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/audio/{language}` - Get audio data for language (english/arabic)
- `POST /api/audio` - Upload new audio data
- `GET /api/audio` - List all audio files

### Next.js API

- `GET /api/audio/{language}` - Proxy to Flask API with fallback

## 🗃️ Database Setup

### Local Development
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Compass GUI
```

### Production Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster (512MB free tier)

2. **Configure Database Access**
   - Create database user with read/write permissions
   - Add your IP to Network Access (or 0.0.0.0/0 for all IPs)

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/elevenlabs_clone?retryWrites=true&w=majority
   ```

4. **Migrate Local Data to Production**
   ```bash
   # Set production MongoDB URI
   set PROD_MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/elevenlabs_clone
   
   # Run migration script
   cd scripts
   python migrate_to_production.py
   ```

## 🗃️ Database Schema

### Audio Files Collection

```javascript
{
  _id: ObjectId,
  language: "english" | "arabic",
  audio_url: "/path/to/audio.mp3",
  text: "Text content with [stage directions]",
  created_at: ISODate,
  updated_at: ISODate
}
```

## 🎯 Text Format

The application supports rich text with stage directions:

**English Example:**
```
In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all down" kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.
```

**Arabic Example:**
```
في أرض إلدوريا القديمة، حيث تتلألأ السماء والغابات، همست الأسرار للريح، عاش تنين يُدعى زيفيروس. [بسخرية] ليس من النوع الذي "يحرق كل شيء"... [يضحك] بل كان لطيفاً وحكيماً، بعيون مثل النجوم القديمة. [يهمس] حتى الطيور صمتت عندما مر.
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_API_URL` | Flask API endpoint | `http://localhost:5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/` |
| `DATABASE_NAME` | MongoDB database name | `elevenlabs_clone` |
| `FLASK_DEBUG` | Flask debug mode | `False` |
| `PORT` | Flask server port | `5000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by ElevenLabs TTS platform
- Built with modern web technologies
- Supports multiple languages and rich text formatting

## 📞 Support

For support, email abhi.14gyan@gmail.com or create an issue on GitHub.

# 🚀 Deployment Instructions

## Prerequisites ✅

- [x] MongoDB Atlas cluster configured and running
- [x] Git repository initialized with all files committed
- [x] Production configuration files created
- [x] Environment variables documented

## 📦 Deployment Steps

### Step 1: Deploy Flask API (Backend)

#### Option A: Railway (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize**
   ```bash
   railway login
   cd "c:\Web Development\Assignment"
   railway init
   ```

3. **Configure Environment Variables**
   ```bash
   railway vars set MONGO_URI="mongodb+srv://Finlock:Abhi1834@finlock.5hmnklf.mongodb.net/?retryWrites=true&w=majority"
   railway vars set DATABASE_NAME="elevenlabs_clone"
   railway vars set FLASK_ENV="production"
   railway vars set PORT="8000"
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get your API URL** (something like `https://your-project.railway.app`)

#### Option B: Heroku

1. **Install Heroku CLI and login**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create your-elevenlabs-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGO_URI="mongodb+srv://Finlock:Abhi1834@finlock.5hmnklf.mongodb.net/?retryWrites=true&w=majority"
   heroku config:set DATABASE_NAME="elevenlabs_clone"
   heroku config:set FLASK_ENV="production"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Step 2: Deploy Next.js Frontend (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard**
   - Go to your Vercel project dashboard
   - Add environment variables:
     - `FLASK_API_URL`: Your Railway/Heroku API URL (e.g., `https://your-project.railway.app`)
     - `NEXT_PUBLIC_API_URL`: Your Vercel app URL

### Step 3: Update CORS Configuration

After getting your Vercel domain:

1. **Update Flask API CORS settings**
   - Replace `"https://your-elevenlabs-clone.vercel.app"` in `scripts/flask_api.py`
   - With your actual Vercel domain

2. **Redeploy Flask API**
   ```bash
   # If using Railway
   railway up
   
   # If using Heroku
   git push heroku main
   ```

## 🔧 Environment Variables Summary

### Flask API (Railway/Heroku):
```env
MONGO_URI=mongodb+srv://Finlock:Abhi1834@finlock.5hmnklf.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=elevenlabs_clone
FLASK_ENV=production
PORT=8000
```

### Next.js (Vercel):
```env
FLASK_API_URL=https://your-flask-api.railway.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

## 🧪 Testing After Deployment

1. **Test Flask API Health**
   ```bash
   curl https://your-flask-api.railway.app/api/health
   ```

2. **Test Audio Endpoints**
   ```bash
   curl https://your-flask-api.railway.app/api/audio/english
   curl https://your-flask-api.railway.app/api/audio/arabic
   ```

3. **Test Next.js Frontend**
   - Visit your Vercel app URL
   - Test language switching
   - Test audio playback

## 📋 Deployment Checklist

- [ ] Flask API deployed to Railway/Heroku
- [ ] Environment variables configured on hosting platform
- [ ] Next.js app deployed to Vercel
- [ ] CORS settings updated with actual domain
- [ ] MongoDB Atlas connection working
- [ ] Audio endpoints returning correct data
- [ ] Frontend language switching functional
- [ ] Audio files playing correctly

## 🔗 Quick Deploy Commands

```bash
# Deploy Flask API to Railway
railway login
railway init
railway vars set MONGO_URI="your-mongo-uri"
railway vars set DATABASE_NAME="elevenlabs_clone"
railway vars set FLASK_ENV="production"
railway up

# Deploy Next.js to Vercel
vercel --prod
```

## 📞 Support

If you encounter any issues:

1. Check environment variables are set correctly
2. Verify MongoDB Atlas connection
3. Ensure CORS settings match your domain
4. Check deployment logs for errors

Your project is ready for production! 🎉
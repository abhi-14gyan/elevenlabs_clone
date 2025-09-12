from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from datetime import datetime, timezone

app = Flask(__name__)

# Configure CORS for production
if os.getenv('FLASK_ENV') == 'production':
    # In production, allow your Vercel domain
    allowed_origins = [
        "https://*.vercel.app",
        os.getenv('VERCEL_URL', 'https://*.vercel.app')  # Will be set from environment
    ]
    CORS(app, origins=allowed_origins, supports_credentials=True)
else:
    # In development, allow all origins
    CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'elevenlabs_clone')

try:
    # Add connection timeout and server selection timeout for production
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,  # 5 second timeout
        connectTimeoutMS=10000,         # 10 second connection timeout
        socketTimeoutMS=20000           # 20 second socket timeout
    )
    
    # Test the connection
    client.admin.command('ping')
    
    db = client[DATABASE_NAME]
    audio_collection = db.audio_files
    print(f"Connected to MongoDB: {DATABASE_NAME}")
    print(f"MongoDB URI: {MONGO_URI[:20]}...")  # Log partial URI for debugging
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    db = None

@app.route('/')
def home():
    return jsonify({
        "message": "ElevenLabs Clone API",
        "version": "1.0.0",
        "endpoints": {
            "/api/audio/<language>": "GET - Fetch audio URL for specified language",
            "/api/audio": "POST - Upload new audio file data",
            "/api/health": "GET - Health check"
        }
    })

@app.route('/api/health')
def health_check():
    mongo_status = "connected" if db is not None else "disconnected"
    return jsonify({
        "status": "healthy",
        "mongodb": mongo_status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/audio/<language>', methods=['GET'])
def get_audio(language):
    """
    Fetch audio URL for the specified language
    """
    try:
        # Validate language parameter
        if language not in ['english', 'arabic']:
            return jsonify({
                "error": "Invalid language. Supported languages: english, arabic"
            }), 400

        # Try to fetch from MongoDB first
        if db is not None:
            audio_doc = audio_collection.find_one({"language": language})
            if audio_doc:
                return jsonify({
                    "language": language,
                    "audioUrl": audio_doc["audio_url"],
                    "text": audio_doc.get("text", ""),
                    "source": "database"
                })

        # No audio found in database
        return jsonify({
            "error": f"No audio found for language: {language}"
        }), 404

    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/api/audio', methods=['POST'])
def upload_audio():
    """
    Upload new audio file data to MongoDB
    """
    try:
        if db is None:
            return jsonify({
                "error": "Database connection not available"
            }), 503

        data = request.get_json()
        
        # Validate required fields
        required_fields = ['language', 'audio_url']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing required field: {field}"
                }), 400

        # Validate language
        if data['language'] not in ['english', 'arabic']:
            return jsonify({
                "error": "Invalid language. Supported languages: english, arabic"
            }), 400

        # Prepare document
        audio_doc = {
            "language": data['language'],
            "audio_url": data['audio_url'],
            "text": data.get('text', ''),
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        # Update or insert document
        result = audio_collection.update_one(
            {"language": data['language']},
            {"$set": audio_doc},
            upsert=True
        )

        return jsonify({
            "message": f"Audio data for {data['language']} uploaded successfully",
            "language": data['language'],
            "audio_url": data['audio_url'],
            "upserted": result.upserted_id is not None
        }), 201

    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

@app.route('/api/audio', methods=['GET'])
def list_audio():
    """
    List all available audio files
    """
    try:
        if db is not None:
            # Fetch from MongoDB
            audio_docs = list(audio_collection.find({}, {"_id": 0}))
            if audio_docs:
                return jsonify({
                    "audio_files": audio_docs,
                    "count": len(audio_docs),
                    "source": "database"
                })

        # No data found
        return jsonify({
            "audio_files": [],
            "count": 0,
            "source": "database"
        })

    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Database should already contain the correct audio data
    if db is not None:
        try:
            existing_count = audio_collection.count_documents({})
            print(f"Database contains {existing_count} audio records")
        except Exception as e:
            print(f"Failed to check database: {e}")

    # Run the Flask app
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"Starting Flask API on port {port}")
    print(f"Debug mode: {debug}")
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    
    app.run(host='0.0.0.0', port=port, debug=debug, threaded=True)

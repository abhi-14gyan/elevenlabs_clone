#!/usr/bin/env python3
"""
Setup MongoDB Atlas with audio data
"""

import os
import sys
sys.path.append('..')

import dotenv
dotenv.load_dotenv('../.env.local')

from pymongo import MongoClient
from datetime import datetime, timezone

def setup_atlas_data():
    """Setup MongoDB Atlas with correct audio data"""
    
    mongo_uri = os.getenv('MONGO_URI')
    if not mongo_uri:
        print("❌ Error: MONGO_URI not found in .env.local")
        return False
    
    try:
        # Connect to MongoDB Atlas
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas")
        
        db = client[os.getenv('DATABASE_NAME', 'elevenlabs_clone')]
        audio_collection = db.audio_files
        
        # English text data
        english_text = """In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the "burn it all down" kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed."""
        
        # Arabic text data  
        arabic_text = """في أرض إلدوريا القديمة، حيث تتلألأ السماء والغابات، همست الأسرار للريح، عاش تنين يُدعى زيفيروس. [بسخرية] ليس من النوع الذي "يحرق كل شيء"... [يضحك] بل كان لطيفاً وحكيماً، بعيون مثل النجوم القديمة. [يهمس] حتى الطيور صمتت عندما مر."""
        
        # Insert English record
        english_record = {
            'language': 'english',
            'audio_url': '/ElevenLabs_Text_to_Speech_audio_english.mp3',
            'text': english_text,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        # Insert Arabic record
        arabic_record = {
            'language': 'arabic', 
            'audio_url': '/ElevenLabs_Text_to_Speech_audio_arabic.mp3',
            'text': arabic_text,
            'created_at': datetime.now(timezone.utc),
            'updated_at': datetime.now(timezone.utc)
        }
        
        # Upsert records
        english_result = audio_collection.update_one(
            {'language': 'english'},
            {'$set': english_record},
            upsert=True
        )
        
        arabic_result = audio_collection.update_one(
            {'language': 'arabic'},
            {'$set': arabic_record}, 
            upsert=True
        )
        
        print('✅ Successfully added English record:', 'inserted' if english_result.upserted_id else 'updated')
        print('✅ Successfully added Arabic record:', 'inserted' if arabic_result.upserted_id else 'updated')
        
        # Verify data
        count = audio_collection.count_documents({})
        print(f'📊 Total records in audio_files collection: {count}')
        
        # Show records
        records = list(audio_collection.find({}, {'_id': 0, 'language': 1, 'text': 1}))
        for record in records:
            text = record.get('text', 'No text')
            text_preview = text[:50] + '...' if len(text) > 50 else text
            print(f'   - {record["language"]}: {text_preview}')
        
        print("\n🎉 MongoDB Atlas setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

if __name__ == "__main__":
    setup_atlas_data()
#!/usr/bin/env python3
"""
Production database migration script
Migrates data from local MongoDB to production MongoDB (Atlas)
"""

import os
import sys
from pymongo import MongoClient
from datetime import datetime, timezone

def migrate_database():
    """Migrate data from local to production MongoDB"""
    
    # Source (local) MongoDB
    LOCAL_URI = "mongodb://localhost:27017/"
    LOCAL_DB = "elevenlabs_clone"
    
    # Destination (production) MongoDB
    PROD_URI = os.getenv('PROD_MONGO_URI')
    PROD_DB = os.getenv('DATABASE_NAME', 'elevenlabs_clone')
    
    if not PROD_URI:
        print("❌ Error: PROD_MONGO_URI environment variable not set")
        print("Set it to your MongoDB Atlas connection string")
        return False
    
    try:
        # Connect to local MongoDB
        print("🔗 Connecting to local MongoDB...")
        local_client = MongoClient(LOCAL_URI, serverSelectionTimeoutMS=5000)
        local_db = local_client[LOCAL_DB]
        local_collection = local_db.audio_files
        
        # Test local connection
        local_client.admin.command('ping')
        print("✅ Connected to local MongoDB")
        
        # Connect to production MongoDB
        print("🔗 Connecting to production MongoDB...")
        prod_client = MongoClient(PROD_URI, serverSelectionTimeoutMS=5000)
        prod_db = prod_client[PROD_DB]
        prod_collection = prod_db.audio_files
        
        # Test production connection
        prod_client.admin.command('ping')
        print("✅ Connected to production MongoDB")
        
        # Get data from local database
        local_data = list(local_collection.find({}))
        print(f"📊 Found {len(local_data)} records in local database")
        
        if not local_data:
            print("⚠️  No data found in local database")
            return True
        
        # Migrate data to production
        for record in local_data:
            # Remove _id to avoid conflicts
            if '_id' in record:
                del record['_id']
            
            # Update timestamps
            record['migrated_at'] = datetime.now(timezone.utc)
            
            # Upsert to production database
            result = prod_collection.update_one(
                {"language": record["language"]},
                {"$set": record},
                upsert=True
            )
            
            action = "inserted" if result.upserted_id else "updated"
            print(f"✅ {action.capitalize()} {record['language']} record")
        
        print(f"🎉 Migration completed successfully!")
        print(f"📊 Migrated {len(local_data)} records to production database")
        
        # Verify migration
        prod_count = prod_collection.count_documents({})
        print(f"🔍 Production database now contains {prod_count} records")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    finally:
        # Close connections
        try:
            local_client.close()
            prod_client.close()
        except:
            pass

def verify_production_data():
    """Verify data exists in production database"""
    
    PROD_URI = os.getenv('PROD_MONGO_URI')
    PROD_DB = os.getenv('DATABASE_NAME', 'elevenlabs_clone')
    
    if not PROD_URI:
        print("❌ Error: PROD_MONGO_URI environment variable not set")
        return False
    
    try:
        print("🔍 Verifying production database...")
        client = MongoClient(PROD_URI, serverSelectionTimeoutMS=5000)
        db = client[PROD_DB]
        collection = db.audio_files
        
        # Test connection
        client.admin.command('ping')
        
        # Check data
        records = list(collection.find({}, {"_id": 0}))
        print(f"📊 Production database contains {len(records)} records:")
        
        for record in records:
            print(f"  - {record['language']}: {record.get('text', 'No text')[:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 MongoDB Production Migration Tool")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == "verify":
        verify_production_data()
    else:
        print("This will migrate your local MongoDB data to production.")
        print("Make sure you have set PROD_MONGO_URI environment variable.")
        print()
        
        response = input("Continue with migration? (y/N): ")
        if response.lower() == 'y':
            migrate_database()
        else:
            print("Migration cancelled.")
#!/bin/bash

echo "🔧 Starting Fix-It Hub..."
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB status..."
if ! systemctl is-active --quiet mongod; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
    
    # Wait a moment for MongoDB to start
    sleep 2
    
    if systemctl is-active --quiet mongod; then
        echo "✅ MongoDB started successfully!"
    else
        echo "❌ Failed to start MongoDB. Please start it manually."
        exit 1
    fi
else
    echo "✅ MongoDB is already running!"
fi

echo ""
echo "🚀 Starting the application..."
echo "   - Backend: http://localhost:5000"
echo "   - Frontend: http://localhost:5173"
echo ""

# Start the application
npm start

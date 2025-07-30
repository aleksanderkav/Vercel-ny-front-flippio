#!/bin/bash

# Railway start script for Trading Card Tracker v8.0.0
echo "🚀 Starting Trading Card Tracker v8.0.0 on Railway..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found, building..."
    npm run build
fi

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed, exiting..."
    exit 1
fi

echo "✅ Build successful, starting server on port $PORT"
npm run preview 
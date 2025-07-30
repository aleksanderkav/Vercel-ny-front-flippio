#!/bin/bash

# Flippio Card Scraper Deployment Script
# Version 1.2.7

echo "🎯 Flippio Card Scraper Deployment"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Make test script executable
echo "🔧 Making test script executable..."
chmod +x test_scraper.js

# Check if Supabase environment variables are set
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Warning: Supabase environment variables not set"
    echo "   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured"
else
    echo "✅ Supabase environment variables found"
fi

# Test the scraper
echo "🧪 Testing scraper functionality..."
node test_scraper.js "Charizard PSA 10 Base Set"

if [ $? -eq 0 ]; then
    echo "✅ Scraper test completed successfully!"
else
    echo "❌ Scraper test failed. Please check the logs above."
    exit 1
fi

echo ""
echo "🚀 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run the SQL script in Supabase: update_schema_for_scraping.sql"
echo "2. Test with the web interface: scraper_test.html"
echo "3. Deploy to Railway: railway up"
echo "4. Use API endpoints for manual triggering"
echo ""
echo "📚 For more information, see: SCRAPER_README.md" 
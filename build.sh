#!/bin/bash

# Force rebuild script to avoid 0 B CSS bundles
echo "🚀 Starting forced rebuild for v5.2.0..."

# Clean previous build
rm -rf dist
rm -rf node_modules/.vite

# Install dependencies
npm install

# Build with explicit Tailwind processing
npm run build

# Verify CSS bundle exists and has content
if [ -f "dist/assets/*.css" ]; then
    CSS_SIZE=$(stat -f%z dist/assets/*.css 2>/dev/null || echo "0")
    echo "✅ CSS bundle size: ${CSS_SIZE} bytes"
    
    if [ "$CSS_SIZE" -gt 1000 ]; then
        echo "✅ Build successful - CSS bundle has proper size"
        exit 0
    else
        echo "❌ CSS bundle too small - forcing rebuild"
        exit 1
    fi
else
    echo "❌ No CSS bundle found - forcing rebuild"
    exit 1
fi 
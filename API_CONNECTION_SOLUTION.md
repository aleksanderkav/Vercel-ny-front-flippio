# 🔧 API Connection Issue - Solution Guide

## 🚨 Problem Identified

The **Pledgen WordPress plugin** is experiencing a **401 Unauthorized** error because the API endpoints are not properly configured on Vercel. Here's what's happening:

### Current Issue:
- **API URL**: `https://vercel-ny-front-flippio.vercel.app/api/public/cards`
- **Response**: Returns HTML page instead of JSON data
- **Status**: HTTP 200 (but wrong content type)
- **Root Cause**: Vercel deployment is serving static files instead of API routes

## 🔍 Technical Analysis

### What's Working:
✅ API files exist in your project (`src/api/public/`)  
✅ API code is properly written using Vercel Edge Runtime  
✅ WordPress plugin is correctly configured  

### What's Broken:
❌ Vercel deployment is not handling API routes as serverless functions  
❌ All `/api/*` requests return the main HTML page  
❌ API endpoints are not accessible from external sources  

## 🛠️ Solution Steps

### Step 1: Fix Vercel Configuration

The `vercel.json` file needs to be updated to properly handle API routes. I've already updated it:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "src/api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/api/$1"
    },
    {
      "src": "/ads.txt",
      "dest": "/ads.txt"
    },
    {
      "src": "/robots.txt",
      "dest": "/robots.txt"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Step 2: Redeploy to Vercel

1. **Commit the updated `vercel.json`**:
   ```bash
   git add vercel.json
   git commit -m "Fix API routes configuration for Vercel"
   git push
   ```

2. **Trigger a new Vercel deployment**:
   - Go to your Vercel dashboard
   - Find the `vercel-ny-front-flippio` project
   - Click "Redeploy" or push to trigger automatic deployment

### Step 3: Verify API Endpoints

After redeployment, test the API endpoints:

```bash
# Test cards endpoint
curl -H "Accept: application/json" "https://vercel-ny-front-flippio.vercel.app/api/public/cards"

# Test stats endpoint
curl -H "Accept: application/json" "https://vercel-ny-front-flippio.vercel.app/api/public/stats"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

## 🔧 WordPress Plugin Updates

I've already updated the **Pledgen plugin** with:

### ✅ Fixed API URL
- Updated from: `https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public`
- Updated to: `https://vercel-ny-front-flippio.vercel.app/api/public`

### ✅ Enhanced Error Handling
- Detects when API returns HTML instead of JSON
- Provides specific error messages for different failure types
- Logs detailed error information for debugging

### ✅ Better Admin Interface
- Shows detailed API status in admin panel
- Explains the root cause of connection issues
- Provides guidance on fixing the problem

## 🚀 Alternative Solutions

### Option 1: Use Vercel Edge Runtime (Recommended)

If the above doesn't work, ensure your API files use the Edge Runtime:

```javascript
// Add this to the top of each API file
export const runtime = 'edge';
```

### Option 2: Separate API Deployment

Create a separate Vercel project just for the API:

1. Create new Vercel project with only the `src/api` folder
2. Deploy API separately at `https://your-api.vercel.app`
3. Update plugin to use the new API URL

### Option 3: Use Netlify Functions

If Vercel continues to have issues:

1. Move API files to `netlify/functions/`
2. Deploy to Netlify
3. Update plugin API URL

## 📋 Testing Checklist

After implementing the fix:

- [ ] API endpoints return JSON (not HTML)
- [ ] WordPress plugin can fetch card data
- [ ] Admin dashboard shows "Connected successfully"
- [ ] Shortcodes work on frontend
- [ ] No 401 or 404 errors in browser console

## 🔍 Debugging Commands

### Test API Directly:
```bash
curl -v "https://vercel-ny-front-flippio.vercel.app/api/public/cards"
```

### Check Response Headers:
```bash
curl -I "https://vercel-ny-front-flippio.vercel.app/api/public/cards"
```

### Test with WordPress Plugin:
1. Install updated plugin from GitHub
2. Go to WordPress Admin → Pledgen
3. Check API status section
4. Try shortcode: `[pledgen_cards limit="5"]`

## 📞 Support

If the issue persists after implementing these fixes:

1. **Check Vercel logs** in your dashboard
2. **Verify API files** are in the correct location
3. **Test locally** with `vercel dev` command
4. **Contact Vercel support** if deployment issues continue

## 🎯 Expected Outcome

After implementing these fixes:

✅ API endpoints return proper JSON responses  
✅ WordPress plugin connects successfully  
✅ Cards display correctly on frontend  
✅ Admin dashboard shows accurate statistics  
✅ No more 401 or HTML response errors  

---

**Updated Plugin Available:** https://github.com/aleksanderkav/flippio-plugin

The plugin now includes better error handling and will provide clear feedback about API connection issues. 
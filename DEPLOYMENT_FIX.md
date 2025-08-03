# 🚨 Vercel API Deployment Fix

## **Problem: API Routes Returning HTML Instead of JSON**

The API endpoints are returning HTML (the frontend app) instead of JSON responses. This means Vercel is treating the entire project as a static site.

## **Root Cause**
Vercel is not recognizing the `/api/` directory as serverless functions. This happens when:
1. Project is configured as "Static Site" instead of "Full Stack"
2. `vercel.json` configuration isn't being applied
3. API files aren't in the correct format

## **Solution Steps**

### **Step 1: Force Vercel Redeploy**
```bash
# In your Vercel dashboard or CLI:
vercel --prod
```

### **Step 2: Check Vercel Project Settings**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `vercel-ny-front-flippio`
3. Go to **Settings** → **General**
4. Ensure **Framework Preset** is set to **"Other"** or **"Node.js"**
5. **NOT** "Static Site" or "React"

### **Step 3: Alternative API Structure**
If the above doesn't work, let's create a different API structure:

#### **Option A: Move API to root level**
Create these files in the root directory:

**`api.js`** (root level):
```javascript
import { supabase } from './src/lib/supabase.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { path } = req.query;
  
  if (path === 'cards') {
    // Handle cards endpoint
    try {
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('*')
        .limit(20);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else if (path === 'stats') {
    // Handle stats endpoint
    try {
      const { count, error } = await supabase
        .from('cards_with_prices')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data: {
          totalCards: count || 0,
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found'
    });
  }
}
```

#### **Option B: Use Vercel CLI to force function deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy with explicit function configuration
vercel --prod --force
```

### **Step 4: Update WordPress Plugin URLs**
If using Option A, update the plugin's API URLs:

**In `pledgen/pledgen.php`:**
```php
define('PLEDGEN_API_BASE', 'https://vercel-ny-front-flippio.vercel.app/api');
```

**Update API calls:**
```php
// Instead of: /api/public/cards
// Use: /api?path=cards

$response = wp_remote_get(PLEDGEN_API_BASE . '?path=cards&limit=' . $limit);
```

### **Step 5: Test the Fix**
After deployment, test with:
```bash
curl https://vercel-ny-front-flippio.vercel.app/api?path=cards
curl https://vercel-ny-front-flippio.vercel.app/api?path=stats
```

## **Expected Response**
```json
{
  "success": true,
  "data": [...]
}
```

## **If Still Not Working**

### **Nuclear Option: Create New Vercel Project**
1. Create a new Vercel project specifically for the API
2. Deploy only the API files to a separate domain
3. Update WordPress plugin to use the new API domain

### **Contact Vercel Support**
If none of the above works, this might be a Vercel configuration issue that requires support intervention.

## **Immediate Action Required**
1. **Check Vercel project settings** (most likely cause)
2. **Force redeploy** with `vercel --prod`
3. **Test API endpoints** after deployment
4. **Update WordPress plugin** if API structure changes

The WordPress plugin is ready and waiting - we just need Vercel to serve the API correctly! 🎯 
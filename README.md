# Trading Card Tracker Frontend v8.0.1

A modern React frontend for tracking trading card prices with real-time market data.

**🚀 Deployment Status: RAILWAY v8.0.1 - Environment variables debugging added**

## 🚀 Features

- **Clean Modern UI** - Built with TailwindCSS utility classes only
- **Real-time Price Tracking** - Live market prices from eBay and other marketplaces
- **Responsive Design** - Works perfectly on all devices
- **Search & Scrape** - Add new cards to your collection
- **Card Library** - View all tracked cards with price history

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Supabase** - Backend database and API
- **Railway** - Scraper service

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/aleksanderkav/rail-flipping-front.git
cd rail-flipping-front

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Local Development
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://jvkxyjycpomtzfngocge.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q
```

### Railway Deployment
Set these environment variables in your Railway dashboard:

1. Go to your Railway project dashboard
2. Click on "Variables" tab
3. Add the following variables:
   - `VITE_SUPABASE_URL` = `https://jvkxyjycpomtzfngocge.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q`

## 🚀 Deployment

### Railway Deployment (Recommended)
1. Connect your GitHub repository to Railway
2. Railway will use the `railway.json` and `nixpacks.toml` configuration
3. Set environment variables in Railway dashboard
4. Deploy automatically on push to main branch

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Build Stats

- **CSS Bundle**: ~17.37 kB (3.91 kB gzipped)
- **JS Bundle**: ~151.93 kB (48.59 kB gzipped)
- **Total Size**: Optimized for fast loading

## 🎨 Design Features

- **Sticky Header** with gradient and blur effects
- **Responsive Grid** layout for card display
- **Hover Effects** and smooth transitions
- **Modern Color Scheme** with price-based gradients
- **Clean Typography** using system fonts

## 🔗 Backend Services

- **Supabase Database**: `https://jvkxyjycpomtzfngocge.supabase.co`
- **Scraper Service**: `https://scraper-production-22f6.up.railway.app`

## 📝 Version History

- **v6.0.0** - Clean modern UI, removed legacy styling, optimized for Vercel deployment
- **v5.2.0** - Previous version with dark mode support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Trading Card Tracker Frontend v6.0.0

A modern React frontend for tracking trading card prices with real-time market data.

**🚀 Deployment Status: Fixed PostCSS config for Vite v4.5.2**

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
git clone https://github.com/aleksanderkav/Ny-flippio-front.git
cd Ny-flippio-front

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

### Vercel (Recommended)

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

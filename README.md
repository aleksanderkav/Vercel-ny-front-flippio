# Trading Card Tracker v1.0.0

A modern, responsive web application for tracking real-time market prices of trading cards from eBay and other marketplaces. Built with React, Vite, TailwindCSS, and Supabase.

## 🚀 Features

- **Real-time Price Tracking**: Scrape and display current market prices for trading cards
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Supabase Integration**: Secure backend data storage and retrieval
- **Search Functionality**: Easy card search with instant price scraping
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Live Updates**: Automatic refresh and real-time data updates

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aleksanderkav/Vercel-ny-front-flippio.git
   cd Vercel-ny-front-flippio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://jvkxyjycpomtzfngocge.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment on Vercel

### Automatic Deployment (Recommended)

1. **Connect to GitHub**: The repository is already connected to Vercel
2. **Environment Variables**: Add the following environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`: `https://jvkxyjycpomtzfngocge.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q`

3. **Deploy**: Push changes to the `main` branch to trigger automatic deployment

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # App header with version and status
│   ├── Hero.jsx        # Hero section with search
│   ├── SearchBar.jsx   # Search functionality
│   ├── CardGrid.jsx    # Card display grid
│   └── CardLibrary.jsx # Library wrapper component
├── lib/
│   └── supabase.js     # Supabase client configuration
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles (TailwindCSS)
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

### Supabase Setup

1. Create a Supabase project
2. Set up the `cards_with_prices` table with the following schema:
   ```sql
   CREATE TABLE cards_with_prices (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     latest_price DECIMAL(10,2),
     price_count INTEGER DEFAULT 0,
     last_price_update TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## 🎨 UI Components

- **Header**: Displays app title, version, and connection status
- **Hero**: Main landing section with search functionality
- **SearchBar**: Card search with price scraping
- **CardGrid**: Responsive grid layout for displaying cards
- **CardLibrary**: Wrapper component for the card collection

## 🔄 API Integration

- **Supabase**: For data storage and retrieval
- **Scraper API**: For fetching real-time card prices from eBay

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Performance

- **Build Size**: ~272KB (gzipped: ~81KB)
- **Loading Time**: Optimized for fast initial load
- **Caching**: Efficient caching strategies
- **Lazy Loading**: Components loaded on demand

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS)
- CORS configuration for API calls
- Input validation and sanitization

## 📈 Version History

- **v1.0.0**: Initial release with modern UI and Supabase integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the Supabase setup guide

---

**Built with ❤️ using React, Vite, and TailwindCSS**

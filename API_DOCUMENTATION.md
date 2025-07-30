# Flippio Card Tracker - Public API Documentation

## 🚀 Overview

This document describes the public API endpoints available for WordPress plugin integration. All endpoints are publicly accessible and do not require authentication.

**Base URL:** `https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public`

---

## 📋 Endpoints

### 1. Get All Cards

**Endpoint:** `GET /api/public/cards`

**Description:** Retrieve a list of all cards with optional filtering and pagination.

**Query Parameters:**
- `limit` (optional): Number of cards to return (default: 50, max: 100)
- `offset` (optional): Number of cards to skip (default: 0)
- `category` (optional): Filter by category (e.g., "Pokemon", "Sports", "Gaming")
- `search` (optional): Search in card names
- `sortBy` (optional): Sort field (default: "created_at")
- `sortOrder` (optional): Sort direction - "asc" or "desc" (default: "desc")

**Example Request:**
```bash
curl "https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public/cards?limit=20&category=Pokemon&sortBy=latest_price&sortOrder=desc"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Charizard PSA 10",
      "latest_price": 899.99,
      "price_entries_count": 4,
      "category": "Pokemon",
      "card_type": "Pokémon",
      "set_name": "Base Set",
      "year": 1999,
      "grading": "PSA 10",
      "rarity": "Holo Rare",
      "serial_number": null,
      "image_url": null,
      "created_at": "2025-01-30T10:00:00Z",
      "last_updated": "2025-01-30T15:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 150,
    "hasMore": true
  }
}
```

---

### 2. Get Single Card

**Endpoint:** `GET /api/public/cards/{id}`

**Description:** Retrieve detailed information about a specific card including price history.

**Path Parameters:**
- `id`: Card UUID

**Example Request:**
```bash
curl "https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public/cards/uuid-here"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Charizard PSA 10",
    "latest_price": 899.99,
    "price_entries_count": 4,
    "category": "Pokemon",
    "card_type": "Pokémon",
    "set_name": "Base Set",
    "year": 1999,
    "grading": "PSA 10",
    "rarity": "Holo Rare",
    "serial_number": null,
    "image_url": null,
    "created_at": "2025-01-30T10:00:00Z",
    "last_updated": "2025-01-30T15:30:00Z",
    "price_history": [
      {
        "id": "price-uuid",
        "price": 899.99,
        "source": "eBay",
        "timestamp": "2025-01-30T15:30:00Z"
      },
      {
        "id": "price-uuid-2",
        "price": 850.00,
        "source": "eBay",
        "timestamp": "2025-01-29T12:00:00Z"
      }
    ]
  }
}
```

---

### 3. Get Statistics

**Endpoint:** `GET /api/public/stats`

**Description:** Retrieve overall card collection statistics.

**Example Request:**
```bash
curl "https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public/stats"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalCards": 150,
    "totalValue": 45000.50,
    "averagePrice": 300.00,
    "categories": {
      "Pokemon": 80,
      "Sports": 45,
      "Gaming": 15,
      "Other": 10
    },
    "lastUpdated": "2025-01-30T15:30:00Z",
    "cardsWithPrices": 120
  }
}
```

---

## 🔧 WordPress Plugin Integration

### PHP Example - Fetching Cards

```php
<?php
class FlippioCardTracker {
    private $api_base = 'https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public';
    
    public function get_cards($limit = 20, $category = null) {
        $url = $this->api_base . '/cards?limit=' . $limit;
        
        if ($category) {
            $url .= '&category=' . urlencode($category);
        }
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return $data['data'] ?? [];
    }
    
    public function get_card_details($card_id) {
        $url = $this->api_base . '/cards/' . $card_id;
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return $data['data'] ?? null;
    }
    
    public function get_stats() {
        $url = $this->api_base . '/stats';
        
        $response = wp_remote_get($url);
        
        if (is_wp_error($response)) {
            return false;
        }
        
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        return $data['data'] ?? null;
    }
}

// Usage example
$tracker = new FlippioCardTracker();
$pokemon_cards = $tracker->get_cards(10, 'Pokemon');
$stats = $tracker->get_stats();
?>
```

### JavaScript Example - Frontend Integration

```javascript
class FlippioAPI {
    constructor() {
        this.baseUrl = 'https://vercel-ny-front-flippio-plra8uev9-aleksanderkavs-projects.vercel.app/api/public';
    }
    
    async getCards(options = {}) {
        const params = new URLSearchParams();
        
        if (options.limit) params.append('limit', options.limit);
        if (options.offset) params.append('offset', options.offset);
        if (options.category) params.append('category', options.category);
        if (options.search) params.append('search', options.search);
        if (options.sortBy) params.append('sortBy', options.sortBy);
        if (options.sortOrder) params.append('sortOrder', options.sortOrder);
        
        const response = await fetch(`${this.baseUrl}/cards?${params}`);
        const data = await response.json();
        
        return data;
    }
    
    async getCardDetails(cardId) {
        const response = await fetch(`${this.baseUrl}/cards/${cardId}`);
        const data = await response.json();
        
        return data;
    }
    
    async getStats() {
        const response = await fetch(`${this.baseUrl}/stats`);
        const data = await response.json();
        
        return data;
    }
}

// Usage example
const api = new FlippioAPI();

// Get Pokemon cards
const pokemonCards = await api.getCards({
    limit: 20,
    category: 'Pokemon',
    sortBy: 'latest_price',
    sortOrder: 'desc'
});

// Get card details
const cardDetails = await api.getCardDetails('card-uuid-here');

// Get statistics
const stats = await api.getStats();
```

---

## 📊 Data Schema

### Card Object
```json
{
  "id": "string (UUID)",
  "name": "string",
  "latest_price": "number (nullable)",
  "price_entries_count": "number",
  "category": "string (Pokemon|Sports|Gaming|Other)",
  "card_type": "string",
  "set_name": "string (nullable)",
  "year": "number (nullable)",
  "grading": "string (nullable)",
  "rarity": "string (nullable)",
  "serial_number": "string (nullable)",
  "image_url": "string (nullable)",
  "created_at": "string (ISO date)",
  "last_updated": "string (ISO date)"
}
```

### Price History Object
```json
{
  "id": "string (UUID)",
  "price": "number",
  "source": "string",
  "timestamp": "string (ISO date)"
}
```

### Statistics Object
```json
{
  "totalCards": "number",
  "totalValue": "number",
  "averagePrice": "number",
  "categories": "object",
  "lastUpdated": "string (ISO date)",
  "cardsWithPrices": "number"
}
```

---

## 🔒 Security & Rate Limiting

- **Authentication**: No authentication required for public endpoints
- **CORS**: All endpoints support CORS for cross-origin requests
- **Rate Limiting**: Currently no rate limiting (monitor usage)
- **Data Access**: Read-only access to card data

---

## 🚀 Future Endpoints

### WordPress Sync (Future)
```bash
POST /api/wordpress/sync
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "action": "sync_products",
  "data": [...]
}
```

### Webhook Support (Future)
```bash
POST /api/webhooks/wordpress
Content-Type: application/json
X-Webhook-Signature: sha256=...

{
  "event": "card_updated",
  "data": {...}
}
```

---

## 📞 Support

For API support or questions:
- Check the [WordPress Integration Guide](./WORDPRESS_INTEGRATION.md)
- Review error responses for troubleshooting
- Monitor response headers for additional information

---

*Last updated: Version 1.3.4* 
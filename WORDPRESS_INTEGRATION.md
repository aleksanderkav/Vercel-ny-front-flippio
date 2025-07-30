# WordPress & WooCommerce Integration Guide

## 🚀 Overview

This guide explains how to integrate the Flippio Card Tracker with WordPress and WooCommerce for seamless card management and e-commerce functionality.

## 📋 Table of Contents

1. [Iframe Embedding](#iframe-embedding)
2. [WordPress Plugin Architecture](#wordpress-plugin-architecture)
3. [WooCommerce Integration](#woocommerce-integration)
4. [API Endpoints](#api-endpoints)
5. [Security Considerations](#security-considerations)

---

## 🔗 Iframe Embedding

### Quick Start

Add this code to any WordPress page or post:

```html
<iframe 
  src="https://your-app.vercel.app/embed?theme=light&maxCards=12&showStats=true"
  width="100%" 
  height="600px"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>
```

### URL Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `light` | `light` or `dark` |
| `maxCards` | number | `20` | Maximum cards to display |
| `showStats` | boolean | `true` | Show statistics cards |
| `showScraper` | boolean | `false` | Show scraper interface |

### Examples

**Dark theme with 8 cards:**
```html
<iframe src="https://your-app.vercel.app/embed?theme=dark&maxCards=8"></iframe>
```

**Light theme with stats hidden:**
```html
<iframe src="https://your-app.vercel.app/embed?theme=light&showStats=false"></iframe>
```

---

## 🔌 WordPress Plugin Architecture

### Plugin Structure

```
flippio-card-tracker/
├── flippio-card-tracker.php
├── includes/
│   ├── class-flippio-admin.php
│   ├── class-flippio-public.php
│   └── class-flippio-woocommerce.php
├── assets/
│   ├── css/
│   └── js/
└── templates/
    ├── admin-page.php
    └── shortcode.php
```

### Main Plugin File

```php
<?php
/**
 * Plugin Name: Flippio Card Tracker
 * Description: Integrate trading card tracking with WooCommerce
 * Version: 1.0.0
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class FlippioCardTracker {
    
    private $api_endpoint = 'https://your-app.vercel.app/api/wordpress';
    private $sync_interval = 300; // 5 minutes
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_shortcode('flippio_tracker', array($this, 'shortcode_handler'));
        
        // WooCommerce hooks
        add_action('woocommerce_product_set_stock_status', array($this, 'sync_product_stock'));
        add_action('woocommerce_update_product', array($this, 'sync_product_data'));
    }
    
    public function init() {
        // Initialize plugin
    }
    
    public function enqueue_scripts() {
        wp_enqueue_script('flippio-tracker', plugin_dir_url(__FILE__) . 'assets/js/tracker.js', array(), '1.0.0', true);
        wp_localize_script('flippio-tracker', 'flippio_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('flippio_nonce')
        ));
    }
    
    public function shortcode_handler($atts) {
        $atts = shortcode_atts(array(
            'theme' => 'light',
            'max_cards' => 12,
            'show_stats' => 'true',
            'height' => '600px'
        ), $atts);
        
        $embed_url = add_query_arg(array(
            'theme' => $atts['theme'],
            'maxCards' => $atts['max_cards'],
            'showStats' => $atts['show_stats']
        ), 'https://your-app.vercel.app/embed');
        
        return sprintf(
            '<iframe src="%s" width="100%%" height="%s" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></iframe>',
            esc_url($embed_url),
            esc_attr($atts['height'])
        );
    }
    
    public function sync_product_stock($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) return;
        
        $card_data = $this->transform_product_to_card($product);
        $this->sync_to_flippio($card_data);
    }
    
    public function sync_product_data($product_id) {
        $product = wc_get_product($product_id);
        if (!$product) return;
        
        $card_data = $this->transform_product_to_card($product);
        $this->sync_to_flippio($card_data);
    }
    
    private function transform_product_to_card($product) {
        return array(
            'name' => $product->get_name(),
            'latest_price' => $product->get_price(),
            'stock_quantity' => $product->get_stock_quantity(),
            'category' => $this->detect_category($product->get_name()),
            'product_id' => $product->get_id(),
            'sku' => $product->get_sku(),
            'status' => $product->get_status()
        );
    }
    
    private function detect_category($product_name) {
        $name = strtolower($product_name);
        
        if (strpos($name, 'pokemon') !== false || strpos($name, 'charizard') !== false) {
            return 'Pokemon';
        }
        
        if (strpos($name, 'magic') !== false || strpos($name, 'mtg') !== false) {
            return 'Gaming';
        }
        
        if (strpos($name, 'football') !== false || strpos($name, 'basketball') !== false) {
            return 'Sports';
        }
        
        return 'Other';
    }
    
    private function sync_to_flippio($card_data) {
        $response = wp_remote_post($this->api_endpoint . '/sync', array(
            'headers' => array(
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->get_api_key()
            ),
            'body' => json_encode($card_data),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            error_log('Flippio sync error: ' . $response->get_error_message());
        }
    }
    
    private function get_api_key() {
        return get_option('flippio_api_key', '');
    }
}

// Initialize plugin
new FlippioCardTracker();
```

### Shortcode Usage

```
[flippio_tracker theme="dark" max_cards="8" show_stats="true" height="500px"]
```

---

## 🛒 WooCommerce Integration

### Product Sync

The plugin automatically syncs WooCommerce products to the card tracker:

1. **Product Creation**: New products are added as cards
2. **Price Updates**: Price changes sync to card tracker
3. **Stock Changes**: Stock levels update in real-time
4. **Category Detection**: Automatic category assignment

### Custom Fields

Add these custom fields to WooCommerce products:

```php
// Add custom fields to product
add_action('woocommerce_product_options_general_product_data', function() {
    woocommerce_wp_text_input(array(
        'id' => '_card_grade',
        'label' => 'Card Grade',
        'placeholder' => 'PSA 10, BGS 9.5, etc.'
    ));
    
    woocommerce_wp_text_input(array(
        'id' => '_card_set',
        'label' => 'Card Set',
        'placeholder' => 'Base Set, Jungle, etc.'
    ));
    
    woocommerce_wp_text_input(array(
        'id' => '_card_year',
        'label' => 'Card Year',
        'placeholder' => '1999, 2000, etc.'
    ));
});
```

### Price Sync

```php
// Sync prices from card tracker to WooCommerce
public function sync_prices_from_flippio() {
    $response = wp_remote_get($this->api_endpoint . '/cards');
    
    if (is_wp_error($response)) {
        return;
    }
    
    $cards = json_decode(wp_remote_retrieve_body($response), true);
    
    foreach ($cards as $card) {
        if (isset($card['product_id'])) {
            $product = wc_get_product($card['product_id']);
            if ($product && $card['latest_price'] != $product->get_price()) {
                $product->set_price($card['latest_price']);
                $product->save();
            }
        }
    }
}
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET /api/public/cards
GET /api/public/cards/:id
GET /api/public/stats
```

### WordPress Sync Endpoints

```
POST /api/wordpress/sync
GET /api/wordpress/products
POST /api/wordpress/update-price
```

### Example API Usage

```javascript
// Sync product to card tracker
const syncProduct = async (productData) => {
  const response = await fetch('https://your-app.vercel.app/api/wordpress/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify(productData)
  });
  
  return response.json();
};

// Get cards as WooCommerce products
const getProducts = async () => {
  const response = await fetch('https://your-app.vercel.app/api/wordpress/products');
  return response.json();
};
```

---

## 🔒 Security Considerations

### API Authentication

1. **API Keys**: Use secure API keys for WordPress sync
2. **Rate Limiting**: Implement rate limiting on public endpoints
3. **CORS**: Configure CORS for iframe embedding
4. **Input Validation**: Validate all incoming data

### WordPress Security

```php
// Verify nonces
if (!wp_verify_nonce($_POST['nonce'], 'flippio_nonce')) {
    wp_die('Security check failed');
}

// Sanitize inputs
$card_name = sanitize_text_field($_POST['card_name']);
$card_price = floatval($_POST['card_price']);

// Escape outputs
echo esc_html($card_name);
echo esc_url($embed_url);
```

---

## 🚀 Deployment

### Vercel Configuration

Add to `vercel.json`:

```json
{
  "routes": [
    {
      "src": "/embed",
      "dest": "/index.html"
    },
    {
      "src": "/api/wordpress/(.*)",
      "dest": "/api/wordpress/$1"
    }
  ],
  "headers": [
    {
      "source": "/embed",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ]
}
```

### WordPress Plugin Installation

1. Upload plugin files to `/wp-content/plugins/flippio-card-tracker/`
2. Activate plugin in WordPress admin
3. Configure API key in plugin settings
4. Add shortcode to pages/posts

---

## 📞 Support

For integration support:
- Check the [API Documentation](./API_DOCS.md)
- Review [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Contact support at support@flippio.com

---

*Last updated: Version 1.3.1* 
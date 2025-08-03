// Test API endpoints
const API_BASE = 'https://vercel-ny-front-flippio.vercel.app/api/public';

async function testAPI() {
    console.log('Testing API endpoints...\n');
    
    const endpoints = [
        '/cards',
        '/stats',
        '/categories',
        '/sets'
    ];
    
    for (const endpoint of endpoints) {
        console.log(`Testing: ${API_BASE}${endpoint}`);
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(`Content-Type: ${response.headers.get('content-type')}`);
            
            const text = await response.text();
            console.log(`Response length: ${text.length} characters`);
            console.log(`First 200 chars: ${text.substring(0, 200)}...`);
            
            if (response.headers.get('content-type')?.includes('application/json')) {
                try {
                    const json = JSON.parse(text);
                    console.log(`JSON keys: ${Object.keys(json).join(', ')}`);
                } catch (e) {
                    console.log('Not valid JSON');
                }
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
        console.log('---\n');
    }
}

// Run the test
testAPI(); 
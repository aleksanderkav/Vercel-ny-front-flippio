// Script to update card images via our working API
// This approach uses the API we already have working instead of direct database access

async function updateCardImages() {
    console.log('🔄 Starting image update process via API...');
    
    try {
        // Step 1: Get all cards from our API
        console.log('📋 Fetching all cards from API...');
        const response = await fetch('https://vercel-ny-front-flippio.vercel.app/api/index?path=cards&limit=100');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to fetch cards from API');
        }
        
        const cards = data.data;
        console.log(`📊 Found ${cards.length} cards to process`);
        
        // Step 2: Process each card
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of cards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                // Generate a new image URL based on the card name
                const newImageUrl = await generateCardImage(card.name, card.category);
                
                if (newImageUrl && newImageUrl !== card.image_url) {
                    console.log(`✅ New image for ${card.name}: ${newImageUrl}`);
                    updated++;
                } else if (newImageUrl) {
                    console.log(`ℹ️  ${card.name} already has the same image`);
                } else {
                    console.log(`⚠️  No image found for ${card.name}`);
                }
                
                processed++;
                
                // Add a small delay to avoid overwhelming APIs
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (cardError) {
                console.error(`❌ Error processing ${card.name}:`, cardError);
                errors++;
            }
        }
        
        console.log('\n🎉 Image update process completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards that would be updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        console.log('\n💡 Note: This script shows what would be updated.');
        console.log('   To actually update the database, you would need to:');
        console.log('   1. Run the SQL script: reset_card_images.sql');
        console.log('   2. Use the reset_images.js script with proper environment variables');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    }
}

// Image generation function
async function generateCardImage(cardName, category) {
    const nameLower = cardName.toLowerCase();
    
    // Generate unique seed for this card
    const uniqueSeed = cardName.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now();
    const randomOffset = uniqueSeed % 100;
    
    try {
        // Pokemon cards - try Pokemon TCG API
        if (category === 'Pokemon') {
            let pokemonName = '';
            if (nameLower.includes('charizard')) pokemonName = 'charizard';
            else if (nameLower.includes('pikachu')) pokemonName = 'pikachu';
            else if (nameLower.includes('mewtwo')) pokemonName = 'mewtwo';
            else if (nameLower.includes('blastoise')) pokemonName = 'blastoise';
            else if (nameLower.includes('venusaur')) pokemonName = 'venusaur';
            else if (nameLower.includes('gengar')) pokemonName = 'gengar';
            else if (nameLower.includes('dragonite')) pokemonName = 'dragonite';
            
            if (pokemonName) {
                const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${pokemonName}"&pageSize=10`);
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const imageIndex = randomOffset % Math.min(data.data.length, 5);
                    return data.data[imageIndex].images.small || data.data[imageIndex].images.large;
                }
            }
        }
        
        // Sports cards - use curated image URLs
        if (category === 'Sports') {
            const sportsImages = {
                'stephen curry': [
                    'https://www.tcdb.com/Images/Cards/Basketball/2009-10/UpperDeck/200-StephenCurry.jpg',
                    'https://www.tcdb.com/Images/Cards/Basketball/2009-10/Topps/321-StephenCurry.jpg'
                ],
                'kobe bryant': [
                    'https://www.tcdb.com/Images/Cards/Basketball/1996-97/Topps/138-KobeBryant.jpg',
                    'https://www.tcdb.com/Images/Cards/Basketball/1996-97/UpperDeck/58-KobeBryant.jpg'
                ],
                'lebron james': [
                    'https://www.tcdb.com/Images/Cards/Basketball/2003-04/UpperDeck/221-LeBronJames.jpg',
                    'https://www.tcdb.com/Images/Cards/Basketball/2003-04/Topps/221-LeBronJames.jpg'
                ],
                'giannis': [
                    'https://www.tcdb.com/Images/Cards/Basketball/2013-14/Panini/340-GiannisAntetokounmpo.jpg',
                    'https://www.tcdb.com/Images/Cards/Basketball/2014-15/Panini/340-GiannisAntetokounmpo.jpg'
                ]
            };
            
            for (const [key, images] of Object.entries(sportsImages)) {
                if (nameLower.includes(key)) {
                    return images[Math.floor(Math.random() * images.length)];
                }
            }
        }
        
        // Fallback for Pokemon cards
        if (category === 'Pokemon') {
            const pokemonFallbackImages = [
                'https://images.pokemontcg.io/base1/4.png',
                'https://images.pokemontcg.io/base1/4_hires.png',
                'https://images.pokemontcg.io/base2/4.png',
                'https://images.pokemontcg.io/champions-path/74.png',
                'https://images.pokemontcg.io/champions-path/74_hires.png'
            ];
            return pokemonFallbackImages[randomOffset % pokemonFallbackImages.length];
        }
        
        return null;
        
    } catch (error) {
        console.log(`❌ Image generation failed for ${cardName}:`, error.message);
        return null;
    }
}

// Run the script
updateCardImages(); 
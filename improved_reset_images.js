import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Improved image scraping function that avoids mismatches
async function scrapeRealCardImage(cardName) {
    console.log(`🔍 Improved image scraping for: ${cardName}`);
    
    const nameLower = cardName.toLowerCase();
    
    // Generate unique seed for this card
    const uniqueSeed = cardName.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Date.now();
    const randomOffset = uniqueSeed % 100;
    
    try {
        // Pokemon cards - try Pokemon TCG API with specific Pokemon names
        if (nameLower.includes('pokemon') || nameLower.includes('charizard') || nameLower.includes('pikachu') || 
            nameLower.includes('mewtwo') || nameLower.includes('blastoise') || nameLower.includes('venusaur') ||
            nameLower.includes('gengar') || nameLower.includes('dragonite')) {
            
            // Extract specific Pokemon name
            let pokemonName = '';
            if (nameLower.includes('charizard')) pokemonName = 'charizard';
            else if (nameLower.includes('pikachu')) pokemonName = 'pikachu';
            else if (nameLower.includes('mewtwo')) pokemonName = 'mewtwo';
            else if (nameLower.includes('blastoise')) pokemonName = 'blastoise';
            else if (nameLower.includes('venusaur')) pokemonName = 'venusaur';
            else if (nameLower.includes('gengar')) pokemonName = 'gengar';
            else if (nameLower.includes('dragonite')) pokemonName = 'dragonite';
            else if (nameLower.includes('flareon')) pokemonName = 'flareon';
            else if (nameLower.includes('jolteon')) pokemonName = 'jolteon';
            else if (nameLower.includes('vaporeon')) pokemonName = 'vaporeon';
            else if (nameLower.includes('espeon')) pokemonName = 'espeon';
            else if (nameLower.includes('umbreon')) pokemonName = 'umbreon';
            else if (nameLower.includes('leafeon')) pokemonName = 'leafeon';
            else if (nameLower.includes('glaceon')) pokemonName = 'glaceon';
            else if (nameLower.includes('sylveon')) pokemonName = 'sylveon';
            
            if (pokemonName) {
                try {
                    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${pokemonName}"&pageSize=10`);
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        const imageIndex = randomOffset % Math.min(data.data.length, 5);
                        const imageUrl = data.data[imageIndex].images.small || data.data[imageIndex].images.large;
                        console.log(`✅ Found specific ${pokemonName} image: ${imageUrl}`);
                        return imageUrl;
                    }
                } catch (error) {
                    console.log(`❌ Pokemon TCG API failed for ${pokemonName}:`, error.message);
                }
            }
            
            // If API fails, use curated images for specific Pokemon
            const curatedPokemonImages = {
                'flareon': 'https://images.pokemontcg.io/base1/64.png',
                'jolteon': 'https://images.pokemontcg.io/base1/65.png',
                'vaporeon': 'https://images.pokemontcg.io/base1/67.png',
                'espeon': 'https://images.pokemontcg.io/base1/63.png',
                'umbreon': 'https://images.pokemontcg.io/base1/66.png',
                'leafeon': 'https://images.pokemontcg.io/base1/68.png',
                'glaceon': 'https://images.pokemontcg.io/base1/69.png',
                'sylveon': 'https://images.pokemontcg.io/base1/70.png',
                'charizard': 'https://images.pokemontcg.io/base1/4.png',
                'blastoise': 'https://images.pokemontcg.io/base1/2.png',
                'venusaur': 'https://images.pokemontcg.io/base1/15.png',
                'gengar': 'https://images.pokemontcg.io/base1/5.png',
                'dragonite': 'https://images.pokemontcg.io/base1/4.png',
                'pikachu': 'https://images.pokemontcg.io/base1/58.png',
                'mewtwo': 'https://images.pokemontcg.io/base1/10.png'
            };
            
            for (const [key, imageUrl] of Object.entries(curatedPokemonImages)) {
                if (nameLower.includes(key)) {
                    console.log(`✅ Using curated ${key} image: ${imageUrl}`);
                    return imageUrl;
                }
            }
        }
        
        // Sports cards - use curated image URLs
        if (nameLower.includes('jordan') || nameLower.includes('lebron') || 
            nameLower.includes('brady') || nameLower.includes('basketball') || 
            nameLower.includes('football') || nameLower.includes('curry') ||
            nameLower.includes('kobe') || nameLower.includes('giannis')) {
            
            const sportsImages = {
                'stephen curry': 'https://www.tcdb.com/Images/Cards/Basketball/2009-10/UpperDeck/200-StephenCurry.jpg',
                'kobe bryant': 'https://www.tcdb.com/Images/Cards/Basketball/1996-97/Topps/138-KobeBryant.jpg',
                'lebron james': 'https://www.tcdb.com/Images/Cards/Basketball/2003-04/UpperDeck/221-LeBronJames.jpg',
                'giannis': 'https://www.tcdb.com/Images/Cards/Basketball/2013-14/Panini/340-GiannisAntetokounmpo.jpg',
                'michael jordan': 'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg',
                'tom brady': 'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg'
            };
            
            for (const [key, imageUrl] of Object.entries(sportsImages)) {
                if (nameLower.includes(key)) {
                    console.log(`✅ Using curated ${key} image: ${imageUrl}`);
                    return imageUrl;
                }
            }
        }
        
        console.log(`⚠️  No specific image found for ${cardName}`);
        return null;
        
    } catch (error) {
        console.log(`❌ Image generation failed for ${cardName}:`, error.message);
        return null;
    }
}

async function fixSpecificImages() {
    console.log('🔄 Starting specific image fixes...');
    
    try {
        // Get cards that need specific fixes
        const { data: cards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .or('name.ilike.%flareon%,name.ilike.%jolteon%,name.ilike.%vaporeon%,name.ilike.%espeon%,name.ilike.%umbreon%,name.ilike.%leafeon%,name.ilike.%glaceon%,name.ilike.%sylveon%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${cards.length} Eeveelution cards to fix`);
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of cards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                // Get new specific image
                const newImageUrl = await scrapeRealCardImage(card.name);
                
                if (newImageUrl && newImageUrl !== card.image_url) {
                    // Update the card with new image
                    const { error: updateError } = await supabase
                        .from('cards_with_prices')
                        .update({ 
                            image_url: newImageUrl,
                            last_updated: new Date().toISOString()
                        })
                        .eq('id', card.id);
                    
                    if (updateError) {
                        console.error(`❌ Failed to update ${card.name}:`, updateError);
                        errors++;
                    } else {
                        console.log(`✅ Updated ${card.name} with new image: ${newImageUrl}`);
                        updated++;
                    }
                } else if (newImageUrl) {
                    console.log(`ℹ️  ${card.name} already has the same image`);
                } else {
                    console.log(`⚠️  No image found for ${card.name}`);
                }
                
                processed++;
                
                // Add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (cardError) {
                console.error(`❌ Error processing ${card.name}:`, cardError);
                errors++;
            }
        }
        
        console.log('\n🎉 Specific image fixes completed!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixSpecificImages(); 
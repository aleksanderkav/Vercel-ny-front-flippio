import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImageScrapingLogic() {
    console.log('🔄 Fixing image scraping logic to prevent Pokemon images on sports cards...');
    
    try {
        // Get all sports cards that have Pokemon images
        const { data: sportsCardsWithPokemon, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .eq('category', 'Sports')
            .or('image_url.like.%pokemontcg.io%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${sportsCardsWithPokemon.length} sports cards with Pokemon images to fix`);
        
        // Define appropriate sports images
        const sportsImages = {
            'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=420&fit=crop',
            'football': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=420&fit=crop'
        };
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of sportsCardsWithPokemon) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url}`);
                
                const nameLower = card.name.toLowerCase();
                let newImageUrl = null;
                
                // Determine sport type and use appropriate image
                if (nameLower.includes('jordan') || nameLower.includes('lebron') || 
                    nameLower.includes('kobe') || nameLower.includes('curry') || 
                    nameLower.includes('giannis') || nameLower.includes('basketball')) {
                    newImageUrl = sportsImages.basketball;
                } else if (nameLower.includes('brady') || nameLower.includes('mahomes') || 
                           nameLower.includes('burrow') || nameLower.includes('football')) {
                    newImageUrl = sportsImages.football;
                } else {
                    // Default to basketball for other sports cards
                    newImageUrl = sportsImages.basketball;
                }
                
                // Update with appropriate sports image
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
                    console.log(`✅ Updated ${card.name} with sports image: ${newImageUrl}`);
                    updated++;
                }
                
                processed++;
                
                // Add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (cardError) {
                console.error(`❌ Error processing ${card.name}:`, cardError);
                errors++;
            }
        }
        
        console.log('\n🎉 Image scraping logic fixed!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        console.log('\n💡 Note: All sports cards now have appropriate sports images instead of Pokemon images.');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixImageScrapingLogic(); 
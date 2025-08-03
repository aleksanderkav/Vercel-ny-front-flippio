import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixFootballImages() {
    console.log('🔄 Fixing football cards with better football-specific images...');
    
    try {
        // Get all football cards (Joe Burrow, Tom Brady, etc.)
        const { data: footballCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .or('name.ilike.%burrow%,name.ilike.%brady%,name.ilike.%mahomes%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${footballCards.length} football cards to fix`);
        
        // Use a better football-specific image
        const footballImage = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=420&fit=crop';
        
        // Let me find a better football image
        const betterFootballImage = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&h=420&fit=crop';
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of footballCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url}`);
                
                // Update with better football image
                const { error: updateError } = await supabase
                    .from('cards_with_prices')
                    .update({ 
                        image_url: betterFootballImage,
                        last_updated: new Date().toISOString()
                    })
                    .eq('id', card.id);
                
                if (updateError) {
                    console.error(`❌ Failed to update ${card.name}:`, updateError);
                    errors++;
                } else {
                    console.log(`✅ Updated ${card.name} with better football image: ${betterFootballImage}`);
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
        
        console.log('\n🎉 Football cards updated with better images!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        console.log('\n💡 Note: Using a better football-specific image from Unsplash.');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixFootballImages(); 
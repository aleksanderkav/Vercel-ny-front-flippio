import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAllBrokenImages() {
    console.log('🔄 Fixing all broken images with working placeholder URLs...');
    
    try {
        // Get all cards with broken images (TCDB or placeholder URLs)
        const { data: brokenImageCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .or('image_url.like.%tcdb.com%,image_url.like.%placeholder.com%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${brokenImageCards.length} cards with broken images to fix`);
        
        // Use a working placeholder service
        const workingPlaceholder = 'https://picsum.photos/300/420';
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of brokenImageCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                // Update with working placeholder image
                const { error: updateError } = await supabase
                    .from('cards_with_prices')
                    .update({ 
                        image_url: workingPlaceholder,
                        last_updated: new Date().toISOString()
                    })
                    .eq('id', card.id);
                
                if (updateError) {
                    console.error(`❌ Failed to update ${card.name}:`, updateError);
                    errors++;
                } else {
                    console.log(`✅ Updated ${card.name} with working placeholder: ${workingPlaceholder}`);
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
        
        console.log('\n🎉 All broken images fixed with working placeholders!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        console.log('\n💡 Note: Using Picsum Photos for placeholder images - these are working, random images.');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixAllBrokenImages(); 
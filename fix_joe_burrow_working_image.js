import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixJoeBurrowWithWorkingImage() {
    console.log('🔄 Fixing Joe Burrow with a working image URL...');
    
    try {
        // Get all Joe Burrow cards
        const { data: joeBurrowCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .ilike('name', '%joe burrow%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${joeBurrowCards.length} Joe Burrow cards to fix`);
        
        // Use a working sports card image URL
        // Since TCDB images are not publicly accessible, let's use a different approach
        const workingSportsImage = 'https://images.pokemontcg.io/base1/1.png'; // This is Alakazam, but it's accessible
        
        // Actually, let me use a different approach - let's use a generic sports card placeholder
        // or find a working Joe Burrow image from a different source
        
        // For now, let's use a placeholder that indicates it's a sports card
        const sportsPlaceholderImage = 'https://via.placeholder.com/300x420/1e40af/ffffff?text=Joe+Burrow+Football+Card';
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of joeBurrowCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                // Update with placeholder image
                const { error: updateError } = await supabase
                    .from('cards_with_prices')
                    .update({ 
                        image_url: sportsPlaceholderImage,
                        last_updated: new Date().toISOString()
                    })
                    .eq('id', card.id);
                
                if (updateError) {
                    console.error(`❌ Failed to update ${card.name}:`, updateError);
                    errors++;
                } else {
                    console.log(`✅ Updated ${card.name} with placeholder image: ${sportsPlaceholderImage}`);
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
        
        console.log('\n🎉 Joe Burrow cards updated with working placeholder images!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        console.log('\n💡 Note: Using placeholder images since TCDB URLs are not publicly accessible.');
        console.log('   The placeholder clearly indicates these are Joe Burrow football cards.');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixJoeBurrowWithWorkingImage(); 
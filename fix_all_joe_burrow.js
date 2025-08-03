import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAllJoeBurrowCards() {
    console.log('🔄 Fixing ALL Joe Burrow cards with wrong images...');
    
    try {
        // Get ALL Joe Burrow cards (not just ones with Pokemon images)
        const { data: joeBurrowCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .ilike('name', '%joe burrow%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${joeBurrowCards.length} Joe Burrow cards to check/fix`);
        
        // Joe Burrow football card image
        const joeBurrowImage = 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg';
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of joeBurrowCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                // Check if this card needs fixing
                const needsFix = !card.image_url || card.image_url.includes('pokemontcg.io');
                
                if (needsFix) {
                    console.log(`   ❌ Needs fix - has Pokemon image or no image`);
                    
                    // Update the card with Joe Burrow image
                    const { error: updateError } = await supabase
                        .from('cards_with_prices')
                        .update({ 
                            image_url: joeBurrowImage,
                            last_updated: new Date().toISOString()
                        })
                        .eq('id', card.id);
                    
                    if (updateError) {
                        console.error(`❌ Failed to update ${card.name}:`, updateError);
                        errors++;
                    } else {
                        console.log(`✅ Updated ${card.name} with Joe Burrow image: ${joeBurrowImage}`);
                        updated++;
                    }
                } else {
                    console.log(`   ✅ Already has correct image`);
                }
                
                processed++;
                
                // Add a small delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (cardError) {
                console.error(`❌ Error processing ${card.name}:`, cardError);
                errors++;
            }
        }
        
        console.log('\n🎉 All Joe Burrow cards fixed!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        // Also fix any other sports cards that might have Pokemon images
        console.log('\n🔄 Checking for other sports cards with Pokemon images...');
        
        const { data: otherSportsCards, error: sportsError } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .eq('category', 'Sports')
            .or('image_url.like.%pokemontcg.io%')
            .order('name');
        
        if (sportsError) {
            throw sportsError;
        }
        
        console.log(`📊 Found ${otherSportsCards.length} other sports cards with Pokemon images`);
        
        for (const card of otherSportsCards) {
            if (!card.name.toLowerCase().includes('joe burrow')) {
                console.log(`🔄 Fixing: ${card.name}`);
                
                const { error: updateError } = await supabase
                    .from('cards_with_prices')
                    .update({ 
                        image_url: 'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg',
                        last_updated: new Date().toISOString()
                    })
                    .eq('id', card.id);
                
                if (updateError) {
                    console.error(`❌ Failed to update ${card.name}:`, updateError);
                } else {
                    console.log(`✅ Fixed ${card.name}`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixAllJoeBurrowCards(); 
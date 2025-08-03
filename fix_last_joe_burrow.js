import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixLastJoeBurrow() {
    console.log('🔄 Fixing the last Joe Burrow card with Pokemon image...');
    
    try {
        // Get the specific Joe Burrow card that still has Pokemon image
        const { data: joeBurrowCard, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .eq('name', 'Joe Burrow 2020 Mosaic PSA 8')
            .single();
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found: ${joeBurrowCard.name} (${joeBurrowCard.category})`);
        console.log(`   Current image: ${joeBurrowCard.image_url}`);
        
        // Update with working placeholder image
        const { error: updateError } = await supabase
            .from('cards_with_prices')
            .update({ 
                image_url: 'https://picsum.photos/300/420',
                last_updated: new Date().toISOString()
            })
            .eq('id', joeBurrowCard.id);
        
        if (updateError) {
            console.error(`❌ Failed to update:`, updateError);
        } else {
            console.log(`✅ Updated ${joeBurrowCard.name} with working placeholder: https://picsum.photos/300/420`);
        }
        
        console.log('\n🎉 Last Joe Burrow card fixed!');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixLastJoeBurrow(); 
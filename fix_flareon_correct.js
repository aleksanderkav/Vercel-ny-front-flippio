import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixFlareonWithCorrectImage() {
    console.log('🔄 Fixing Flareon PSA 9 with the CORRECT image...');
    
    try {
        // Update Flareon PSA 9 with the correct Flareon image (not Starmie!)
        const { data, error } = await supabase
            .from('cards_with_prices')
            .update({ 
                image_url: 'https://images.pokemontcg.io/pop3/2.png', // This is the correct Flareon image
                last_updated: new Date().toISOString()
            })
            .eq('name', 'Flareon PSA 9')
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Flareon PSA 9 image updated with CORRECT Flareon image!');
        console.log('New image URL: https://images.pokemontcg.io/pop3/2.png');
        
        // Also fix other Eeveelutions with correct images
        const eeveelutionUpdates = [
            { name: 'Jolteon PSA 8', image: 'https://images.pokemontcg.io/pop3/3.png' },
            { name: 'Vaporeon PSA 9', image: 'https://images.pokemontcg.io/pop3/4.png' },
            { name: 'Espeon GX PSA 8', image: 'https://images.pokemontcg.io/sm12/140.png' },
            { name: 'Umbreon GX PSA 9', image: 'https://images.pokemontcg.io/sm12/142.png' },
            { name: 'Leafeon GX PSA 10', image: 'https://images.pokemontcg.io/sm12/138.png' },
            { name: 'Glaceon GX PSA 9', image: 'https://images.pokemontcg.io/sm12/139.png' },
            { name: 'Sylveon GX PSA 10', image: 'https://images.pokemontcg.io/sm12/141.png' }
        ];
        
        for (const update of eeveelutionUpdates) {
            const { error: updateError } = await supabase
                .from('cards_with_prices')
                .update({ 
                    image_url: update.image,
                    last_updated: new Date().toISOString()
                })
                .eq('name', update.name);
            
            if (updateError) {
                console.error(`❌ Failed to update ${update.name}:`, updateError);
            } else {
                console.log(`✅ Updated ${update.name} with correct image: ${update.image}`);
            }
        }
        
        console.log('\n🎉 All Eeveelution images fixed with CORRECT images!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run the script
fixFlareonWithCorrectImage(); 
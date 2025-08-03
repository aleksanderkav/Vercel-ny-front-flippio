import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixFlareonImage() {
    console.log('🔄 Fixing Flareon PSA 9 image...');
    
    try {
        // Update Flareon PSA 9 with the correct image
        const { data, error } = await supabase
            .from('cards_with_prices')
            .update({ 
                image_url: 'https://images.pokemontcg.io/base1/64.png',
                last_updated: new Date().toISOString()
            })
            .eq('name', 'Flareon PSA 9')
            .select();
        
        if (error) {
            throw error;
        }
        
        console.log('✅ Flareon PSA 9 image updated successfully!');
        console.log('New image URL: https://images.pokemontcg.io/base1/64.png');
        
        // Also fix other Eeveelutions
        const eeveelutionUpdates = [
            { name: 'Jolteon PSA 8', image: 'https://images.pokemontcg.io/base1/65.png' },
            { name: 'Vaporeon PSA 9', image: 'https://images.pokemontcg.io/base1/67.png' },
            { name: 'Espeon GX PSA 8', image: 'https://images.pokemontcg.io/base1/63.png' },
            { name: 'Umbreon GX PSA 9', image: 'https://images.pokemontcg.io/base1/66.png' },
            { name: 'Leafeon GX PSA 10', image: 'https://images.pokemontcg.io/base1/68.png' },
            { name: 'Glaceon GX PSA 9', image: 'https://images.pokemontcg.io/base1/69.png' },
            { name: 'Sylveon GX PSA 10', image: 'https://images.pokemontcg.io/base1/70.png' }
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
                console.log(`✅ Updated ${update.name} with image: ${update.image}`);
            }
        }
        
        console.log('\n🎉 All Eeveelution images fixed!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run the script
fixFlareonImage(); 
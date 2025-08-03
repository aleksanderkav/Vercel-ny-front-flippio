import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixSportsPlaceholders() {
    console.log('🔄 Fixing sports cards with better placeholder images...');
    
    try {
        // Get all sports cards with Picsum placeholder images
        const { data: sportsCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .eq('category', 'Sports')
            .eq('image_url', 'https://picsum.photos/300/420')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${sportsCards.length} sports cards with Picsum placeholders to fix`);
        
        // Use better placeholder images for sports cards
        const sportsPlaceholders = {
            'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=420&fit=crop',
            'football': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=420&fit=crop',
            'baseball': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=420&fit=crop',
            'soccer': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&h=420&fit=crop'
        };
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of sportsCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                
                const nameLower = card.name.toLowerCase();
                let newImageUrl = null;
                
                // Determine sport type and use appropriate placeholder
                if (nameLower.includes('jordan') || nameLower.includes('lebron') || 
                    nameLower.includes('kobe') || nameLower.includes('curry') || 
                    nameLower.includes('giannis') || nameLower.includes('basketball')) {
                    newImageUrl = sportsPlaceholders.basketball;
                } else if (nameLower.includes('brady') || nameLower.includes('mahomes') || 
                           nameLower.includes('burrow') || nameLower.includes('football')) {
                    newImageUrl = sportsPlaceholders.football;
                } else {
                    // Default to basketball for other sports cards
                    newImageUrl = sportsPlaceholders.basketball;
                }
                
                // Update with better placeholder image
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
                    console.log(`✅ Updated ${card.name} with sports placeholder: ${newImageUrl}`);
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
        
        console.log('\n🎉 Sports cards updated with better placeholders!');
        console.log(`📊 Summary:`);
        console.log(`   - Total cards processed: ${processed}`);
        console.log(`   - Cards updated: ${updated}`);
        console.log(`   - Errors: ${errors}`);
        
        console.log('\n💡 Note: Using Unsplash sports images as placeholders - these are relevant sports photos.');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
fixSportsPlaceholders(); 
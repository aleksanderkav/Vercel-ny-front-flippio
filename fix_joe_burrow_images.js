import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixJoeBurrowAndSportsCards() {
    console.log('🔄 Fixing Joe Burrow and other sports cards with wrong images...');
    
    try {
        // Get all sports cards that have Pokemon images
        const { data: sportsCards, error } = await supabase
            .from('cards_with_prices')
            .select('id, name, category, image_url')
            .eq('category', 'Sports')
            .or('image_url.like.%pokemontcg.io%')
            .order('name');
        
        if (error) {
            throw error;
        }
        
        console.log(`📊 Found ${sportsCards.length} sports cards with Pokemon images to fix`);
        
        // Define correct sports card images
        const sportsCardImages = {
            'joe burrow': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'joe burrow 2020 mosaic': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'joe burrow 2020 optic': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'joe burrow 2020 select': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'joe burrow 2020 contenders': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'joe burrow rookie': 'https://www.tcdb.com/Images/Cards/Football/2020/Panini/327-JoeBurrow.jpg',
            'stephen curry': 'https://www.tcdb.com/Images/Cards/Basketball/2009-10/UpperDeck/200-StephenCurry.jpg',
            'kobe bryant': 'https://www.tcdb.com/Images/Cards/Basketball/1996-97/Topps/138-KobeBryant.jpg',
            'lebron james': 'https://www.tcdb.com/Images/Cards/Basketball/2003-04/UpperDeck/221-LeBronJames.jpg',
            'giannis': 'https://www.tcdb.com/Images/Cards/Basketball/2013-14/Panini/340-GiannisAntetokounmpo.jpg',
            'michael jordan': 'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg',
            'tom brady': 'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg',
            'patrick mahomes': 'https://www.tcdb.com/Images/Cards/Football/2017/Panini/327-PatrickMahomes.jpg'
        };
        
        let processed = 0;
        let updated = 0;
        let errors = 0;
        
        for (const card of sportsCards) {
            try {
                console.log(`\n🔄 Processing: ${card.name} (${card.category})`);
                console.log(`   Current image: ${card.image_url || 'None'}`);
                
                const nameLower = card.name.toLowerCase();
                let newImageUrl = null;
                
                // Find matching sports card image
                for (const [key, imageUrl] of Object.entries(sportsCardImages)) {
                    if (nameLower.includes(key)) {
                        newImageUrl = imageUrl;
                        console.log(`✅ Found match for "${key}": ${imageUrl}`);
                        break;
                    }
                }
                
                // If no specific match, use a generic sports card image
                if (!newImageUrl) {
                    if (nameLower.includes('basketball') || nameLower.includes('lebron') || nameLower.includes('jordan') || 
                        nameLower.includes('kobe') || nameLower.includes('curry') || nameLower.includes('giannis')) {
                        newImageUrl = 'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg';
                    } else if (nameLower.includes('football') || nameLower.includes('brady') || nameLower.includes('mahomes') || nameLower.includes('burrow')) {
                        newImageUrl = 'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg';
                    } else {
                        // Generic sports card
                        newImageUrl = 'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg';
                    }
                    console.log(`✅ Using generic sports image: ${newImageUrl}`);
                }
                
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
                        console.log(`✅ Updated ${card.name} with sports image: ${newImageUrl}`);
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
        
        console.log('\n🎉 Sports card image fixes completed!');
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
fixJoeBurrowAndSportsCards(); 
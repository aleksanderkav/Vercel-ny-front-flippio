import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jvkxyjycpomtzfngocge.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Simulate eBay scraping for card data and images
 * In a real implementation, this would use a web scraping library like Puppeteer or Cheerio
 */
async function simulateEbayScraping(cardName) {
    console.log(`🔍 Simulating eBay scraping for: ${cardName}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Extract information from card name using regex patterns
    const nameLower = cardName.toLowerCase();
    
    // Parse grading (PSA, BGS, etc.)
    const gradingMatch = cardName.match(/(PSA|BGS|CGC|SGC)\s*(\d+)/i);
    const grading = gradingMatch ? `${gradingMatch[1]} ${gradingMatch[2]}` : 'Ungraded';
    
    // Parse set name
    const setPatterns = [
        /(base set|base set 2|jungle|fossil|team rocket|gym heroes|gym challenge)/i,
        /(neo genesis|neo discovery|neo revelation|neo destiny)/i,
        /(ex ruby & sapphire|ex sandstorm|ex dragon|ex team magma vs team aqua)/i,
        /(black & white|next destinies|dark explorers|dragons exalted)/i,
        /(sun & moon|guardians rising|crimson invasion|ultra prism)/i,
        /(sword & shield|rebel clash|darkness ablaze|champions path)/i
    ];
    
    let set_name = 'Unknown Set';
    for (const pattern of setPatterns) {
        const match = cardName.match(pattern);
        if (match) {
            set_name = match[1];
            break;
        }
    }
    
    // Determine card type and category with better detection
    let card_type = 'Other';
    let category = 'Other';
    
    // Pokemon detection (much more comprehensive)
    const pokemonKeywords = [
        'pikachu', 'charizard', 'blastoise', 'venusaur', 'mewtwo', 'mew', 'rayquaza',
        'lugia', 'ho-oh', 'giratina', 'arceus', 'dialga', 'palkia', 'reshiram', 'zekrom',
        'xerneas', 'yveltal', 'zygarde', 'solgaleo', 'lunala', 'necrozma', 'zacian', 'zamazenta',
        'calyrex', 'miraidon', 'koraidon', 'sylveon', 'umbreon', 'espeon', 'vaporeon', 'jolteon',
        'flareon', 'leafeon', 'glaceon', 'eevee', 'snorlax', 'gyarados', 'dragonite', 'tyranitar',
        'metagross', 'salamence', 'garchomp', 'lucario', 'garchomp', 'gengar', 'alakazam',
        'machamp', 'golem', 'ninetales', 'raichu', 'nidoking', 'nidoqueen', 'vileplume',
        'victreebel', 'tentacruel', 'muk', 'weezing', 'rapidash', 'slowbro', 'magneton',
        'dodrio', 'dewgong', 'muk', 'cloyster', 'gastly', 'haunter', 'onix', 'drowzee',
        'hypno', 'krabby', 'kingler', 'voltorb', 'electrode', 'exeggcute', 'exeggutor',
        'cubone', 'marowak', 'hitmonlee', 'hitmonchan', 'lickitung', 'koffing', 'rhyhorn',
        'rhydon', 'chansey', 'tangela', 'kangaskhan', 'horsea', 'seadra', 'goldeen', 'seaking',
        'staryu', 'starmie', 'mr. mime', 'scyther', 'jynx', 'electabuzz', 'magmar', 'pinsir',
        'tauros', 'magikarp', 'lapras', 'ditto', 'vaporeon', 'jolteon', 'flareon', 'omanyte',
        'omastar', 'kabuto', 'kabutops', 'aerodactyl', 'snorlax', 'articuno', 'zapdos', 'moltres',
        'dratini', 'dragonair', 'dragonite', 'mewtwo', 'mew', 'chikorita', 'bayleef', 'meganium',
        'cyndaquil', 'quilava', 'typhlosion', 'totodile', 'croconaw', 'feraligatr', 'sentret',
        'furret', 'hoothoot', 'noctowl', 'ledyba', 'ledian', 'spinarak', 'ariados', 'crobat',
        'chinchou', 'lanturn', 'pichu', 'cleffa', 'igglybuff', 'togepi', 'togetic', 'natu',
        'xatu', 'mareep', 'flaaffy', 'ampharos', 'bellossom', 'marill', 'azumarill', 'sudowoodo',
        'politoed', 'hoppip', 'skiploom', 'jumpluff', 'aipom', 'sunkern', 'sunflora', 'yanma',
        'wooper', 'quagsire', 'espeon', 'umbreon', 'murkrow', 'slowking', 'misdreavus', 'unown',
        'wobbuffet', 'girafarig', 'pineco', 'forretress', 'dunsparce', 'gligar', 'steelix',
        'snubbull', 'granbull', 'qwilfish', 'scizor', 'shuckle', 'heracross', 'sneasel',
        'teddiursa', 'ursaring', 'slugma', 'magcargo', 'swinub', 'piloswine', 'corsola',
        'remoraid', 'octillery', 'delibird', 'mantine', 'skarmory', 'houndour', 'houndoom',
        'kingdra', 'phanpy', 'donphan', 'porygon2', 'stantler', 'smeargle', 'tyrogue',
        'hitmontop', 'smoochum', 'elekid', 'magby', 'miltank', 'blissey', 'raikou', 'entei',
        'suicune', 'larvitar', 'pupitar', 'tyranitar', 'lugia', 'ho-oh', 'celebi', 'treecko',
        'grovyle', 'sceptile', 'torchic', 'combusken', 'blaziken', 'mudkip', 'marshtomp',
        'swampert', 'poochyena', 'mightyena', 'zigzagoon', 'linoone', 'wurmple', 'silcoon',
        'beautifly', 'cascoon', 'dustox', 'lotad', 'lombre', 'ludicolo', 'seedot', 'nuzleaf',
        'shiftry', 'taillow', 'swellow', 'wingull', 'pelipper', 'ralts', 'kirlia', 'gardevoir',
        'surskit', 'masquerain', 'shroomish', 'breloom', 'slakoth', 'vigoroth', 'slaking',
        'nincada', 'ninjask', 'shedinja', 'whismur', 'loudred', 'exploud', 'makuhita',
        'hariyama', 'azurill', 'nosepass', 'skitty', 'delcatty', 'sableye', 'mawile',
        'aron', 'lairon', 'aggron', 'meditite', 'medicham', 'electrike', 'manectric',
        'plusle', 'minun', 'volbeat', 'illumise', 'roselia', 'gulpin', 'swalot', 'carvanha',
        'sharpedo', 'wailmer', 'wailord', 'numel', 'camerupt', 'torkoal', 'spoink', 'grumpig',
        'spinda', 'trapinch', 'vibrava', 'flygon', 'cacnea', 'cacturne', 'swablu', 'altaria',
        'zangoose', 'seviper', 'lunatone', 'solrock', 'barboach', 'whiscash', 'corphish',
        'crawdaunt', 'baltoy', 'claydol', 'lileep', 'cradily', 'anorith', 'armaldo',
        'feebas', 'milotic', 'castform', 'kecleon', 'shuppet', 'banette', 'duskull',
        'dusclops', 'tropius', 'chimecho', 'absol', 'wynaut', 'snorunt', 'glalie',
        'spheal', 'sealeo', 'walrein', 'clamperl', 'huntail', 'gorebyss', 'relicanth',
        'luvdisc', 'bagon', 'shelgon', 'salamence', 'beldum', 'metang', 'metagross',
        'regirock', 'regice', 'registeel', 'latias', 'latios', 'kyogre', 'groudon',
        'rayquaza', 'jirachi', 'deoxys', 'turtwig', 'grotle', 'torterra', 'chimchar',
        'monferno', 'infernape', 'piplup', 'prinplup', 'empoleon', 'starly', 'staravia',
        'staraptor', 'bidoof', 'bibarel', 'kricketot', 'kricketune', 'shinx', 'luxio',
        'luxray', 'budew', 'roserade', 'cranidos', 'rampardos', 'shieldon', 'bastiodon',
        'burmy', 'wormadam', 'mothim', 'combee', 'vespiquen', 'pachirisu', 'buizel',
        'floatzel', 'cherubi', 'cherrim', 'shellos', 'gastrodon', 'ambipom', 'drifloon',
        'drifblim', 'buneary', 'lopunny', 'mismagius', 'honchkrow', 'glameow', 'purugly',
        'chingling', 'stunky', 'skuntank', 'bronzor', 'bronzong', 'bonsly', 'mime jr.',
        'happiny', 'chatot', 'spiritomb', 'gible', 'gabite', 'garchomp', 'munchlax',
        'riolu', 'lucario', 'hippopotas', 'hippowdon', 'skorupi', 'drapion', 'croagunk',
        'toxicroak', 'carnivine', 'finneon', 'lumineon', 'mantyke', 'snover', 'abomasnow',
        'weavile', 'magnezone', 'lickilicky', 'rhyperior', 'tangrowth', 'electivire',
        'magmortar', 'togekiss', 'yanmega', 'leafeon', 'glaceon', 'gliscor', 'mamoswine',
        'porygon-z', 'gallade', 'probopass', 'dusknoir', 'froslass', 'rotom', 'uxie',
        'mesprit', 'azelf', 'dialga', 'palkia', 'heatran', 'regigigas', 'giratina',
        'cresselia', 'phione', 'manaphy', 'darkrai', 'shaymin', 'arceus', 'victini',
        'snivy', 'servine', 'serperior', 'tepig', 'pignite', 'emboar', 'oshawott',
        'dewott', 'samurott', 'patrat', 'watchog', 'lillipup', 'herdier', 'stoutland',
        'purrloin', 'liepard', 'pansage', 'simisage', 'pansear', 'simisear', 'panpour',
        'simipour', 'munna', 'musharna', 'pidove', 'tranquill', 'unfezant', 'blitzle',
        'zebstrika', 'roggenrola', 'boldore', 'gigalith', 'woobat', 'swoobat', 'drilbur',
        'excadrill', 'audino', 'timburr', 'gurdurr', 'conkeldurr', 'tympole', 'palpitoad',
        'seismitoad', 'throh', 'sawk', 'sewaddle', 'swadloon', 'leavanny', 'venipede',
        'whirlipede', 'scolipede', 'cottonee', 'whimsicott', 'petilil', 'lilligant',
        'basculin', 'sandile', 'krokorok', 'krookodile', 'darumaka', 'darmanitan',
        'maractus', 'dwebble', 'crustle', 'scraggy', 'scrafty', 'sigilyph', 'yamask',
        'cofagrigus', 'tirtouga', 'carracosta', 'archen', 'archeops', 'trubbish',
        'garbodor', 'zorua', 'zoroark', 'minccino', 'cinccino', 'gothita', 'gothorita',
        'gothitelle', 'solosis', 'duosion', 'reuniclus', 'ducklett', 'swanna', 'vanillite',
        'vanillish', 'vanilluxe', 'deerling', 'sawsbuck', 'emolga', 'karrablast',
        'escavalier', 'foongus', 'amoonguss', 'frillish', 'jellicent', 'alomomola',
        'joltik', 'galvantula', 'ferroseed', 'ferrothorn', 'klink', 'klang', 'klinklang',
        'tynamo', 'eelektrik', 'eelektross', 'elgyem', 'beheeyem', 'litwick', 'lampent',
        'chandelure', 'axew', 'fraxure', 'haxorus', 'cubchoo', 'beartic', 'cryogonal',
        'shelmet', 'accelgor', 'stunfisk', 'mienfoo', 'mienshao', 'druddigon', 'golett',
        'golurk', 'pawniard', 'bisharp', 'bouffalant', 'rufflet', 'braviary', 'vullaby',
        'mandibuzz', 'heatmor', 'durant', 'deino', 'zweilous', 'hydreigon', 'larvesta',
        'volcarona', 'cobalion', 'terrakion', 'virizion', 'tornadus', 'thundurus',
        'reshiram', 'zekrom', 'landorus', 'kyurem', 'keldeo', 'meloetta', 'genesect',
        'chespin', 'quilladin', 'chesnaught', 'fennekin', 'braixen', 'delphox', 'froakie',
        'frogadier', 'greninja', 'bunnelby', 'diggersby', 'fletchling', 'fletchinder',
        'talonflame', 'scatterbug', 'spewpa', 'vivillon', 'litleo', 'pyroar', 'flabebe',
        'floette', 'florges', 'skiddo', 'gogoat', 'pancham', 'pangoro', 'furfrou',
        'espurr', 'meowstic', 'honedge', 'doublade', 'aegislash', 'spritzee', 'aromatisse',
        'swirlix', 'slurpuff', 'inkay', 'malamar', 'binacle', 'barbaracle', 'skrelp',
        'dragalge', 'clauncher', 'clawitzer', 'helioptile', 'heliolisk', 'tyrunt',
        'tyrantrum', 'amaura', 'aurorus', 'sylveon', 'hawlucha', 'dedenne', 'carbink',
        'goomy', 'sliggoo', 'goodra', 'klefki', 'phantump', 'trevenant', 'pumpkaboo',
        'gourgeist', 'bergmite', 'avalugg', 'noibat', 'noivern', 'xerneas', 'yveltal',
        'zygarde', 'diancie', 'hoopa', 'volcanion', 'rowlet', 'dartrix', 'decidueye',
        'litten', 'torracat', 'incineroar', 'popplio', 'brionne', 'primarina', 'pikipek',
        'trumbeak', 'toucannon', 'yungoos', 'gumshoos', 'grubbin', 'charjabug', 'vikavolt',
        'crabrawler', 'crabominable', 'oricorio', 'cutiefly', 'ribombee', 'rockruff',
        'lycanroc', 'wishiwashi', 'mareanie', 'toxapex', 'mudbray', 'mudsdale', 'dewpider',
        'araquanid', 'fomantis', 'lurantis', 'morelull', 'shiinotic', 'salandit',
        'salazzle', 'stufful', 'bewear', 'bounsweet', 'steenee', 'tsareena', 'comfey',
        'oranguru', 'passimian', 'wimpod', 'golisopod', 'sandygast', 'palossand',
        'pyukumuku', 'type: null', 'silvally', 'minior', 'komala', 'turtonator',
        'togedemaru', 'mimikyu', 'bruxish', 'drampa', 'dhelmise', 'jangmo-o', 'hakamo-o',
        'kommo-o', 'tapu koko', 'tapu lele', 'tapu bulu', 'tapu fini', 'cosmog',
        'cosmoem', 'solgaleo', 'lunala', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree',
        'celesteela', 'kartana', 'guzzlord', 'necrozma', 'magearna', 'marshadow',
        'poipole', 'naganadel', 'stakataka', 'blacephalon', 'zeraora', 'meltan',
        'melmetal', 'grookey', 'thwackey', 'rillaboom', 'scorbunny', 'raboot', 'cinderace',
        'sobble', 'drizzile', 'inteleon', 'skwovet', 'greedent', 'rookidee', 'corvisquire',
        'corviknight', 'blipbug', 'dottler', 'orbeetle', 'nickit', 'thievul', 'gossifleur',
        'eldegoss', 'wooloo', 'dubwool', 'chewtle', 'drednaw', 'yamper', 'boltund',
        'rolycoly', 'carkol', 'coalossal', 'applin', 'flapple', 'appletun', 'silicobra',
        'sandaconda', 'cramorant', 'arrokuda', 'barraskewda', 'toxel', 'toxtricity',
        'sizzlipede', 'centiskorch', 'clobbopus', 'grapploct', 'sinistea', 'polteageist',
        'hatenna', 'hattrem', 'hatterene', 'impidimp', 'morgrem', 'grimmsnarl', 'obstagoon',
        'perrserker', 'cursola', 'sirfetch\'d', 'mr. rime', 'runerigus', 'milcery',
        'alcremie', 'falinks', 'pincurchin', 'snom', 'frosmoth', 'stonjourner', 'eiscue',
        'indeedee', 'morpeko', 'cufant', 'copperajah', 'dracozolt', 'arctozolt', 'dracovish',
        'arctovish', 'duraludon', 'dreepy', 'drakloak', 'dragapult', 'zacian', 'zamazenta',
        'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki', 'regidrago', 'glastrier',
        'spectrier', 'calyrex', 'sprigatito', 'floragato', 'meowscarada', 'fuecoco',
        'crocalor', 'skeledirge', 'quaxly', 'quaxwell', 'quaquaval', 'lechonk', 'oinkologne',
        'tarountula', 'spidops', 'nymble', 'lokix', 'pawmi', 'pawmo', 'pawmot', 'tandemaus',
        'maushold', 'fidough', 'dachsbun', 'smoliv', 'dolliv', 'arboliva', 'squawkabilly',
        'nacli', 'naclstack', 'garganacl', 'charcadet', 'armarouge', 'ceruledge', 'tadbulb',
        'bellibolt', 'wattrel', 'kilowattrel', 'maschiff', 'mabosstiff', 'shroodle',
        'grafaiai', 'bramblin', 'brambleghast', 'toedscool', 'toedscruel', 'klawf',
        'capsakid', 'scovillain', 'rellor', 'rabsca', 'flittle', 'espathra', 'tinkatink',
        'tinkatuff', 'tinkaton', 'wiglett', 'wugtrio', 'bombirdier', 'finizen', 'palafin',
        'varoom', 'revavroom', 'cyclizar', 'orthworm', 'glimmet', 'glimmora', 'greavard',
        'houndstone', 'flamigo', 'cetoddle', 'cetitan', 'veluza', 'dondozo', 'tatsugiri',
        'annihilape', 'clodsire', 'farigiraf', 'dudunsparce', 'kingambit', 'great tusk',
        'scream tail', 'brute bonnet', 'flutter mane', 'slither wing', 'sandy shocks',
        'iron threads', 'iron bundle', 'iron hands', 'iron jugulis', 'iron moth',
        'iron thorns', 'frigibax', 'arctibax', 'baxcalibur', 'gimmighoul', 'gholdengo',
        'wo-chien', 'chien-pao', 'ting-lu', 'chi-yu', 'roaring moon', 'iron valiant',
        'koraidon', 'miraidon', 'walking wake', 'iron leaves', 'okidogi', 'munkidori',
        'fezandipiti', 'ogerpon', 'terapagos', 'pecharunt', 'gx', 'v', 'vmax', 'vstar',
        'ex', 'break', 'prism', 'tag team', 'rainbow', 'gold', 'secret', 'ultra', 'hyper'
    ];
    
         // Check if card name contains Pokemon keywords (including common misspellings)
     const hasPokemonKeyword = pokemonKeywords.some(keyword => nameLower.includes(keyword));
     
     // Common Pokemon misspellings
     const pokemonMisspellings = [
         'pikatchu', 'piketchu', 'charishard', 'charicard', 'blastoise', 'venusaur',
         'mewtwo', 'mew', 'rayquaza', 'lugia', 'giratina', 'arceus', 'dialga', 'palkia',
         'reshiram', 'zekrom', 'xerneas', 'yveltal', 'zygarde', 'solgaleo', 'lunala',
         'necrozma', 'zacian', 'zamazenta', 'calyrex', 'miraidon', 'koraidon', 'sylveon',
         'umbreon', 'espeon', 'vaporeon', 'jolteon', 'flareon', 'leafeon', 'glaceon',
         'eevee', 'snorlax', 'gyarados', 'dragonite', 'tyranitar', 'metagross', 'salamence',
         'garchomp', 'lucario', 'gengar', 'alakazam', 'machamp', 'golem', 'ninetales',
         'raichu', 'nidoking', 'nidoqueen', 'vileplume', 'victreebel', 'tentacruel',
         'muk', 'weezing', 'rapidash', 'slowbro', 'magneton', 'dodrio', 'dewgong',
         'cloyster', 'gastly', 'haunter', 'onix', 'drowzee', 'hypno', 'krabby',
         'kingler', 'voltorb', 'electrode', 'exeggcute', 'exeggutor', 'cubone',
         'marowak', 'hitmonlee', 'hitmonchan', 'lickitung', 'koffing', 'rhyhorn',
         'rhydon', 'chansey', 'tangela', 'kangaskhan', 'horsea', 'seadra', 'goldeen',
         'seaking', 'staryu', 'starmie', 'mr. mime', 'scyther', 'jynx', 'electabuzz',
         'magmar', 'pinsir', 'tauros', 'magikarp', 'lapras', 'ditto', 'omanyte',
         'omastar', 'kabuto', 'kabutops', 'aerodactyl', 'articuno', 'zapdos', 'moltres',
         'dratini', 'dragonair', 'chikorita', 'bayleef', 'meganium', 'cyndaquil',
         'quilava', 'typhlosion', 'totodile', 'croconaw', 'feraligatr', 'sentret',
         'furret', 'hoothoot', 'noctowl', 'ledyba', 'ledian', 'spinarak', 'ariados',
         'crobat', 'chinchou', 'lanturn', 'pichu', 'cleffa', 'igglybuff', 'togepi',
         'togetic', 'natu', 'xatu', 'mareep', 'flaaffy', 'ampharos', 'bellossom',
         'marill', 'azumarill', 'sudowoodo', 'politoed', 'hoppip', 'skiploom',
         'jumpluff', 'aipom', 'sunkern', 'sunflora', 'yanma', 'wooper', 'quagsire',
         'murkrow', 'slowking', 'misdreavus', 'unown', 'wobbuffet', 'girafarig',
         'pineco', 'forretress', 'dunsparce', 'gligar', 'steelix', 'snubbull',
         'granbull', 'qwilfish', 'scizor', 'shuckle', 'heracross', 'sneasel',
         'teddiursa', 'ursaring', 'slugma', 'magcargo', 'swinub', 'piloswine',
         'corsola', 'remoraid', 'octillery', 'delibird', 'mantine', 'skarmory',
         'houndour', 'houndoom', 'kingdra', 'phanpy', 'donphan', 'porygon2',
         'stantler', 'smeargle', 'tyrogue', 'hitmontop', 'smoochum', 'elekid',
         'magby', 'miltank', 'blissey', 'raikou', 'entei', 'suicune', 'larvitar',
         'pupitar', 'celebi', 'treecko', 'grovyle', 'sceptile', 'torchic',
         'combusken', 'blaziken', 'mudkip', 'marshtomp', 'swampert', 'poochyena',
         'mightyena', 'zigzagoon', 'linoone', 'wurmple', 'silcoon', 'beautifly',
         'cascoon', 'dustox', 'lotad', 'lombre', 'ludicolo', 'seedot', 'nuzleaf',
         'shiftry', 'taillow', 'swellow', 'wingull', 'pelipper', 'ralts', 'kirlia',
         'gardevoir', 'surskit', 'masquerain', 'shroomish', 'breloom', 'slakoth',
         'vigoroth', 'slaking', 'nincada', 'ninjask', 'shedinja', 'whismur',
         'loudred', 'exploud', 'makuhita', 'hariyama', 'azurill', 'nosepass',
         'skitty', 'delcatty', 'sableye', 'mawile', 'aron', 'lairon', 'aggron',
         'meditite', 'medicham', 'electrike', 'manectric', 'plusle', 'minun',
         'volbeat', 'illumise', 'roselia', 'gulpin', 'swalot', 'carvanha',
         'sharpedo', 'wailmer', 'wailord', 'numel', 'camerupt', 'torkoal',
         'spoink', 'grumpig', 'spinda', 'trapinch', 'vibrava', 'flygon',
         'cacnea', 'cacturne', 'swablu', 'altaria', 'zangoose', 'seviper',
         'lunatone', 'solrock', 'barboach', 'whiscash', 'corphish', 'crawdaunt',
         'baltoy', 'claydol', 'lileep', 'cradily', 'anorith', 'armaldo',
         'feebas', 'milotic', 'castform', 'kecleon', 'shuppet', 'banette',
         'duskull', 'dusclops', 'tropius', 'chimecho', 'absol', 'wynaut',
         'snorunt', 'glalie', 'spheal', 'sealeo', 'walrein', 'clamperl',
         'huntail', 'gorebyss', 'relicanth', 'luvdisc', 'bagon', 'shelgon',
         'beldum', 'metang', 'regirock', 'regice', 'registeel', 'latias',
         'latios', 'kyogre', 'groudon', 'jirachi', 'deoxys', 'turtwig',
         'grotle', 'torterra', 'chimchar', 'monferno', 'infernape', 'piplup',
         'prinplup', 'empoleon', 'starly', 'staravia', 'staraptor', 'bidoof',
         'bibarel', 'kricketot', 'kricketune', 'shinx', 'luxio', 'luxray',
         'budew', 'roserade', 'cranidos', 'rampardos', 'shieldon', 'bastiodon',
         'burmy', 'wormadam', 'mothim', 'combee', 'vespiquen', 'pachirisu',
         'buizel', 'floatzel', 'cherubi', 'cherrim', 'shellos', 'gastrodon',
         'ambipom', 'drifloon', 'drifblim', 'buneary', 'lopunny', 'mismagius',
         'honchkrow', 'glameow', 'purugly', 'chingling', 'stunky', 'skuntank',
         'bronzor', 'bronzong', 'bonsly', 'mime jr.', 'happiny', 'chatot',
         'spiritomb', 'gible', 'gabite', 'munchlax', 'riolu', 'hippopotas',
         'hippowdon', 'skorupi', 'drapion', 'croagunk', 'toxicroak', 'carnivine',
         'finneon', 'lumineon', 'mantyke', 'snover', 'abomasnow', 'weavile',
         'magnezone', 'lickilicky', 'rhyperior', 'tangrowth', 'electivire',
         'magmortar', 'togekiss', 'yanmega', 'gliscor', 'mamoswine', 'porygon-z',
         'gallade', 'probopass', 'dusknoir', 'froslass', 'rotom', 'uxie',
         'mesprit', 'azelf', 'heatran', 'regigigas', 'cresselia', 'phione',
         'manaphy', 'darkrai', 'shaymin', 'victini', 'snivy', 'servine',
         'serperior', 'tepig', 'pignite', 'emboar', 'oshawott', 'dewott',
         'samurott', 'patrat', 'watchog', 'lillipup', 'herdier', 'stoutland',
         'purrloin', 'liepard', 'pansage', 'simisage', 'pansear', 'simisear',
         'panpour', 'simipour', 'munna', 'musharna', 'pidove', 'tranquill',
         'unfezant', 'blitzle', 'zebstrika', 'roggenrola', 'boldore', 'gigalith',
         'woobat', 'swoobat', 'drilbur', 'excadrill', 'audino', 'timburr',
         'gurdurr', 'conkeldurr', 'tympole', 'palpitoad', 'seismitoad', 'throh',
         'sawk', 'sewaddle', 'swadloon', 'leavanny', 'venipede', 'whirlipede',
         'scolipede', 'cottonee', 'whimsicott', 'petilil', 'lilligant',
         'basculin', 'sandile', 'krokorok', 'krookodile', 'darumaka', 'darmanitan',
         'maractus', 'dwebble', 'crustle', 'scraggy', 'scrafty', 'sigilyph',
         'yamask', 'cofagrigus', 'tirtouga', 'carracosta', 'archen', 'archeops',
         'trubbish', 'garbodor', 'zorua', 'zoroark', 'minccino', 'cinccino',
         'gothita', 'gothorita', 'gothitelle', 'solosis', 'duosion', 'reuniclus',
         'ducklett', 'swanna', 'vanillite', 'vanillish', 'vanilluxe', 'deerling',
         'sawsbuck', 'emolga', 'karrablast', 'escavalier', 'foongus', 'amoonguss',
         'frillish', 'jellicent', 'alomomola', 'joltik', 'galvantula', 'ferroseed',
         'ferrothorn', 'klink', 'klang', 'klinklang', 'tynamo', 'eelektrik',
         'eelektross', 'elgyem', 'beheeyem', 'litwick', 'lampent', 'chandelure',
         'axew', 'fraxure', 'haxorus', 'cubchoo', 'beartic', 'cryogonal',
         'shelmet', 'accelgor', 'stunfisk', 'mienfoo', 'mienshao', 'druddigon',
         'golett', 'golurk', 'pawniard', 'bisharp', 'bouffalant', 'rufflet',
         'braviary', 'vullaby', 'mandibuzz', 'heatmor', 'durant', 'deino',
         'zweilous', 'hydreigon', 'larvesta', 'volcarona', 'cobalion', 'terrakion',
         'virizion', 'tornadus', 'thundurus', 'landorus', 'kyurem', 'keldeo',
         'meloetta', 'genesect', 'chespin', 'quilladin', 'chesnaught', 'fennekin',
         'braixen', 'delphox', 'froakie', 'frogadier', 'greninja', 'bunnelby',
         'diggersby', 'fletchling', 'fletchinder', 'talonflame', 'scatterbug',
         'spewpa', 'vivillon', 'litleo', 'pyroar', 'flabebe', 'floette',
         'florges', 'skiddo', 'gogoat', 'pancham', 'pangoro', 'furfrou',
         'espurr', 'meowstic', 'honedge', 'doublade', 'aegislash', 'spritzee',
         'aromatisse', 'swirlix', 'slurpuff', 'inkay', 'malamar', 'binacle',
         'barbaracle', 'skrelp', 'dragalge', 'clauncher', 'clawitzer', 'helioptile',
         'heliolisk', 'tyrunt', 'tyrantrum', 'amaura', 'aurorus', 'hawlucha',
         'dedenne', 'carbink', 'goomy', 'sliggoo', 'goodra', 'klefki', 'phantump',
         'trevenant', 'pumpkaboo', 'gourgeist', 'bergmite', 'avalugg', 'noibat',
         'noivern', 'diancie', 'hoopa', 'volcanion', 'rowlet', 'dartrix',
         'decidueye', 'litten', 'torracat', 'incineroar', 'popplio', 'brionne',
         'primarina', 'pikipek', 'trumbeak', 'toucannon', 'yungoos', 'gumshoos',
         'grubbin', 'charjabug', 'vikavolt', 'crabrawler', 'crabominable', 'oricorio',
         'cutiefly', 'ribombee', 'rockruff', 'lycanroc', 'wishiwashi', 'mareanie',
         'toxapex', 'mudbray', 'mudsdale', 'dewpider', 'araquanid', 'fomantis',
         'lurantis', 'morelull', 'shiinotic', 'salandit', 'salazzle', 'stufful',
         'bewear', 'bounsweet', 'steenee', 'tsareena', 'comfey', 'oranguru',
         'passimian', 'wimpod', 'golisopod', 'sandygast', 'palossand', 'pyukumuku',
         'type: null', 'silvally', 'minior', 'komala', 'turtonator', 'togedemaru',
         'mimikyu', 'bruxish', 'drampa', 'dhelmise', 'jangmo-o', 'hakamo-o',
         'kommo-o', 'tapu koko', 'tapu lele', 'tapu bulu', 'tapu fini', 'cosmog',
         'cosmoem', 'nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela',
         'kartana', 'guzzlord', 'magearna', 'marshadow', 'poipole', 'naganadel',
         'stakataka', 'blacephalon', 'zeraora', 'meltan', 'melmetal', 'grookey',
         'thwackey', 'rillaboom', 'scorbunny', 'raboot', 'cinderace', 'sobble',
         'drizzile', 'inteleon', 'skwovet', 'greedent', 'rookidee', 'corvisquire',
         'corviknight', 'blipbug', 'dottler', 'orbeetle', 'nickit', 'thievul',
         'gossifleur', 'eldegoss', 'wooloo', 'dubwool', 'chewtle', 'drednaw',
         'yamper', 'boltund', 'rolycoly', 'carkol', 'coalossal', 'applin',
         'flapple', 'appletun', 'silicobra', 'sandaconda', 'cramorant', 'arrokuda',
         'barraskewda', 'toxel', 'toxtricity', 'sizzlipede', 'centiskorch',
         'clobbopus', 'grapploct', 'sinistea', 'polteageist', 'hatenna', 'hattrem',
         'hatterene', 'impidimp', 'morgrem', 'grimmsnarl', 'obstagoon', 'perrserker',
         'cursola', 'sirfetch\'d', 'mr. rime', 'runerigus', 'milcery', 'alcremie',
         'falinks', 'pincurchin', 'snom', 'frosmoth', 'stonjourner', 'eiscue',
         'indeedee', 'morpeko', 'cufant', 'copperajah', 'dracozolt', 'arctozolt',
         'dracovish', 'arctovish', 'duraludon', 'dreepy', 'drakloak', 'dragapult',
         'eternatus', 'kubfu', 'urshifu', 'zarude', 'regieleki', 'regidrago',
         'glastrier', 'spectrier', 'sprigatito', 'floragato', 'meowscarada',
         'fuecoco', 'crocalor', 'skeledirge', 'quaxly', 'quaxwell', 'quaquaval',
         'lechonk', 'oinkologne', 'tarountula', 'spidops', 'nymble', 'lokix',
         'pawmi', 'pawmo', 'pawmot', 'tandemaus', 'maushold', 'fidough', 'dachsbun',
         'smoliv', 'dolliv', 'arboliva', 'squawkabilly', 'nacli', 'naclstack',
         'garganacl', 'charcadet', 'armarouge', 'ceruledge', 'tadbulb', 'bellibolt',
         'wattrel', 'kilowattrel', 'maschiff', 'mabosstiff', 'shroodle', 'grafaiai',
         'bramblin', 'brambleghast', 'toedscool', 'toedscruel', 'klawf', 'capsakid',
         'scovillain', 'rellor', 'rabsca', 'flittle', 'espathra', 'tinkatink',
         'tinkatuff', 'tinkaton', 'wiglett', 'wugtrio', 'bombirdier', 'finizen',
         'palafin', 'varoom', 'revavroom', 'cyclizar', 'orthworm', 'glimmet',
         'glimmora', 'greavard', 'houndstone', 'flamigo', 'cetoddle', 'cetitan',
         'veluza', 'dondozo', 'tatsugiri', 'annihilape', 'clodsire', 'farigiraf',
         'dudunsparce', 'kingambit', 'great tusk', 'scream tail', 'brute bonnet',
         'flutter mane', 'slither wing', 'sandy shocks', 'iron threads', 'iron bundle',
         'iron hands', 'iron jugulis', 'iron moth', 'iron thorns', 'frigibax',
         'arctibax', 'baxcalibur', 'gimmighoul', 'gholdengo', 'wo-chien', 'chien-pao',
         'ting-lu', 'chi-yu', 'roaring moon', 'iron valiant', 'walking wake',
         'iron leaves', 'okidogi', 'munkidori', 'fezandipiti', 'ogerpon', 'terapagos',
         'pecharunt', 'abra', 'ekans', 'arbok', 'jiggelypuff', 'snorlax'
     ];
     
     const hasPokemonMisspelling = pokemonMisspellings.some(misspelling => nameLower.includes(misspelling));
     
     if (hasPokemonKeyword || hasPokemonMisspelling || nameLower.includes('pokemon') || nameLower.includes('pokémon')) {
         card_type = 'Pokémon';
         category = 'Pokemon';
     } else if (nameLower.includes('jordan') || nameLower.includes('lebron') || nameLower.includes('brady') || 
                nameLower.includes('messi') || nameLower.includes('ronaldo') || nameLower.includes('baseball') ||
                nameLower.includes('basketball') || nameLower.includes('football') || nameLower.includes('soccer')) {
         card_type = 'Sports';
         category = 'Sports';
     } else if (nameLower.includes('black lotus') || nameLower.includes('blue eyes') || 
                nameLower.includes('magic') || nameLower.includes('mtg') || nameLower.includes('yugioh')) {
         card_type = 'Magic: The Gathering';
         category = 'Gaming';
     }
    
    // Generate realistic price data
    const basePrice = Math.random() * 1000 + 50;
    const priceVariation = basePrice * 0.2;
    const latest_price = Math.round((basePrice + (Math.random() - 0.5) * priceVariation) * 100) / 100;
    
    // Generate year (mostly 1999-2023 for Pokemon)
    const year = category === 'Pokemon' ? 
        (Math.random() > 0.7 ? 2020 + Math.floor(Math.random() * 4) : 1999 + Math.floor(Math.random() * 20)) :
        1990 + Math.floor(Math.random() * 30);
    
    // Determine rarity
    const rarities = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Secret Rare'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    // Generate serial number for graded cards
    const serial_number = grading !== 'Ungraded' ? 
        `${Math.floor(Math.random() * 900000) + 100000}` : null;
    
    // Simulate eBay image scraping
    const image_url = await simulateEbayImageScraping(cardName);
    
    return {
        latest_price,
        price_entries: Math.floor(Math.random() * 50) + 5,
        category,
        card_type,
        set_name,
        year,
        grading,
        rarity,
        serial_number,
        image_url,
        source: 'eBay'
    };
}

/**
 * Simulate eBay image scraping
 * In a real implementation, this would scrape actual eBay listing images
 */
async function simulateEbayImageScraping(cardName) {
    console.log(`🖼️ Simulating eBay image scraping for: ${cardName}`);
    
    // Simulate network delay for image scraping
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate realistic placeholder image URLs using Picsum Photos
    const nameLower = cardName.toLowerCase();
    const randomId = Math.floor(Math.random() * 1000);
    
    // Create placeholder image URLs based on card characteristics
    // Using Picsum Photos for realistic placeholder images
    if (nameLower.includes('charizard')) {
        return `https://picsum.photos/400/600?random=${randomId}&blur=1`;
    } else if (nameLower.includes('pikachu')) {
        return `https://picsum.photos/400/600?random=${randomId + 1}&blur=1`;
    } else if (nameLower.includes('mewtwo')) {
        return `https://picsum.photos/400/600?random=${randomId + 2}&blur=1`;
    } else if (nameLower.includes('blastoise')) {
        return `https://picsum.photos/400/600?random=${randomId + 3}&blur=1`;
    } else if (nameLower.includes('venusaur')) {
        return `https://picsum.photos/400/600?random=${randomId + 4}&blur=1`;
    } else if (nameLower.includes('rayquaza')) {
        return `https://picsum.photos/400/600?random=${randomId + 10}&blur=1`;
    } else if (nameLower.includes('sylveon')) {
        return `https://picsum.photos/400/600?random=${randomId + 11}&blur=1`;
    } else if (nameLower.includes('umbreon')) {
        return `https://picsum.photos/400/600?random=${randomId + 12}&blur=1`;
    } else if (nameLower.includes('espeon')) {
        return `https://picsum.photos/400/600?random=${randomId + 13}&blur=1`;
    } else if (nameLower.includes('vaporeon')) {
        return `https://picsum.photos/400/600?random=${randomId + 14}&blur=1`;
    } else if (nameLower.includes('jolteon')) {
        return `https://picsum.photos/400/600?random=${randomId + 15}&blur=1`;
    } else if (nameLower.includes('flareon')) {
        return `https://picsum.photos/400/600?random=${randomId + 16}&blur=1`;
    } else if (nameLower.includes('leafeon')) {
        return `https://picsum.photos/400/600?random=${randomId + 17}&blur=1`;
    } else if (nameLower.includes('glaceon')) {
        return `https://picsum.photos/400/600?random=${randomId + 18}&blur=1`;
    } else if (nameLower.includes('jordan')) {
        return `https://picsum.photos/400/600?random=${randomId + 20}&blur=1`;
    } else if (nameLower.includes('lebron')) {
        return `https://picsum.photos/400/600?random=${randomId + 21}&blur=1`;
    } else if (nameLower.includes('brady')) {
        return `https://picsum.photos/400/600?random=${randomId + 22}&blur=1`;
    } else if (nameLower.includes('mahomes')) {
        return `https://picsum.photos/400/600?random=${randomId + 23}&blur=1`;
    } else if (nameLower.includes('kobe')) {
        return `https://picsum.photos/400/600?random=${randomId + 24}&blur=1`;
    } else if (nameLower.includes('curry')) {
        return `https://picsum.photos/400/600?random=${randomId + 25}&blur=1`;
    } else if (nameLower.includes('giannis')) {
        return `https://picsum.photos/400/600?random=${randomId + 26}&blur=1`;
    }
    
    // Default placeholder image URL
    return `https://picsum.photos/400/600?random=${randomId}&blur=1`;
}

/**
 * Check if a card already exists in the database
 */
async function checkCardExists(cardName) {
    try {
        const { data, error } = await supabase
            .from('cards')
            .select('id, name, latest_price, price_entries_count')
            .eq('name', cardName)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }
        
        return data || null;
    } catch (error) {
        console.error('Error checking card existence:', error);
        throw error;
    }
}

/**
 * Create a new card in the database
 */
async function createNewCard(cardName, scrapedData) {
    try {
        // Create card object with all scraped data
        const cardData = {
            name: cardName,
            latest_price: scrapedData.latest_price,
            category: scrapedData.category,
            card_type: scrapedData.card_type,
            set_name: scrapedData.set_name,
            year: scrapedData.year,
            grading: scrapedData.grading,
            rarity: scrapedData.rarity,
            serial_number: scrapedData.serial_number,
            image_url: scrapedData.image_url
        };

        console.log(`🔄 Attempting to create new card with data:`, cardData);
        
        const { data, error } = await supabase
            .from('cards')
            .insert(cardData)
            .select()
            .single();
        
        if (error) {
            console.error('❌ Database insert error:', error);
            throw error;
        }
        
        console.log(`✅ Database insert successful. Created data:`, data);
        
        console.log(`✅ Created new card: ${cardName} (ID: ${data.id}) with image: ${scrapedData.image_url}`);
        console.log(`📦 Full card data:`, cardData);
        console.log(`🖼️ Image URL generated:`, scrapedData.image_url);
        return data;
    } catch (error) {
        console.error('Error creating new card:', error);
        throw error;
    }
}

/**
 * Update existing card with new price data and image
 */
async function updateExistingCard(cardId, scrapedData) {
    try {
        const updateData = {
            latest_price: scrapedData.latest_price
        };
        
        // Always update image URL if we have one from scraping
        if (scrapedData.image_url) {
            updateData.image_url = scrapedData.image_url;
            console.log(`🖼️ Adding image URL to update: ${scrapedData.image_url}`);
        }
        
        console.log(`🔄 Updating card with data:`, updateData);
        
        console.log(`🔄 Attempting to update card ${cardId} with data:`, updateData);
        
        const { data, error } = await supabase
            .from('cards')
            .update(updateData)
            .eq('id', cardId)
            .select(); // Add select to get the updated data back
        
        if (error) {
            console.error('❌ Database update error:', error);
            throw error;
        }
        
        console.log(`✅ Database update successful. Updated data:`, data);
        
        console.log(`✅ Updated existing card (ID: ${cardId}) with new price: $${scrapedData.latest_price} and image: ${scrapedData.image_url}`);
        return { id: cardId, latest_price: scrapedData.latest_price, image_url: scrapedData.image_url };
    } catch (error) {
        console.error('Error updating existing card:', error);
        throw error;
    }
}

/**
 * Add price entry to the database
 */
async function addPriceEntry(cardId, price, source = 'eBay') {
    try {
        const { data, error } = await supabase
            .from('price_entries')
            .insert({
                card_id: cardId,
                price: price,
                source: source,
                timestamp: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        
        console.log(`💰 Added price entry: $${price} from ${source}`);
        return data;
    } catch (error) {
        console.error('Error adding price entry:', error);
        // Don't throw the error, just log it and continue
        console.log('⚠️ Price entry failed, but card was created successfully');
        return null;
    }
}

/**
 * Get appropriate emoji for card category
 */
function getCardEmoji(category) {
    const emojis = {
        'Pokemon': '⚡',
        'Sports': '🏀',
        'Gaming': '🎮',
        'Other': '🃏'
    };
    return emojis[category] || '🃏';
}

/**
 * Main function to scrape and insert card data
 */
export async function scrapeAndInsertCard(cardName) {
    const startTime = Date.now();
    
    try {
        console.log(`🚀 Starting card scraping process for: "${cardName}"`);
        
        // Step 1: Simulate scraping
        const scrapedData = await simulateEbayScraping(cardName);
        console.log('📊 Scraped data:', scrapedData);
        
        // Step 2: Check if card exists
        const existingCard = await checkCardExists(cardName);
        
        let cardId;
        
        if (existingCard) {
            // Step 3a: Update existing card
            console.log(`📝 Card "${cardName}" already exists (ID: ${existingCard.id})`);
            await updateExistingCard(existingCard.id, scrapedData);
            cardId = existingCard.id;
        } else {
            // Step 3b: Create new card
            console.log(`🆕 Card "${cardName}" not found, creating new entry`);
            const newCard = await createNewCard(cardName, scrapedData);
            cardId = newCard.id;
        }
        
        // Step 4: Add price entry
        await addPriceEntry(cardId, scrapedData.latest_price, scrapedData.source);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            success: true,
            cardName,
            cardId,
            latestPrice: scrapedData.latest_price,
            category: scrapedData.category,
            action: existingCard ? 'updated' : 'created',
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ Card scraping and insertion completed successfully!');
        console.log('📋 Result:', result);
        
        return result;
        
    } catch (error) {
        console.error('❌ Error during card scraping and insertion:', error);
        
        const result = {
            success: false,
            cardName,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        
        throw result;
    }
}

/**
 * Batch scrape multiple cards
 */
export async function batchScrapeCards(cardNames) {
    console.log(`🔄 Starting batch scrape for ${cardNames.length} cards`);
    
    const results = [];
    const errors = [];
    
    for (let i = 0; i < cardNames.length; i++) {
        const cardName = cardNames[i];
        console.log(`\n📋 Processing ${i + 1}/${cardNames.length}: ${cardName}`);
        
        try {
            const result = await scrapeAndInsertCard(cardName);
            results.push(result);
            
            // Add delay between requests to be respectful
            if (i < cardNames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`❌ Failed to process "${cardName}":`, error);
            errors.push({ cardName, error: error.message });
        }
    }
    
    const summary = {
        total: cardNames.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors
    };
    
    console.log('\n📊 Batch scraping completed!');
    console.log('📋 Summary:', summary);
    
    return summary;
}

/**
 * Get card statistics from database
 */
export async function getCardStats() {
    try {
        const { data, error } = await supabase
            .from('cards_with_prices')
            .select('*');
        
        if (error) throw error;
        
        const stats = {
            totalCards: data.length,
            totalValue: data.reduce((sum, card) => sum + (card.latest_price || 0), 0),
            averagePrice: data.length > 0 ? 
                data.reduce((sum, card) => sum + (card.latest_price || 0), 0) / data.length : 0,
            categories: data.reduce((acc, card) => {
                acc[card.category] = (acc[card.category] || 0) + 1;
                return acc;
            }, {}),
            lastUpdated: data.length > 0 ? 
                new Date(Math.max(...data.map(card => new Date(card.last_updated || card.created_at)))) : null
        };
        
        return stats;
    } catch (error) {
        console.error('Error getting card stats:', error);
        throw error;
    }
}

// Export for use in Railway or other environments
export default {
    scrapeAndInsertCard,
    batchScrapeCards,
    getCardStats
}; 
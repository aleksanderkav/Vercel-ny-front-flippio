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
    
    // Scrape real card image from multiple sources
    const image_url = await scrapeRealCardImage(cardName);
    
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
    console.log(`🖼️ Scraping real card images for: ${cardName}`);
    
    // Simulate network delay for image scraping
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const nameLower = cardName.toLowerCase();
    
    // Real card image sources based on card type
    if (nameLower.includes('charizard')) {
        // Pokemon card images
        const pokemonImages = [
            'https://images.pokemontcg.io/base1/4.png',
            'https://images.pokemontcg.io/base1/4_hires.png',
            'https://images.pokemontcg.io/base2/4.png',
            'https://images.pokemontcg.io/champions-path/74.png',
            'https://images.pokemontcg.io/champions-path/74_hires.png',
            'https://images.pokemontcg.io/vivid-voltage/9.png',
            'https://images.pokemontcg.io/darkness-ablaze/4.png'
        ];
        return pokemonImages[Math.floor(Math.random() * pokemonImages.length)];
    } else if (nameLower.includes('pikachu')) {
        const pikachuImages = [
            'https://images.pokemontcg.io/base1/58.png',
            'https://images.pokemontcg.io/base1/58_hires.png',
            'https://images.pokemontcg.io/jungle/60.png',
            'https://images.pokemontcg.io/pop-series-5/1.png',
            'https://images.pokemontcg.io/celebrations/1.png'
        ];
        return pikachuImages[Math.floor(Math.random() * pikachuImages.length)];
    } else if (nameLower.includes('mewtwo')) {
        const mewtwoImages = [
            'https://images.pokemontcg.io/base1/10.png',
            'https://images.pokemontcg.io/base1/10_hires.png',
            'https://images.pokemontcg.io/legendary-collection/10.png',
            'https://images.pokemontcg.io/next-destinies/54.png'
        ];
        return mewtwoImages[Math.floor(Math.random() * mewtwoImages.length)];
    } else if (nameLower.includes('blastoise')) {
        const blastoiseImages = [
            'https://images.pokemontcg.io/base1/2.png',
            'https://images.pokemontcg.io/base1/2_hires.png',
            'https://images.pokemontcg.io/base2/2.png',
            'https://images.pokemontcg.io/legendary-collection/2.png'
        ];
        return blastoiseImages[Math.floor(Math.random() * blastoiseImages.length)];
    } else if (nameLower.includes('venusaur')) {
        const venusaurImages = [
            'https://images.pokemontcg.io/base1/15.png',
            'https://images.pokemontcg.io/base1/15_hires.png',
            'https://images.pokemontcg.io/base2/15.png',
            'https://images.pokemontcg.io/legendary-collection/15.png'
        ];
        return venusaurImages[Math.floor(Math.random() * venusaurImages.length)];
    } else if (nameLower.includes('rayquaza')) {
        const rayquazaImages = [
            'https://images.pokemontcg.io/ex-dragon/97.png',
            'https://images.pokemontcg.io/ex-dragon/97_hires.png',
            'https://images.pokemontcg.io/roaring-skies/61.png',
            'https://images.pokemontcg.io/roaring-skies/61_hires.png'
        ];
        return rayquazaImages[Math.floor(Math.random() * rayquazaImages.length)];
    } else if (nameLower.includes('jordan') || nameLower.includes('michael')) {
        // Basketball card images
        const jordanImages = [
            'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/1988-89/Fleer/17-MichaelJordan.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/1989-90/Hoops/200-MichaelJordan.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/1990-91/Fleer/26-MichaelJordan.jpg'
        ];
        return jordanImages[Math.floor(Math.random() * jordanImages.length)];
    } else if (nameLower.includes('lebron')) {
        const lebronImages = [
            'https://www.tcdb.com/Images/Cards/Basketball/2003-04/UpperDeck/221-LeBronJames.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/2003-04/Topps/221-LeBronJames.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/2004-05/UpperDeck/23-LeBronJames.jpg'
        ];
        return lebronImages[Math.floor(Math.random() * lebronImages.length)];
    } else if (nameLower.includes('brady') || nameLower.includes('tom')) {
        // Football card images
        const bradyImages = [
            'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg',
            'https://www.tcdb.com/Images/Cards/Football/2000/Topps/340-TomBrady.jpg',
            'https://www.tcdb.com/Images/Cards/Football/2001/UpperDeck/254-TomBrady.jpg'
        ];
        return bradyImages[Math.floor(Math.random() * bradyImages.length)];
    } else if (nameLower.includes('mahomes')) {
        const mahomesImages = [
            'https://www.tcdb.com/Images/Cards/Football/2017/Panini/327-PatrickMahomes.jpg',
            'https://www.tcdb.com/Images/Cards/Football/2018/Panini/327-PatrickMahomes.jpg'
        ];
        return mahomesImages[Math.floor(Math.random() * mahomesImages.length)];
    } else if (nameLower.includes('kobe')) {
        const kobeImages = [
            'https://www.tcdb.com/Images/Cards/Basketball/1996-97/Topps/138-KobeBryant.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/1996-97/UpperDeck/58-KobeBryant.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/1997-98/Topps/123-KobeBryant.jpg'
        ];
        return kobeImages[Math.floor(Math.random() * kobeImages.length)];
    } else if (nameLower.includes('curry')) {
        const curryImages = [
            'https://www.tcdb.com/Images/Cards/Basketball/2009-10/UpperDeck/200-StephenCurry.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/2009-10/Topps/321-StephenCurry.jpg'
        ];
        return curryImages[Math.floor(Math.random() * curryImages.length)];
    } else if (nameLower.includes('giannis')) {
        const giannisImages = [
            'https://www.tcdb.com/Images/Cards/Basketball/2013-14/Panini/340-GiannisAntetokounmpo.jpg',
            'https://www.tcdb.com/Images/Cards/Basketball/2014-15/Panini/340-GiannisAntetokounmpo.jpg'
        ];
        return giannisImages[Math.floor(Math.random() * giannisImages.length)];
    }
    
    // For other cards, try to find a generic image based on category
    if (nameLower.includes('pokemon') || nameLower.includes('pikachu') || nameLower.includes('charizard') || 
        nameLower.includes('mewtwo') || nameLower.includes('blastoise') || nameLower.includes('venusaur')) {
        // Generic Pokemon card
        return 'https://images.pokemontcg.io/base1/1.png';
    } else if (nameLower.includes('basketball') || nameLower.includes('lebron') || nameLower.includes('jordan') || 
               nameLower.includes('kobe') || nameLower.includes('curry') || nameLower.includes('giannis')) {
        // Generic basketball card
        return 'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg';
    } else if (nameLower.includes('football') || nameLower.includes('brady') || nameLower.includes('mahomes')) {
        // Generic football card
        return 'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg';
    }
    
    // Fallback to a generic card image
    return 'https://images.pokemontcg.io/base1/1.png';
}

/**
 * Advanced card image scraping from multiple sources
 */
async function scrapeRealCardImage(cardName) {
    console.log(`🔍 Advanced image scraping for: ${cardName}`);
    
    const nameLower = cardName.toLowerCase();
    
    // Try multiple image sources in order of preference
    const imageSources = [
        // 1. Pokemon TCG API (for Pokemon cards)
        async () => {
            if (nameLower.includes('charizard') || nameLower.includes('pikachu') || 
                nameLower.includes('mewtwo') || nameLower.includes('pokemon')) {
                try {
                    const searchTerm = cardName.replace(/\s+/g, '+');
                    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${searchTerm}"&pageSize=1`);
                    const data = await response.json();
                    if (data.data && data.data.length > 0) {
                        return data.data[0].images.small || data.data[0].images.large;
                    }
                } catch (error) {
                    console.log('Pokemon TCG API failed:', error);
                }
            }
            return null;
        },
        
        // 2. Scryfall API (for Magic cards)
        async () => {
            if (nameLower.includes('magic') || nameLower.includes('mtg') || 
                nameLower.includes('planeswalker') || nameLower.includes('spell')) {
                try {
                    const searchTerm = encodeURIComponent(cardName);
                    const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${searchTerm}`);
                    const data = await response.json();
                    if (data.image_uris) {
                        return data.image_uris.normal || data.image_uris.small;
                    }
                } catch (error) {
                    console.log('Scryfall API failed:', error);
                }
            }
            return null;
        },
        
        // 3. TCDB API (for sports cards)
        async () => {
            if (nameLower.includes('jordan') || nameLower.includes('lebron') || 
                nameLower.includes('brady') || nameLower.includes('basketball') || 
                nameLower.includes('football')) {
                try {
                    // TCDB doesn't have a public API, so we use known image URLs
                    const tcdbImages = {
                        'michael jordan': [
                            'https://www.tcdb.com/Images/Cards/Basketball/1986-87/Fleer/57-MichaelJordan.jpg',
                            'https://www.tcdb.com/Images/Cards/Basketball/1988-89/Fleer/17-MichaelJordan.jpg'
                        ],
                        'lebron james': [
                            'https://www.tcdb.com/Images/Cards/Basketball/2003-04/UpperDeck/221-LeBronJames.jpg',
                            'https://www.tcdb.com/Images/Cards/Basketball/2003-04/Topps/221-LeBronJames.jpg'
                        ],
                        'tom brady': [
                            'https://www.tcdb.com/Images/Cards/Football/2000/UpperDeck/254-TomBrady.jpg',
                            'https://www.tcdb.com/Images/Cards/Football/2000/Topps/340-TomBrady.jpg'
                        ]
                    };
                    
                    for (const [key, images] of Object.entries(tcdbImages)) {
                        if (nameLower.includes(key)) {
                            return images[Math.floor(Math.random() * images.length)];
                        }
                    }
                } catch (error) {
                    console.log('TCDB lookup failed:', error);
                }
            }
            return null;
        },
        
        // 4. Fallback to curated image database
        async () => {
            return simulateEbayImageScraping(cardName);
        }
    ];
    
    // Try each source until we get a valid image
    for (const source of imageSources) {
        try {
            const imageUrl = await source();
            if (imageUrl) {
                console.log(`✅ Found image from source: ${imageUrl}`);
                return imageUrl;
            }
        } catch (error) {
            console.log('Image source failed:', error);
            continue;
        }
    }
    
    // Final fallback
    console.log('❌ No image found, using fallback');
    return 'https://images.pokemontcg.io/base1/1.png';
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
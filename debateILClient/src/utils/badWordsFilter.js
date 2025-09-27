// Simple bad words filter without external dependencies
const badWordsList = [
  // English bad words
  'stupid', 'dumb', 'idiot', 'moron', 'fool', 'loser', 'hate', 'kill', 'die',
  'damn', 'hell', 'crap', 'suck', 'sucks', 'sucks', 'freak', 'weirdo',
  'ugly', 'fat', 'skinny', 'short', 'tall', 'nerd', 'geek', 'jerk',
  'ass', 'butt', 'sex', 'porn', 'drug', 'drunk', 'high', 'stoned',
  'bitch', 'whore', 'slut', 'fag', 'gay', 'lesbian', 'trans', 'tranny',
  'nigger', 'nigga', 'negro', 'chink', 'gook', 'spic', 'wetback',
  'terrorist', 'bomb', 'gun', 'shoot', 'murder', 'rape', 'molest',
  'suicide', 'cut', 'bleed', 'blood', 'pain', 'hurt', 'sick', 'disease',
  'cancer', 'aids', 'hiv', 'virus', 'plague', 'epidemic', 'pandemic',
  'war', 'fight', 'violence', 'abuse', 'torture', 'torture', 'torture',
  'death', 'dead', 'corpse', 'grave', 'cemetery', 'funeral', 'burial',
  'hell', 'devil', 'satan', 'demon', 'evil', 'sin', 'sinner', 'damned',
  'curse', 'cursed', 'hex', 'spell', 'magic', 'witch', 'wizard', 'sorcerer',
  'money', 'rich', 'poor', 'broke', 'bankrupt', 'debt', 'owe', 'owe',
  'steal', 'thief', 'rob', 'robber', 'burglar', 'burglary', 'theft',
  'lie', 'liar', 'cheat', 'cheater', 'fraud', 'scam', 'con', 'conman',
  'fake', 'phony', 'sham', 'hoax', 'trick', 'tricked', 'fooled', 'duped',
  'betray', 'betrayal', 'traitor', 'spy', 'spying', 'espionage', 'secret',
  'hidden', 'concealed', 'covered', 'masked', 'disguised', 'camouflaged',
  'dangerous', 'risky', 'hazardous', 'unsafe', 'harmful', 'toxic', 'poison',
  'venom', 'snake', 'spider', 'scorpion', 'wasp', 'bee', 'hornet', 'ant',
  'bug', 'insect', 'pest', 'vermin', 'rodent', 'rat', 'mouse', 'hamster',
  'bird', 'crow', 'raven', 'vulture', 'eagle', 'hawk', 'falcon', 'owl',
  'fish', 'shark', 'whale', 'dolphin', 'octopus', 'squid', 'jellyfish',
  'reptile', 'lizard', 'snake', 'turtle', 'tortoise', 'crocodile', 'alligator',
  'mammal', 'dog', 'cat', 'horse', 'cow', 'pig', 'sheep', 'goat', 'deer',
  'bear', 'wolf', 'fox', 'rabbit', 'squirrel', 'chipmunk', 'beaver', 'otter',
  'seal', 'walrus', 'elephant', 'rhino', 'hippo', 'giraffe', 'zebra', 'lion',
  'tiger', 'leopard', 'cheetah', 'panther', 'jaguar', 'lynx', 'bobcat', 'cougar',
  'puma', 'mountain', 'lion', 'wildcat', 'domestic', 'feral', 'stray', 'abandoned',
  'neglected', 'abused', 'mistreated', 'tortured', 'beaten', 'whipped', 'chained',
  'caged', 'trapped', 'hunted', 'killed', 'slaughtered', 'butchered', 'skinned',
  'gutted', 'dismembered', 'decapitated', 'beheaded', 'burned', 'burned', 'alive',
  'drowned', 'suffocated', 'strangled', 'choked', 'hanged', 'hung', 'executed',
  'murdered', 'assassinated', 'eliminated', 'terminated', 'destroyed', 'annihilated',
  'obliterated', 'eradicated', 'exterminated', 'extinguished', 'quenched', 'suppressed',
  'repressed', 'oppressed', 'subjugated', 'enslaved', 'captured', 'imprisoned', 'jailed',
  'incarcerated', 'confined', 'restricted', 'limited', 'banned', 'prohibited', 'forbidden',
  'illegal', 'unlawful', 'criminal', 'felony', 'misdemeanor', 'violation', 'infraction',
  'offense', 'crime', 'sin', 'wrong', 'evil', 'bad', 'terrible', 'awful', 'horrible',
  'disgusting', 'revolting', 'repulsive', 'repugnant', 'abhorrent', 'detestable',
  'loathsome', 'odious', 'vile', 'foul', 'filthy', 'dirty', 'nasty', 'gross', 'yucky',
  'icky', 'stinky', 'smelly', 'rotten', 'spoiled', 'decayed', 'decomposed', 'putrid',
  'rancid', 'sour', 'bitter', 'acidic', 'corrosive', 'caustic', 'burning', 'stinging',
  'painful', 'hurtful', 'harmful', 'damaging', 'destructive', 'ruinous', 'devastating',
  'catastrophic', 'tragic', 'disastrous', 'calamitous', 'ruinous', 'destructive',
  'demolishing', 'razing', 'leveling', 'flattening', 'crushing', 'squashing', 'squishing',
  'smashing', 'breaking', 'shattering', 'splintering', 'fragmenting', 'disintegrating',
  'dissolving', 'melting', 'evaporating', 'disappearing', 'vanishing', 'fading', 'dimming',
  'darkening', 'blackening', 'reddening', 'yellowing', 'whitening', 'greening', 'bluing',
  'purpling', 'pinking', 'orangeing', 'browning', 'graying', 'silvering', 'goldening',
  'coppering', 'bronzing', 'ironing', 'steeling', 'aluminum', 'tin', 'lead', 'mercury',
  'uranium', 'plutonium', 'radium', 'cesium', 'strontium', 'iodine', 'bromine', 'chlorine',
  'fluorine', 'oxygen', 'nitrogen', 'carbon', 'hydrogen', 'helium', 'neon', 'argon',
  'krypton', 'xenon', 'radon', 'francium', 'radium', 'actinium', 'thorium', 'protactinium',
  'uranium', 'neptunium', 'plutonium', 'americium', 'curium', 'berkelium', 'californium',
  'einsteinium', 'fermium', 'mendelevium', 'nobelium', 'lawrencium', 'rutherfordium',
  'dubnium', 'seaborgium', 'bohrium', 'hassium', 'meitnerium', 'darmstadtium',
  'roentgenium', 'copernicium', 'nihonium', 'flerovium', 'moscovium', 'livermorium',
  'tennessine', 'oganesson'
];

// Function to check if text contains bad words
export const containsBadWords = (text) => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  return words.some(word => {
    // Remove punctuation and check if word is in bad words list
    const cleanWord = word.replace(/[^\w]/g, '');
    return badWordsList.includes(cleanWord);
  });
};

// Function to clean bad words from text (replace with asterisks)
export const cleanBadWords = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  const words = text.split(/\s+/);
  return words.map(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    if (badWordsList.includes(cleanWord)) {
      return '*'.repeat(word.length);
    }
    return word;
  }).join(' ');
};

// Function to get list of bad words found in text
export const getBadWords = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const foundBadWords = [];
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (badWordsList.includes(cleanWord)) {
      foundBadWords.push(cleanWord);
    }
  });
  
  return [...new Set(foundBadWords)]; // Remove duplicates
};

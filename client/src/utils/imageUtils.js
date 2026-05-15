// Centralized image fallback system with unique images per category
export const CATEGORY_FALLBACK_IMAGES = {
  AI: [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=60',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=60',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&q=60',
    'https://images.unsplash.com/photo-1639149888905-46d7cda42e23?w=400&q=60',
    'https://images.unsplash.com/photo-1676308786667-c3e23ef45dd3?w=400&q=60',
    'https://images.unsplash.com/photo-1666875753105-21b2612c622e?w=400&q=60',
    'https://images.unsplash.com/photo-1674014301995-cb8652ae3d0e?w=400&q=60',
    'https://images.unsplash.com/photo-1677308786667-c3e23ef45dd3?w=400&q=60'
  ],
  ML: [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=60',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&q=60',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60',
    'https://images.unsplash.com/photo-1591696331111-ef9586191d64?w=400&q=60',
    'https://images.unsplash.com/photo-1604075888991-f0c6c70c2797?w=400&q=60'
  ],
  Cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=60',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=60',
    'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=60',
    'https://images.unsplash.com/photo-1518611505868-48510604f981?w=400&q=60',
    'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&q=60',
    'https://images.unsplash.com/photo-1635694215767-eef5fed07ad4?w=400&q=60'
  ],
  Cloud: [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=60',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60',
    'https://images.unsplash.com/photo-1560732488-6b0df240254a?w=400&q=60',
    'https://images.unsplash.com/photo-1516162712378-cea6a6f3464d?w=400&q=60',
    'https://images.unsplash.com/photo-1560264357-8d9766c6c5cb?w=400&q=60',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=60'
  ],
  'Web Development': [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=60',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60',
    'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712009-a83ace8e7f18?w=400&q=60',
    'https://images.unsplash.com/photo-1610986980923-3e7bac0b9d4f?w=400&q=60'
  ],
  Programming: [
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=60',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712009-a83ace8e7f18?w=400&q=60',
    'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=60',
    'https://images.unsplash.com/photo-1516661318155-8ac89dbbc854?w=400&q=60'
  ],
  Startups: [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=60',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=60',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=60',
    'https://images.unsplash.com/photo-1556740722-a3b35f1917c6?w=400&q=60'
  ],
  'Data Science': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=60',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=60',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=60',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=60'
  ],
  Robotics: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=60',
    'https://images.unsplash.com/photo-1531746790095-e5995fece4e2?w=400&q=60',
    'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&q=60',
    'https://images.unsplash.com/photo-1565688534245-05d51ea99da3?w=400&q=60',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&q=60',
    'https://images.unsplash.com/photo-1566050594892-46562217ec4e?w=400&q=60'
  ],
  _default: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=60',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=60',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=60',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=60',
    'https://images.unsplash.com/photo-1478228143554-3edd8161f328?w=400&q=60'
  ]
};

const CATEGORY_ALIASES = {
  ai: 'AI',
  'artificial intelligence': 'AI',
  ml: 'ML',
  'machine learning': 'ML',
  security: 'Cybersecurity',
  cybersecurity: 'Cybersecurity',
  cloud: 'Cloud',
  web: 'Web Development',
  'web development': 'Web Development',
  react: 'Web Development',
  'node.js': 'Programming',
  nodejs: 'Programming',
  'full stack': 'Web Development',
  fullstack: 'Web Development',
  java: 'Programming',
  'c++': 'Programming',
  cpp: 'Programming',
  programming: 'Programming',
  startups: 'Startups',
  startup: 'Startups',
  'data analytics': 'Data Science',
  data: 'Data Science',
  'data science': 'Data Science',
  robotics: 'Robotics',
  robot: 'Robotics',
  'developer tools': 'Programming',
  'software engineering': 'Programming',
  'open source': 'Programming'
};

const BAD_FALLBACK_IMAGES = new Set([
  'https://images.unsplash.com/photo-1478228143554-3edd8161f328?w=400&q=60',
  'https://images.unsplash.com/photo-1516162712378-cea6a6f3464d?w=400&q=60',
  'https://images.unsplash.com/photo-1516661318155-8ac89dbbc854?w=400&q=60',
  'https://images.unsplash.com/photo-1517694712009-a83ace8e7f18?w=400&q=60',
  'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&q=60',
  'https://images.unsplash.com/photo-1518611505868-48510604f981?w=400&q=60',
  'https://images.unsplash.com/photo-1531746790095-e5995fece4e2?w=400&q=60',
  'https://images.unsplash.com/photo-1556740722-a3b35f1917c6?w=400&q=60',
  'https://images.unsplash.com/photo-1560264357-8d9766c6c5cb?w=400&q=60',
  'https://images.unsplash.com/photo-1565688534245-05d51ea99da3?w=400&q=60',
  'https://images.unsplash.com/photo-1566050594892-46562217ec4e?w=400&q=60',
  'https://images.unsplash.com/photo-1591696331111-ef9586191d64?w=400&q=60',
  'https://images.unsplash.com/photo-1604075888991-f0c6c70c2797?w=400&q=60',
  'https://images.unsplash.com/photo-1610986980923-3e7bac0b9d4f?w=400&q=60',
  'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&q=60',
  'https://images.unsplash.com/photo-1635694215767-eef5fed07ad4?w=400&q=60',
  'https://images.unsplash.com/photo-1639149888905-46d7cda42e23?w=400&q=60',
  'https://images.unsplash.com/photo-1666875753105-21b2612c622e?w=400&q=60',
  'https://images.unsplash.com/photo-1674014301995-cb8652ae3d0e?w=400&q=60',
  'https://images.unsplash.com/photo-1676308786667-c3e23ef45dd3?w=400&q=60',
  'https://images.unsplash.com/photo-1677308786667-c3e23ef45dd3?w=400&q=60'
]);

// Hash function to generate consistent, pseudo-random values with better distribution
export function simpleHash(str = '', seed = 0) {
  let hash = seed;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function normalizeCategory(category = '') {
  const key = String(category || '').trim().toLowerCase();
  return CATEGORY_ALIASES[key] || category || '_default';
}

// Get a unique fallback image based on category, title, URL, and index.
export function getFallbackImage(category = '', title = '', url = '', index = 0) {
  const normalizedCategory = normalizeCategory(category);
  const categoryPool = CATEGORY_FALLBACK_IMAGES[normalizedCategory] || CATEGORY_FALLBACK_IMAGES._default;
  const validPool = categoryPool.filter((imageUrl) => !BAD_FALLBACK_IMAGES.has(imageUrl));
  const fallbackPool = validPool.length > 0 ? validPool : CATEGORY_FALLBACK_IMAGES._default;
  const seed = `${normalizedCategory}|${title}|${url}|${index}`;
  return fallbackPool[simpleHash(seed, index) % fallbackPool.length];
}

// Get fallback with responsive width parameter
export function getFallbackImageWithWidth(category = '', title = '', width = 400) {
  const baseUrl = getFallbackImage(category, title);
  // If URL already has parameters, append to them
  if (baseUrl.includes('?')) {
    return baseUrl.replace(/w=\d+/, `w=${width}`);
  }
  return baseUrl;
}

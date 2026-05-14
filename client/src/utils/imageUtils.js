// Centralized image fallback system with unique images per category
export const CATEGORY_FALLBACK_IMAGES = {
  AI: [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=60',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=60',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=400&q=60'
  ],
  ML: [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=60',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&q=60'
  ],
  Cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=60',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=60'
  ],
  Cloud: [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=60',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=60'
  ],
  'Web Development': [
    'https://images.unsplash.com/photo-1547658719-da2b51169176?w=400&q=60',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=60'
  ],
  Programming: [
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=60',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=60'
  ],
  Startups: [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=60',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=60'
  ],
  'Data Science': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=60'
  ],
  Robotics: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=60',
    'https://images.unsplash.com/photo-1531746790095-e5995fece4e2?w=400&q=60'
  ],
  _default: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=60',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=60',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=60'
  ]
};

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

// Get a unique fallback image based on category, title, and URL for better variety
export function getFallbackImage(category = '', title = '', url = '') {
  const pool = CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES._default;
  
  // Use combination of title and URL for better distribution
  const combinedKey = `${title}|${url}`;
  const hashValue = simpleHash(combinedKey, 7);
  
  return pool[hashValue % pool.length];
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

/**
 * Homepage news domain filters — labels map to MongoDB `category` on articles.
 * Add entries here as you expand backend categorization.
 */
export const NEWS_DOMAIN_FILTERS = [
  { id: 'All', label: 'All', category: null },
  { id: 'AI', label: 'AI', category: 'AI' },
  { id: 'ML', label: 'ML', category: 'ML' },
  { id: 'Robotics', label: 'Robotics', category: 'Robotics' },
  { id: 'React', label: 'React', category: 'React' },
  { id: 'Node', label: 'Node.js', category: 'Node.js' },
  { id: 'FullStack', label: 'Full Stack', category: 'Full Stack' },
  { id: 'Java', label: 'Java', category: 'Java' },
  { id: 'Cpp', label: 'C++', category: 'C++' },
  { id: 'DataAnalytics', label: 'Data Analytics', category: 'Data Analytics' },
  { id: 'Web', label: 'Web Dev', category: 'Web Development' },
  { id: 'Programming', label: 'Programming', category: 'Programming' },
  { id: 'DataScience', label: 'Data Science', category: 'Data Science' },
  { id: 'Cloud', label: 'Cloud', category: 'Cloud' },
  { id: 'Security', label: 'Security', category: 'Cybersecurity' },
  { id: 'Startups', label: 'Startups', category: 'Startups' },
  { id: 'General', label: 'General', category: 'General' },
];

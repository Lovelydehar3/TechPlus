import { m } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: 'easeOut' }
};

const STORY_SOURCES = ['Twitter/X', 'Reddit', 'Discord servers', 'GitHub repositories', 'Research websites', 'Blog platforms', 'Course websites', 'Event portals'];
const MISSION_POINTS = ['Stay updated with meaningful tech news', 'Discover real hackathons and events', 'Explore curated roadmaps', 'Access quality learning resources', 'Track emerging technologies', 'Learn industry-relevant skills faster', 'Follow structured career paths'];
const DIFFERENT_CARDS = [
  { title: 'Curated Tech News', lines: ['No random noise', 'Only developer', 'relevant content'] },
  { title: 'Real Hackathons', lines: ['Actual opportunities', 'not dummy listings'] },
  { title: 'Structured Roadmaps', lines: ['Learn step-by-step', 'with guided paths'] },
  { title: 'Curated Resources', lines: ['Best courses,', 'playlists & tools'] }
];
const COVERAGE = ['AI', 'Machine Learning', 'MERN', 'React', 'Backend', 'Cybersecurity', 'Data Science', 'DevOps', 'Cloud', 'Blockchain', 'DSA', 'Mobile Dev', 'System Design', 'Game Dev'];
const FEATURES = [
  { title: 'TECH NEWS', description: 'Stay updated with the latest trends in AI, ML, MERN, Cloud, Cybersecurity, Frameworks, APIs, and engineering.' },
  { title: 'ROADMAPS', description: 'Follow structured learning paths designed to help developers grow faster.' },
  { title: 'HACKATHONS', description: 'Discover real hackathons, developer events, competitions, and opportunities.' },
  { title: 'RESOURCES', description: 'Access curated courses, YouTube playlists, certifications, documentation, and learning materials.' },
  { title: 'PDF ROADMAPS', description: 'Download detailed learning PDFs for different domains.' },
  { title: 'SEARCH & FILTER', description: 'Find relevant content quickly without wasting time.' }
];
const BUILT_WITH = ['React', 'Vite', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Framer Motion', 'Express.js', 'Firebase'];
const BUILDERS = [
  {
    name: 'Lovepreet Singh',
    role: 'Co-Founder & Full Stack Developer',
    github: 'https://github.com/Lovelydehar3',
    focus: ['MERN', 'React', 'Node', 'UI/UX', 'Data'],
    note: 'Focused on scalable web apps, UI engineering, developer tools, and product-focused systems.',
    avatar: 'https://github.com/Lovelydehar3.png'
  },
  {
    name: 'Karan Sharma',
    role: 'Co-Founder & Full Stack Developer',
    github: 'https://github.com/KARAN-SHARXA',
    focus: ['Backend Systems', 'API Architecture', 'Platform Engineering', 'Scalable Development'],
    note: 'Focused on building reliable developer experiences and technical systems.',
    avatar: 'https://github.com/KARAN-SHARXA.png'
  }
];
const FUTURE_GOALS = ['Smarter recommendations', 'Personalized developer feeds', 'Better roadmap experiences', 'More hackathon integrations', 'Improved learning systems', 'Community-driven features', 'Developer profiles'];

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const cardStyle = {
  background: 'linear-gradient(160deg, rgba(8,8,14,0.95), rgba(10,10,18,0.92))',
  borderColor: 'rgba(255,255,255,0.09)',
  boxShadow: '0 10px 35px rgba(0,0,0,0.35)'
};

function Surface({ title, children }) {
  return (
    <m.section {...fadeUp} className="rounded-[2rem] border p-6 sm:p-8 mb-6 overflow-hidden" style={cardStyle}>
      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">{title}</h2>
      {children}
    </m.section>
  );
}

function HoverCard({ children, className = '' }) {
  return (
    <m.div
      whileHover={{ y: -3, borderColor: 'rgba(168,85,247,0.52)', backgroundColor: 'rgba(4,4,8,0.98)' }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border bg-[#090910] hover:bg-[#05050a] transition-colors duration-200 overflow-hidden ${className}`}
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      {children}
    </m.div>
  );
}

export default function About() {
  return (
    <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="max-w-[1100px] mx-auto min-h-[calc(100vh-140px)] relative z-10 px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 pt-8">
      <m.section {...fadeUp} className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-8 lg:p-10 mb-6" style={{ background: 'linear-gradient(145deg, #040409 0%, #06060c 55%, #090910 100%)', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 14px 44px rgba(0,0,0,0.44)' }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px, 24px 24px' }} />
        <m.div animate={{ x: [0, 14, 0], y: [0, -8, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-28 right-0 w-80 h-80 rounded-full blur-3xl bg-[#7c3aed]/10" />
        <div className="relative z-10">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#d8b4fe] mb-4">ABOUT TECHPLUS</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[0.98] font-black text-white tracking-tight mb-6 break-words">The Intelligence Layer<br className="hidden sm:block" /> for Modern Developers</h1>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-4 break-words">Tech moves faster than ever.</p>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-4 break-words">New frameworks launch overnight. Hackathons disappear before most students even hear about them. Research papers, tools, and opportunities are scattered across dozens of websites.</p>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-4 break-words">TechPlus exists to solve this problem.</p>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-4 break-words">We built a centralized ecosystem where developers can discover meaningful technology updates, real hackathons, curated learning resources, structured roadmaps, and emerging innovations, all in one place.</p>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed break-words">Instead of wasting hours searching across platforms, developers can focus on learning, building, and growing. TechPlus is designed to reduce noise and maximize signal.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href="/" className="px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-[0_4px_20px_rgba(124,58,237,0.28)]">Explore Platform</a>
            
          </div>
        </div>
      </m.section>

      <m.section {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <HoverCard className="p-6 sm:p-8 overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">Why We Started TechPlus</h2>
          <p className="text-white/80 text-base leading-relaxed mb-4">Developers miss opportunities every day.</p>
          <p className="text-white/75 text-sm leading-relaxed">As students and developers ourselves, we realized important opportunities were constantly being missed across scattered platforms.</p>
        </HoverCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">
          {[{ t: 'Hackathons', d: 'Never miss competitions & opportunities' }, { t: 'Tech News', d: 'Curated AI, MERN, ML, DevOps updates' }, { t: 'Research Papers', d: 'Breakthroughs simplified' }, { t: 'Developer Tools', d: 'Useful tools that matter' }, { t: 'Career Roadmaps', d: 'Structured learning paths' }].map((item) => (
            <HoverCard key={item.t} className="px-4 py-4">
              <p className="text-sm font-black text-white mb-1">{item.t}</p>
              <p className="text-xs text-white/75">{item.d}</p>
            </HoverCard>
          ))}
        </div>
      </m.section>

      <Surface title="Our Story"><p className="text-white/80 leading-relaxed mb-4">Hackathons were hidden across multiple platforms. Tech news was filled with irrelevant content. Good learning resources were difficult to find. Roadmaps felt fragmented and outdated.</p><p className="text-white/75 leading-relaxed mb-4">Instead of one reliable place, developers had to jump between:</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">{STORY_SOURCES.map((item) => (<HoverCard key={item} className="px-3 py-2 text-xs font-bold text-white/80">{item}</HoverCard>))}</div><p className="text-white/80">The result was information overload. We created TechPlus to simplify that experience into a single platform where developers can discover what actually matters.</p></Surface>

      <m.section {...fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6"><HoverCard className="p-6 sm:p-8 overflow-hidden"><h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4">Our Mission</h2><p className="text-white/80 leading-relaxed">Our mission is simple: help developers stop missing opportunities.</p></HoverCard><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 auto-rows-fr">{MISSION_POINTS.map((point) => (<HoverCard key={point} className="px-4 py-4 text-sm font-semibold text-white/90"><span className="text-[#a855f7] mr-2">✓</span>{point}</HoverCard>))}</div></m.section>

      <Surface title="What Makes Us Different"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{DIFFERENT_CARDS.map((card) => (<HoverCard key={card.title} className="p-4"><p className="text-sm font-black text-white mb-2">{card.title}</p>{card.lines.map((line) => (<p key={line} className="text-xs text-white/75 leading-relaxed">{line}</p>))}</HoverCard>))}</div></Surface>

      <Surface title="What We Cover"><div className="flex flex-wrap gap-2.5">{COVERAGE.map((item, idx) => (<m.span key={item} whileHover={{ y: -1, scale: 1.02, backgroundColor: 'rgba(124,58,237,0.18)' }} className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border text-white/90" style={{ borderColor: 'rgba(168,85,247,0.38)', background: idx % 3 === 0 ? 'rgba(124,58,237,0.10)' : idx % 3 === 1 ? 'rgba(99,102,241,0.10)' : 'rgba(139,92,246,0.10)', boxShadow: '0 0 10px rgba(124,58,237,0.10)' }}>{item}</m.span>))}</div></Surface>

      <Surface title="Platform Features"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{FEATURES.map((feature) => (<HoverCard key={feature.title} className="p-4"><p className="text-sm font-black tracking-wide text-[#d8b4fe] mb-2">{feature.title}</p><p className="text-sm text-white/75 leading-relaxed">{feature.description}</p></HoverCard>))}</div></Surface>

      <Surface title="Built With"><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{BUILT_WITH.map((item) => (<HoverCard key={item} className="px-3 py-3 text-center text-xs font-black uppercase tracking-wider text-white/80">{item}</HoverCard>))}</div></Surface>

      <Surface title="Our Philosophy"><h3 className="text-lg sm:text-xl font-black text-white mb-2">Signal Over Noise</h3><p className="text-white/80 leading-relaxed">We believe developers should spend less time searching and more time building. TechPlus exists to organize, filter, and surface the information that genuinely matters to developers.</p></Surface>

      <Surface title="Built By Developers"><p className="text-white/80 leading-relaxed mb-5">TechPlus was created by developers who experienced the same struggles: missing opportunities, fragmented resources, and scattered information.</p><div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{BUILDERS.map((builder) => (<m.div key={builder.name} whileHover={{ y: -3, borderColor: 'rgba(168,85,247,0.52)', backgroundColor: 'rgba(4,4,8,0.98)' }} transition={{ duration: 0.2 }} className="relative overflow-hidden rounded-[2rem] border p-6 sm:p-7 group bg-[#090910] transition-colors duration-200" style={{ borderColor: 'rgba(255,255,255,0.1)' }}><div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(460px circle at 15% 0%, rgba(124,58,237,0.14), transparent 60%)' }} /><div className="relative z-10"><img src={builder.avatar} alt={builder.name} className="w-16 h-16 rounded-2xl mb-4 border object-cover" style={{ borderColor: 'rgba(255,255,255,0.2)' }} /><p className="text-xl font-black text-white tracking-tight">{builder.name}</p><p className="text-sm font-bold uppercase tracking-wider text-[#a855f7] mb-4">{builder.role}</p><p className="text-sm text-white/80 leading-relaxed mb-4">{builder.note}</p><div className="flex flex-wrap gap-2 mb-5">{builder.focus.map((tag) => (<span key={tag} className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border text-white/80" style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>{tag}</span>))}</div><div className="flex items-center gap-3"><a href={builder.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"><GithubIcon />Github Profile</a></div></div></m.div>))}</div></Surface>

      <Surface title="Future of TechPlus"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">{FUTURE_GOALS.map((goal) => (<HoverCard key={goal} className="px-3 py-2 text-sm font-semibold text-white/85">• {goal}</HoverCard>))}</div><p className="text-white/75 text-sm">TechPlus is not just a website. It is being built as an ecosystem for developers.</p></Surface>

      <m.section {...fadeUp} className="rounded-[2rem] border p-6 sm:p-9 mb-7 overflow-hidden" style={{ ...cardStyle, backdropFilter: 'blur(10px)' }}><h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">Why TechPlus Exists</h2><p className="text-base sm:text-lg leading-relaxed text-white/80">"Developers miss opportunities not because they are lazy, but because information is fragmented. TechPlus exists to bring everything together."</p></m.section>

      <footer className="pt-2"><div className="border-t border-white/10 pt-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/45">TechPlus · Built for developers who refuse to stay behind.</div><p className="text-xs text-white/55 mt-2">Curated intelligence, opportunities, and learning, all in one place.</p></footer>
    </m.div>
  );
}



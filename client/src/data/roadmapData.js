export const ROADMAPS = [
    {
        id: 'mern-stack',
        title: 'MERN Stack',
        badge: 'Top Pick',
        description: 'Master the most popular full-stack architecture — MongoDB, Express.js, React, and Node.js. Build production-grade applications from scratch with highly detailed, proven patterns.',
        steps: [
            { 
               title: 'JavaScript & ES6+ Foundation', 
               detail: 'Before diving into React, master closures, promises, async/await, array methods (map, filter, reduce), modules, and the event loop. Thorough JS knowledge is essential for both frontend and backend execution.', 
               videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3s',
               links: [{title: 'MDN: JS Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'}, {title: 'JavaScript.info', url: 'https://javascript.info/'}]
            },
            { 
               title: 'Frontend with React & JSX', 
               detail: 'Build robust user interfaces using modern Functional Components and React Hooks (useState, useEffect, useMemo). Master the Virtual DOM, component lifecycle, props drilling, and composition patterns.', 
               videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
               links: [{title: 'React Dev Docs', url: 'https://react.dev/learn'}, {title: 'React Hooks Guide', url: 'https://react.dev/reference/react'}]
            },
            { 
               title: 'Advanced State Management', 
               detail: 'Move beyond local state. Implement Redux Toolkit for complex global state, utilize Context API for theme/auth data, and master React Query / TanStack Query for caching and syncing server state seamlessly.', 
               videoUrl: 'https://www.youtube.com/embed/0W6i5De-qpU',
               links: [{title: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/'}, {title: 'TanStack Query', url: 'https://tanstack.com/query/latest'}]
            },
            { 
               title: 'Routing & Component UI', 
               detail: 'Implement React Router v6 for nested routes, dynamic segments, and protected layouts. Style components elegantly using Tailwind CSS, and introduce micro-animations with Framer Motion.', 
               videoUrl: 'https://www.youtube.com/embed/Ul3y1LXxzdU',
               links: [{title: 'React Router', url: 'https://reactrouter.com/en/main'}, {title: 'Tailwind CSS', url: 'https://tailwindcss.com/docs'}]
            },
            { 
               title: 'Backend with Node & Express', 
               detail: 'Construct high-performance server applications using Node.js event-driven architecture. Set up Express.js middleware pipelines, custom error handling, CORS policies, and RESTful API structures.',
               videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
               links: [{title: 'Node.js Docs', url: 'https://nodejs.org/en/docs/'}, {title: 'Express Routing', url: 'https://expressjs.com/en/guide/routing.html'}]
            },
            { 
               title: 'Database Design with MongoDB', 
               detail: 'Understand Non-Relational (NoSQL) logic. Deploy MongoDB Atlas clusters, create strict data schemas using Mongoose ODM, and utilize powerful aggregation pipelines to query deeply nested data.', 
               videoUrl: 'https://www.youtube.com/embed/ExcRbA7fy_A',
               links: [{title: 'MongoDB Atlas', url: 'https://www.mongodb.com/atlas/database'}, {title: 'Mongoose Docs', url: 'https://mongoosejs.com/'}]
            },
            { 
               title: 'Authentication & Authorization', 
               detail: 'Implement JSON Web Tokens (JWT) for stateless sessions. Hash sensitive user passwords with bcrypt. Build role-based access control (RBAC) middlewares to restrict admin dashboard routes.', 
               videoUrl: 'https://www.youtube.com/embed/7Q17ubqLfaM',
               links: [{title: 'JWT.io', url: 'https://jwt.io/'}, {title: 'Bcrypt Guide', url: 'https://www.npmjs.com/package/bcrypt'}]
            },
            { 
               title: 'Testing & Performance Tuning', 
               detail: 'Write unit tests using Jest and React Testing Library. Execute backend route testing via Supertest. Optimize React re-renders with useCallback, and implement Redis for ultra-fast backend caching.', 
               videoUrl: 'https://www.youtube.com/embed/8Xwq35cPwYg',
               links: [{title: 'RTL Docs', url: 'https://testing-library.com/docs/react-testing-library/intro/'}, {title: 'Jest Testing', url: 'https://jestjs.io/'}]
            },
            { 
               title: 'Deployment & CI/CD Pipelines', 
               detail: 'Deploy the React frontend on Vercel/Netlify. Dockerize the Node server and host on Render or Railway. Set up GitHub Actions for automated continuous integration deployments.', 
               videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI',
               links: [{title: 'Vercel Deployment', url: 'https://vercel.com/docs'}, {title: 'Render Node Web Service', url: 'https://render.com/docs/deploy-node-express-app'}]
            },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'frontend',
        title: 'Frontend Development',
        badge: 'Beginner to Pro',
        description: 'Master the modern web — HTML/CSS fundamentals to React, TypeScript, state management, and extreme web performance testing.',
        steps: [
            { 
                title: 'HTML5 & Semantic Markup', 
                detail: 'Learn proper document structure. Use semantic tags (nav, section, article) for accessibility and SEO. Understand the DOM hierarchy and critical rendering path.', 
                videoUrl: 'https://www.youtube.com/embed/qz0aGYMCzl0',
                links: [{title: 'HTML Elements', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'}, {title: 'Web Accessibility', url: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/'}]
            },
            { 
                title: 'Advanced CSS & Architecture', 
                detail: 'Master CSS Flexbox and Grid layouts. Learn absolute/relative positioning, media queries for responsive design, CSS variables, and styling paradigms like BEM.', 
                videoUrl: 'https://www.youtube.com/embed/1wDfIqT-apE',
                links: [{title: 'CSS Tricks Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/'}, {title: 'Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/'}]
            },
            { 
                title: 'JavaScript Execution Context', 
                detail: 'Understand how the JS engine works. Master closures, scope chains, hoisting, the event loop, and strict mode. Essential for debugging unpredictable behaviors.', 
                videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3s',
                links: [{title: 'Event Loop Visualizer', url: 'http://latentflip.com/loupe'}, {title: 'You Don\'t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS'}]
            },
            { 
                title: 'TypeScript Foundations', 
                detail: 'Bring strict typing to JS. Learn primitive types, interfaces, types vs interfaces, generics, Enums, optional chaining, and utility types (Pick, Omit).', 
                videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs',
                links: [{title: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html'}, {title: 'Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html'}]
            },
            { 
                title: 'Modern React Component APIs', 
                detail: 'Understand the V-DOM. Build scalable folder structures, utilize React Router for navigation, and learn the transition from Class components to Hooks.', 
                videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
                links: [{title: 'React Dev', url: 'https://react.dev/'}]
            },
            { 
                title: 'Server State & Data Fetching', 
                detail: 'Replace local fetch logics with TanStack Query (React Query) or SWR. Master caching, background invalidation, stale-times, and optimistic UI updates.', 
                videoUrl: 'https://www.youtube.com/embed/novnyCaa7To',
                links: [{title: 'TanStack Query', url: 'https://tanstack.com/query/latest'}, {title: 'SWR', url: 'https://swr.vercel.app/'}]
            },
            { 
                title: 'Modern Styling Ecosystem', 
                detail: 'Adopt Tailwind CSS for utility-first styling. Use tools like Shadcn/UI and Radix for accessible, unstyled primitives. Build complex design systems.', 
                videoUrl: 'https://www.youtube.com/embed/dFgzHOX84xQ',
                links: [{title: 'Tailwind CSS', url: 'https://tailwindcss.com/'}, {title: 'Shadcn UI', url: 'https://ui.shadcn.com/'}]
            },
            { 
                title: 'Web Performance Optimization', 
                detail: 'Audit sites with Lighthouse. Implement dynamic imports (code splitting), tree-shaking, image optimization, web workers, and mitigate layout shifts (CLS).', 
                videoUrl: 'https://www.youtube.com/embed/0fONene3OIA',
                links: [{title: 'Web Vitals', url: 'https://web.dev/vitals/'}, {title: 'Lighthouse CI', url: 'https://github.com/GoogleChrome/lighthouse-ci'}]
            },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'backend',
        title: 'Backend Development',
        badge: 'Enterprise Level',
        description: 'Build scalable server-side environments and microservices. Master architectures, databases, caching, and infrastructure resilience.',
        steps: [
            { 
               title: 'Server-Side Paradigms', 
               detail: 'Understand the single-threaded event loop architecture of Node. Master built-in modules: fs, path, crypto, and the stream/buffer APIs for large files.', 
               videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
               links: [{title: 'Node JS Architecture', url: 'https://nodejs.dev/en/learn/'}] 
            },
            { 
               title: 'RESTful API Engineering', 
               detail: 'Architect RESTful APIs using Express. Master middleware chaining, global error handlers, route controllers, request validation, and clean MVC structure.', 
               videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
               links: [{title: 'Express MVC', url: 'https://expressjs.com/en/guide/routing.html'}] 
            },
            { 
               title: 'Relational Databases (SQL)', 
               detail: 'Master PostgreSQL/MySQL. Understand schema normalization, primary/foreign keys, complex JOIN operations, indexing strategies, and database locks.', 
               videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
               links: [{title: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/'}] 
            },
            { 
               title: 'Object Relational Mapping (ORM)', 
               detail: 'Abstract database engines. Integrate Prisma or TypeORM in Node projects to write type-safe queries, handle automated migrations, and manage database seeding.', 
               videoUrl: 'https://www.youtube.com/embed/RebA5J-rlwg',
               links: [{title: 'Prisma Docs', url: 'https://www.prisma.io/docs/'}] 
            },
            { 
               title: 'Authentication Strategies', 
               detail: 'Handle user identity safely. Implement bcrypt password hashing, JSON Web Tokens (JWT) for stateless auth, refresh token rotation, and OAuth 2.0 social logins.', 
               videoUrl: 'https://www.youtube.com/embed/7Q17ubqLfaM',
               links: [{title: 'OAuth 2.0 Simplified', url: 'https://aaronparecki.com/oauth-2-simplified/'}] 
            },
            { 
               title: 'Caching & Optimization (Redis)', 
               detail: 'In-memory data store mastery. Set up Redis to cache expensive DB queries, manage user sessions, implement rate limiting, and build pub-sub message channels.', 
               videoUrl: 'https://www.youtube.com/embed/jgpVdJB2sKQ',
               links: [{title: 'Redis Commands', url: 'https://redis.io/commands/'}] 
            },
            { 
               title: 'Message Brokers & Queues', 
               detail: 'Decouple services using RabbitMQ or BullMQ. Handle heavy background tasks (like video processing or sending bulk emails) safely without blocking the main event loop.', 
               videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOls',
               links: [{title: 'RabbitMQ Tutorials', url: 'https://www.rabbitmq.com/getstarted.html'}] 
            },
            { 
               title: 'CI/CD & Server Deployment', 
               detail: 'Automate zero-downtime releases. Set up GitHub Actions for testing. Configure NGINX reverse proxies, SSL certificates with Let\'s Encrypt, and PM2 process management.', 
               videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI',
               links: [{title: 'NGINX Config', url: 'https://www.nginx.com/resources/wiki/'}] 
            },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'fullstack',
        title: 'Full Stack Web Dev',
        badge: 'Full Stack Pro',
        description: 'End-to-end web deployment — integrating intuitive client-side UI with high-performance scalable server architectures.',
        steps: [
            { 
               title: 'React SPA Architecture', 
               detail: 'Build Single Page Applications. Understand component lifecycle, Hooks API, prop drilling solutions, and client-side routing strategies using React Router.', 
               videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
               links: [{title: 'React Router', url: 'https://reactrouter.com/en/main'}] 
            },
            { 
               title: 'Node & Express Ecosystem', 
               detail: 'Develop server endpoints to handle CRUD operations. Implement global error handling, environment variables config, and robust RESTful API convention patterns.', 
               videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
               links: [{title: 'Express Error Handling', url: 'https://expressjs.com/en/guide/error-handling.html'}] 
            },
            { 
               title: 'Database Design Ecosystem', 
               detail: 'Choose the right database (SQL vs NoSQL). Master MongoDB schemas or PostgreSQL tables. Understand connections, queries, and connection pooling techniques.', 
               videoUrl: 'https://www.youtube.com/embed/W2Z7GOfH07U',
               links: [{title: 'DB Architecture Guide', url: 'https://www.prisma.io/dataguide'}] 
            },
            { 
               title: 'End-to-End Authentication', 
               detail: 'Secure the entire stack. Dispatch encrypted tokens from Node, store them securely in React HttpOnly cookies or memory, and protect frontend routes appropriately.', 
               videoUrl: 'https://www.youtube.com/embed/7Q17ubqLfaM',
               links: [{title: 'HttpOnly Cookies', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies'}] 
            },
            { 
               title: 'Full Stack Next.js Framework', 
               detail: 'Migrate to Next.js. Master Server-Side Rendering (SSR), Static Site Generation (SSG), caching, and Route Handlers to build full-stack apps within a single codebase.', 
               videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk',
               links: [{title: 'Next.js App Router', url: 'https://nextjs.org/docs/app'}] 
            },
            { 
               title: 'File Upload & Storage Infrastructures', 
               detail: 'Accept multipart form uploads on the frontend, process them with Express/Multer, optimize images in Node, and stream the final file to secure AWS S3 buckets.', 
               videoUrl: 'https://www.youtube.com/embed/srPXMt1Q0nY',
               links: [{title: 'AWS S3 Setup', url: 'https://docs.aws.amazon.com/s3/index.html'}] 
            },
            { 
               title: 'Containerization Basics', 
               detail: 'Unify frontend and backend environments using Docker. Create multi-container applications via Docker Compose to guarantee environment parity on across devices.', 
               videoUrl: 'https://www.youtube.com/embed/3c-iBn7E9d8',
               links: [{title: 'Docker Compose', url: 'https://docs.docker.com/compose/'}] 
            },
            { 
               title: 'Cloud Deployment Strategies', 
               detail: 'Deploy frontend assets to Vercel/Netlify CDNs. Host Node backends on EC2, Render, or Railway. Link databases securely, and establish continuous integration loops.', 
               videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI',
               links: [{title: 'Vercel Connect', url: 'https://vercel.com/docs/concepts/projects/overview'}] 
            },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'javascript',
        title: 'JavaScript Ecosystem',
        badge: 'Language Master',
        description: 'Comprehensive guide to mastering vanilla JavaScript. Advance from ES5 paradigms to hardcore asynchronous ES6+ performance handling.',
        steps: [
            { title: 'The Call Stack & Engine', detail: 'V8 Engine internals. Learn memory heaps, execution contexts, hoisting layers, and garbage collection mechanisms.', videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3s', links: [{title: 'MDN Call Stack', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Call_stack'}] },
            { title: 'Closures & Scope Chains', detail: 'Understand lexical scoping deeply. Implement closure factories, module patterns, and isolate state beautifully without classes.', videoUrl: 'https://www.youtube.com/embed/vKJpN5FAeF4', links: [{title: 'Closures MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'}] },
            { title: 'Asynchronous Programming', detail: 'Microtasks vs Macrotasks. Master the Event Loop, Promises, Async/Await syntax, and handle intense Promise.all parallel executions safely.', videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ', links: [{title: 'JS Event Loop', url: 'https://javascript.info/event-loop'}] },
            { title: 'Prototypes & OOP', detail: 'Go beneath class syntax. Manipulate prototype chains directly, utilize prototypal inheritance, and bind `this` contexts dynamically.', videoUrl: 'https://www.youtube.com/embed/4dzGc1fABrc', links: [{title: 'Inheritance MDN', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain'}] },
            { title: 'Functional Programming (FP)', detail: 'Embrace immutability. Master exact higher-order functions (HOFs), currying, pure function composition, and recursive paradigms.', videoUrl: 'https://www.youtube.com/embed/e-5obm1G_FY', links: [{title: 'FP Guide', url: 'https://flaviocopes.com/javascript-functional-programming/'}] },
            { title: 'NPM & Bundlers (Vite/Webpack)', detail: 'Compile modern code for legacy browsers. Set up Babel layers, formulate complex Webpack config structures, or execute blazing fast Vite HMR protocols.', videoUrl: 'https://www.youtube.com/embed/5IG4UmULyoA', links: [{title: 'Vite Next Gen', url: 'https://vitejs.dev/guide/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'python',
        title: 'Python Development',
        badge: 'Essential',
        description: 'From zero to Python software engineer. Extensive mastery of automation, backend scraping, and multi-thread data processing.',
        steps: [
            { title: 'Python Core & Data Types', detail: 'Understand lists, dictionaries, tuples, sets. Write powerful list comprehensions, handle exceptions smoothly, and establish virtual environments gracefully.', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8', links: [{title: 'Python Org', url: 'https://docs.python.org/3/tutorial/'}] },
            { title: 'Advanced OOP', detail: 'Utilize dunder/magic methods perfectly (e.g. __init__, __str__). Formulate advanced class inheritance frameworks and manage polymorphic behaviors natively.', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0', links: [{title: 'Python OOP', url: 'https://realpython.com/python3-object-oriented-programming/'}] },
            { title: 'Functional Python & Generators', detail: 'Differentiate map, filter, zip natively. Create iterative lambda expressions perfectly and deploy yield generators to handle massive datasets seamlessly.', videoUrl: 'https://www.youtube.com/embed/bD05uBecCGQ', links: [{title: 'Generators Guide', url: 'https://realpython.com/introduction-to-python-generators/'}] },
            { title: 'Web Scraping & Automation', detail: 'Retrieve structural internet data safely. Extract massive tree hierarchies via Beautiful Soup, automate headless browsers utilizing Selenium securely, and define Scrapy pipelines natively.', videoUrl: 'https://www.youtube.com/embed/XVv6mJpFOb0', links: [{title: 'Beautiful Soup', url: 'https://www.crummy.com/software/BeautifulSoup/bs4/doc/'}] },
            { title: 'Backend APIs (FastAPI/Flask)', detail: 'Build robust network interfaces quickly. Deploy precise Flask microservices successfully or implement bleeding edge async endpoints securely via FastAPI architecture.', videoUrl: 'https://www.youtube.com/embed/0sOvCWFmrtA', links: [{title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/'}] },
            { title: 'Data Processing (Pandas/NumPy)', detail: 'Engineer rapid numerical analysis pipelines locally. Read immense datasets structurally, execute NumPy vectorized formulas reliably, and plot analytical representations effortlessly.', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', links: [{title: 'Pandas Guide', url: 'https://pandas.pydata.org/docs/user_guide/index.html'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'typescript',
        title: 'TypeScript Mastery',
        badge: 'Types & Safety',
        description: 'The standard for enterprise software. Transform loose JavaScript into scalable, strictly-typed systems.',
        steps: [
            { title: 'Basics & Primitives', detail: 'Add compilation safety. Define basic types natively, assign Arrays/Tuples exactly, specify dynamic Objects appropriately, and comprehend the structural `any` versus `unknown` difference deeply.', videoUrl: 'https://www.youtube.com/embed/BwuLxPH8IDs', links: [{title: 'TS Handbook', url: 'https://www.typescriptlang.org/docs/handbook/intro.html'}] },
            { title: 'Interfaces vs Type Aliases', detail: 'Evaluate complex mapping intelligently. Determine precisely when to use Interfaces over Types securely, extend legacy interfaces consistently, and implement powerful Intersection types systematically.', videoUrl: 'https://www.youtube.com/embed/d56mG7DezGs', links: [{title: 'Types vs Interfaces', url: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'}] },
            { title: 'Functions & Generics', detail: 'Write fully reusable abstractions structurally. Establish dynamic Generic Type Variables `<T>` securely, create strict function boundary signatures correctly, and evaluate complex constraints actively.', videoUrl: 'https://www.youtube.com/embed/nViEqnHwLQG', links: [{title: 'TS Generics', url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html'}] },
            { title: 'Advanced Utility Types', detail: 'Transform existing interfaces dynamically. Understand complex mapped types correctly, utilize native Pick/Omit safely, evaluate robust Partial/Required implementations optimally, and assess specific ReturnType operations dependably.', videoUrl: 'https://www.youtube.com/embed/2l0C10mU_U0', links: [{title: 'Utility Types', url: 'https://www.typescriptlang.org/docs/handbook/utility-types.html'}] },
            { title: 'React with TypeScript', detail: 'Combine typing with UI correctly. Type dynamic React component Hooks consistently, declare precise functional Props intelligently, type sophisticated Event handlers seamlessly, and evaluate advanced Ref typings fluently.', videoUrl: 'https://www.youtube.com/embed/Z5iWr6Srsj8', links: [{title: 'React+TS CheatSheet', url: 'https://react-typescript-cheatsheet.netlify.app/'}] },
            { title: 'Node.js Backend with TS', detail: 'Adopt safe server environments reliably. Setup ts-node compilation execution smoothly, structure Express types dynamically, establish Prisma schema interfaces dependably, and utilize precise TypeORM integration models deeply.', videoUrl: 'https://www.youtube.com/embed/1UcLoOD1lIQ', links: [{title: 'TS Node Setup', url: 'https://khalilstemmler.com/blogs/typescript/node-starter-project/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'java',
        title: 'Java Development',
        badge: 'Enterprise Core',
        description: 'Java remains the backbone of immense backend corporate systems. Deep dive into OOP, JVM internals, and advanced Spring ecosystems.',
        steps: [
            { title: 'Java Core & JVM Architecture', detail: 'Understand the specific compilation methodologies natively. Differentiate JDK, JRE, JVM structurally, examine memory regions dynamically (Heap/Stack), and code essential variables accurately.', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34', links: [{title: 'Oracle Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/'}] },
            { title: 'Object-Oriented Mastery', detail: 'Apprehend enterprise structure paradigms completely. Guarantee exact Encapsulation optimally, implement multi-level Polymorphism securely, formulate complete Abstraction layers accurately, and define strict Interface contracts solidly.', videoUrl: 'https://www.youtube.com/embed/pTB0EiLXUC8', links: [{title: 'Java OOP Concepts', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/'}] },
            { title: 'Collections Framework', detail: 'Evaluate data dynamically completely. Navigate dense Lists/Sets seamlessly, orchestrate rapid Maps intuitively, formulate custom sorting with Comparators efficiently, and apply generic boundaries rigorously.', videoUrl: 'https://www.youtube.com/embed/vi2ioIEgAEY', links: [{title: 'Java Collections', url: 'https://docs.oracle.com/javase/8/docs/technotes/guides/collections/overview.html'}] },
            { title: 'Multithreading & Concurrency', detail: 'Process complex logic asynchronously dynamically. Initiate standalone Threads properly, orchestrate parallel Runnables securely, establish strict Synchronization blocks dependably, and operate explicit ExecutorServices safely.', videoUrl: 'https://www.youtube.com/embed/e3X0lRz2h0I', links: [{title: 'Java Concurrency', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/'}] },
            { title: 'Spring Boot Architecture', detail: 'Construct vast application microservices optimally. Operate fundamental Dependency Injection (DI) smoothly, master Inversion of Control (IoC) conceptually, build comprehensive REST Controllers effectively, and setup structural Spring Data JPA precisely.', videoUrl: 'https://www.youtube.com/embed/9SGDpanrc8U', links: [{title: 'Spring Boot Reference', url: 'https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/'}] },
            { title: 'Enterprise Security (Spring Security)', detail: 'Secure Java deployments thoroughly. Enforce widespread authorization filters deeply, implement tokenized JWT operations seamlessly, configure massive OAuth2 providers successfully, and safeguard API routes effectively.', videoUrl: 'https://www.youtube.com/embed/her_7pa0vrg', links: [{title: 'Spring Security Architecture', url: 'https://spring.io/guides/topicals/spring-security-architecture'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'cplusplus',
        title: 'C++ Programming',
        badge: 'High Performance',
        description: 'Systems, gaming, and extreme trading software. Master absolute memory control and lightning-fast low-level executions.',
        steps: [
            { title: 'C++ Foundations & Syntax', detail: 'Acquire static compilation abilities structurally. Formulate basic functions correctly, apply robust conditionals extensively, manipulate arrays logically, and construct essential iterative loop frameworks successfully.', videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y', links: [{title: 'CPlusPlus.com Topics', url: 'https://cplusplus.com/doc/tutorial/'}] },
            { title: 'Pointers & Memory Control', detail: 'Unlock system power completely. Manage direct RAM pointers securely, configure explicit Dereferencing accurately, implement dynamic Heap allocation effectively (new/delete), and eliminate distinct memory leaks cleanly.', videoUrl: 'https://www.youtube.com/embed/zuegQmMdy8M', links: [{title: 'Pointers Explained', url: 'https://www.learncpp.com/cpp-tutorial/pointers/'}] },
            { title: 'Modern C++ (11/14/17)', detail: 'Access cutting edge features intuitively. Write elegant auto typing safely, deploy advanced smart pointers (unique_ptr, shared_ptr) seamlessly, instantiate clean Lambda expressions rapidly, and process distinct Move semantics robustly.', videoUrl: 'https://www.youtube.com/embed/1O7m19D6Zg0', links: [{title: 'Modern C++ Features', url: 'https://github.com/AnthonyCalandra/modern-cpp-features'}] },
            { title: 'Object-Oriented Programming (OOP) C++', detail: 'Define sophisticated class states natively. Execute exact Inheritance paradigms fluently, override distinct Virtual functions precisely, enforce pure Abstract classes securely, and resolve massive Diamond problem hierarchies efficiently.', videoUrl: 'https://www.youtube.com/embed/wKNE1FkF-J0', links: [{title: 'C++ Classes Guide', url: 'https://www.learncpp.com/cpp-tutorial/classes-and-class-members/'}] },
            { title: 'Standard Template Library (STL)', detail: 'Manipulate universal algorithms smoothly. Access dynamic Vectors fluidly, instantiate specific Maps/Sets quickly, understand generic Iterators extensively, and utilize predefined sorting algorithms dependably.', videoUrl: 'https://www.youtube.com/embed/bOlK8sOQy5I', links: [{title: 'STL Reference', url: 'https://en.cppreference.com/w/cpp/container'}] },
            { title: 'Concurrency & Multi-threading', detail: 'Develop massive parallel computations directly. Control explicit std::thread accurately, process discrete Mutex locking flawlessly, avoid structural Deadlocks dependably, and guarantee safe asynchronous atomic operations seamlessly.', videoUrl: 'https://www.youtube.com/embed/LL8wkskDlbs', links: [{title: 'C++ Concurrency Rules', url: 'https://isocpp.org/wiki/faq/pointers-to-members#concurrency'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'go',
        title: 'Go (Golang)',
        badge: 'Backend Scalability',
        description: 'Pioneered by Google for massive cloud infrastructure. Harness intuitive Goroutines for blazing-fast microservices architectures.',
        steps: [
            { title: 'Go Basics & Environment', detail: 'Configure the strict Go toolchain successfully. Understand primitive types natively, define structural precise functions swiftly, manage modular Packages intelligently, and execute distinct strict statically-typed variable declarations effectively.', videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU', links: [{title: 'Tour of Go', url: 'https://go.dev/tour/welcome/1'}] },
            { title: 'Control Structures & Maps', detail: 'Direct execution logic appropriately. Construct rapid `for` loops elegantly, deploy advanced `switch` evaluations actively, instantiate complex Maps efficiently, and execute fluid `defer` routines accurately.', videoUrl: 'https://www.youtube.com/embed/yQjJioUf2k8', links: [{title: 'Go Details Map/Slice', url: 'https://go.dev/blog/maps'}] },
            { title: 'Structs & Interfaces', detail: 'Achieve scalable abstraction efficiently. Establish robust Struct definitions properly, implement Method receivers locally, define explicit interface behaviors natively, and instantiate exact polymorphism without traditional class hierarchies deeply.', videoUrl: 'https://www.youtube.com/embed/1E_vHkFEvn' },
            { title: 'Goroutines & Concurrency', detail: 'The absolute core of Go computing. Spawn lightweight Goroutines asynchronously, define strict wait groups intelligently, prevent race conditions actively, and manage complex system threading simultaneously seamlessly.', videoUrl: 'https://www.youtube.com/embed/f6kdp27TYZs', links: [{title: 'Go Concurrency Patterns', url: 'https://go.dev/blog/pipelines'}] },
            { title: 'Channels & Select Statements', detail: 'Share data effectively. Process buffered Channels securely, organize massive non-blocking selections (Select) properly, establish clear worker pools robustly, and broadcast communication protocols flawlessly.', videoUrl: 'https://www.youtube.com/embed/z4Aijx-qNls', links: [{title: 'Effective Go - Channels', url: 'https://go.dev/doc/effective_go#channels'}] },
            { title: 'Web Servers & Gin Framework', detail: 'Engineer backend APIs elegantly. Initiate high-speed native HTTP servers accurately, serialize immense JSON payloads proficiently, utilize the Gin router structurally, and handle distinct SQL/PostgreSQL database connections seamlessly.', videoUrl: 'https://www.youtube.com/embed/3A-q2cK2oA0', links: [{title: 'Gin Web Framework', url: 'https://gin-gonic.com/docs/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'rust',
        title: 'Rust Programming',
        badge: 'Safe Systems',
        description: 'Memory-safe systems programming. Unparalleled performance with a unique borrow checker that absolutely eliminates runtime data races.',
        steps: [
            { title: 'Rust Ecosystem & Cargo', detail: 'Setup the massive Cargo build system seamlessly. Install crates smoothly, interpret structural TOML configurations accurately, construct foundational variables cleanly, and master exact static-typing derivations correctly.', videoUrl: 'https://www.youtube.com/embed/5C_HPTJg5ek', links: [{title: 'The Rust Book', url: 'https://doc.rust-lang.org/book/'}] },
            { title: 'Ownership & Borrowing', detail: 'Master the revolutionary memory protocol directly. Interpret profound Ownership rules inherently, utilize powerful references seamlessly (Borrowing), specify exact Lifetime parameters thoroughly, and nullify deep dangling pointers functionally.', videoUrl: 'https://www.youtube.com/embed/8M0ROZXsBQw', links: [{title: 'Rust Ownership', url: 'https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html'}] },
            { title: 'Structs, Enums & Pattern Matching', detail: 'Deconstruct massive state management functionally. Determine robust Struct templates comprehensively, formulate advanced Enums exactly, and configure strict exhaustive Match control flows dynamically.', videoUrl: 'https://www.youtube.com/embed/bX_GZfTIFGE', links: [{title: 'Rust Pattern Matching', url: 'https://doc.rust-lang.org/book/ch06-02-match.html'}] },
            { title: 'Error Handling (Result/Option)', detail: 'Guarantee runtime safety dependably. Eliminate null evaluations intrinsically using `Option<T>`, orchestrate predictable failure returns via `Result<T, E>`, and propagate advanced errors with the intuitive `?` operator precisely.', videoUrl: 'https://www.youtube.com/embed/wMXXjmZpNMI', links: [{title: 'Rust Error Handling', url: 'https://doc.rust-lang.org/book/ch09-00-error-handling.html'}] },
            { title: 'Traits & Generics', detail: 'Implement robust abstractions optimally. Specify powerful generic bounding requirements strictly, establish exact reusable interface methods through Traits accurately, and execute massive static dispatch methodologies safely.', videoUrl: 'https://www.youtube.com/embed/bnnacleqg6k', links: [{title: 'Rust Traits', url: 'https://doc.rust-lang.org/book/ch10-02-traits.html'}] },
            { title: 'Fearless Concurrency', detail: 'Scale processing massively. Develop multi-thread implementations consistently using `Arc<Mutex<T>>`, spawn complex thread ecosystems asynchronously, orchestrate asynchronous Tokio execution securely, and ensure completely safe data sharing dynamically.', videoUrl: 'https://www.youtube.com/embed/P_Pki_2_h4Q', links: [{title: 'Tokio Async', url: 'https://tokio.rs/tokio/tutorial'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'react',
        title: 'React Ecosystem',
        badge: 'UI Champion',
        description: 'Extensive deep dive into the world\'s most popular library. Master compound components, SSR patterns, and heavy state optimizations.',
        steps: [
            { title: 'JSX & React Elements', detail: 'Discover the exact mechanisms converting JSX XML strings into native JS AST functionally. Formulate discrete basic components intelligently, orchestrate complex Props chains predictably, and comprehend precise virtual DOM mapping completely.', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', links: [{title: 'React Dev JSX', url: 'https://react.dev/learn/writing-markup-with-jsx'}] },
            { title: 'Advanced Hooks Mechanics', detail: 'Command the specific hooks execution contexts dependably. Reconstruct native useReducer for advanced state systematically, apply dynamic generic Refs for strict DOM measurements cleanly, and configure robust explicit custom hooks consistently.', videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', links: [{title: 'React Hooks Ref', url: 'https://react.dev/reference/react'}] },
            { title: 'Rendering Optimization', detail: 'Achieve massive framerates dynamically. Isolate rendering bottlenecks appropriately, employ functional React.memo actively, resolve heavy closures with useCallback adequately, and execute distinct useMemo algorithms properly.', videoUrl: 'https://www.youtube.com/embed/0W6i5De-qpG', links: [{title: 'React Profiler', url: 'https://react.dev/reference/react/Profiler'}] },
            { title: 'Patterns & Composition', detail: 'Build sophisticated API designs securely. Formulate structural Compound Components inherently, orchestrate detailed HOCs optimally, integrate dynamic Render Props flawlessly, and deploy accessible slot implementations organically.', videoUrl: 'https://www.youtube.com/embed/hEGg-3pIHlE', links: [{title: 'Advanced React Patterns', url: 'https://frontendmasters.com/courses/advanced-react-patterns/'}] },
            { title: 'Complex State Management', detail: 'Bridge extreme prop-drilling operations safely. Deploy optimal Zustand store integrations optimally, instantiate distinct Context API instances correctly, orchestrate robust Redux RTK methodologies cleanly, or construct functional Jotai atoms smoothly.', videoUrl: 'https://www.youtube.com/embed/B_n4YONte5A', links: [{title: 'Zustand Docs', url: 'https://docs.pmnd.rs/zustand/getting-started/introduction'}] },
            { title: 'React Server Architectures', detail: 'Adopt the extreme modern edge perfectly. Navigate functional React Server Components (RSC) cleanly, establish strict Server Actions safely, manage complex streaming HTML methodologies actively, and compile applications explicitly with Next.js properly.', videoUrl: 'https://www.youtube.com/embed/ZjAqacigCGo', links: [{title: 'Next JS App Router', url: 'https://nextjs.org/docs'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'nextjs',
        title: 'Next.js Development',
        badge: 'Modern Web',
        description: 'The React framework for production. Master server actions, hybrid rendering (SSR/SSG), API endpoints, and extreme edge deployments.',
        steps: [
            { title: 'App Router Foundations', detail: 'Navigate the complete App Directory system profoundly. Map dynamic route segments securely, orchestrate distinct parallel layouts safely, deploy structural loading UI effectively, and implement native customized error boundary handlers natively.', videoUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk', links: [{title: 'App Router Concepts', url: 'https://nextjs.org/docs/app/building-your-application/routing'}] },
            { title: 'Server Components (RSC)', detail: 'Reduce fundamental client payload definitively. Define explicit separation boundaries (`"use client"`), fetch massive server data directly from components seamlessly, and resolve sensitive backend logic purely off-client explicitly.', videoUrl: 'https://www.youtube.com/embed/VBlSe8tvg4U', links: [{title: 'Next Server Components', url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components'}] },
            { title: 'Data Fetching & Caching', detail: 'Execute the absolute fastest data delivery globally. Establish robust robust static generation (SSG) correctly, integrate explicit on-demand Revalidation (ISR) securely, process strict dynamic server rendering (SSR) continuously, and intercept specific fetch caches logically.', videoUrl: 'https://www.youtube.com/embed/gSSsZReIFRk', links: [{title: 'Data Fetching & Caching', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching'}] },
            { title: 'Server Actions & Mutations', detail: 'Perform intense form handling without API routes naturally. Author seamless server-side mutations synchronously, utilize optimistic UI (useOptimistic) progressively, execute comprehensive pending states neatly, and invoke actions systematically.', videoUrl: 'https://www.youtube.com/embed/dDpZfOQBMaA', links: [{title: 'Next Server Actions', url: 'https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations'}] },
            { title: 'Authentication Paradigms', detail: 'Lockdown specific layouts properly. Install robust NextAuth.js protocols reliably, link massive distinct OAuth strategies consistently, enforce distinct role-based route middleware correctly, and construct session cookie mechanisms powerfully.', videoUrl: 'https://www.youtube.com/embed/1YJWOSMExzg', links: [{title: 'NextAuth.js (Auth.js)', url: 'https://authjs.dev/'}] },
            { title: 'SEO & Performance Deep Dive', detail: 'Engineer extreme search configurations perfectly. Create dynamic absolute Metadata elegantly, serve optimized dynamic open-graph generated images smoothly, construct native performant sitemaps correctly, and implement robust Next/Image optimization flawlessly.', videoUrl: 'https://www.youtube.com/embed/ydZfaF2zJjY', links: [{title: 'Next.js SEO metadata', url: 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'angular',
        title: 'Angular Development',
        badge: 'Enterprise Architecture',
        description: 'Google\'s massive structured framework. Conquer dependency injection, robust RxJS pipelines, strict TypeScript modules, and vast scalable configurations.',
        steps: [
            { title: 'Angular Architecture & CLI', detail: 'Set massive infrastructural standards explicitly. Operate the comprehensive Angular CLI seamlessly, synthesize distinct Modules correctly, render native component views securely, and define strict structural data binding consistently.', videoUrl: 'https://www.youtube.com/embed/3qBXWUpoPHo', links: [{title: 'Angular Docs', url: 'https://angular.dev/'}] },
            { title: 'Directives & Pipes', detail: 'Manipulate vast DOM rendering logically. Execute essential structural directives dependably (ngIf, ngFor), initiate customized attribute formatting accurately, bind custom structural view transformations natively, and execute built-in specific data pipes smoothly.', videoUrl: 'https://www.youtube.com/embed/e1_BovAIsUE', links: [{title: 'Directives Guide', url: 'https://angular.dev/guide/directives'}] },
            { title: 'Services & Dependency Injection', detail: 'Isolate deep business logic intelligently. Engineer complex global singleton patterns reliably, orchestrate hierarchical injectable providers accurately, configure extensive Http client requests smoothly, and implement clean abstraction interfaces clearly.', videoUrl: 'https://www.youtube.com/embed/_BwXoDPAf6E', links: [{title: 'DI in Angular', url: 'https://angular.dev/guide/di'}] },
            { title: 'RxJS & Reactive Programming', detail: 'Transform extreme asynchronous events purely. Create native explicit Observables functionally, execute strict RxJS mapping (mergeMap, switchMap) logically, pipe extensive data streams safely, and coordinate complex multi-event emissions brilliantly.', videoUrl: 'https://www.youtube.com/embed/TqB8HwWezZk', links: [{title: 'RxJS Library', url: 'https://rxjs.dev/'}] },
            { title: 'Reactive Forms Ecosystem', detail: 'Handle large multi-input complexity precisely. Establish defined FormGroup validations intuitively, orchestrate real-time async server validations accurately, react directly to vast value changes dependably, and structure complex dynamic form arrays profoundly.', videoUrl: 'https://www.youtube.com/embed/JeeUY6WaXiA', links: [{title: 'Reactive Forms', url: 'https://angular.dev/guide/forms/reactive-forms'}] },
            { title: 'Nx Monorepo & Angular Universal', detail: 'Scale deployments completely. Coordinate immense distinct mono-repo systems natively, deploy Server Side Rendering efficiently to assist extreme SEO tracking, implement explicit deep lazy loading actively, and maintain strict standalone components dependably.', videoUrl: 'https://www.youtube.com/embed/nUewUv_6R5U', links: [{title: 'Nx documentation', url: 'https://nx.dev/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'system-design',
        title: 'System Design',
        badge: 'Staff Engineer Track',
        description: 'Architect incredible large-scale distributed systems — from profound requirements analysis to fault-tolerant globally deployed architectures.',
        steps: [
            { 
               title: 'System Design Foundational Ideals', 
               detail: 'Design massive systems structurally. Analyze structural Scalability logically, establish profound Reliability dynamically, guarantee extreme Availability fundamentally, ensure deep Consistency properly, decode the absolute CAP theorem naturally, and synthesize effective System requirements gathering logically.', 
               videoUrl: 'https://www.youtube.com/embed/i53Gi_K3o7I',
               links: [{title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer'}, {title: 'ByteByteGo System Design', url: 'https://bytebytego.com/'}]
            },
            { 
               title: 'High-Level Networking layers', 
               detail: 'Transmit huge data payloads reliably. Exploit reliable HTTP/HTTPS optimally, manipulate deep TCP/UDP effectively, configure dynamic WebSockets seamlessly, process distinct gRPC correctly, establish optimal REST vs GraphQL adequately, evaluate distinct DNS resolution successfully, and establish powerful CDN architecture securely.', 
               videoUrl: 'https://www.youtube.com/embed/IPvYjXCsTg8',
               links: [{title: 'Cloudflare What is DNS', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/'}]
            },
            { 
               title: 'Database Optimization Engineering', 
               detail: 'Structure raw storage perfectly. Select optimal SQL vs NoSQL trade-offs adequately, configure reliable Sharding logically, formulate precise Replication efficiently, perform intelligent Partitioning securely, discover distinct Indexing strategies functionally, and validate fundamental ACID vs BASE intuitively.', 
               videoUrl: 'https://www.youtube.com/embed/W2Z7GOfH07U',
               links: [{title: 'Database Sharding Concepts', url: 'https://aws.amazon.com/what-is/database-sharding/'}]
            },
            { 
               title: 'Global Caching Strategies', 
               detail: 'Deliver immediate content intelligently. Write accurate Cache-aside logically, configure rapid Write-through effortlessly, integrate smooth Write-behind gracefully, operate fast Redis/Memcached properly, process deep Cache invalidation dynamically, and configure distinct CDN caching gracefully.', 
               videoUrl: 'https://www.youtube.com/embed/jgpVdJB2sKQ',
               links: [{title: 'AWS Caching Tech', url: 'https://aws.amazon.com/caching/'}]
            },
            { 
               title: 'Distributed Message Ecosystems', 
               detail: 'Asynchronize server requests broadly. Integrate deep Apache Kafka logically, deploy standard RabbitMQ reliably, handle asynchronous Event-driven architecture efficiently, understand scalable Pub/Sub securely, calculate massive Stream processing elegantly, and catch specific Dead letter queues systematically.', 
               videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOls',
               links: [{title: 'Kafka Architecture', url: 'https://kafka.apache.org/documentation/'}]
            },
            { 
               title: 'Proxies & Resilient Balancing', 
               detail: 'Balance high volume network demands precisely. Evaluate flexible Reverse proxy fundamentally, manage efficient Load balancing algorithms successfully, conduct necessary Health checks securely, establish secure API gateway implementations flawlessly, implement profound Rate limiting intelligently, and engineer absolute Circuit breakers seamlessly.', 
               videoUrl: 'https://www.youtube.com/embed/K0Ta65OqQkY',
               links: [{title: 'NGINX Load Balancing', url: 'https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/'}]
            },
            { 
               title: 'Microservices Decomposition', 
               detail: 'Separate massive concerns intelligently. Execute scalable Service decomposition properly, connect distinct Inter-service communication dynamically, navigate profound Saga pattern gracefully, leverage extensive Service mesh precisely, and master structured Domain-Driven Design professionally.', 
               videoUrl: 'https://www.youtube.com/embed/lTAcCNbJ7KE',
               links: [{title: 'Microservices Design Patterns', url: 'https://microservices.io/patterns/'}]
            },
            { 
               title: 'Storage Medium Architectures', 
               detail: 'Catalog unstructured files logically. Organize absolute Object storage (S3) adequately, structure detailed Block storage conceptually, handle huge File systems fundamentally, query massive Data lakes properly, evaluate fast Blob storage natively, and guarantee robust Backup strategies accurately.', 
               videoUrl: 'https://www.youtube.com/embed/xoGq7EfyJnU',
               links: [{title: 'AWS S3 Concepts', url: 'https://aws.amazon.com/s3/'}]
            },
            { 
               title: 'Complex Design Analysis Studies', 
               detail: 'Breakdown corporate systems fundamentally. Deconstruct a generic Design URL Shortener logically, evaluate the deep Twitter Feed intuitively, reconstruct typical WhatsApp effectively, define vast YouTube functionally, orchestrate global Uber adequately, outline massive Instagram conceptually, and formulate a responsive Notification system accurately.', 
               videoUrl: 'https://www.youtube.com/embed/rnkBKzbFe6U',
               links: [{title: 'System Design Interview Guide', url: 'https://igotanoffer.com/blogs/tech/system-design-interviews'}]
            },
            { 
               title: 'High Availability & Reliability Tracking', 
               detail: 'Safeguard live environments fundamentally. Structure widespread Distributed tracing precisely, execute vast Logging architecture intelligently, configure specific Alerting systems seamlessly, implement dangerous Chaos engineering accurately, formulate perfect Disaster recovery logically, and define exact strict SLOs natively.', 
               videoUrl: 'https://www.youtube.com/embed/uTEL8Ff1Zvk',
               links: [{title: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/'}]
            },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'ui-ux-design',
        title: 'UI/UX Design',
        badge: 'Creative Tech',
        description: 'Design the future of software. Master user psychology, wireframing, high-fidelity prototyping, and design systems in Figma.',
        steps: [
            { title: 'Design Principles & Psychology', detail: 'Understand Gestalt principles, color theory, typography scales, contrast checking, and cognitive load management to craft visually appealing and functional layouts.', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', links: [{title: 'Laws of UX', url: 'https://lawsofux.com/'}] },
            { title: 'User Research & Journey Mapping', detail: 'Conduct user interviews, create detailed empirical personas, map empathy diagrams, and chart complete user journey flows to solve real human problems.', videoUrl: 'https://www.youtube.com/embed/xQx2E3LpxvI', links: [{title: 'NNGroup Journey Mapping', url: 'https://www.nngroup.com/articles/journey-mapping-101/'}] },
            { title: 'Information Architecture', detail: 'Organize complex system content. Develop intuitive navigation hierarchies, logical card sorting, and user-centric sitemaps that prioritize discoverability.', videoUrl: 'https://www.youtube.com/embed/2-iR-nC_U8w', links: [{title: 'Information Architecture', url: 'https://www.uxbooth.com/articles/complete-beginners-guide-to-information-architecture/'}] },
            { title: 'Figma Mastery', detail: 'Become a power user in the industry-standard tool. Master frames, constraints, vector editing, boolean operations, components, and auto-layout strategies.', videoUrl: 'https://www.youtube.com/embed/e502GndR2cM', links: [{title: 'Figma Learn', url: 'https://help.figma.com/hc/en-us'}] },
            { title: 'Design Systems & Tokens', detail: 'Build reusable, scalable design libraries. Define strict color tokens, typographic variables, spacing systems, and nested component variants to maintain consistency.', videoUrl: 'https://www.youtube.com/embed/sM67A5m309w', links: [{title: 'Material Design', url: 'https://m3.material.io/'}] },
            { title: 'Developer Handoff', detail: 'Bridge the design-to-development gap. Annotate complex CSS parameters, export highly optimized SVG assets, and communicate responsive breakpoints clearly.', videoUrl: 'https://www.youtube.com/embed/EwF312Z10Dk', links: [{title: 'Figma Dev Mode', url: 'https://www.figma.com/dev-mode/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'qa-testing',
        title: 'QA Automation',
        badge: 'Quality Architect',
        description: 'Ensure software reliability through rigorous automated test suites, CI/CD integrations, and bug identification pipelines.',
        steps: [
            { title: 'Software Testing Fundamentals', detail: 'Understand the Software Testing Life Cycle (STLC). Differentiate between Black-box vs White-box testing, agile methodologies, and the testing pyramid.', videoUrl: 'https://www.youtube.com/embed/a-T0ErbW8E0', links: [{title: 'ISTQB Foundation', url: 'https://www.istqb.org/'}] },
            { title: 'API Testing Strategy', detail: 'Verify backend integrity. Use Postman or Insomnia to execute HTTP requests, assert secure status codes, validate JSON response schemas, and test auth tokens.', videoUrl: 'https://www.youtube.com/embed/t6QvIK0k25w', links: [{title: 'Postman Learning', url: 'https://learning.postman.com/docs/introduction/overview/'}] },
            { title: 'Modern UI Automation (Cypress)', detail: 'Embrace modern frameworks. Write ultra-fast E2E tests, handle asynchronous waiting natively, mock backend network traffic, and capture screenshot diffs upon failure.', videoUrl: 'https://www.youtube.com/embed/LcgWwP9cpeM', links: [{title: 'Cypress Docs', url: 'https://docs.cypress.io/'}] },
            { title: 'Behavior Driven Development', detail: 'Bridge business and engineering. Use Cucumber and Gherkin syntax (Given/When/Then) to write English-readable test scenarios that automatically execute code.', videoUrl: 'https://www.youtube.com/embed/w74-U3w_2U4', links: [{title: 'Cucumber Docs', url: 'https://cucumber.io/docs/cucumber/'}] },
            { title: 'Performance & Load Testing', detail: 'Stress test applications before production crashes. Use Apache JMeter or k6 to simulate thousands of concurrent virtual users, analyzing throughput and bottlenecks.', videoUrl: 'https://www.youtube.com/embed/kRjKzR1OQG0', links: [{title: 'k6 Documentation', url: 'https://k6.io/docs/'}] },
            { title: 'Continuous Integration / CI', detail: 'Automate test execution. Configure GitHub Actions or Jenkins to run full E2E automation suites parallelly on every PR pull, blocking faulty merge attempts.', videoUrl: 'https://www.youtube.com/embed/R8_veQiYBjI', links: [{title: 'GitHub Actions Testing', url: 'https://docs.github.com/en/actions'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'ai-ml',
        title: 'Machine Learning',
        badge: 'Expert Track',
        description: 'Python to production ML — neural networks, LLM fine-tuning, RAG pipelines, and sophisticated MLOps deployments.',
        steps: [
            { title: 'Applied Math & LinAlg', detail: 'Dive into the math underlying tensors. Understand matrix multiplication, dot products, eigenvalues, multivariable calculus concepts, and probability distributions.', videoUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs', links: [{title: 'Mathematics for ML', url: 'https://mml-book.github.io/'}] },
            { title: 'Classical Machine Learning', detail: 'Understand traditional predictive modeling. Implement Linear/Logistic regression, Decision Trees, SVMs, and K-Means using scikit-learn. Master cross-validation.', videoUrl: 'https://www.youtube.com/embed/GwIo3gDZCVQ', links: [{title: 'Scikit-Learn Guide', url: 'https://scikit-learn.org/stable/user_guide.html'}] },
            { title: 'Deep Learning Foundation', detail: 'Build neurons from scratch. Understand perceptrons, activation functions (ReLU, Sigmoid), weights/biases, and manually calculate forward passes and backprop.', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', links: [{title: 'Deep Learning Book', url: 'https://www.deeplearningbook.org/'}] },
            { title: 'PyTorch Framework', detail: 'Transition to modern frameworks. Create compute graphs, leverage GPU acceleration via CUDA, write custom DataLoaders, and code granular training loops with PyTorch.', videoUrl: 'https://www.youtube.com/embed/V_xro1bcAuI', links: [{title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/'}] },
            { title: 'Transformers & LLMs', detail: 'The state-of-the-art. Study the Attention Mechanism. Utilize the HuggingFace Hub, orchestrate Prompt Engineering, and execute LoRA fine-tuning on open-source massive models.', videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g', links: [{title: 'HuggingFace Course', url: 'https://huggingface.co/learn/nlp-course/'}] },
            { title: 'Retrieval Augmented Generation (RAG)', detail: 'Build robust AI assistants. Orchestrate LangChain tools, generate high-dimension embeddings, store them in Vector Databases (Pinecone/Milvus), and query them.', videoUrl: 'https://www.youtube.com/embed/lG7Uxts9SXs', links: [{title: 'LangChain Docs', url: 'https://python.langchain.com/docs/get_started/introduction'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'data-science',
        title: 'Data Science',
        badge: 'Data Pro',
        description: 'Transform raw data into actionable insights — statistics, Pandas visualization, SQL, and robust business intelligence.',
        steps: [
            { title: 'Statistics & Probability', detail: 'Analyze Descriptive statistics and distributions thoroughly. Implement rigorous Hypothesis testing flows, establish Confidence intervals correctly, apply Bayesian logic.', videoUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs', links: [{title: 'StatQuest', url: 'https://statquest.org/'}] },
            { title: 'SQL & Database Querying', detail: 'Execute complex relational SELECT queries structurally. Construct relational JOINs precisely, build efficient Subqueries, utilize sophisticated Window functions.', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', links: [{title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/'}] },
            { title: 'Data Manipulation (Pandas)', detail: 'Clean and reshape immense datasets efficiently. Manipulate multi-dimensional DataFrames conceptually, orchestrate GroupBy clustering, synchronize Merging operations.', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', links: [{title: 'Pandas Doc', url: 'https://pandas.pydata.org/docs/'}] },
            { title: 'Data Visualization Techniques', detail: 'Graph insight effectively reliably. Generate dense Matplotlib charts, design beautiful Seaborn graphs, deploy Plotly interactive components intuitively.', videoUrl: 'https://www.youtube.com/embed/a9UrKTVEeZA', links: [{title: 'Plotly Graphing', url: 'https://plotly.com/python/'}] },
            { title: 'Exploratory Data Analysis (EDA)', detail: 'Uncover deep insights systematically. Formulate a comprehensive EDA workflow effectively, compute complex Correlation analysis tables accurately, conduct Outlier tracking.', videoUrl: 'https://www.youtube.com/embed/xi0vhXFPegw', links: [{title: 'Kaggle EDA Guides', url: 'https://www.kaggle.com/learn/data-visualization'}] },
            { title: 'Business Intelligence (BI) Tools', detail: 'Publish interactive organizational metrics structurally. Build complex Tableau dashboards perfectly, synthesize intricate Power BI metrics efficiently, manage KPI systems.', videoUrl: 'https://www.youtube.com/embed/eSH4kE1gMag', links: [{title: 'Tableau Learn', url: 'https://www.tableau.com/learn'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'devops',
        title: 'DevOps & SRE',
        badge: 'Infra Specialist',
        description: 'Master Cloud infrastructures, Kubernetes orchestration, CI/CD monitoring, scaling architectures, and site reliability.',
        steps: [
            { title: 'Linux Administration Mastery', detail: 'Master the fundamental OS of the web. Learn bash scripting, complex file permissions, daemon processes, cron schedulers, SSH key management.', videoUrl: 'https://www.youtube.com/embed/sWbUDq4S6Y8', links: [{title: 'Linux Journey', url: 'https://linuxjourney.com/'}] },
            { title: 'Docker Containerization', detail: 'Standardize environments. Construct highly optimized multi-stage Dockerfiles. Understand container networking, persistent volume mounts, internal security.', videoUrl: 'https://www.youtube.com/embed/3c-iBn7E9d8', links: [{title: 'Docker Docs', url: 'https://docs.docker.com/'}] },
            { title: 'Kubernetes Orchestration', detail: 'Manage container clusters. Deploy Pods, configure internal Services, maintain desired states via Deployments, manage stateful applications, handle Secrets.', videoUrl: 'https://www.youtube.com/embed/X48VuDVv0do', links: [{title: 'K8s Official Docs', url: 'https://kubernetes.io/docs/home/'}] },
            { title: 'Continuous Deployment (GitOps)', detail: 'Automate production deployments. Explore ArgoCD and Flux. Implement safe rollout strategies including Blue/Green deployments, Canary releases, and auto rollback.', videoUrl: 'https://www.youtube.com/embed/MeU5_rxGxA', links: [{title: 'ArgoCD Docs', url: 'https://argo-cd.readthedocs.io/en/stable/'}] },
            { title: 'Infrastructure as Code (Terraform)', detail: 'Declare infrastructure systematically. Write HCL configurations, formulate reusable Terraform modules, manage external tf-states remotely, and automate cloud APIs.', videoUrl: 'https://www.youtube.com/embed/SLB_c_ayRMo', links: [{title: 'Terraform Registry', url: 'https://registry.terraform.io/'}] },
            { title: 'Observability (Prometheus/Grafana)', detail: 'Instrument distributed systems. Export system metrics via Prometheus, create beautiful Grafana visualization dashboards, trace complex requests with Jaeger.', videoUrl: 'https://www.youtube.com/embed/9TJx7QTrTyo', links: [{title: 'Prometheus Guides', url: 'https://prometheus.io/docs/introduction/overview/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        badge: 'Security Architect',
        description: 'Protecting systems and networks from digital attacks — ethical hacking, cryptography, forensics, and defensive security.',
        steps: [
            { title: 'Network Security Fundamentals', detail: 'Master TCP/IP security layers, configure strict Firewalls & IDS/IPS systems, manage secure VPN tunnels, execute Network segmentation, and perform Packet analysis.', videoUrl: 'https://www.youtube.com/embed/E03gh1fRzmk', links: [{title: 'TryHackMe Networking', url: 'https://tryhackme.com/path/outline/presecurity'}] },
            { title: 'Cryptography', detail: 'Understand Symmetric & Asymmetric encryption mathematics. Learn secure Hashing algorithms (SHA, bcrypt), Digital signatures, Public Key Infrastructure (PKI).', videoUrl: 'https://www.youtube.com/embed/jhXCTbFnK8o', links: [{title: 'Crypto 101', url: 'https://www.crypto101.io/'}] },
            { title: 'Ethical Hacking & Pentesting', detail: 'Utilize Kali Linux, Metasploit, Burp Suite, and Nmap scanning. Perform comprehensive Vulnerability assessments and execute penetration Exploitation techniques.', videoUrl: 'https://www.youtube.com/embed/fNzpcB7ODxQ', links: [{title: 'HackTheBox', url: 'https://www.hackthebox.com/'}] },
            { title: 'Web Application Security', detail: 'Defend against OWASP Top 10 vulnerabilities. Implement safeguards for SQL Injection, XSS payloads, CSRF tokens, SSRF mitigation, and robust WAF configurations.', videoUrl: 'https://www.youtube.com/embed/L_f5Bv7x_rU', links: [{title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/'}] },
            { title: 'Identity & Access Management', detail: 'Manage enterprise identities using Active Directory, LDAP, and SAML. Integrate OAuth 2.0 flows, enforce secure MFA, and deploy Zero Trust architecture.', videoUrl: 'https://www.youtube.com/embed/6iQonEInO10', links: [{title: 'Zero Trust Basics', url: 'https://www.crowdstrike.com/cybersecurity-101/zero-trust-security/'}] },
            { title: 'Incident Response & SOC', detail: 'Manage day-to-day security. Implement SIEM tools (Splunk, QRadar), conduct proactive Threat hunting, streamline SOC analyst triage workflows.', videoUrl: 'https://www.youtube.com/embed/fBsN6_SBJtU', links: [{title: 'NIST IR Guidelines', url: 'https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'mobile',
        title: 'Mobile App Dev',
        badge: 'Cross Platform',
        description: 'Build native and cross-platform mobile apps for iOS and Android using React Native and Flutter frameworks natively.',
        steps: [
            { title: 'Mobile Dev Fundamentals', detail: 'Differentiate Native vs Cross-platform constraints. Grasp fundamental Mobile UI patterns, Touch/gesture interactions, and the complex app component lifecycle states.', videoUrl: 'https://www.youtube.com/embed/0-S5a0eXPoc', links: [{title: 'Apple HIG', url: 'https://developer.apple.com/design/human-interface-guidelines/'}] },
            { title: 'React Native Engine', detail: 'Utilize React knowledge for mobile apps. Render Core components (View, Text, Image), construct UI using StyleSheet and Flexbox layouts, utilitize Expo.', videoUrl: 'https://www.youtube.com/embed/obH0Po_RdWk', links: [{title: 'React Native Docs', url: 'https://reactnative.dev/docs/getting-started'}] },
            { title: 'Navigation Paradigms', detail: 'Implement React Navigation packages flawlessly. Develop Stack algorithms, Tab, Drawer layouts, configure Deep linking payloads, and manage dynamic states.', videoUrl: 'https://www.youtube.com/embed/npe3Wf4t0SQ', links: [{title: 'React Navigation', url: 'https://reactnavigation.org/'}] },
            { title: 'Native Device Features', detail: 'Access hardware integrations interactively. Interface with native Camera rolls, GPS/Location services, orchestrate Push notifications, enforce Biometrics safely.', videoUrl: 'https://www.youtube.com/embed/ZBCUegTZF7M', links: [{title: 'Expo Camera/Sensors', url: 'https://docs.expo.dev/versions/latest/'}] },
            { title: 'Flutter & Dart Ecosystem', detail: 'Master Google\'s Flutter framework architecture. Learn Dart language basics natively, assemble nested Flutter widgets, implement Material/Cupertino design rules.', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8', links: [{title: 'Flutter Widgets', url: 'https://docs.flutter.dev/ui/widgets'}] },
            { title: 'App Store Deployment', detail: 'Ship to global users seamlessly. Execute secure App signing protocols, navigate the Google Play Console policies, master Apple App Store Connect reviews.', videoUrl: 'https://www.youtube.com/embed/oBR97oIJM4', links: [{title: 'App Store Connect', url: 'https://developer.apple.com/app-store-connect/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'blockchain',
        title: 'Web3 & Blockchain',
        badge: 'Web3 Architect',
        description: 'Decentralized applications, smart contracts, advanced DeFi protocols, and the architecture of Web3 distributed internet.',
        steps: [
            { title: 'Blockchain Consensus logic', detail: 'Understand immutable Distributed ledger technology deeply. Differentiate complex Consensus mechanisms (PoW, PoS) intelligently, analyze secure Hashing algorithms.', videoUrl: 'https://www.youtube.com/embed/SSo_EIwHSd4', links: [{title: 'Bitcoin Whitepaper', url: 'https://bitcoin.org/bitcoin.pdf'}] },
            { title: 'Ethereum & EVM', detail: 'Dissect the global Ethereum state architecture fundamentally. Analyze global Gas pricing dynamically, contrast structural Accounts conceptually (EOA vs Contract).', videoUrl: 'https://www.youtube.com/embed/gyMwXuJrbJQ', links: [{title: 'Ethereum Dev', url: 'https://ethereum.org/en/developers/'}] },
            { title: 'Solidity Smart Contracts', detail: 'Master decentralised programming comprehensively. Use advanced strict Data types perfectly, construct complex Functions efficiently, deploy Upgradeable proxy patterns.', videoUrl: 'https://www.youtube.com/embed/M576WGiDBdQ', links: [{title: 'Solidity Docs', url: 'https://docs.soliditylang.org/'}] },
            { title: 'DeFi Protocols', detail: 'Understand global trading architectures intimately. Formulate functional AMMs (Uniswap) fundamentally, integrate structural Lending logic (Aave) accurately.', videoUrl: 'https://www.youtube.com/embed/17QRFlml4pA', links: [{title: 'Uniswap V3 Core', url: 'https://uniswap.org/whitepaper-v3.pdf'}] },
            { title: 'Web3 Client (Ethers.js)', detail: 'Bridge classic interfaces seamlessly. Leverage the ethers.js/wagmi libraries heavily, orchestrate complex MetaMask integration intelligently.', videoUrl: 'https://www.youtube.com/embed/GKJBEEXUha0', links: [{title: 'Wagmi Docs', url: 'https://wagmi.sh/'}] },
            { title: 'Contract Security', detail: 'Prevent exploits reliably. Analyze pervasive vulnerabilities structurally (Reentrancy, Front-running) correctly. Audit systems with Slither efficiently.', videoUrl: 'https://www.youtube.com/embed/TmZ8gH-toX0', links: [{title: 'Smart Contract Weakness', url: 'https://swcregistry.io/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'game-dev',
        title: 'Game Development',
        badge: 'Immersive Dev',
        description: 'Create immersive gaming experiences — advanced game engines, real-world physics, graphics programming, and multiplayer systems.',
        steps: [
            { title: 'Game Design Principles', detail: 'Understand fundamental Game mechanics accurately. Produce robust Level design documentation systematically, grasp nuanced Player psychology actively.', videoUrl: 'https://www.youtube.com/embed/zQvWMdWhFCc', links: [{title: 'Game Design Concepts', url: 'https://www.gamedesigning.org/'}] },
            { title: 'Unity Engine Architecture', detail: 'Operate standard engine components proficiently. Navigate the Unity Editor interface intelligently, grasp critical GameObjects & Components intrinsically.', videoUrl: 'https://www.youtube.com/embed/gB1F9G0JXOo', links: [{title: 'Unity Manual', url: 'https://docs.unity3d.com/Manual/index.html'}] },
            { title: 'C# Programming Fundamentals', detail: 'Master powerful language paradigms functionally. Learn basic C# fundamentals explicitly, apply formal OOP patterns actively, manage complex Coroutines.', videoUrl: 'https://www.youtube.com/embed/GhQdlMFylQ8', links: [{title: 'C# Microsoft Docs', url: 'https://learn.microsoft.com/en-us/dotnet/csharp/'}] },
            { title: 'Unreal Engine & Blueprints', detail: 'Transition to hyper-realistic systems. Navigate structural Blueprints visual scripting dynamically, integrate powerful C++ for Unreal accurately.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', links: [{title: 'Unreal Engine Docs', url: 'https://docs.unrealengine.com/'}] },
            { title: 'Game Physics & Math', detail: 'Compute spatial interactions extensively. Establish foundational Vectors math precisely, configure continuous Matrices accurately, evaluate complex Quaternions.', videoUrl: 'https://www.youtube.com/embed/DPfxjQ6squc', links: [{title: 'Vector Math for 3D', url: 'https://gamemath.com/'}] },
            { title: 'Multiplayer Architectures', detail: 'Connect global interactive clients reliably. Establish secure Client-server architecture, launch stable Photon/Mirror networking effectively.', videoUrl: 'https://www.youtube.com/embed/L-hJYja4SJQ', links: [{title: 'Photon Engine', url: 'https://doc.photonengine.com/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'dsa',
        title: 'Algorithms (DSA)',
        badge: 'Absolute Core',
        description: 'Master extreme problem-solving fundamentals — arrays to dense graphs, optimal sorting to dynamic programming matrices.',
        steps: [
            { title: 'Complexity Analysis', detail: 'Compute algorithm efficiencies accurately. Deduce formal Big O, Big Omega, and Big Theta complexities properly, differentiate strict Time vs Space complexity tradeoffs.', videoUrl: 'https://www.youtube.com/embed/BgLTDT03QtU', links: [{title: 'Big-O CheatSheet', url: 'https://www.bigocheatsheet.com/'}] },
            { title: 'Arrays & Two Pointers', detail: 'Solve linear collections efficiently. Apprehend the powerful Two pointer technique naturally, master the elegant Sliding window algorithm swiftly.', videoUrl: 'https://www.youtube.com/embed/pkYVOmU3MgA', links: [{title: 'Two Pointers Guide', url: 'https://leetcode.com/tag/two-pointers/'}] },
            { title: 'Trees & Search Algorithms', detail: 'Navigate hierarchical data naturally. Analyze structural Traversals adequately (Inorder, Preorder, Postorder), execute functional BST operations seamlessly.', videoUrl: 'https://www.youtube.com/embed/fAAZixBzIAI', links: [{title: 'VisuAlgo BST', url: 'https://visualgo.net/en/bst'}] },
            { title: 'Graph Theory (BFS/DFS)', detail: 'Map abstract interconnections systematically. Operate basic BFS, DFS functionally, traverse paths using Dijkstra\'s optimally, apply robust Bellman-Ford smoothly.', videoUrl: 'https://www.youtube.com/embed/tWVWeAqZ0WU', links: [{title: 'Graph Traversal', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/'}] },
            { title: 'Dynamic Programming', detail: 'Optimize complex recursive states intelligently. Apply functional Memoization logically, execute iterative Tabulation structurally, solve classic 0/1 Knapsack.', videoUrl: 'https://www.youtube.com/embed/oBt53YbR9Kk', links: [{title: 'DP Guide Patterns', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns'}] },
            { title: 'Advanced Data Structures', detail: 'Process large datasets structurally. Analyze extremum properties structurally via Heaps, execute efficient Union-Find gracefully, utilize high-speed Tries.', videoUrl: 'https://www.youtube.com/embed/t0Cq6tVNRBA', links: [{title: 'Trie Visualizer', url: 'https://visualgo.net/en/trie'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'cloud-computing',
        title: 'Cloud Computing',
        badge: 'AWS / Azure / GCP',
        description: 'Command massive datacenters from your terminal. Master the conceptual frameworks driving modern hyper-scale infrastructure.',
        steps: [
            { title: 'Cloud Paradigms (IaaS/PaaS)', detail: 'Distinguish explicit cloud deployment strategies natively. Compare Private vs Public clouds accurately, define IaaS/PaaS/SaaS boundaries optimally.', videoUrl: 'https://www.youtube.com/embed/M988_fsOSWo', links: [{title: 'NIST Cloud Definition', url: 'https://csrc.nist.gov/publications/detail/sp/800-145/final'}] },
            { title: 'Virtualization & Networking', detail: 'Evaluate Virtual Machines intrinsically. Establish Software Defined Networking logically, execute VPC/VNet peering fluidly, structure precise API gateways reliably.', videoUrl: 'https://www.youtube.com/embed/1O7m19D6Zgo', links: [{title: 'VPC Architecture', url: 'https://docs.aws.amazon.com/vpc/'}] },
            { title: 'Serverless Functions', detail: 'Eliminate server management perfectly. Code event-driven AWS Lambda procedures optimally, execute accurate Azure Functions dynamically, deploy fast Cloud Run processes rapidly.', videoUrl: 'https://www.youtube.com/embed/P_Pki_2_h3z', links: [{title: 'AWS Lambda', url: 'https://aws.amazon.com/lambda/'}] },
            { title: 'Identity & Access (IAM)', detail: 'Strictly secure widespread operations precisely. Execute Role-Based Access Control comprehensively, attach policy JSONs safely, federate active SAML providers completely.', videoUrl: 'https://www.youtube.com/embed/ZBCUegTZF3V', links: [{title: 'AWS IAM Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html'}] },
            { title: 'Managed Databases (RDS/NoSQL)', detail: 'Scale global persistence autonomously. Instantiate reliable Aurora instances dynamically, organize vast DynamoDB keysets flexibly, integrate global Spanner networks correctly.', videoUrl: 'https://www.youtube.com/embed/xQx2E3LpxuM', links: [{title: 'DynamoDB Design', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html'}] },
            { title: 'Cost Optimization (FinOps)', detail: 'Eliminate rampant cloud spend safely. Master intrinsic reserved instances calculations accurately, employ strict spot-instances dependably, build lifecycle storage transition rules seamlessly.', videoUrl: 'https://www.youtube.com/embed/sM67A5m30tO', links: [{title: 'AWS Cost Explorer', url: 'https://aws.amazon.com/aws-cost-management/aws-cost-explorer/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'web-development',
        title: 'Web Webmaster',
        badge: 'Absolute Basic',
        description: 'The foundation of the internet. Basic HTML styling to domain registration, simple HTTP networks, and static hosting.',
        steps: [
            { title: 'Internet Fundamentals', detail: 'Understand how packets route globally. Demystify DNS lookup logic accurately, deploy simple hosting correctly, execute basic FTP file transfers directly.', videoUrl: 'https://www.youtube.com/embed/1O7m19D6Zg0', links: [{title: 'How DNS Works', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/'}] },
            { title: 'Semantic HTML', detail: 'Define proper web accessibility. Generate rigid DOM structures efficiently, embed proper meta tags, handle semantic article nesting properly.', videoUrl: 'https://www.youtube.com/embed/qz0aGYMCzl0', links: [{title: 'MDN HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML'}] },
            { title: 'CSS Styling', detail: 'Paint the structure effectively. Apply rudimentary Box Model logic properly, define responsive Media Queries effectively, assign absolute vs relative positions clearly.', videoUrl: 'https://www.youtube.com/embed/1wDfIqT-apE', links: [{title: 'CSS Tricks', url: 'https://css-tricks.com/'}] },
            { title: 'JavaScript DOM Manipulation', detail: 'Bring elements to life securely. Select discrete elements cleanly, bind Event Listeners organically, mutate element classes dynamically natively.', videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3s', links: [{title: 'JS DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model'}] },
            { title: 'Responsive Design', detail: 'Support mobile interfaces natively. Adopt fluid Flexbox structures fully, adapt content to viewports flawlessly, deploy Mobile-first philosophy accurately.', videoUrl: 'https://www.youtube.com/embed/srvUrASNj0s', links: [{title: 'Responsive Rules', url: 'https://web.dev/responsive-web-design-basics/'}] },
            { title: 'Static Deployment', detail: 'Expose code to the world directly. Host static files securely on Netlify/Vercel natively, understand CNAME configuration accurately, configure basic SSL actively.', videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI', links: [{title: 'Netlify Docs', url: 'https://docs.netlify.com/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'api-development',
        title: 'API Development',
        badge: 'Integration Expert',
        description: 'Master the connective tissue of modern software. Design resilient RESTful APIs, profound GraphQL endpoints, and Webhooks.',
        steps: [
            { title: 'REST Protocol Definitions', detail: 'Architect stateless systems completely. Assign strict HTTP Verbs correctly, execute correct Status Codes efficiently, formulate distinct hierarchical URIs correctly.', videoUrl: 'https://www.youtube.com/embed/lsMQRaeKNDk', links: [{title: 'REST API Tutorial', url: 'https://restfulapi.net/'}] },
            { title: 'GraphQL Mastery', detail: 'Prevent over-fetching absolutely. Resolve intense Schema Types systematically, map complex Resolvers elegantly, eliminate extreme N+1 anomalies via DataLoaders.', videoUrl: 'https://www.youtube.com/embed/ed8SzALpx1Q', links: [{title: 'GraphQL Org', url: 'https://graphql.org/learn/'}] },
            { title: 'gRPC & Protocol Buffers', detail: 'Transmit dense data instantly. Execute rapid binary ProtoBuf files actively, build efficient bi-directional streaming natively, link polyglot microservices smoothly.', videoUrl: 'https://www.youtube.com/embed/Yw4rkaTc0f8', links: [{title: 'gRPC Docs', url: 'https://grpc.io/docs/'}] },
            { title: 'API Security Protocols', detail: 'Defend massive endpoints heavily. Issue structured OAuth 2.0 flows dependably, execute strict Rate Limiting correctly, enforce structural API Keys natively.', videoUrl: 'https://www.youtube.com/embed/her_7pa0vrg', links: [{title: 'OAuth Guide', url: 'https://oauth.net/2/'}] },
            { title: 'Webhooks & Event Driven', detail: 'Broadcast immediate events dynamically. Design secure webhook receivers cleanly, secure callbacks using HMAC signatures fundamentally, maintain solid retry queues automatically.', videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOls', links: [{title: 'Stripe Webhooks', url: 'https://stripe.com/docs/webhooks'}] },
            { title: 'Postman & API Testing', detail: 'Ensure flawless network operations flawlessly. Generate extensive Postman Collections accurately, script automated testing assertions reliably, validate exact JSON schemas structurally.', videoUrl: 'https://www.youtube.com/embed/t6QvIK0k25w', links: [{title: 'Postman Testing', url: 'https://learning.postman.com/docs/writing-scripts/test-scripts/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'microservices',
        title: 'Microservices',
        badge: 'Enterprise Architecture',
        description: 'Scale engineering organizations infinitely. Break monolithic backends into isolated, independently deployable robust services.',
        steps: [
            { title: 'Monolith Decomposition', detail: 'Extract complex logic gracefully. Identity bounded contexts methodically (DDD), prevent distributed monolithic traps fundamentally, calculate accurate Strangler Fig patterns natively.', videoUrl: 'https://www.youtube.com/embed/lTAcCNbJ7KE', links: [{title: 'Microservices.io', url: 'https://microservices.io/'}] },
            { title: 'Inter-process Communication', detail: 'Sync separated servers perfectly. Implement robust Async message queues logically (Kafka), structure distinct Sync HTTP clients carefully, manage complex gRPC connections reliably.', videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOls', links: [{title: 'Kafka Architecture', url: 'https://kafka.apache.org/documentation/'}] },
            { title: 'Service Discovery & Registry', detail: 'Locate dynamic endpoints autonomously. Implement Consul/Eureka robustly, define reliable Health Checks seamlessly, synchronize active routing tables organically.', videoUrl: 'https://www.youtube.com/embed/1O7m19D6Zg1', links: [{title: 'Consul Service Mesh', url: 'https://developer.hashicorp.com/consul/docs'}] },
            { title: 'Distributed Data Management', detail: 'Preserve isolated persistence intelligently. Avoid shared database conflicts directly, execute explicit Saga Transaction models correctly, map eventual consistency thoroughly.', videoUrl: 'https://www.youtube.com/embed/W2Z7GOfH07U', links: [{title: 'Saga Pattern', url: 'https://microservices.io/patterns/data/saga.html'}] },
            { title: 'API Gateways & BFF', detail: 'Funnel front-end requests seamlessly. Institute the Backend-For-Frontend paradigm directly, aggregate fragmented data efficiently, deploy massive central security routing effectively.', videoUrl: 'https://www.youtube.com/embed/K0Ta65OqQkY', links: [{title: 'API Gateway Pattern', url: 'https://microservices.io/patterns/apigateway.html'}] },
            { title: 'Distributed Tracing & Logs', detail: 'Debug chaotic failures completely. Propagate profound trace IDs consistently, organize centralized Fluentd logs accurately, evaluate massive Jaeger traces efficiently.', videoUrl: 'https://www.youtube.com/embed/9TJx7QTrTyo', links: [{title: 'OpenTelemetry', url: 'https://opentelemetry.io/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'swift',
        title: 'Swift iOS Dev',
        badge: 'Apple Ecosystem',
        description: 'Build native, incredibly fluid iOS mobile applications. Master UIKit, SwiftUI, and intense native device integrations.',
        steps: [
            { title: 'Swift Language Foundations', detail: 'Master Apple\'s specific language gracefully. Write clean Optionals logic completely, execute powerful Closures organically, specify explicit Protocols properly.', videoUrl: 'https://www.youtube.com/embed/comQ1-x2a1Q', links: [{title: 'Swift Book', url: 'https://docs.swift.org/swift-book/'}] },
            { title: 'SwiftUI Architecture', detail: 'Declare modern interfaces naturally. Bind State variables dynamically, stack layout modifiers fluently (VStack/HStack), handle profound Environment objects systematically.', videoUrl: 'https://www.youtube.com/embed/UzbJOyF88b4', links: [{title: 'SwiftUI Docs', url: 'https://developer.apple.com/xcode/swiftui/'}] },
            { title: 'UIKit Migration', detail: 'Manage legacy views securely. Architect explicit ViewControllers accurately, command raw AutoLayout constraints deeply, bind explicit Delegation patterns manually.', videoUrl: 'https://www.youtube.com/embed/comQ1-x2a1s', links: [{title: 'UIKit Docs', url: 'https://developer.apple.com/documentation/uikit'}] },
            { title: 'Data Persistence (Core Data)', detail: 'Save offline entities cleanly. Configure structured Core Data schemas actively, query massive predicates effortlessly, transition to modern SwiftData frameworks securely.', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB1', links: [{title: 'Core Data', url: 'https://developer.apple.com/documentation/coredata'}] },
            { title: 'Network Operations (URLSession)', detail: 'Handle dynamic JSON requests fundamentally. Process complex async/await network calls seamlessly, unwrap specific Codable models beautifully, map explicit errors safely.', videoUrl: 'https://www.youtube.com/embed/UzbJOyF88b5', links: [{title: 'URLSession Guide', url: 'https://developer.apple.com/documentation/foundation/urlsession'}] },
            { title: 'App Store Connect', detail: 'Publish apps directly. Execute robust provisioning profiles properly, manage intense TestFlight betas exactly, satisfy stringent Apple Review guidelines successfully.', videoUrl: 'https://www.youtube.com/embed/oBR97oIJM41', links: [{title: 'App Store Connect', url: 'https://developer.apple.com/app-store-connect/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'kotlin',
        title: 'Kotlin Android',
        badge: 'Google Endorsed',
        description: 'Develop premium Android applications. Master Coroutines, Jetpack Compose, and native Android Studio methodologies.',
        steps: [
            { title: 'Kotlin Syntax & Null Safety', detail: 'Eliminate Billion Dollar mistakes structurally. Code robust safe calls (`?.`), execute strict Data Classes cleanly, construct explicit Extension Functions accurately.', videoUrl: 'https://www.youtube.com/embed/F9UC9q2vK8s', links: [{title: 'Kotlin Docs', url: 'https://kotlinlang.org/docs/home.html'}] },
            { title: 'Coroutines & Asynchrony', detail: 'Process heavy data smoothly. Launch lightweight Dispatchers immediately, manage strict suspending functions securely, execute powerful Flow observation loops consistently.', videoUrl: 'https://www.youtube.com/embed/Sh1r_r4c6X4', links: [{title: 'Coroutines Guide', url: 'https://kotlinlang.org/docs/coroutines-guide.html'}] },
            { title: 'Jetpack Compose UI', detail: 'Generate declarative layouts fluently. Architect functional Composables optimally, specify deep State Hoisting patterns cleanly, deploy robust Material Design naturally.', videoUrl: 'https://www.youtube.com/embed/SMOhl9RK0BA', links: [{title: 'Compose UI', url: 'https://developer.android.com/jetpack/compose'}] },
            { title: 'Android Architecture Components', detail: 'Structure complex apps fundamentally. Instantiate explicit ViewModels safely, watch LiveData organically, operate reliable Room databases locally smoothly.', videoUrl: 'https://www.youtube.com/embed/aThE3uI33B4', links: [{title: 'Android Architecture', url: 'https://developer.android.com/topic/architecture'}] },
            { title: 'Network Calls (Retrofit)', detail: 'Connect external endpoints securely. Write exact Retrofit interface methods fluently, construct complex Moshi/Gson serialization adapters natively, attach explicit OkHttp interceptors correctly.', videoUrl: 'https://www.youtube.com/embed/5D-zS6-yS6s', links: [{title: 'Retrofit Docs', url: 'https://square.github.io/retrofit/'}] },
            { title: 'Play Console Publishing', detail: 'Submit APKs perfectly. Execute solid Keystore signatures natively, configure robust App Bundles (AAB) optimally, navigate dense Android permission models flawlessly.', videoUrl: 'https://www.youtube.com/embed/oBR97oIJM42', links: [{title: 'Google Play Console', url: 'https://play.google.com/console/about/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'php',
        title: 'PHP & Laravel',
        badge: 'Web Standard',
        description: 'Powering 70% of the internet. Learn advanced PHP CLI operations and deploy rapid, beautiful MVC apps with the Laravel framework.',
        steps: [
            { title: 'PHP Syntax & Constructs', detail: 'Master raw dynamic code optimally. Process Superglobals properly, establish native OOP inheritance properly, configure solid Composer packages systematically.', videoUrl: 'https://www.youtube.com/embed/OK_JCtrrv-c', links: [{title: 'PHP Manual', url: 'https://www.php.net/manual/en/'}] },
            { title: 'Laravel MVC Architecture', detail: 'Build robust web applications gracefully. Link specific request Routers cleanly, deploy intricate Blade templates beautifully, develop distinct Controllers properly.', videoUrl: 'https://www.youtube.com/embed/MYyJ4PuL4pY', links: [{title: 'Laravel Docs', url: 'https://laravel.com/docs/'}] },
            { title: 'Eloquent ORM', detail: 'Map relational databases effectively. Articulate deep Models elegantly, specify complex Relationships smoothly (HasMany), execute massive Migrations effectively safely.', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB2', links: [{title: 'Eloquent ORM', url: 'https://laravel.com/docs/master/eloquent'}] },
            { title: 'Authentication (Breeze/Sanctum)', detail: 'Lock routes efficiently cleanly. Spin up explicit Laravel Breeze setups natively, configure intense API tokens with Sanctum cleanly, handle robust Middlewares organically.', videoUrl: 'https://www.youtube.com/embed/her_7pa0vr1', links: [{title: 'Laravel Sanctum', url: 'https://laravel.com/docs/master/sanctum'}] },
            { title: 'Queues & Task Scheduling', detail: 'Optimize massive workloads silently. Dispatch explicit Jobs autonomously, establish powerful Redis broker pipelines properly, execute rigorous Cron task scheduling precisely.', videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOl1', links: [{title: 'Laravel Queues', url: 'https://laravel.com/docs/master/queues'}] },
            { title: 'Testing & Forge Deployment', detail: 'Release perfect applications rapidly. Write exact Pest unit tests completely, integrate massive server deployments automatically via Laravel Forge properly.', videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hO1', links: [{title: 'Laravel Forge', url: 'https://forge.laravel.com/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'vue',
        title: 'Vue.js Ecosystem',
        badge: 'Progressive Framework',
        description: 'The elegant alternative. Master the Composition API, robust Nuxt.js SSR deployments, and fluid state management with Pinia.',
        steps: [
            { title: 'Vue Directives & SFCs', detail: 'Declare logic intrinsically. Manipulate distinct template directives flawlessly (v-if/v-for), orchestrate distinct Single-File Components clearly, bind native v-model logic correctly.', videoUrl: 'https://www.youtube.com/embed/FXpIoQ_rT_c', links: [{title: 'Vue Guide', url: 'https://vuejs.org/guide/introduction.html'}] },
            { title: 'Composition API (Ref/Reactive)', detail: 'Extract complex logic gracefully. Implement profound `script setup` tags effectively, distinguish dynamic ref vs reactive variables systematically, handle deep watch effects accurately.', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA1', links: [{title: 'Composition API', url: 'https://vuejs.org/guide/extras/composition-api-faq.html'}] },
            { title: 'Pinia State Management', detail: 'Avoid intense prop-drilling explicitly. Formulate distinct global store Actions locally, manipulate direct computed Getters intelligently, mutate central State flawlessly.', videoUrl: 'https://www.youtube.com/embed/0W6i5De-qp2', links: [{title: 'Pinia State', url: 'https://pinia.vuejs.org/'}] },
            { title: 'Vue Router Dynamics', detail: 'Enable sophisticated SPAs directly. Hook precise Navigation Guards carefully, define deeply nested routes efficiently, enact perfect Scroll behavior naturally.', videoUrl: 'https://www.youtube.com/embed/Ul3y1LXxzd1', links: [{title: 'Vue Router', url: 'https://router.vuejs.org/'}] },
            { title: 'Nuxt.js Full Stack', detail: 'Bridge absolute SEO gaps smoothly. Formulate dynamic Server-Side implementations actively, generate intense static routes systematically, write native Server API handlers natively.', videoUrl: 'https://www.youtube.com/embed/ZjAqacigCG1', links: [{title: 'Nuxt Framework', url: 'https://nuxt.com/docs/getting-started/introduction'}] },
            { title: 'Testing Vue Applications', detail: 'Guarantee quality logic cleanly. Formulate extreme component assertions via Vue Test Utils appropriately, invoke explicit Vitest runners efficiently natively.', videoUrl: 'https://www.youtube.com/embed/TNhaISOUy61', links: [{title: 'Vue Test Utils', url: 'https://test-utils.vuejs.org/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'product-management',
        title: 'Product Management',
        badge: 'Leadership Track',
        description: 'Orchestrate global engineering teams. Master the product lifecycle, profound agile methodologies, and intense stakeholder strategy.',
        steps: [
            { title: 'Product Strategy & Vision', detail: 'Guide corporate initiatives deliberately. Formulate specific North Star metrics accurately, write extensive PRDs effectively, analyze robust competitive landscapes intelligently.', videoUrl: 'https://www.youtube.com/embed/2-iR-nC_U8w', links: [{title: 'SVPG Articles', url: 'https://www.svpg.com/articles/'}] },
            { title: 'Agile & Scrum Methodologies', detail: 'Organize chaotic schedules smoothly. Plan rigorous sprint ceremonies practically, estimate intense story points reliably, handle fluid backlog grooming actively.', videoUrl: 'https://www.youtube.com/embed/a-T0ErbW8E1', links: [{title: 'Scrum Guide', url: 'https://scrumguides.org/'}] },
            { title: 'User Research & Prototyping', detail: 'Capture exact customer needs actively. Validate broad hypotheses quickly, orchestrate unmoderated A/B tests perfectly, integrate robust Figma handoffs effectively.', videoUrl: 'https://www.youtube.com/embed/xQx2E3Lpxv1', links: [{title: 'User Interviews', url: 'https://www.nngroup.com/articles/user-interviews/'}] },
            { title: 'Go-To-Market (GTM) Planning', detail: 'Release massively successful updates efficiently. Organize critical pre-launch marketing gracefully, align massive sales channels distinctly, execute distinct feature flags securely.', videoUrl: 'https://www.youtube.com/embed/EwF312Z10D1', links: [{title: 'GTM Strategy', url: 'https://productschool.com/blog/product-management-2/go-to-market-strategy'}] },
            { title: 'Data Driven Decisions', detail: 'Validate performance rigorously. Synthesize extensive Mixpanel funnels dependably, calculate exact Cohort retention precisely, manipulate deep SQL queries directly.', videoUrl: 'https://www.youtube.com/embed/xi0vhXFPeg1', links: [{title: 'Mixpanel Data Guides', url: 'https://mixpanel.com/blog/'}] },
            { title: 'Stakeholder Architecture', detail: 'Align immense corporate operations effectively. Mediate massive C-Suite expectations smoothly, communicate dense engineering timelines directly, say "No" strategically seamlessly.', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_Yl1', links: [{title: 'Mind the Product', url: 'https://www.mindtheproduct.com/'}] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'desktop-app-dev',
        title: 'Desktop App Dev',
        badge: 'Native Experience',
        description: 'Create high-performance applications for Windows, Mac, and Linux using modern tools like Electron, Tauri, and Qt.',
        steps: [
            { title: 'Electron Foundations', detail: 'Leverage strict web tech seamlessly. Coordinate complex IPC communication distinctly, orchestrate specific Main/Renderer processes flawlessly, bundle huge Chromium logic natively.', videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy31', links: [{title: 'Electron Docs', url: 'https://www.electronjs.org/docs/latest/'}] },
            { title: 'Tauri Framework (Rust)', detail: 'Achieve massive performance intrinsically. Eradicate profound bloat deploying tiny Rust binaries effectively, hook specific webviews smoothly, enforce direct security IPC.', videoUrl: 'https://www.youtube.com/embed/5C_HPTJg5e1', links: [{title: 'Tauri Docs', url: 'https://tauri.app/'}] },
            { title: 'Qt & C++ Native GUIs', detail: 'Command extreme bare-metal engines efficiently. Connect specific Signal/Slot macros consistently, integrate deep QML elements vividly, deploy pure native speed properly.', videoUrl: 'https://www.youtube.com/embed/bOlK8sOQy51', links: [{title: 'Qt Documentation', url: 'https://doc.qt.io/'}] },
            { title: 'Native Device APIs', detail: 'Interact directly with OS features perfectly. Mount exact file system handlers cleanly, summon deep OS notifications actively, listen to profound hardware keyboard distinct interrupts safely.', videoUrl: 'https://www.youtube.com/embed/ZBCUegTZF71', links: [] },
            { title: 'CI/CD Packaging', detail: 'Distribute massive binaries safely. Automate complete cross-compilation accurately, issue strict MacOS code signatures natively, spin up dense Windows installers correctly.', videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hO2', links: [{title: 'Electron Builder', url: 'https://www.electron.build/'}] },
            { title: 'Auto Updating', detail: 'Sync massive active states elegantly. Ship specific remote OTA updates perfectly, handle distinct AppStore updates securely, generate flawless delta patch distributions directly.', videoUrl: 'https://www.youtube.com/embed/oBR97oIJM43', links: [] },
        ],
        color: 'var(--accent-purple)',
    },
    {
        id: 'ruby',
        title: 'Ruby on Rails',
        badge: 'Startup Legend',
        description: 'The ultimate rapid development framework. Optimize developer happiness with Ruby, ActiveRecord, and blazing fast monolithic deployments.',
        steps: [
            { title: 'Ruby Object Orientation', detail: 'Embrace true OOP purely. Construct flexible Mixins consistently, execute dynamic Metaprogramming thoroughly, handle exact Block yielding natively.', videoUrl: 'https://www.youtube.com/embed/t_ispmWb1q1', links: [{title: 'Ruby Docs', url: 'https://ruby-doc.org/'}] },
            { title: 'Rails MVC Protocol', detail: 'Establish the exact convention reliably. Scaffold vast resources optimally, process strict REST routing distinct schemas organically, render explicit ERB partials cleanly.', videoUrl: 'https://www.youtube.com/embed/fmyvWz5TUW1', links: [{title: 'Rails Guides', url: 'https://guides.rubyonrails.org/'}] },
            { title: 'ActiveRecord Relationships', detail: 'Interact with robust databases intuitively. Validate complex model models actively, specify massive associations smoothly (has_many), query vast SQL chains beautifully.', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB3', links: [{title: 'ActiveRecord Basics', url: 'https://guides.rubyonrails.org/active_record_basics.html'}] },
            { title: 'Hotwire & Turbo', detail: 'Modernize the absolute monolith dynamically. Transmit partial DOM updates natively, execute advanced WebSockets seamlessly via ActionCable gracefully.', videoUrl: 'https://www.youtube.com/embed/srPXMt1Q0n1', links: [{title: 'Hotwire Dev', url: 'https://hotwired.dev/'}] },
            { title: 'Background Jobs (Sidekiq)', detail: 'Offload profound procedures safely. Spin up rapid Redis logic locally, execute comprehensive mailer deliveries reliably, retry massive specific queues gracefully.', videoUrl: 'https://www.youtube.com/embed/W4_aGb_MOl2', links: [{title: 'Sidekiq Wiki', url: 'https://github.com/sidekiq/sidekiq/wiki'}] },
            { title: 'RSpec TDD Methodology', detail: 'Test intense operations accurately. Formulate exact RSpec expectations continuously, construct elaborate Factories intelligently, simulate immense controller outputs definitively.', videoUrl: 'https://www.youtube.com/embed/8Xwq35cPwY1', links: [{title: 'RSpec Guide', url: 'https://rspec.info/'}] },
        ],
        color: 'var(--accent-purple)',
    }
];

export const ROADMAP_QUESTIONS = {
    'mern-stack': [
        '1. What exactly does the MERN acronym represent?',
        '2. Why is MongoDB often chosen over SQL within the MERN structure?'
    ],
    frontend: [
        '1. Functionally differentiate between display: flex and display: grid architectures.',
        '2. Break down the mathematical calculation rules defining CSS specificity.'
    ],
    backend: [
        '1. Compare the structural constraints of explicit horizontal versus rigid vertical system scaling.',
        '2. Define the highly problematic N+1 query situation and articulate its best mitigation strategy.'
    ],
    fullstack: [
        '1. Explain end-to-end integration and connection pooling logic.',
        '2. Compare SSR vs client-rendered fetching limitations securely.'
    ],
    javascript: [
        '1. How precisely does closures isolate data globally without employing explicit ES6 classes logically?',
        '2. Detail the exact temporal disparities differentiating rapid Microtasks vs immense Macrotasks thoroughly.'
    ],
    python: [
        '1. Contrast the exact behavioral architectures differentiating iterative Map logic vs native List Comprehensions efficiently.',
        '2. Differentiate deep Dunder object mechanisms accurately.'
    ],
    typescript: [
        '1. Explain precise situations justifying Type aliases versus structural strict Interface boundaries logically.',
        '2. Deduce specific Generic `<T>` structural validations successfully.'
    ],
    java: [
        '1. Explain exactly how JVM architecture translates bytecode universally.',
        '2. Detail precisely the hierarchical implementations resolving profound Spring Dependency Injection seamlessly.'
    ],
    cplusplus: [
        '1. Detail the exact distinct performance advantages characterizing structured Pointers accurately.',
        '2. Resolve robust Virtual table mechanism conflicts thoroughly.'
    ],
    go: [
        '1. Detail the exact mechanisms isolating concurrent Goroutines natively.',
        '2. Resolve buffered Channel blocking architectures proficiently.'
    ],
    rust: [
        '1. Breakdown exactly how the compiler\'s Borrow checker executes flawlessly.',
        '2. Define exactly how Option/Result wrappers execute inherently.'
    ],
    react: [
        '1. Formulate exact V-DOM reconciliation diffing protocols correctly.',
        '2. Detail precise caching executions resolving useCallback redundancies fluidly.'
    ],
    nextjs: [
        '1. Analyze SSR vs SSG architectural distinctions optimally.',
        '2. Detail precise Next.js Image caching executions safely.'
    ],
    'angular': [
        '1. Explain complex Dependency Injection mechanisms explicitly.',
        '2. Detail extensive RxJS mapping transformations reliably.'
    ],
    'ui-ux-design': [
        '1. Explain the psychological impact dictated by adherence to classical Gestalt design principles.',
        '2. What are the specific systemic benefits of implementing strict foundational design tokens?'
    ],
    'qa-testing': [
        '1. Analyze the concrete functional differences between positive flow and negative limit testing.',
        '2. Detail the explicit advantages provided by shifting testing left natively within CI/CD pipelines.'
    ],
    'ai-ml': [
        '1. Explain the deep calculus mechanism dictating the precise operation of standard backpropagation.',
        '2. Evaluate how modern attention mechanisms allow massive transformers to outperform sequential RNNs.'
    ],
    'data-science': [
        '1. Execute complex relational SELECT queries structurally considering implicit JOIN tradeoffs.',
        '2. Clean and reshape immense datasets efficiently manipulating multi-dimensional Pandas DataFrames conceptually.'
    ],
    'devops': [
        '1. Explain the immense reliability and security benefits gained deploying Infrastructure as Code (IaC).',
        '2. Document the exact data retrieval strategy dictating how Prometheus successfully gathers critical node metrics.'
    ],
    'cybersecurity': [
        '1. Map out the foundational components establishing the traditional CIA global security triad.',
        '2. Define the proactive behavioral and systemic advantages generated by utilizing deep Web Application Firewalls.'
    ],
    'mobile': [
        '1. Differentiate Native vs Cross-platform constraints mapping React Native execution paradigms explicitly.',
        '2. Formulate App store deployment strategies guaranteeing precise code signing logic.'
    ],
    'blockchain': [
        '1. Formulate exact Contract Security methodologies isolating dangerous Reentrancy flaws.',
        '2. Analyze global Gas pricing dynamically isolating specific structural Account limits.'
    ],
    'game-dev': [
        '1. Operate standard engine Unity components proficiently integrating specific GameObjects logic.',
        '2. Connect global interactive clients reliably deploying specific Photon/Mirror implementations.'
    ],
    'dsa': [
        '1. Trace exactly why the fundamental worst-case mathematical time complexity occurring in quicksort is O(N^2).',
        '2. Explain conceptually how functional dynamic programming and explicit memoization eliminate deep recurrence overhead.'
    ],
    'cloud-computing': [
        '1. Contrast precise Service-Level Agreement execution logic differentiating specific IaaS against explicit PaaS models.',
        '2. Define the exact IAM role assignment limitations regulating external cross-account cloud access dependably.'
    ],
    'system-design': [
        '1. Explain mathematically how deploying consistent hashing successfully mitigates cascading server failures.',
        '2. Map out the real-time websocket distribution components needed to architect a massive notification delivery system.'
    ],
    'web-development': [
        '1. Contrast precise structural semantic tags mapping accurate HTML DOM execution naturally.',
        '2. Formulate proper responsive CSS configurations isolating exact media query logic dependably.'
    ],
    'api-development': [
        '1. Explain exact REST verb allocations characterizing precise stateless POST vs PUT execution accurately.',
        '2. Define exactly how GraphQL execution drastically diminishes standard endpoint over-fetching logic.'
    ],
    'microservices': [
        '1. Detail precise event-driven communication constraints managing deep asynchronous message brokers systematically.',
        '2. Execute accurate distributed Saga transaction patterns securing absolute eventual data consistency flawlessly.'
    ],
    'swift': [
        '1. Breakdown exact structural Optionals syntax guaranteeing safe memory execution properly.',
        '2. Detail explicitly when implementing core SwiftUI State versus deep external EnvironmentObjects correctly.'
    ],
    'kotlin': [
        '1. Detail explicit Coroutine flow configurations executing profound asynchronous non-blocking processes dependably.',
        '2. Break down exact Jetpack Compose declarative architectures mitigating state mutation logic consistently.'
    ],
    'php': [
        '1. Formulate precise Eloquent ORM mapping logic defining structural Controller to Model architecture neatly.',
        '2. Analyze specific Service Provider boot methods enforcing massive singleton instantiation effectively.'
    ],
    'vue': [
        '1. Describe explicitly the structural Reactivity logic tracking strict Proxy dependencies accurately.',
        '2. Distinguish the explicit setup function nuances defining the profound Composition API framework.'
    ],
    'product-management': [
        '1. Differentiate precise execution methodologies allocating agile Scrum ceremonies against massive Kanban methodologies explicitly.',
        '2. Analyze precise data metrics organizing exact Cohort retention models gracefully.'
    ],
    'desktop-app-dev': [
        '1. Organize exact IPC security architectures communicating structural Main to Renderer channels directly.',
        '2. Trace precise compilation limitations optimizing heavy Webviews flawlessly.'
    ],
    'ruby': [
        '1. Break down exact ActiveRecord association macros identifying extreme polymorphic configurations logically.',
        '2. Explain precise Turbo frame execution sending discrete DOM fragments successfully.'
    ]
};

export const COURSE_SUGGESTIONS = {
    'mern-stack': ['FREE: Full Stack Open', 'PAID: Zero to Mastery Full Stack'],
    frontend: ['FREE: The Odin Project', 'PAID: UI.Dev'],
    backend: ['FREE: Express.js Crash Course', 'PAID: Udemy Node.js'],
    fullstack: ['FREE: freeCodeCamp', 'PAID: Pluralsight Fullstack Tracks'],
    javascript: ['FREE: JavaScript.info', 'PAID: Udemy Modern JS Bootcamp'],
    python: ['FREE: CS50p Harvard', 'PAID: Complete Python Developer'],
    typescript: ['FREE: TypeScript Handbook', 'PAID: FrontendMasters TS Path'],
    java: ['FREE: Helsinki MOOC.fi Java', 'PAID: Spring Boot Masterclass'],
    cplusplus: ['FREE: LearnCpp.com', 'PAID: Unreal Engine 5 C++ Udemy'],
    go: ['FREE: Tour of Go', 'PAID: Go Bootcamps (ZTM)'],
    rust: ['FREE: The Rust Book', 'PAID: Rust in Action'],
    react: ['FREE: React.dev Official Tutorial', 'PAID: Epic React by Kent C. Dodds'],
    nextjs: ['FREE: Next.js Documentation Tutorial', 'PAID: Master Next.js by Lee Robinson'],
    'angular': ['FREE: Angular Tour of Heroes', 'PAID: Angular - The Complete Guide (Udemy)'],
    'ui-ux-design': ['FREE: Figma Official YouTube Tutorials', 'PAID: Shift Nudge UI Design Course'],
    'qa-testing': ['FREE: Cypress Official Documentation', 'PAID: SDET Bootcamp with Java / Python'],
    'ai-ml': ['FREE: fast.ai Practical Deep Learning', 'PAID: Custom Deep Learning Specialization'],
    'data-science': ['FREE: Kaggle Learn', 'PAID: Data Science Specialization - Coursera'],
    'devops': ['FREE: KodeKloud Free Courses', 'PAID: DevOps Bootcamp (Udemy)'],
    'cybersecurity': ['FREE: TryHackMe', 'PAID: Practical Ethical Hacking (TCM)'],
    'mobile': ['FREE: React Native Official Docs', 'PAID: React Native + Hooks (Udemy)'],
    'blockchain': ['FREE: CryptoZombies', 'PAID: Patrick Collins Foundry Course'],
    'game-dev': ['FREE: Brackeys YouTube', 'PAID: Complete C# Unity Game Developer'],
    'dsa': ['FREE: NeetCode.io', 'PAID: AlgoExpert'],
    'cloud-computing': ['FREE: AWS Cloud Practitioner Docs', 'PAID: A Cloud Guru AWS Solutions Architect'],
    'system-design': ['FREE: ByteByteGo YouTube', 'PAID: System Design Interview (Alex Xu)'],
    'web-development': ['FREE: freeCodeCamp Responsive Web', 'PAID: The Web Developer Bootcamp (Udemy)'],
    'api-development': ['FREE: Postman API Network Docs', 'PAID: REST API Design Bootcamp'],
    'microservices': ['FREE: Microservices.io Design Patterns', 'PAID: Software Architecture (Pluralsight)'],
    'swift': ['FREE: 100 Days of SwiftUI', 'PAID: iOS & Swift Bootcamp (Angela Yu)'],
    'kotlin': ['FREE: Android Basics in Kotlin', 'PAID: The Complete Android Developer Course'],
    'php': ['FREE: Laracasts Free Path', 'PAID: Complete Laravel Course'],
    'vue': ['FREE: Vue.js Docs', 'PAID: Vue Mastery Core Path'],
    'product-management': ['FREE: Product School YouTube', 'PAID: Reforge Product Strategy'],
    'desktop-app-dev': ['FREE: Electron Official Manual', 'PAID: Complete Electron Course'],
    'ruby': ['FREE: The Odin Project (Ruby)', 'PAID: Ruby on Rails Developer Course']
};

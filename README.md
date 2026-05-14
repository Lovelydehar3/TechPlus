# TechPlus - Learning Platform for Tech Enthusiasts

>  **Discover curated tech content, roadmaps, hackathons, and opportunities in one place**

**[🌐 Visit Live Demo](https://tech-plus-kappa.vercel.app/)** | **[📱 Get Started](#getting-started)**

![Node.js](https://img.shields.io/badge/Node.js-v18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ What's Inside

### 🎓 Features
- **Learning Paths & Roadmaps** - Structured career paths for tech professionals
- **Tech News Feed** - Real-time updates from multiple sources
- **Hackathon Listings** - Discover and track hackathon opportunities
- **Resource Library** - Curated playlists and learning materials
- **User Profiles** - Personalized learning dashboard with progress tracking

### 🛠️ Built With
- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Auth**: JWT + Email OTP verification
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gmail account (for OTP emails)

### Setup (3 steps)

```bash
# 1. Clone & install
git clone https://github.com/Lovelydehar3/techplus.git
cd techplus

# Backend
cd server && npm install && npm run dev

# Frontend (new terminal)
cd client && npm install && npm run dev
```

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:5000

---

## 🔐 Environment Setup

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
EMAIL=your-email@gmail.com
EMAIL_PASS=app-specific-password
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000
```

---

## 📚 API Overview

```
Auth:       POST /api/auth/register, /login, /verify-otp
User:       GET /api/user/profile, PUT /update
Roadmaps:   GET /api/roadmaps
Hackathons: GET /api/hackathons, POST /bookmark
News:       GET /api/news/all, /search
```

[View full API docs →](./docs/API.md)

---

## 🚀 Deploy

### Backend on Render
1. Connect GitHub repo
2. Set Root: `server/`
3. Add environment variables
4. Deploy!

### Frontend on Vercel
1. Import GitHub repo
2. Set Root: `client/`
3. Add `VITE_API_URL` env var
4. Deploy!

[Detailed guide →](./DEPLOYMENT_GUIDE.md)

---

## 👥 Team

| Developer | Links |
|-----------|-------|
| **Lovepreet Singh** | [GitHub](https://github.com/Lovelydehar3) • [LinkedIn](https://www.linkedin.com/in/lovepreet-singh-6200a8287/) • [Email](mailto:lovepreetsingh73437@gmail.com) |
| **Karan Sharma** | [GitHub](https://github.com/KARAN-SHARXA) • [LinkedIn](https://www.linkedin.com/in/karan-sharma-ji/) • [Email](mailto:karansharma202005@gmail.com) |

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing`
5. Open Pull Request

---

## 📝 License

MIT © 2026 TechPlus

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Lovelydehar3/techplus/issues)
- **Email**: lovepreetsingh73437@gmail.com
- **Demo**: [tech-plus-kappa.vercel.app](https://tech-plus-kappa.vercel.app/)

---

<div align="center">
Made with ❤️ by Lovepreet Singh & Karan Sharma
</div>

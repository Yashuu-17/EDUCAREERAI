# 🎓 EduCareer AI — AI-Powered Personalized Learning & Career Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.14-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **EduCareer AI** is an intelligent, modern learning and career advancement platform built to help students and developers master technology, prepare for high-impact tech careers, receive AI mentorship, and track their growth in real-time.

---

## 🌟 Key Features

### 🤖 AI Buddy (Intelligent Interactive Assistant)
- **Always Available**: Positioned smoothly in the bottom-right corner as a responsive floating companion.
- **Custom Themes**: Personalize the look and feel with 6+ theme presets (Cyberpunk, Emerald, Sunset, Royal Purple, Neon Amber, Oceanic Blue).
- **Contextual Learning**: Ask programming doubts, receive concise explanations, and get instant code debugging help.

### 📚 Interactive Course Library
- Comprehensive structured learning tracks across **Web Development**, **Python**, **Data Science**, **DevOps**, **Mobile Development**, and **Cybersecurity**.
- Dynamic, domain-specific color palettes and themes for each course track.
- Lesson progress tracking, completed milestones, and enrollment management.

### 🎯 Quizzes & Skill Assessments
- Topic-specific quizzes with instant feedback and score evaluation.
- Celebration confetti animations (`canvas-confetti`) upon completing assessments.
- Comprehensive history and performance analytics on the user dashboard.

### 🗺️ Career Roadmaps
- Visual, step-by-step career roadmaps for roles such as **Full-Stack Developer**, **Frontend Specialist**, **Backend Engineer**, **AI/ML Practitioner**, and **Cloud Architect**.
- Interactive milestone checking and progress persistence.

### 📄 AI Resume Analyzer & Maker
- **Smart Feedback**: Detailed breakdown of resume quality, ATS compatibility score, impact analysis, and missing keywords.
- **Resume Builder**: Clean, professional templates ready to export.

### 🎥 YouTube Learning Vault
- Curated high-yield video tutorials, categorized by skill level and tech stack for distraction-free learning.

### 🔐 Secure Authentication & User Profiles
- Complete JWT-based authentication system with encrypted password hashing (`bcryptjs`).
- Secure registration, login, forgot password, and reset password flows.
- User profile management with language and theme preferences.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router) + [React 18](https://react.dev/) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Backend API** | Next.js Route Handlers + [Express 5](https://expressjs.com/) API server |
| **Database & ORM** | [Prisma ORM](https://www.prisma.io/) (SQLite default, PostgreSQL/MySQL ready) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` |

---

## 📂 Project Structure

```text
├── app/                      # Next.js 14 App Router pages & API routes
│   ├── ai-buddy/             # AI Buddy dedicated view
│   ├── api/                  # Next.js REST API endpoints
│   │   ├── auth/             # Login, register, profile, password reset
│   │   ├── chat/             # AI Buddy chat endpoint
│   │   ├── courses/          # Courses & lesson progress
│   │   ├── quizzes/          # Quizzes, questions & results
│   │   ├── resumes/          # Resume analysis & storage
│   │   └── roadmaps/         # Roadmap progress tracking
│   ├── courses/              # Course catalog & lesson reader
│   ├── dashboard/            # Student analytics & progress dashboard
│   ├── interview/            # Mock interview questions
│   ├── profile/              # User settings & profile
│   ├── quizzes/              # Skill assessment module
│   ├── resume-tools/         # Resume builder & analyzer
│   ├── roadmaps/             # Career roadmaps explorer
│   └── youtube-vault/        # Curated video playlists
├── components/               # Reusable UI components (Navbar, Footer, BuddyChatbot, Logo)
├── context/                  # React Contexts (AuthContext, ThemeContext, LanguageContext)
├── data/                     # Seed data, quiz questions, and roadmap templates
├── lib/                      # Helper libraries, Prisma client, theme configurations
├── prisma/                   # Prisma schema & database seeding script
├── server/                   # Auxiliary Express API server & routes
├── .env.example              # Environment variables template
├── next.config.mjs           # Next.js configuration
└── package.json              # Project dependencies & scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17 or higher recommended)
- `npm` or `yarn` or `pnpm`
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Yashuu-17/EDUCAREERAI.git
cd EDUCAREERAI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```
Inside `.env`, configure your values:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_secure_random_jwt_secret_key"

# Optional: AI API Keys (for live AI responses)
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Initialize Database
Generate Prisma client and seed initial courses, roadmaps, and questions:
```bash
npm run prisma:push
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to explore EduCareer AI!

*(Optional) To run the standalone Express backend server:*
```bash
npm run server
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Launches the Next.js development server on port `3000` |
| `npm run build` | Builds the optimized production build |
| `npm run start` | Starts the production server |
| `npm run prisma:push` | Synchronizes Prisma schema with the SQLite database |
| `npm run seed` | Seeds courses, quiz questions, and career roadmap data |
| `npm run server` | Starts the Express auxiliary API server |
| `npm run db:studio` | Opens Prisma Studio visual database inspector |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Crafted with ❤️ for students and future engineers by <a href="https://github.com/Yashuu-17"><b>Yashuu-17</b></a>
</p>

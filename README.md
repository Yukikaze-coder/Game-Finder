# Game Finder 🎮

A modern, full-stack web app to search, discover, and save your favorite video games!

**Tech stack:**  
- Frontend: React, Tailwind CSS, DaisyUI, Firebase Auth  
- Backend: Express.js, PostgreSQL (hosted on Render), Node.js  
- APIs: GiantBomb (primary), RAWG (coming soon)

---

## ✨ Features

- 🔍 Search games, characters, companies, concepts, etc.
- 📖 Detailed game info (images, platforms, genres, developers, publishers, description, etc.)
- ❤️ Save favorite games (requires sign in)
- 📝 See your favorites on a dedicated page
- 🎠 Recent games carousel on homepage
- 👤 Register/Login with Email/Password or Google (Firebase)
- 🗄️ Data stored in PostgreSQL
- 🚀 Deployed on Render.com (client, server, and database)
- 💻 Responsive UI, works on desktop & mobile

---


🌐 API Endpoints

/api/search – GiantBomb search
/api/game/:id – GiantBomb details
/api/rawg/search – RAWG search (coming soon)
/api/rawg/game/:id – RAWG details (coming soon)
/api/favorites – CRUD user favorites (requires authentication)


💡 Useful Scripts

npm install – Install dependencies
npm run dev – Start dev server
npm run build – Build for production (client)
npm start – Start backend (server)


📝 TODO

 Integrate RAWG API and merge with GiantBomb search results

 Merge/compare game details from both APIs on details page

 User profile page (edit info, avatar, etc.)

 Better error handling and loading spinners

 Add unit/integration tests

 Polish mobile UI

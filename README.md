# Portfolio - Separated Frontend & Backend

Modern React + Vite portfolio with Express.js backend, admin panel, and EmailJS integration.

## 📁 Project Structure

```
portfolio/
├── frontend/          # React + Vite frontend
│   ├── src/          # React components
│   ├── public/       # Static assets
│   ├── package.json
│   └── vite.config.js
└── backend/          # Express.js backend
    ├── server/       # API routes & logic
    ├── package.json
    └── .env         # Environment variables
```

## Features
- Hero section with 3D background animations
- Sections: About, Skills, Projects, Contact
- Animated navigation + footer
- Admin panel (login, message management, password change)
- EmailJS integration for contact form
- JWT authentication
- Express API routes for backend

## 🚀 Development

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Port 4000)
```bash
cd backend
npm install
npm start
```

Run both servers simultaneously for full functionality.

## 📦 Production Build

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build  # Creates dist in backend/dist
```

### 2. Run Backend (serves frontend + API)
```bash
cd backend
npm install
npm start
```

Backend will serve the built frontend files and handle all API routes.



## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/login` | POST | Admin login, returns JWT token |
| `/api/messages` | GET | Get all messages (auth required) |
| `/api/messages` | POST | Submit contact form message |
| `/api/admin/change-password` | POST | Change admin password |

## 🚢 Deployment

### Railway / Render
1. Connect GitHub repository
2. Set root directory to `backend`
3. Build command: `cd ../frontend && npm install && npm run build && cd ../backend && npm install`
4. Start command: `npm start`
5. Add environment variables in dashboard

### Environment Variables for Deployment
Add all variables from backend/.env to your hosting platform's environment settings.

## License
Personal portfolio project.


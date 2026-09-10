# Pocket Mentor

Pocket Mentor is an AI-powered personalized revision assistant designed for students. It helps transform study notes into concise summaries, quick revision guides, flashcards, and topic-based MCQ quizzes.

## Features

- AI-generated revision packs from pasted notes
- Interactive flashcards
- Quiz generation and automatic scoring
- Weak topic detection and revision prompts
- Student dashboard with progress overview
- JWT-based authentication
- Responsive and mobile-friendly UI
- Student/exam profile with confidence-aware recommendations
- Teach a Friend simulation with voice input and scored teaching report
- Adaptive Boss Battle with four lives, 100 HP, staged difficulty and saved mistakes
- Five-minute Rescue Mode and transparent exam readiness score
- MongoDB-backed learning records for quizzes, teaching, battles, rescue sessions and mistakes

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcrypt

## Project Structure

```text
pocket-mentor/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
├── package.json
├── README.md
└── package-lock.json
```

## Installation

1. Clone the project.
2. Install root dependencies:

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor"
npm install
```

3. Install backend dependencies:

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor\backend"
npm install
```

4. Install frontend dependencies:

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor\frontend"
npm install
```

## Environment Variables

Create backend env file:

```powershell
copy .env.example .env
```

Then update values as needed.

### Backend .env.example

```env
PORT=5041
MONGODB_URI=mongodb://127.0.0.1:27017/pocket-mentor
JWT_SECRET=your_jwt_secret_here
AI_API_KEY=your_ai_api_key_here
AI_PROVIDER=mock
AI_MODEL=gpt-4o-mini
FRONTEND_URL=http://localhost:5173
```

### Frontend .env.example

```env
VITE_API_URL=http://localhost:5041/api
```

## MongoDB Setup

- Install MongoDB locally or use MongoDB Atlas.
- Ensure your MongoDB URI points to a reachable database.
- If MongoDB is not running, the backend can continue in demo mode for UI testing, but production usage should use a live MongoDB instance.

## Run the App

### Run both services together

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor"
npm run dev
```

### Run backend only

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor\backend"
npm run dev
```

### Run frontend only

```powershell
cd "D:\HACKATHON(ATP)\pocket-mentor\frontend"
npm run dev
```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Notes
- POST /api/notes
- GET /api/notes
- GET /api/notes/:id
- DELETE /api/notes/:id

### AI generation
- POST /api/ai/generate

### Adaptive learning
- GET /api/learning/overview
- PUT /api/learning/profile
- POST /api/learning/teaching
- POST /api/learning/boss
- POST /api/learning/rescue
- POST /api/learning/quiz
- POST /api/learning/mistakes/fix

## Demo Flow

1. Register and complete the student profile.
2. Create a revision pack from pasted or OCR-extracted notes.
3. View summary, quick revision, key concepts and flashcards.
4. Attempt the adaptive quiz and review the result.
5. Teach a Friend, fight the Boss Battle, or launch a five-minute Rescue.
6. Use Exam Readiness and the Smart Mistake Bank to choose the next activity.

The mock provider is deliberately deterministic for hackathon demos. Set `AI_PROVIDER=openai` and `AI_API_KEY` in the backend environment to use the configured OpenAI-compatible JSON generation path. API keys remain backend-only.

## Future Improvements

- Personalized study plans
- PDF and image note upload
- Multi-language support
- Voice-based learning
- Spaced repetition engine
- Advanced analytics dashboards

## Screenshots

Add screenshots here when the project is ready for demo.

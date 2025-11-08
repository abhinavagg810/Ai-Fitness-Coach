# AI Fitness Coach

AI-powered fitness and nutrition coaching platform that collects user biometrics, eating preferences, and wellness feedback to generate adaptive 7-day plans via large language models. The project contains a Node.js/Express API with MongoDB persistence and a React/Tailwind dashboard for plan visualization and progress tracking.

## Project Structure

```
.
├── backend/         # Express API, MongoDB models, OpenAI integration
└── frontend/        # React + Vite client with TailwindCSS styling
```

## Backend

### Environment variables

Create a `.env` file inside `backend/` based on `.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-fitness-coach
JWT_SECRET=replace-with-strong-secret
OPENAI_API_KEY=your-openai-api-key
```

If `OPENAI_API_KEY` is omitted, the API falls back to a deterministic sample plan to simplify local development.

### Install & run

```
cd backend
npm install
npm run dev
```

The server exposes the following authenticated endpoints under `/api`:

- `POST /register` and `POST /login` – email/password authentication
- `POST /submit-data` – persist personal, medical, and food preference data
- `POST /generate-plan` – request a 7-day plan from OpenAI and store it
- `GET /get-plan` – fetch the current week's plan
- `POST /update-progress` – update completion counts and notes
- `POST /next-week` – generate an adapted plan for the next week

## Frontend

### Environment variables

Create `frontend/.env` with the backend base URL if different from the default:

```
VITE_API_URL=http://localhost:5000/api
```

### Install & run

```
cd frontend
npm install
npm run dev
```

The frontend provides:

- Registration & login screens
- Onboarding form for detailed user data collection
- AI-generated weekly plan dashboard with day cards, completion toggles, and a progress tracker
- Modal to update weekly progress and regenerate the next week's plan

## Deployment

- **Frontend:** Deploy the Vite application to Vercel (build command `npm run build`, output `dist`).
- **Backend:** Deploy the Express API to services like Render or Railway. Ensure environment variables are configured and a MongoDB instance is reachable.

## Testing the Flow Locally

1. Start MongoDB and the backend server (`npm run dev`).
2. Launch the frontend (`npm run dev`) and open the provided URL.
3. Register a new account, complete onboarding, and inspect the generated plan.
4. Mark daily completion or update weekly metrics to trigger next-week plan generation.

## License

MIT

# Student Flow PM - Backend API

Backend API for Student Flow PM using Express.js, DrizzleORM, PostgreSQL, Better Auth, and Google Gemini AI.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL, secrets, and API keys
   ```

3. **Setup database:**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:push      # Push schema to database
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (Better Auth)
- `POST /api/auth/sign-up` - Register
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/session` - Get session

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/projects/:projectId/tasks` - List tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update status

### AI Features
- `GET /api/projects/:id/ai/health` - Health score
- `GET /api/projects/:id/ai/suggestions` - Task suggestions
- `GET /api/projects/:id/ai/report` - Insights report
- `POST /api/ai/analyze-document` - Document analysis

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth secret (min 32 chars) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: 3001) |
| `FRONTEND_URL` | Frontend URL for CORS |

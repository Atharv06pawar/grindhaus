# REDAESTH

Production-ready monorepo layout for the REDAESTH platform.

## Active architecture

```text
redaesth/
|- client/               React app (styled-components + framer-motion + lenis)
|- server/               Node/Express API (modular routes/controllers/services)
|- api/                  Vercel serverless entrypoints for the Express app
|- ai/
|  |- engine_cpp/        Local C++ coaching engine
|  `- README.md          Future AI system domain notes
|- package.json          Root scripts for client/server workflow
|- vercel.json           Vercel build and routing config
`- grindhaus.bat         One-click local launcher
```

## Local development

1. Install dependencies

```powershell
npm install --prefix client
npm install --prefix server
```

2. Start backend

```powershell
npm run dev:server
```

3. Start frontend

```powershell
npm run dev:client
```

4. (Optional) Compile the C++ engine for local AI responses

```powershell
cd ai/engine_cpp
g++ -std=c++17 -O2 -I. main.cpp -o grind_engine.exe
```

## Validation commands

```powershell
npm run lint
npm run build
npm run test
```

## API base

- Versioned base: `/api/v1`
- Health: `GET /api/v1/health`

### Auth
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`

### Chat
- `POST /api/v1/chat`
- `POST /api/v1/chat/message`
- `GET /api/v1/chat/notifications`
- `POST /api/v1/chat/notifications/read`

## Local AI companion

The chat system runs locally without external LLM APIs. It uses `server/ai/memory.json`
as persistent companion memory and updates it after each chat turn. The file is local-only
and ignored by git so real user memory is not committed.

Memory stores:
- user goals, weight, preferences, and habits
- chat history
- hydration, nutrition, workout, inactivity, and performance notifications

The always-on simulator starts with the server and runs health checks every minute.
Set `DISABLE_AI_SCHEDULER=true` to disable the interval for special local runs.

Example:

```powershell
npm run dev:server
```

```http
POST /api/v1/chat
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "I didn't workout today"
}
```

Response:

```json
{
  "response": "That is okay, but consistency matters. Let's plan tomorrow: pick one focused session, keep it short, and restart the streak."
}
```

### Profiles
- `GET /api/v1/profiles/:userId`
- `PATCH /api/v1/profiles`

### Community
- `GET /api/v1/community/posts`
- `POST /api/v1/community/posts`
- `POST /api/v1/community/posts/:postId/like`
- `POST /api/v1/community/posts/:postId/comment`

## Vercel deployment

- Build command: `cd client && npm install && npm run build`
- Output directory: `client/build`
- Framework: `create-react-app`
- Optional frontend env var for external API: `REACT_APP_API_URL`

If `REACT_APP_API_URL` is not set, frontend requests target `/api/v1/*` on the same origin.

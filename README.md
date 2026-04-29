# GrindHaus

Production-ready monorepo layout for the GrindHaus platform.

## Active architecture

```text
grindhaus/
|- client/               React app (styled-components + framer-motion + lenis)
|- server/               Node/Express API (modular routes/controllers/services)
|- ai/
|  |- engine_cpp/        Local C++ coaching engine
|  `- README.md          Future AI system domain notes
|- grindhaus/            Legacy frontend (not used in active runtime)
|- grindhaus-backend/    Legacy backend (not used in active runtime)
`- grindhaus_ai/         Legacy AI stack (not used in active runtime)
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
- `POST /api/v1/chat/message`

### Profiles
- `GET /api/v1/profiles/:userId`
- `PATCH /api/v1/profiles`

### Community
- `GET /api/v1/community/posts`
- `POST /api/v1/community/posts`
- `POST /api/v1/community/posts/:postId/like`
- `POST /api/v1/community/posts/:postId/comment`

## Vercel deployment

- Root build command: `npm run build`
- Output directory: `client/build`
- Optional frontend env var for external API: `REACT_APP_API_URL`

If `REACT_APP_API_URL` is not set, frontend requests target `/api/v1/*` on the same origin.

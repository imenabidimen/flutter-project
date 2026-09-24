# ClientHub

A React + TypeScript workspace for keeping a small team's work organized. The project focuses on straightforward product behavior: sign in, see your work, add a task, finish it, and get out of the way.

Stack: React 18, TypeScript, Vite, React Router, Vitest.

## What it demonstrates

- Client-side authentication state
- REST API integration with bearer tokens
- Task loading and mutations
- Logout/session clearing
- Responsive UI states
- CI with automated tests and a production build

## Why a separate React project?

WorkBoard uses Vue for the same backend contract. ClientHub deliberately implements the workflow in React so the portfolio shows that I can move between component models and state-management approaches without changing the API design.

## Run locally

npm install
npm run dev
npm test
npm run build

Set VITE_API_URL to point at another API instance.

## API contract

- POST /api/auth/login
- GET /api/tasks
- POST /api/tasks
- POST /api/tasks/:id/complete

The UI is intentionally small. The value of this repository is in the clean API boundary and the interaction states, not in pretending a three-screen demo is a full CRM.
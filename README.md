<div align="center">

# 💬 ChatEase

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-SWC-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)

</div>

A real-time chat app I built with React, TypeScript, and Socket.IO. Supports private DMs, group chats, and public channels. You can send text, images, and voice messages, and there's a built-in AI assistant panel on the side.

The backend lives in a separate repo and needs to be running locally for this to work.

---

## What it does

- **Private, group & public conversations** — three conversation modes, each with their own layout
- **Voice messages** — record and send audio directly in the chat
- **Image sharing** — send images with a loading preview
- **AI assistant** — side panel on desktop, full overlay on mobile, talks to `/api/ai/chat`
- **Google OAuth + email auth** — both options available at sign-in
- **Contact system** — add people, send/accept requests, block or blacklist
- **Real-time everything** — messages, notifications, block events all go through Socket.IO
- **Infinite scroll** — older messages load as you scroll up
- **Swipe to open nav** — on mobile, swipe right to open the sidebar

---

## Stack

|                       |                        |
| --------------------- | ---------------------- |
| React 18 + TypeScript | core UI                |
| Vite + SWC            | build tooling          |
| SCSS Modules          | styling                |
| Redux Toolkit         | global state           |
| TanStack Query v5     | server state & caching |
| Socket.IO Client      | real-time              |
| Ant Design 5          | UI components          |
| Framer Motion         | animations             |
| Axios                 | HTTP                   |

---

## Running locally

You need Node 18+, pnpm, and the backend running on port `8080`.

```bash
pnpm install
pnpm dev
```

Runs at `http://localhost:3000`.

```bash
pnpm build    # builds and copies output to ../server/public
pnpm preview  # preview the production build
pnpm lint     # ESLint, zero warnings
```

---

## Project layout

```
src/
├── client/          # all API calls, react-query setup
├── containers/
│   ├── Chat/        # the main app shell (navbar, conversation views, AI panel)
│   └── Home/        # landing, sign in, sign up
├── store/           # redux slices — auth, socket, UI state, notifications
├── helpers/         # debounce, throttle, useResize, shared scss vars
└── shared/          # reusable components and SVG icons
```

---

## API endpoints

Dev base URL: `http://localhost:8080`. In production it uses `window.location.origin` automatically.

**Auth**

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/login/oauth/google
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/check/username/:name
GET    /api/auth/check/email/:email
```

**Messages**

```
GET    /api/messages/:conversationId   (paginated)
POST   /api/messages/:conversationId
POST   /api/messages/:conversationId/image
POST   /api/messages/:conversationId/voice
DELETE /api/messages/:messageId
```

**Contacts & social**

```
GET    /api/users/contacts
POST   /api/users/contacts/:id
DELETE /api/users/contacts/:id
PATCH  /api/users/contacts/:id/block
PATCH  /api/users/contacts/:id/unblock
PATCH  /api/users/contacts/:id/blacklist
GET    /api/users/requests
POST   /api/users/requests/:id
DELETE /api/users/requests/:id
GET    /api/users/candidates/contacts?search=...
GET    /api/users/conversations/public
```

**Profile**

```
GET    /api/users/profile
PATCH  /api/users/profile
PUT    /api/users/profile/picture
GET    /api/users/profile/:conversationId/contact
```

**AI**

```
POST   /api/ai/chat
```

---

## Socket events

| event          | direction | what it does                 |
| -------------- | --------- | ---------------------------- |
| `chat`         | emit      | join a conversation room     |
| `block`        | emit      | notify the server of a block |
| `message`      | on        | incoming messages            |
| `notification` | on        | contact request alerts       |

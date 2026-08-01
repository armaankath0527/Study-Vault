# StudyVault

A campus utility app for students — timetable, tasks, attendance, notice board,
notes, GPA calculator, and productivity streaks in one place.

This project is split into two apps:

```
studyvault-project/
├── client/   React (Vite) frontend
└── server/   Node.js + Express + MongoDB backend (REST API)
```

The UI, layout, colors, animations, icons, charts, and navigation are unchanged
from the original build — this refactor only reorganizes the code into a
professional project structure and replaces local/browser storage with a real
backend + database.

---

## 1. Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - a local MongoDB server (`mongod`), or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't want to install MongoDB locally)

---

## 2. Backend setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in your own values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/studyvault
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=30d
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

- `MONGO_URI` — your local MongoDB connection string, or your Atlas connection
  string (looks like `mongodb+srv://user:password@cluster.mongodb.net/studyvault`)
- `JWT_SECRET` — any long random string (used to sign login tokens)

Run the API:

```bash
npm run dev     # with auto-restart (nodemon)
# or
npm start       # plain node
```

The API will start on `http://localhost:5000` and log:

```
MongoDB connected: <host>
StudyVault API listening on port 5000
```

You can sanity-check it's alive at `http://localhost:5000/api/health`.

---

## 3. Frontend setup (`client/`)

In a second terminal:

```bash
cd client
npm install
cp .env.example .env
```

By default `.env` points at the local API:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). You'll land on the
StudyVault landing page → sign up → dashboard.

To build a production bundle:

```bash
npm run build      # outputs to client/dist
npm run preview    # serve the production build locally
```

---

## 4. Project structure

### `client/src/`

```
components/
  common/     Modal, ConfirmModal, Toast, Field, EmptyState, StatCard, PriorityBadge, LoadingScreen
  layout/     Sidebar, Topbar, BottomNav, AppLayout
  CalendarView.jsx
context/      AuthContext, AppDataContext
hooks/        useAuth (via context), useNotifications, useToast, useDarkMode, useBodyBackground
pages/        LandingPage, AuthPage, Dashboard, Timetable, Tasks, Attendance,
              Notices, Notes, GpaCalculator, Faculty, Profile
services/     One file per API resource (authService, taskService, timetableService, …)
              plus a shared axios instance (api.js) with JWT + error interceptors
utils/        constants.js, dateUtils.js, gradeUtils.js
styles/       theme.css (CSS variable design tokens, light + true-black dark theme)
```

### `server/`

```
config/db.js            MongoDB connection
models/                 User, Task, ClassEntry, AttendanceSubject, AttendanceLog,
                         CalendarEvent, Note, Notice, GpaSemester, Notification
middleware/              authMiddleware (JWT verification), errorMiddleware
controllers/             Business logic per resource
routes/                  Express routers per resource
utils/                   generateToken, asyncHandler
server.js                App entry point
```

---

## 5. API overview

All routes are prefixed with `/api`. Every route except `/auth/signup` and
`/auth/login` requires an `Authorization: Bearer <token>` header.

| Method | Route                        | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/auth/signup`                | Create an account                    |
| POST   | `/auth/login`                 | Log in, returns a JWT                |
| GET    | `/auth/me`                    | Get the logged-in user               |
| POST   | `/auth/logout`                | Logout (client discards the token)   |
| GET    | `/dashboard`                  | One-shot snapshot of all app data    |
| GET/POST | `/tasks`                    | List / create tasks                  |
| PUT/DELETE | `/tasks/:id`               | Update / delete a task               |
| GET/POST | `/timetable`                | List / create classes                |
| PUT/DELETE | `/timetable/:id`           | Update / delete a class              |
| GET    | `/attendance`                 | Get attendance subjects + log        |
| PUT    | `/attendance/:subject`        | Mark today's attendance for a subject|
| GET/POST | `/notes`                    | List / create notes                  |
| PUT/DELETE | `/notes/:id`               | Update / delete a note               |
| GET/POST | `/notices`                  | List / post notices (shared board)   |
| DELETE | `/notices/:id`                | Delete a notice                      |
| GET/POST | `/calendar`                 | List / create calendar events        |
| DELETE | `/calendar/:id`                | Delete a calendar event              |
| GET/POST | `/gpa`                      | List / create GPA semesters          |
| PUT/DELETE | `/gpa/:id`                 | Update / delete a semester           |
| GET/PUT | `/profile`                   | Get / update profile                 |
| PUT    | `/profile/password`           | Change password                      |
| GET    | `/notifications`              | Get notifications                    |
| PUT    | `/notifications/read-all`     | Mark all notifications as read       |

A calendar event created with `type: "Task"` automatically creates a linked
`Task` document too, so it shows up in both the Calendar and the Tasks tab.

---

## 6. Notes on behavior

- **Notice board** is shared across all signed-up students (not per-user).
- **Productivity streaks** are tracked server-side on the `User` document and
  bump automatically whenever a task transitions to `done`.
- **Notifications** combine persisted events (e.g. new notices) with
  live-computed ones (tasks due today, low attendance, streak milestones).
- **Dark mode** is true black (`#000000` / `#111111`), not a tinted dark theme.

---

## 7. Troubleshooting

- **"MongoDB connection error"** — check `MONGO_URI` in `server/.env`; make
  sure `mongod` is running locally, or that your Atlas IP allow-list includes
  your current IP.
- **CORS errors in the browser** — make sure `CLIENT_ORIGIN` in `server/.env`
  matches the URL the frontend is actually running on.
- **401 errors right after login** — double check `VITE_API_URL` in
  `client/.env` points at your running backend.

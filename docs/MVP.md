# CampusFlow — Hackathon MVP Plan

> Scoped from the CampusFlow PRD v1.0 | Goal: the smallest buildable, demo-ready version

---

## 1. MVP Objective

CampusFlow MVP is a single web app where faculty publish announcements, assignments, and study resources for their courses. Students log in and see everything relevant to them on one dashboard. An AI assistant (Gemini) answers questions like *"What's due this week?"* using only that student's college data. It proves the core idea: one place instead of WhatsApp chaos, plus one smart feature. Everything else is a roadmap item.

---

## 2. Core User Flow

1. Open the site and land on the login/register page.
2. Faculty registers (picks the "Faculty" role) and logs in.
3. Faculty creates a course, e.g., "CS201 – DBMS".
4. Faculty posts an announcement, an assignment with a due date, and a resource (link or pasted notes).
5. Student registers and logs in (separate browser or incognito window).
6. Student joins the course from the course list.
7. The student dashboard shows announcements, upcoming assignments, and resources for their courses.
8. Student opens the AI assistant and asks "What's due this week?" or "Summarize the latest announcements".
9. Gemini replies with an answer based on the student's real data.

---

## 3. Must-Have Features

- Register and log in with two roles (`student`, `faculty`).
- Role-aware dashboard.
- Courses: faculty create, students join.
- Announcements: faculty create, students view (category: `general` | `event` | `exam`, optional event date, college-wide if `course_id` is null).
- Assignments: faculty create with due date, students view (sorted by due date).
- Resources: faculty add (title, description, link or optional pasted text).
- AI assistant: one chat drawer backed by Gemini Flash.
- Basic validation and clear error messages.
- Responsive layout (works on a phone-sized screen, ~375px).
- Seed script with demo data (1 faculty, 2 students, 2 courses, sample content).

---

## 4. Nice-to-Have Features (Only if MVP is done early)

1. Assignment submissions (text or link) and a faculty view of who submitted.
2. A "Summarize" button on each announcement.
3. Minimal admin page: list users, deactivate a user.
4. Read/unread marker on announcements.
5. Dark mode.
6. Edit and delete for faculty posts.
7. File upload for resources (hosted bucket).
8. Simple search/filter box on the dashboard.

---

## 5. Features Explicitly Cut for Hackathon MVP

- Admin dashboard, analytics, audit logs
- Email verification, password reset, SSO
- Refresh tokens, session management, lockouts (one JWT in Authorization header is enough)
- Discussions / forums
- Complaints workflow
- Events with RSVP, calendar, capacity (events are announcements with category `event` and date)
- Notifications (email / push / in-app)
- Global full-text search
- File upload / S3 / virus scan (links or pasted text only)
- RAG / embeddings / pgvector (not needed at this scale; direct prompt feeding)
- Background workers / queues
- Bulk CSV import
- Soft deletes, rate limiting, CI/CD, monitoring

---

## 6. User Roles

| Role | Permissions in MVP |
| :--- | :--- |
| **Student** | Register / log in, browse and join courses, view announcements, assignments, and resources for joined courses (+ college-wide announcements), use the AI assistant. |
| **Faculty** | Register / log in, create courses, create announcements, assignments, and resources for their own courses (+ college-wide announcements), view the same feeds, use the AI assistant. |

---

## 7. Database (PostgreSQL, 6 tables)

### `users`
- `id` (PK, String/UUID)
- `name` (String)
- `email` (String, unique)
- `password_hash` (String)
- `role` ('student' | 'faculty')
- `created_at` (DateTime, default now)

### `courses`
- `id` (PK, String/UUID)
- `code` (String, e.g., 'CS201')
- `name` (String)
- `faculty_id` (FK -> `users.id`)
- `created_at` (DateTime, default now)

### `enrollments`
- `id` (PK, String/UUID)
- `user_id` (FK -> `users.id`)
- `course_id` (FK -> `courses.id`)
- `joined_at` (DateTime, default now)
- Unique constraint: `[user_id, course_id]`

### `announcements`
- `id` (PK, String/UUID)
- `course_id` (FK -> `courses.id`, nullable = college-wide)
- `author_id` (FK -> `users.id`)
- `title` (String)
- `body` (Text)
- `category` ('general' | 'event' | 'exam')
- `event_date` (DateTime, nullable)
- `created_at` (DateTime, default now)

### `assignments`
- `id` (PK, String/UUID)
- `course_id` (FK -> `courses.id`)
- `author_id` (FK -> `users.id`)
- `title` (String)
- `description` (Text)
- `due_date` (DateTime)
- `created_at` (DateTime, default now)

### `resources`
- `id` (PK, String/UUID)
- `course_id` (FK -> `courses.id`)
- `uploader_id` (FK -> `users.id`)
- `title` (String)
- `description` (Text)
- `link_url` (String, nullable)
- `content_text` (Text, nullable)
- `created_at` (DateTime, default now)

---

## 8. Backend REST APIs (13 Endpoints)

1. `POST /api/auth/register` (Public) - Create account (`name`, `email`, `password`, `role`, optional `facultyInviteCode`)
2. `POST /api/auth/login` (Public) - Return JWT and user info
3. `GET /api/auth/me` (Auth: Yes) - Current user info (restores session on refresh)
4. `GET /api/courses` (Auth: Yes) - List all courses with `joined` flag
5. `POST /api/courses` (Auth: Faculty) - Create course
6. `POST /api/courses/:id/join` (Auth: Student) - Student joins course
7. `GET /api/announcements` (Auth: Yes) - Announcements for user's courses + college-wide
8. `POST /api/announcements` (Auth: Faculty) - Create announcement (course-specific or college-wide)
9. `GET /api/assignments` (Auth: Yes) - Assignments for user's courses, sorted by `due_date ASC`
10. `POST /api/assignments` (Auth: Faculty) - Create assignment for owned course (due date in future)
11. `GET /api/resources` (Auth: Yes) - Resources for user's courses
12. `POST /api/resources` (Auth: Faculty) - Add resource for owned course
13. `POST /api/ai/ask` (Auth: Yes) - Ask AI assistant (500 char limit, rate limited, safe prompt context)

---

## 9. AI Assistant Specifications

- **Question limit**: 500 characters max.
- **Rate limiting**: Simple in-memory per-user rate limit (e.g., 5 requests per minute) to protect free Gemini quota.
- **Untrusted text protection**: Course resources / pasted notes must be clearly delimited with XML/triple backtick tags with strict system prompt instructing Gemini not to follow external instructions inside materials.
- **Error resilience**: Return friendly messages on timeout or quota exhaustion.

# Job Search App – Backend API (Node.js + GraphQL + REST)

Hi! I’m excited to share this backend application that powers a job search platform using both REST and GraphQL APIs. This project brings together clean backend architecture, modular routing, admin control logic, and a flexible GraphQL schema to allow easy extension and management.

---

## 🧩 What This Project Delivers

Over the course of building this, I focused on creating a backend that is both practical and easy to work with. It includes:

- A GraphQL schema to handle admin-level actions like approving or banning users and companies
- RESTful endpoints for job posting, user management, and company logic
- A dedicated GraphQL Playground for quick testing and prototyping
- Full support for global error handling and 404 routing
- Cron job automation on app boot
- MongoDB connection setup out of the box

---

## 🧠 How It Works

The app bootstraps Express and binds all route handlers for:
- `/auth` – authentication and session logic
- `/user` – user profile and data routes
- `/company` – company registration and admin functions
- `/job` – job creation, search, and filtering

It also includes:
- `/graphQL` – the main GraphQL endpoint
- `/graphPlayGround` – a live playground to test queries and mutations

All routes are JSON-ready via `express.json()`, and uncaught requests are caught by a custom global error handler.

---

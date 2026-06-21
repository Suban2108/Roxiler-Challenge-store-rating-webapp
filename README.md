# For Login Details Please go to the very end of this Readme.md file

## Deployment Link: https://roxiler-challenge-store-rating-weba.vercel.app

## Deployment Status : 

- Frontend is Deployed in Vercel
- Backend is Deployed in Render


# StoreRate - Store Rating Platform

Lightweight full-stack application for submitting and managing store ratings with role-based access control.

## Tech Stack

- Backend: Express.js, Node.js, PostgreSQL, JWT, Zod
- Frontend: React, Vite, Tailwind CSS, shadcn UI primitives
- Dev / Tooling: nodemon (dev), dotenv, bcryptjs, axios, lottie

## Features

- Authentication: registration, login, logout, access + refresh tokens
- Role-based access: admin, store_owner, user
- Admin: dashboard metrics, create/list/update users and stores
- Store owner: view store ratings and raters, average rating
- Normal user: browse/search stores, submit/update 1–5 ratings, change password
- API validations using Zod; centralized error handling

## Low-level Design (LLD) concepts used

- Layered architecture (Router → Controller → Service → Repository)
- DTOs / validation boundary (Zod schemas)
- Repository pattern (DB access abstraction)
- Connection pooling (pg Pool)
- Pagination, filtering, sorting utilities
- JWT-based auth with access/refresh tokens
- Role-based authorization middleware
- Centralized error envelope and AppError class
- Database migrations/seeding (schema.sql + seed script)
- Optimistic UI patterns (frontend)
- Debouncing for search

## Project layout

See `backend/src` and `frontend/src` for implementation. Backend DB schema and seed are in `backend/src/db`.

## Notes

- Database: project currently expects a PostgreSQL instance referenced by `DATABASE_URL` (see `backend/src/config/index.js`).
- Scripts: backend `package.json` includes `db:schema` and `db:seed` scripts.
- Database is `deployed` in `Supabase` for accessing the data from anywhere in the world


## Example Data to login as [ admin, user, owner ]:
# Admin: 
- email: `admin@storeplatform.com` ; password: `Admin@Pass123`

# User: 
- email: `user@storeplatform.com` ; password: `User@Pass123`

# Owner:
- Owner1: email: `owner1@storeplatform.com` ; password: `Owner@Pass123`
- Owner2: email: `owner2@storeplatform.com` ; password: `Owner@Pass123`

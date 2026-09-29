# VYRO E-commerce Platform

A full-stack e-commerce solution including:
- Website
- CRM
- Backend API
- Telegram Bot
- Telegram Mini App

## Project Structure
Powered by Turborepo.

- `apps/website`: Next.js frontend for customers
- `apps/crm`: Next.js frontend for managers
- `apps/api`: Node.js backend
- `apps/telegram-bot`: Telegram bot integration
- `apps/telegram-mini-app`: Telegram Mini App
- `packages/database`: Prisma models and PostgreSQL connection
- `packages/types`: Shared types
- `packages/validation`: Zod schemas
- `packages/ui`: Shared shadcn/ui components

## Getting Started

1. Copy `.env.example` to `.env` in all required places.
2. Run `docker-compose up -d` to start the database.
3. Run `npm install`.
4. Run `npm run db:push` to sync database schema.
5. Run `npm run dev` to start all apps.


[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/skyt11dd/VYROSHOP)


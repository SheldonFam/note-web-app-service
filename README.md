<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Note Web Service

Backend API for the note-taking application built with NestJS, Prisma, and PostgreSQL.

**Production:** https://note-web-app-service.vercel.app
**Frontend:** https://fem-note.vercel.app

## Tech Stack

- NestJS 11
- Prisma 7 (PostgreSQL)
- JWT authentication (access + refresh tokens)
- argon2 password hashing
- Resend (email)
- Google OAuth

## Setup

```bash
pnpm install
cp .env.example .env   # fill in your values
npx prisma migrate dev
pnpm run start:dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Yes | Secret for access tokens (min 16 chars) |
| `JWT_REFRESH_SECRET` | Yes | Secret for refresh tokens (min 16 chars) |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` / `production` / `test` |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:3001`) |
| `JWT_ACCESS_EXPIRES_IN` | No | Access token TTL (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh token TTL (default: `7d`) |
| `RESEND_API_KEY` | No | Resend API key for emails |
| `MAIL_FROM` | No | Sender email address |

## API Endpoints

Base URL: `https://note-web-app-service.vercel.app`

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |

**Response:**
```json
{ "status": "ok", "timestamp": "2026-03-22T00:00:00.000Z" }
```

---

### Auth

| Method | Endpoint | Auth | Rate Limit | Description |
|--------|----------|------|------------|-------------|
| `POST` | `/auth/signup` | No | 5/min | Register new user |
| `POST` | `/auth/login` | No | 5/min | Login with email/password |
| `POST` | `/auth/google` | No | 5/min | Login with Google |
| `POST` | `/auth/logout` | Yes | - | Logout (revoke refresh token) |
| `POST` | `/auth/refresh` | No | - | Refresh token pair |
| `POST` | `/auth/change-password` | Yes | 3/min | Change password |
| `POST` | `/auth/forgot-password` | No | 3/min | Request password reset email |
| `POST` | `/auth/reset-password` | No | 3/min | Reset password with token |
| `GET` | `/auth/me` | Yes | - | Get current user |

#### POST /auth/signup

```json
// Request
{ "email": "user@example.com", "password": "securepassword" }

// Response 201
{
  "user": { "id": "uuid", "email": "user@example.com", "createdAt": "..." },
  "accessToken": "eyJ...",
  "refreshToken": "uuid"
}
```

#### POST /auth/login

```json
// Request
{ "email": "user@example.com", "password": "securepassword" }

// Response 200
{
  "user": { "id": "uuid", "email": "user@example.com", "createdAt": "..." },
  "accessToken": "eyJ...",
  "refreshToken": "uuid"
}
```

#### POST /auth/google

```json
// Request
{ "accessToken": "ya29.xxx..." }

// Response 200
{
  "user": { "id": "uuid", "email": "user@gmail.com", "createdAt": "..." },
  "accessToken": "eyJ...",
  "refreshToken": "uuid"
}
```

#### POST /auth/logout

```json
// Request (Authorization: Bearer <accessToken>)
{ "refreshToken": "uuid" }

// Response 200
```

#### POST /auth/refresh

```json
// Request
{ "refreshToken": "uuid" }

// Response 200
{ "accessToken": "eyJ...", "refreshToken": "new-uuid" }
```

#### POST /auth/change-password

```json
// Request (Authorization: Bearer <accessToken>)
{ "currentPassword": "oldpassword", "newPassword": "newpassword" }

// Response 200
{ "accessToken": "eyJ...", "refreshToken": "uuid" }
```

#### POST /auth/forgot-password

```json
// Request
{ "email": "user@example.com" }

// Response 200
{ "message": "If that email exists, a reset link has been sent" }
```

#### POST /auth/reset-password

```json
// Request
{ "token": "reset-uuid", "newPassword": "newpassword" }

// Response 200
{ "message": "Password has been reset" }
```

#### GET /auth/me

```json
// Response 200 (Authorization: Bearer <accessToken>)
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "...",
  "updatedAt": "...",
  "lastLoginAt": "...",
  "isEmailVerified": false
}
```

---

### Notes

All endpoints require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/notes` | Create a note |
| `GET` | `/notes` | List notes (with filters) |
| `GET` | `/notes/:id` | Get a single note |
| `PATCH` | `/notes/:id` | Update a note |
| `DELETE` | `/notes/:id` | Delete a note |
| `POST` | `/notes/:id/archive` | Archive a note |
| `POST` | `/notes/:id/restore` | Restore an archived note |

#### POST /notes

```json
// Request
{ "title": "My Note", "content": "Hello world", "tags": ["work", "ideas"] }

// Response 201
{
  "id": "uuid",
  "title": "My Note",
  "content": "Hello world",
  "isArchived": false,
  "tags": [
    { "id": "uuid", "name": "work" },
    { "id": "uuid", "name": "ideas" }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### GET /notes

Query parameters:

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search in title, content, and tags (case-insensitive) |
| `tag` | string | Filter by a single tag name |
| `archived` | boolean | Filter by archive status (`true` / `false`) |
| `sort` | string | Sort field and direction, e.g. `updatedAt:desc`, `title:asc` (default: `updatedAt:desc`). Allowed fields: `createdAt`, `updatedAt`, `title` |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page, max 100 (default: `20`) |

```json
// Response 200
{
  "data": [
    {
      "id": "uuid",
      "title": "My Note",
      "content": "Hello world",
      "isArchived": false,
      "tags": [
        { "id": "uuid", "name": "work" },
        { "id": "uuid", "name": "ideas" }
      ],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### PATCH /notes/:id

```json
// Request (all fields optional)
{ "title": "Updated Title", "content": "Updated content", "tags": ["new-tag"] }

// Response 200
{
  "id": "uuid",
  "title": "Updated Title",
  "content": "Updated content",
  "isArchived": false,
  "tags": [{ "id": "uuid", "name": "new-tag" }],
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### DELETE /notes/:id

```json
// Response 200
{ "message": "Note deleted" }
```

#### POST /notes/:id/archive

```json
// Response 200
{
  "id": "uuid",
  "title": "...",
  "content": "...",
  "isArchived": true,
  "tags": [{ "id": "uuid", "name": "..." }],
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### POST /notes/:id/restore

```json
// Response 200
{
  "id": "uuid",
  "title": "...",
  "content": "...",
  "isArchived": false,
  "tags": [{ "id": "uuid", "name": "..." }],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### Tags

All endpoints require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tags` | List all tags for current user |

```json
// Response 200
[
  { "id": "uuid", "name": "work", "noteCount": 3 },
  { "id": "uuid", "name": "Ideas", "noteCount": 1 }
]
```

---

### Preferences

All endpoints require `Authorization: Bearer <accessToken>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/preferences` | Get user preferences |
| `PATCH` | `/preferences` | Update user preferences |

#### GET /preferences

```json
// Response 200
{ "colorTheme": "system", "fontTheme": "sans" }
```

#### PATCH /preferences

```json
// Request (all fields optional)
{ "colorTheme": "dark", "fontTheme": "serif" }

// Response 200
{ "colorTheme": "dark", "fontTheme": "serif" }
```

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Access tokens expire in 15 minutes. Use `POST /auth/refresh` with the refresh token to get a new pair.

## Error Response

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error description"
}
```

Validation errors include field-level details:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": ["email must be an email"],
    "password": ["password must be longer than or equal to 8 characters"]
  }
}
```

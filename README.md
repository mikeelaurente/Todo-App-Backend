# Todo App Backend

A robust and feature-rich backend for a Todo application built with Express.js, TypeScript, and MongoDB. Includes authentication, authorization, account management, and comprehensive todo management with password reset functionality.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)

## Features

- **User Authentication**: Register, login, logout with JWT-based authentication
- **Password Management**: Forgot password flow with OTP verification
- **Account Management**: Get user account information
- **Todo Management**: Full CRUD operations for todos with pagination and search
- **Token Refresh**: Access token refresh mechanism
- **Security**: Rate limiting, CORS, helmet for secure headers, MongoDB injection prevention
- **Email Notifications**: OTP and confirmation email sending via Nodemailer
- **Error Handling**: Comprehensive global error handling
- **Request Logging**: Morgan HTTP request logger

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.2.x
- **Database**: MongoDB 9.2.x with Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize
- **Utilities**: Cookie-parser, CORS, Morgan, UUID, Geoip-lite, UA-parser
- **Development**: tsx, TypeScript

## Project Structure

```
src/
├── controllers/           # Request handlers
│   ├── account/          # Account controller
│   ├── auth/             # Authentication controller
│   ├── token/            # Token refresh controller
│   └── todos/            # Todo CRUD controller
├── db/                   # Database connection
├── middlewares/          # Express middlewares
│   ├── global-error-handler.middleware.ts
│   ├── limiter.middleware.ts
│   └── token.middleware.ts
├── models/               # MongoDB schemas
│   ├── account/
│   ├── otp/
│   └── todos/
├── routes/               # API route definitions
│   ├── account/
│   ├── auth/
│   ├── token/
│   └── todos/
├── services/             # Business logic
│   ├── account/
│   ├── otp/
│   ├── token/
│   └── todos/
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
│   ├── bcrypt/           # Password hashing
│   ├── cookie/           # Cookie management
│   ├── error/            # Custom error class
│   ├── jwt/              # JWT operations
│   ├── mailer/           # Email configuration
│   └── session/          # Session management
└── index.ts              # Application entry point
```

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Todo-App-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (see [Environment Variables](#environment-variables))

   ```bash
   cp .env.example .env
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Type checking**
   ```bash
   npm run typecheck
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/todo-app

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@todoapp.com

# OTP
OTP_EXPIRY_MINUTES=10
```

## API Endpoints

### Base URL

`/api`

### Auth Endpoints

**Register User**

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login**

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Logout**

```
POST /auth/logout
Authorization: Bearer <access_token>
```

**Forgot Password (Send OTP)**

```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Verify Password Reset OTP**

```
POST /auth/verify-reset-otp/:email
Content-Type: application/json

{
  "otp": "123456"
}
```

**Reset Password**

```
POST /auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Account Endpoints

**Get Account Information**

```
GET /account
Authorization: Bearer <access_token>
```

### Token Endpoints

**Refresh Access Token**

```
POST /token/refresh
Authorization: Bearer <refresh_token>
```

### Todo Endpoints

**Get All Todos (Paginated & Searchable)**

```
GET /todos?search=<search>&page=<page>&limit=<limit>&status=<status>
Authorization: Bearer <access_token>

Query Parameters:
- search (string): Search by todo title
- page (number): Page number (default: 1)
- limit (number): Items per page (default: 10)
- status (string): Filter by status (all | pending | done)
```

Response:

```json
{
  "message": "Success",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "pending",
      "userId": "507f1f77bcf86cd799439010",
      "createdAt": "2026-02-15T21:37:33.638Z",
      "updatedAt": "2026-02-15T21:37:33.638Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}
```

**Get Single Todo**

```
GET /todos/:id
Authorization: Bearer <access_token>
```

**Create Todo**

```
POST /todos
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app backend"
}
```

**Update Todo**

```
PUT /todos/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "done"
}
```

**Delete Todo**

```
DELETE /todos/:id
Authorization: Bearer <access_token>
```

### Health Check

**Test API**

```
GET /api/test
```

Response:

```
Api is running
```

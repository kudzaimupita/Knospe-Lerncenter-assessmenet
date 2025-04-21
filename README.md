## Quick Start

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Features

- **SQL database**: PostgreSQL with Prisma ORM
- **Authentication and authorization**: using passport
- **Validation**: request data validation using Joi
- **API documentation**: with swagger-jsdoc and swagger-ui-express
- **Security**: HTTP headers, XSS protection, CORS, compression
- **Development tools**: ESLint, Prettier, Husky

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Database:

```bash
# push changes to db
yarn db:push

# start prisma studio
yarn db:studio
```

## API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

**Patient routes**:\
`POST /v1/patients` - create a patient\
`GET /v1/patients` - get all patients\
`GET /v1/patients/:patientId` - get patient\
`PATCH /v1/patients/:patientId` - update patient\
`DELETE /v1/patients/:patientId` - delete patient

## Patient Model

The Patient model includes the following fields:

```
- id                Int
- email             String
- name              String?
- password          String
- role              Role
- isEmailVerified   Boolean
- createdAt         DateTime
- updatedAt         DateTime
- insuranceProvider String?
- insuranceNumber   String?
- dateOfBirth       DateTime?
- gender            String?
- phone             String?
- address           String?
- bloodType         String?
- allergies         String?
- conditions        String?
- medications       String?
- lastVisit         DateTime?
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration
 |--controllers\    # Route controllers
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--services\       # Business logic
 |--validations\    # Request data validation schemas
 |--utils\          # Utility classes and functions
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Authentication & Authorization

Authentication is handled via JWT tokens. Patient routes require the following permissions:

- `getPatients` - To view patient data
- `managePatients` - To create, update, or delete patients

The ADMIN role includes these permissions by default.

# MasterPhrase — Backend

Backend API for the MasterPhrase language-learning platform.

## Tech stack

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT authentication
- bcrypt password hashing
- Nodemailer
- express-rate-limit

## Architecture

The application uses a layered structure with routes, controllers, models, middleware, database configuration, and migrations.

## Selected functionality

- User registration and login
- JWT-protected endpoints
- Password hashing
- Email-based password recovery
- User profiles and language preferences
- Vocabulary, word-set, phrase, translation, and exercise APIs
- Mistake tracking
- Subscription-related data model
- API rate limiting
- PostgreSQL relational data model through Sequelize

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Provide your own local values in `.env`. Never commit the real `.env` file. The server refuses to start without `JWT_SECRET`.

Production build:

```bash
npm run build
npm start
```

## Repository history

This is a **sanitized public portfolio mirror** of the original private development repository.

The original development history was rewritten before publication to remove sensitive configuration, secret values, generated working data, and internal-only files. Commit authors, dates, messages, and the meaningful development sequence were preserved where safe. Commit SHAs therefore differ from the original private repository, and commits that only affected removed files may no longer appear.

No production credentials are included in this repository.

## Related repository

Frontend: https://github.com/volodymyr89ukr/MasterPhrase-Frontend

The API was previously used by the production MasterPhrase application.

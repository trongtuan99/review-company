# ReviewCompany - Company Review Platform

Enterprise-grade SaaS platform for collecting and managing company reviews with multi-tenant architecture, real-time updates, and robust background processing.

## 🚀 Live Demo

- **Frontend**: [https://reviewcompany.vercel.app](https://reviewcompany.vercel.app)

## Overview

ReviewCompany enables organizations and users to evaluate companies through structured reviews with scoring, replies, and interactive features. Built with Rails 7 and React, deployed with Docker and Kafka-based event streaming.

## Key Features

- **Company Management**: Create, update, list companies with filtering and search
- **Review System**: Create reviews with scores, job titles, anonymity options
- **Intelligent Engagement**: Like/dislike reviews with real-time counters
- **Reply Threading**: Reply to reviews with nested conversations
- **Favorites**: Bookmark companies for quick access
- **Role-Based Access**: User, Admin, Owner, Anonymous roles with granular permissions
- **Multi-Tenant SaaS**: Isolated data per geographic area with separate database schemas
- **Event Streaming**: Kafka-based like/dislike event processing for scalability
- **Background Jobs**: Sidekiq workers + Clockwork scheduler for async operations

## Tech Stack

**Backend**: Rails 7.0.8, Ruby 3.1.2, PostgreSQL + UUID, Redis, Sidekiq, Clockwork, Karafka (Kafka)
**Frontend**: React 18, Vite, TanStack React Query, Axios, React Router
**Infrastructure**: Docker, Docker Compose, Puma, Multi-tenant (Apartment gem)
**Auth**: Devise + JWT with role-based access control
**API**: RESTful with versioning (X-API-VERSION header)

## Quick Start

### Prerequisites
- Ruby 3.1.2, Node.js 18+
- PostgreSQL 12+, Redis, Kafka (optional, but recommended)
- Docker & Docker Compose (optional)

### Installation

```bash
# Backend setup
bundle install
rails db:create db:migrate db:seed

# Frontend setup
cd FE && npm install

# Start development servers
rails server          # Backend: localhost:3000
npm run dev          # Frontend: localhost:5173 (in FE/)

# Background jobs (separate terminals)
bundle exec sidekiq
bundle exec clockwork app/clockworks/clock.rb
bundle exec karafka server
```

See [docs/SETUP.md](./docs/SETUP.md) for detailed configuration and Docker setup.

## Project Structure

```
ReviewCompany/
├── app/
│   ├── controllers/api/v1/       # API endpoints (company, review, reply, favorite, user)
│   ├── models/                   # Rails models (Company, Review, Reply, Like, Favorite, User, Area)
│   ├── serializers/              # JSON response formatting
│   ├── consumers/                # Kafka consumers (like_event_consumer)
│   ├── clockworks/workers/       # Scheduled jobs (delete_user, destroy_company, etc.)
│   └── middleware/               # Tenant switching via X-API-TENANT header
├── config/
│   ├── routes/api_routes.rb      # API route definitions
│   └── initializers/             # Apartment, Devise, Kafka, Redis, Sidekiq config
├── db/
│   ├── migrate/                  # Database migrations (job_title, industry, hiring, favorites)
│   └── seeds/                    # Sample data seeding
├── FE/
│   ├── src/
│   │   ├── components/           # React components (Navbar, Review*, Company*, etc.)
│   │   ├── pages/                # Page layouts (Home, CompanyDetail, Profile, etc.)
│   │   ├── hooks/                # Custom React hooks (useReviews, useCompanies, useFavorites, etc.)
│   │   ├── services/             # API client services
│   │   └── contexts/             # React Context (AuthContext)
│   └── vite.config.js            # Vite bundler config
├── docs/                         # Project documentation
└── spec/                         # RSpec tests (models, API requests)
```

## Recent Changes (Latest 5 Commits)

1. **update feat** (Dec 20): Enhanced UI components with CSS styling for reviews, recent reviews list, rating display, improved company/profile pages. Added job_title and industry/hiring fields to models.
2. **update feature** (Dec 20): Refactored API handling, added React hooks for data fetching (useReviews, useCompanies, useFavorites), added ConfirmModal, improved error handling.
3. **add favorites** (Dec 19): Implemented company favorites with new Favorite model, API endpoints, and UI integration.
4. **bugfix** (earlier): Various bug fixes in core functionality.
5. **add pages** (earlier): Added new frontend pages.

## Architecture Highlights

- **Multi-Tenant**: Apartment gem with separate PostgreSQL schemas per area (tenant)
- **Event-Driven**: Kafka for async like/dislike processing (producer/consumer pattern)
- **Stateless API**: Rails API with JWT auth, token validation via AuthTokenConcern
- **Background Processing**: Sidekiq with queues for delete_user, find_and_destroy_company, handle_like_event
- **Horizontal Scaling**: Stateless servers, independent worker scaling, Kafka consumer groups

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture.

## API Documentation

All endpoints are versioned with `X-API-VERSION` header. Core endpoints:

- **Companies**: GET/POST /companies, GET /companies/:id, PUT /companies/:id, DELETE /companies/:id
- **Reviews**: GET/POST /companies/:company_id/reviews, PUT/DELETE reviews/:id
- **Replies**: GET/POST /reviews/:review_id/replies
- **Likes**: PUT /reviews/:id/like (toggle like/dislike)
- **Favorites**: GET /favorites, POST /favorites/:company_id, DELETE /favorites/:company_id
- **Auth**: POST /auth/register, POST /auth/login, POST /auth/logout
- **Users**: GET /profile, PUT /profile

See [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for full details.

## Environment Variables

Key variables in `.env`:

```
RAILS_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/review_company
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
KAFKA_BROKERS=localhost:9092
APARTMENT_EXCLUDED_MODELS=User,Role,Area
ENABLE_DELETE_USER=1
ENABLE_FIND_AND_DESTROY_COMPANY=1
ENABLE_FIND_AND_DESTROY_REVIEW=1
```

See [docs/SETUP.md](./docs/SETUP.md) for complete environment setup.

## Development Guidelines

- Use strong params for validation
- Model validations in ActiveRecord models
- JWT-based authentication, role checks in controllers
- Use serializers for consistent JSON responses
- Write RSpec tests in spec/models and spec/requests
- Follow Rails conventions for naming and structure

See [docs/code-standards.md](./docs/code-standards.md) for detailed guidelines.

## Deployment

Docker Compose for quick setup:

```bash
docker-compose up -d
```

Production deployment via traditional servers or cloud platforms. See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Documentation Index

- [API Documentation](./docs/API_DOCUMENTATION.md) - All endpoints, request/response examples
- [Architecture](./docs/ARCHITECTURE.md) - System design, data flow, scaling strategies
- [Setup Guide](./docs/SETUP.md) - Installation and configuration
- [Models](./docs/MODELS.md) - Database schema, relationships, validations
- [Deployment](./docs/DEPLOYMENT.md) - Production deployment, monitoring, backup
- [Code Standards](./docs/code-standards.md) - Development best practices
- [System Architecture](./docs/system-architecture.md) - Detailed architecture docs
- [Project Roadmap](./docs/project-roadmap.md) - Planned features and improvements
- [Codebase Summary](./docs/codebase-summary.md) - Codebase overview

## License

[TBD]

## Support

For issues or questions, create a GitHub issue or contact the development team.

---

**Last Updated**: January 21, 2026

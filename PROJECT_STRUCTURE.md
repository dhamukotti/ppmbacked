# PPM Backend - Project Structure Documentation

## Overview

PPM (Project Portfolio Management) Backend is a Node.js/Express.js application that provides a comprehensive API for project management, task tracking, sprint management, and team collaboration. The application uses Sequelize ORM with MSSQL database, implements authentication with Passport.js, and includes real-time communication via Socket.IO.

## Technology Stack

- **Runtime**: Node.js (>= v20.11.1 LTS)
- **Framework**: Express.js
- **Database**: Microsoft SQL Server (MSSQL)
- **ORM**: Sequelize
- **Authentication**: Passport.js with JWT and Google OAuth
- **Real-time**: Socket.IO
- **API Documentation**: Swagger/OpenAPI
- **Template Engine**: EJS
- **Internationalization**: i18n
- **File Upload**: express-fileupload
- **Email Service**: MailerSend
- **Testing**: Jest

## Root Directory Structure

```
ppm-backend/
├── index.js                 # Main application entry point
├── package.json            # Project dependencies and scripts
├── eslint.config.mjs       # ESLint configuration
├── passport-config.js      # Passport.js authentication configuration
├── README.md               # Basic project setup instructions
├── public/                 # Static assets
├── src/                    # Source code directory
└── PROJECT_STRUCTURE.md    # This documentation file
```

## Detailed Directory Structure

### `/public` - Static Assets
Contains all static files served directly to the client.

```
public/
├── css/
│   ├── not-found.css      # 404 page styling
│   └── style.css          # Main application styles
└── images/
    ├── logo/
    │   ├── logo-pp-dark.png
    │   ├── logo-pp-small.png
    │   └── logo-pp.png
    └── users/
        └── man.png        # Default user avatar
```

### `/src` - Source Code

The main source code directory containing all application logic, organized in a modular structure.

#### `/src/api-docs` - API Documentation
Contains Swagger/OpenAPI documentation files for all API endpoints.

```
api-docs/
├── api.js                 # Main Swagger configuration
└── swagger/               # Individual API documentation files
    ├── auth.js            # Authentication endpoints
    ├── bug-queue.js       # Bug queue management
    ├── column-type-lookup.js
    ├── country.js         # Country data endpoints
    ├── invite.js          # Invitation management
    ├── organization.js    # Organization management
    ├── project-priority.js
    ├── project-status.js
    ├── project.js         # Project management
    ├── sprint-task.js     # Sprint task management
    ├── sprint.js          # Sprint management
    ├── task-group.js      # Task grouping
    ├── task.js            # Task management
    ├── user-group.js      # User grouping
    └── workspace.js       # Workspace management
```

#### `/src/constants` - Application Constants
Contains application-wide constants and configuration.

```
constants/
├── command.js             # Command constants
├── cors.js                # CORS configuration
├── extractDomain.js       # Domain extraction utilities
├── index.js               # Main constants export
└── response.js            # Standard API response formats
```

#### `/src/controllers` - Business Logic
Contains all the business logic and request handlers for the API endpoints.

```
controllers/
├── sprint-management/     # Sprint-related controllers
│   ├── bug-priority.js
│   ├── bug-queue-additional-columns.js
│   ├── sprint-bugs.js
│   ├── sprint-group.js
│   ├── sprint-tasks.js
│   ├── sprints.js
│   └── workspace.js
├── auth.js                # Authentication logic
├── automation-rules.js    # Automation rules management
├── column-type-lookup.js  # Column type management
├── country.js             # Country data management
├── dynamic-dropdown.js    # Dynamic dropdown functionality
├── google-auth.js         # Google OAuth integration
├── management.js          # General management functions
├── organization.js        # Organization management
├── project-priority.js    # Project priority management
├── project-status.js      # Project status management
├── project.js             # Project management
├── recent-activity.js     # Activity tracking
├── roles.js               # Role management
├── sub-task.js            # Sub-task management
├── task-group.js          # Task grouping logic
├── task-master.js         # Main task management
├── task-updates.js        # Task update handling
├── user-group.js          # User grouping logic
├── user.js                # User management
└── workspace.js           # Workspace management
```

#### `/src/db-connection` - Database Configuration
Database connection and configuration management.

```
db-connection/
└── index.js               # Database connection setup
```

#### `/src/events` - Event Management
Event-driven architecture components.

```
events/
├── automation-handler.js  # Automation event handling
└── event-emitter.js       # Event emitter configuration
```

#### `/src/ftp-connection` - FTP Configuration
FTP connection management for file operations.

```
ftp-connection/
└── index.js               # FTP connection setup
```

#### `/src/i18n` - Internationalization
Multi-language support configuration.

```
i18n/
├── i18n.js               # i18n configuration
└── locales/              # Language files
    ├── ar.json           # Arabic translations
    └── en.json           # English translations
```

#### `/src/middleware` - Express Middleware
Custom middleware functions for request processing.

```
middleware/
├── accept-invite.js      # Invitation acceptance middleware
├── auth.middleware.js    # Authentication middleware
└── rateLimiter.js        # Rate limiting middleware
```

#### `/src/models` - Database Models
Sequelize ORM models representing database tables.

```
models/
├── sprint-management/     # Sprint-related models
│   ├── additional-column-sprint-bugs.js
│   ├── additional-column-sprint-task.js
│   ├── bug-priority.js
│   ├── bug-queue.js
│   ├── sprint-group.js
│   ├── sprint-tasks.js
│   ├── sprint-workspace.js
│   └── sprints.js
├── index.js              # Model associations and exports
├── additional-column-subtask.js
├── additional-column-task.js
├── automation-rules.js
├── column-type-lookup.js
├── country.js
├── dynamic-column.js
├── dynamic-dropdown.js
├── invite-management.js
├── login.js
├── organization.js
├── project-priority.js
├── project-status.js
├── project.js
├── recent-activity.js
├── role.js
├── roles.js
├── signup.js
├── status.js
├── subtask-dynamic-column.js
├── subtask.js
├── task-group.js
├── task-master.js
├── task-update-likes.js
├── task-updates.js
├── user-organization.js
├── user-project.js
└── workspace.js
```

#### `/src/routes` - API Routes
Express.js route definitions for all API endpoints.

```
routes/
├── sprint-management/     # Sprint-related routes
│   ├── bug-priority.js
│   ├── sprint-bugs.js
│   ├── sprint-group.js
│   ├── sprint-tasks.js
│   ├── sprints.js
│   └── workspace.js
├── auth.js                # Authentication routes
├── automation-rules.js    # Automation routes
├── column-type-lookup.js  # Column type routes
├── country.js             # Country routes
├── db.js                  # Database utility routes
├── dynamic-dropdown.js    # Dynamic dropdown routes
├── google-auth.js         # Google OAuth routes
├── management.js          # Management routes
├── organization.js        # Organization routes
├── project-priority.js    # Project priority routes
├── project-status.js      # Project status routes
├── project.js             # Project routes
├── recent-activity.js     # Activity routes
├── roles.js               # Role routes
├── sub-task.js            # Sub-task routes
├── task-group.js          # Task group routes
├── task-master.js         # Task master routes
├── task-updates.js        # Task update routes
├── user-group.js          # User group routes
├── user.js                # User routes
└── workspace.js           # Workspace routes
```

#### `/src/seeder` - Database Seeders
Database seeding scripts for initial data population.

#### `/src/socket-connection` - Real-time Communication
Socket.IO configuration for real-time features.

```
socket-connection/
└── index.js               # Socket.IO setup and event handlers
```

#### `/src/utils` - Utility Functions
Helper functions and utilities used throughout the application.

```
utils/
├── index.js               # Main utilities export
└── recent-activity.js     # Activity tracking utilities
```

#### `/src/validator` - Input Validation
Request validation schemas and middleware.

```
validator/
├── auth.js                # Authentication validation
├── dynamic-dropdown.js    # Dynamic dropdown validation
├── organization.js        # Organization validation
├── project-priority.js    # Project priority validation
├── project-status.js      # Project status validation
├── project.js             # Project validation
├── sub-tasks.js           # Sub-task validation
├── task-group.js          # Task group validation
├── task-master.js         # Task master validation
├── user-group.js          # User group validation
└── workspace.js           # Workspace validation
```

#### `/src/views` - Template Views
EJS template files for server-side rendering.

```
views/
├── index.ejs              # Main application view
└── not-found.ejs          # 404 error page
```

## Key Configuration Files

### `index.js`
The main application entry point that:
- Configures Express.js application
- Sets up middleware (CORS, body parsing, file upload, sessions)
- Initializes Socket.IO for real-time communication
- Configures Passport.js for authentication
- Sets up Swagger documentation
- Loads all routes dynamically
- Starts the HTTP server

### `package.json`
Contains:
- Project metadata and dependencies
- Development and production scripts
- Testing configuration with Jest
- Code quality tools (ESLint, Prettier)

### `passport-config.js`
Configures Passport.js authentication strategies including:
- Local authentication
- Google OAuth 2.0
- JWT token handling

### `eslint.config.mjs`
ESLint configuration for code quality and consistency.

## Application Architecture

### MVC Pattern
The application follows the Model-View-Controller (MVC) pattern:
- **Models**: Database schema definitions in `/src/models`
- **Views**: EJS templates in `/src/views`
- **Controllers**: Business logic in `/src/controllers`

### Modular Structure
The application is organized into feature-based modules:
- **Authentication**: User management, login, registration
- **Project Management**: Projects, tasks, sub-tasks
- **Sprint Management**: Sprint planning and execution
- **Organization Management**: Multi-tenant organization support
- **Workspace Management**: Team collaboration spaces

### API Design
- RESTful API design principles
- Comprehensive Swagger documentation
- Input validation using express-validator
- Standardized response formats
- Rate limiting and security middleware

### Real-time Features
- Socket.IO integration for live updates
- Real-time task updates and notifications
- Live collaboration features

## Development Workflow

### Available Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run lint`: Run ESLint for code quality
- `npm run format`: Format code with Prettier
- `npm test`: Run Jest tests with coverage

### Environment Setup
1. Node.js >= v20.11.1 (LTS)
2. MSSQL database
3. Environment variables in `.env` file
4. Install dependencies with `npm install`

## Security Features

- CORS configuration for cross-origin requests
- Rate limiting to prevent abuse
- Input validation and sanitization
- JWT token-based authentication
- Secure session management
- File upload security
- SQL injection prevention via Sequelize ORM

## Database Design

The application uses a relational database design with:
- User management and authentication
- Organization and workspace hierarchy
- Project and task management
- Sprint planning and execution
- Dynamic columns for customizable workflows
- Activity tracking and audit logs

## Deployment Considerations

- Environment-specific configurations
- Database migration support
- Static asset serving
- Production-ready security settings
- Scalable architecture for horizontal scaling

This documentation provides a comprehensive overview of the PPM Backend project structure, helping developers understand the codebase organization and architecture decisions. 
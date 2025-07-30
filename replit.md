# Texas Career Path Explorer

## Overview

This project is a web application designed to help students in Texas explore career paths based on their interests. The application allows students to browse different career interests, view educational and career pathways related to those interests, and track their progress through these pathways.

The application follows a modern web architecture with a React frontend and Express backend, using Drizzle ORM for database operations. It has been designed to provide an intuitive user interface for students to explore career opportunities, educational requirements, and pathway options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture:

1. **Frontend**: React-based SPA using Vite as the build tool, with a component library based on Radix UI and styled with Tailwind CSS.

2. **Backend**: Express.js server that provides API endpoints for the frontend to consume.

3. **Database**: PostgreSQL database managed through Drizzle ORM with a well-defined schema for users, students, career interests, and pathways.

4. **Development**: Uses Vite's dev server with HMR for frontend development, and integrates with PostgreSQL in the Replit environment.

The architecture enables a clean separation of concerns, with the frontend handling the UI and user interactions, and the backend providing data and business logic.

## Key Components

### Frontend Components

1. **Application Shell**: Provides the overall layout and navigation structure, including the header, footer, and router setup.

2. **Career Explorer Page**: The main feature page that includes:
   - Interest selector for browsing different career fields
   - Pathway visualization components for displaying educational and career paths
   - Progress timeline to show student's progress along chosen paths
   - Detailed views for specific pathway nodes

3. **UI Component Library**: A comprehensive set of UI components built on top of Radix UI primitives and styled with Tailwind CSS, following the Shadcn UI pattern.

4. **Theme Provider**: Supports light and dark theme with system preference detection.

5. **API Integration**: Uses TanStack Query (React Query) for data fetching, caching, and state management for API calls.

### Backend Components

1. **Express Server**: Handles HTTP requests and serves the API endpoints.

2. **Storage Layer**: Manages database operations through Drizzle ORM, with schemas defined for various entity types.

3. **API Routes**: Defined in the server/routes.ts file, providing endpoints for:
   - Student profiles
   - Career interests
   - Pathway information
   - Student progress tracking

4. **Vite Integration**: Setup for serving the frontend in development mode with HMR.

## Data Flow

1. **Interest Selection Flow**:
   - User selects a career interest from the InterestSelector component
   - Frontend queries the backend for pathway data related to that interest
   - Pathway visualization displays courses, certifications, majors, and career options
   - Similar pathway suggestions are shown as alternative paths

2. **Student Progress Flow**:
   - Student profile is loaded with current academic information
   - Progress data for selected interests is fetched and displayed in timeline
   - Completed, in-progress, and upcoming steps are visualized

3. **Pathway Exploration Flow**:
   - Users can click on pathway nodes to view detailed information
   - Details include descriptions, requirements, school options, salary data, and skills needed
   - Similar pathway suggestions help users discover related options

## External Dependencies

### Frontend Dependencies
- React and React DOM for UI rendering
- TanStack Query for data fetching and state management
- Radix UI components for accessible UI primitives
- Tailwind CSS for styling
- Lucide icons for iconography
- Day.js for date formatting and manipulation
- Wouter for lightweight routing

### Backend Dependencies
- Express.js for the web server
- Drizzle ORM for database operations
- PostgreSQL as the database (via Neon Database serverless)
- Zod for schema validation
- TypeScript for type safety

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

1. **Development Mode**: 
   - Running `npm run dev` starts both the backend server and frontend dev server
   - Vite's dev server provides HMR for the frontend
   - API requests are proxied to the backend server

2. **Production Build**:
   - Frontend assets are built with Vite
   - Backend code is bundled with esbuild
   - Combined build is output to the dist directory

3. **Database**:
   - PostgreSQL is provisioned through Replit
   - Database migrations are managed with Drizzle Kit
   - Connection string is provided through environment variables

4. **Configuration**:
   - `.replit` file defines run commands and deployment configuration
   - Ports are configured to expose the application publicly

## Recent Changes

**Latest Updates (January 2025):**
- Added motivational quote system to header for logged-in users
- Displays random inspirational quotes focused on education and career development  
- Quotes rotate on each login to provide fresh motivation for students
- Designed with accessible blue gradient styling that matches the overall theme

## Next Steps

To complete the application, the following areas need attention:

1. **Database Implementation**: Complete the database implementation for pathways, progress tracking, and similar pathway suggestions.

2. **Authentication**: Add user authentication to associate students with their profiles and track individual progress.

3. **Admin Interface**: Create an admin interface for managing career interests, pathways, and educational resources.

4. **Expanded Career Data**: Integrate with real educational and career data sources for Texas educational institutions and job markets.

5. **Progress Persistence**: Implement functionality to save student progress and selections across sessions.
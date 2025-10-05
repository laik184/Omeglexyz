# Omegle Web

## Overview
A React-based landing page for an Omegle alternative - a modern, safer, and friendlier video and text chat platform. This is a static frontend showcasing the platform's features and benefits.

## Project Structure
- **Frontend**: React + Vite application
- **Port**: 5000 (development and preview)
- **Build Tool**: Vite
- **Package Manager**: npm

## Technology Stack
- React 18.2.0
- Vite 5.1.0
- Plain CSS (no CSS framework)

## Key Files
- `src/main.jsx` - Application entry point
- `src/App.jsx` - Root component
- `src/components/OmegleWeb.jsx` - Main landing page component
- `src/style/OmegleWeb.css` - Styling for the landing page
- `vite.config.js` - Vite configuration (configured for Replit with 0.0.0.0 host)

## Development
The dev server runs on port 5000 with HMR (Hot Module Replacement) enabled.

## Deployment
- **Build**: `npm run build` - Creates optimized production build in `dist/`
- **Preview**: `npm run preview` - Serves the production build
- **Deployment Type**: Autoscale (static site)

## Features Showcased
1. Global community for video and text chat
2. Privacy-focused design
3. Browser-based (no app needed)
4. Modern UI with gradient backgrounds

## Recent Changes (October 5, 2025)
- Initial Replit setup completed
- Created package.json with proper dependencies
- Created vite.config.js with Replit-compatible settings (0.0.0.0 host)
- Fixed component file extensions (.jsx)
- Configured workflow for development server
- Configured deployment settings for production
- Created .gitignore for Node.js/React projects

## Notes
- The `models/nsfw-detector.js` file appears to be for a backend component (Node.js + TensorFlow) but is not currently integrated with the frontend
- The logo.jpg exists but is not currently used in the application (references logo.png instead)

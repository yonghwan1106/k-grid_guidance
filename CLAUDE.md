# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks
- `npm run type-check` - Run TypeScript type checking without emitting files

## Architecture Overview

### Core Application Structure
This is a Next.js 14 application using the App Router with TypeScript. The project implements a gamification-based citizen participation platform for power grid safety and energy efficiency called "K-그리드 가디언즈" (K-Grid Guardians).

### Key Technology Stack
- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + Framer Motion for animations
- **State Management**: Zustand with persistence middleware
- **Data Fetching**: React Query (@tanstack/react-query)
- **Maps**: Kakao Maps API via react-kakao-maps-sdk
- **AI Integration**: Claude API (Anthropic) for risk analysis
- **UI Components**: Headless UI + Heroicons

### State Management Pattern
The application uses Zustand for state management with two main stores:
- `userStore` - User authentication, profile, points, badges, location
- `missionStore` - Energy saving missions and safety reports

Both stores use the `persist` middleware to maintain state across browser sessions.

### API Integration
- **Claude API**: `/api/analyze-risk` endpoint analyzes uploaded images for power grid safety risks using Claude's vision capabilities
- **Kakao Maps API**: Location services including geocoding, reverse geocoding, and interactive maps

### Page Structure & Routing
- `/` - Homepage with overview and quick actions
- `/safety` - Grid Watch (안전 신고) - safety reporting with AI analysis
- `/energy` - Saver Quest (에너지 절약) - energy saving missions
- `/community` - Community platform for sharing and discussions
- `/profile` - User profile, achievements, and settings
- `/map` - Real-time status map showing reports and regional data

### Component Organization
Components are organized by feature domain:
- `ui/` - Reusable base UI components (Button, Card, etc.)
- `safety/` - Safety reporting components
- `energy/` - Energy mission components
- `gamification/` - Points, badges, levels system
- `community/` - Social features and feeds
- `layout/` - Navigation and layout components
- `maps/` - Kakao Maps integration components

### Type System
All TypeScript types are centralized in `src/types/index.ts` covering:
- User management and gamification (User, Badge, UserLevel)
- Safety reporting (SafetyReport, SafetyCategory, ReportStatus)
- Energy missions (EnergyMission, EnergyUsage, MissionType)
- Community features (CommunityPost, Comment, TeamMission)
- API responses and map markers

### Environment Variables
Required environment variables (see `.env.local`):
- `CLAUDE_API_KEY` - Anthropic Claude API key for AI analysis
- `NEXT_PUBLIC_KAKAO_API_KEY` - Kakao Maps JavaScript API key

### Design System
Custom Tailwind configuration with semantic color tokens:
- `primary` - Blue theme for trust and stability (#2563EB)
- `success` - Green for achievements and efficiency (#22C55E)
- `warning` - Yellow for attention and alerts (#F59E0B)
- `danger` - Red for risks and emergencies (#EF4444)

### Key Business Logic
- **Gamification Engine**: Point accumulation, level progression, and badge unlocking system
- **AI Risk Analysis**: Image-based safety assessment using Claude's multimodal capabilities
- **Location Services**: GPS integration with Kakao Maps for precise incident reporting
- **Mission System**: Personalized energy saving challenges with progress tracking

### PWA Features
The application is designed as a Progressive Web App with offline capabilities and mobile-first responsive design.

### Development Notes
- Uses Next.js App Router (not Pages Router)
- Implements React Server Components where appropriate
- All API routes are in `src/app/api/` following App Router conventions
- Component props use TypeScript interfaces defined in the types system
- Animations use Framer Motion with custom Tailwind keyframes

### State Store Architecture
The application uses two main Zustand stores with persistence:
- `src/stores/userStore.ts` - User authentication, profile data, points, badges, and location
- `src/stores/missionStore.ts` - Energy missions and safety reports management

Both stores automatically persist to localStorage and include error handling.

### Key Utility Functions
- `src/lib/kakao.ts` - Kakao Maps SDK initialization, geocoding, and location services
- `src/lib/utils.ts` - General utilities including user level calculations
- `src/lib/constants.ts` - Application constants and configuration

### API Endpoints
- `POST /api/analyze-risk` - Claude AI image analysis for safety risk assessment
  - Accepts: `{ imageBase64, category, location, description }`
  - Returns: Risk score (1-10), urgency level, analysis description, and recommended actions

### Kakao Maps Integration
The app uses the Kakao Maps SDK for location services. Key functions in `src/lib/kakao.ts`:
- `initKakaoMaps()` - Dynamic SDK loading with services library
- `getAddressFromCoords()` - Reverse geocoding (coordinates to address)
- `getCoordsFromAddress()` - Forward geocoding (address to coordinates)
- `getCurrentPosition()` - Browser geolocation with high accuracy settings

### Error Handling Patterns
- API routes include fallback responses for AI analysis failures
- Zustand stores include error state management
- Geolocation includes timeout and accuracy configuration
- JSON parsing in AI analysis includes graceful fallbacks
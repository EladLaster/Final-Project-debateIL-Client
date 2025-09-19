# Components Structure

This directory contains all React components organized by functionality with clear, descriptive names:

## 📁 `/ui` - Basic UI Components

- **PrimaryButton.jsx** - Reusable button with variants (primary, secondary, outline, ghost)
- **StatusBadge.jsx** - Status badges for debates (live, scheduled, finished)
- **ContentCard.jsx** - Container component for content sections
- **UserAvatar.jsx** - User avatar display component

_Usage: Basic building blocks used throughout the app_

## 📁 `/layout` - Layout Components

- **Navbar.jsx** - Main navigation header with logo and menu
- **Footer.jsx** - Footer component

_Usage: Components that handle app layout and navigation_

## 📁 `/features` - Feature-Specific Components

### `/features/homepage` - Homepage Components

- **DebateCard.jsx** - Debate card display
- **DebateGrid.jsx** - Grid layout for debates
- **DebateSection.jsx** - Debate section wrapper
- **DebateStats.jsx** - Platform statistics
- **EmptyState.jsx** - Empty state component
- **NavigationButtons.jsx** - Navigation buttons

### `/features/debate` - Debate Components

- **ArgumentCard.jsx** - Display individual arguments
- **CreateDebateModal.jsx** - Create debate modal

### `/features/profile` - Profile Components

- **EditProfile.jsx** - Edit profile form
- **ProfileCard.jsx** - Profile display
- **UserDebateHistory.jsx** - User debate history
- **UserStats.jsx** - User statistics

### `/features/admin` - Admin Components

- **AdminRoute.jsx** - Admin route protection

## Import Examples

```jsx
// Direct imports (recommended)
import PrimaryButton from "../components/ui/PrimaryButton";
import DebateCard from "../components/features/homepage/DebateCard";
import Navbar from "../components/layout/Navbar";
```

## Team Collaboration Guidelines

- **ui**: Generic, reusable components - coordinate before changes
- **layout**: Layout and navigation components
- **features**: Feature-specific functionality organized by domain
- Each folder has a clear purpose to minimize conflicts during team development

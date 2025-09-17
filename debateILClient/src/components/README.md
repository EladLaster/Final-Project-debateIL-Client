# Components Structure

This directory contains all React components organized by functionality with clear, descriptive names:

## 📁 `/basic-ui` - Basic UI Components

- **PrimaryButton.jsx** - Reusable button with variants (primary, secondary, outline, ghost)
- **StatusBadge.jsx** - Status badges for debates (live, scheduled, finished)
- **ContentCard.jsx** - Container component for content sections

_Usage: Basic building blocks used throughout the app_

## 📁 `/homepage` - HomePage Related Components

- **DebateListCard.jsx** - Card component displaying debate information on homepage

_Usage: Components specific to the home page display_

## 📁 `/navigation` - Navigation Components

- **MainNavigation.jsx** - Main navigation header with logo and menu

_Usage: Components that handle app navigation and layout_

## 📁 `/debate-room` - Debate Page Components

- _TODO: Future components for debate functionality_
- ArgumentCard, VotingPanel, LiveChat, ParticipantsList, etc.

_Usage: Components for real-time debate pages and interactive features_

## Import Examples

```jsx
// Direct imports (recommended - no index files)
import PrimaryButton from "../components/basic-ui/PrimaryButton.jsx";
import DebateListCard from "../components/homepage/DebateListCard.jsx";
import MainNavigation from "../components/navigation/MainNavigation.jsx";
```

## Team Collaboration Guidelines

- **basic-ui**: Generic, reusable components - coordinate before changes
- **homepage**: Homepage-specific functionality
- **navigation**: Navigation and header components
- **debate-room**: Real-time debate features, voting, arguments

Each folder has a clear purpose to minimize conflicts during team development.

## DebateIL - Client

### Project Structure

```
src/
├── api/                           # API utilities and external services
│   └── randomAvatar.js           # Avatar generation from randomuser.me API
├── components/                    # React components
│   ├── ui/                       # Basic UI components
│   │   ├── ContentCard.jsx       # Container component for content sections
│   │   ├── PrimaryButton.jsx     # Button component with variants
│   │   ├── StatusBadge.jsx       # Status badges for debates
│   │   └── UserAvatar.jsx        # User avatar display
│   ├── layout/                   # Layout components
│   │   ├── Footer.jsx            # Footer component
│   │   └── Navbar.jsx            # Navigation bar
│   ├── features/                 # Feature-specific components
│   │   ├── admin/                # Admin functionality
│   │   │   └── AdminRoute.jsx    # Admin route protection
│   │   ├── debate/               # Debate functionality
│   │   │   ├── ArgumentCard.jsx  # Display individual arguments
│   │   │   └── CreateDebateModal.jsx # Create debate modal
│   │   ├── homepage/             # Homepage components
│   │   │   ├── DebateCard.jsx    # Debate card display
│   │   │   ├── DebateGrid.jsx    # Grid layout for debates
│   │   │   ├── DebateSection.jsx # Debate section wrapper
│   │   │   ├── DebateStats.jsx   # Platform statistics
│   │   │   ├── EmptyState.jsx    # Empty state component
│   │   │   └── NavigationButtons.jsx # Navigation buttons
│   │   └── profile/              # Profile functionality
│   │       ├── EditProfile.jsx   # Edit profile form
│   │       ├── ProfileCard.jsx   # Profile display
│   │       ├── UserDebateHistory.jsx # User debate history
│   │       └── UserStats.jsx     # User statistics
│   └── README.md                 # Components documentation
├── hooks/                        # Custom React hooks (empty - ready for future hooks)
│   ├── useAuth.js                # Authentication state and actions
│   ├── useDebates.js             # Debates data management with loading states
│   ├── useLocalStorage.js        # LocalStorage synchronization hook
│   ├── useTheme.js               # Theme management hook
│   └── index.js                  # Barrel exports for all hooks
├── pages/                        # Route-level page components
│   ├── AdminPanelPage.jsx        # Admin dashboard page
│   ├── DebatePage.jsx            # Individual debate view page
│   ├── HomePage.jsx              # Homepage with hero section and debate lists
│   ├── LoginPage.jsx             # User login page
│   ├── NotFoundPage.jsx          # 404 error page
│   ├── ProfilePage.jsx           # User profile page
│   └── ReplayPage.jsx            # Debate replay viewer page
├── services/                     # API service layer
│   └── serverApi.js              # Main API service functions and configuration
├── stores/                       # MobX stores for state management
│   └── authStore.js              # Authentication store with login/logout
├── styles/                       # Global styles
│   └── global.css                # Global CSS styles and variables
├── utils/                        # Utility functions and constants
│   ├── constants.js              # Application constants and configuration
│   ├── formatters.js             # Data formatting utilities (dates, text, scores)
│   ├── validators.js             # Input validation utilities
│   └── index.js                  # Barrel exports for all utilities
├── App.jsx                       # Main app component with routing setup
└── main.jsx                      # Application entry point
```

## DebateIL - Client

### Project Structure

```
src/
├── api/                           # API utilities and external services
│   └── randomAvatar.js           # Avatar generation from randomuser.me API
├── components/                    # Reusable UI components
│   ├── basic-ui/                 # Basic UI building blocks
│   │   ├── ContentCard.jsx       # Container component for content sections
│   │   ├── PrimaryButton.jsx     # Button component with variants
│   │   └── StatusBadge.jsx       # Status badges for debates
│   ├── debate-room/              # Debate-specific components
│   │   └── ArgumentCard.jsx      # Display individual arguments in debates
│   ├── homepage/                 # Homepage-specific components
│   │   ├── DebateGrid.jsx        # Grid layout for displaying debates
│   │   ├── DebateStats.jsx       # Platform statistics display
│   │   ├── FinishedDebatesList.jsx # List of completed debates
│   │   ├── LiveDebatesList.jsx   # List of currently active debates
│   │   └── RegisterableDebatesList.jsx # List of debates open for registration
│   ├── navigation/               # Navigation components
│   │   └── MainNavigation.jsx    # Main header navigation with user menu
│   └── profile/                  # Profile-related components
│       └── README.md             # Documentation for profile components
├── context/                      # React Context providers
│   ├── themeContext.js           # Theme context definition
│   └── ThemeContext.jsx          # Theme provider component
├── data/                         # Static data and mock data
│   ├── brandColors.js            # Brand color definitions and theme
│   └── mockData.js               # Mock data for development and testing
├── hooks/                        # Custom React hooks
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

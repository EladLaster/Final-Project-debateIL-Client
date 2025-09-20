# DebateIL - Client

## 📁 Project Structure

```
src/
├── api/                           # External API services
│   └── randomAvatar.js           # Avatar generation from randomuser.me
├── components/                    # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── ContentCard.jsx       # Content container
│   │   ├── PrimaryButton.jsx     # Button with variants
│   │   ├── StatusBadge.jsx       # Status indicators
│   │   └── UserAvatar.jsx        # User avatar display
│   ├── layout/                   # Layout components
│   │   ├── Footer.jsx            # Site footer
│   │   └── Navbar.jsx            # Navigation bar
│   └── features/                 # Feature components
│       ├── admin/                # Admin functionality
│       │   └── AdminRoute.jsx    # Admin route protection
│       ├── debate/               # Debate features
│       │   ├── ArgumentCard.jsx  # Argument display
│       │   └── CreateDebateModal.jsx # Create debate
│       ├── homepage/             # Homepage components
│       │   ├── DebateCard.jsx    # Debate card
│       │   ├── DebateGrid.jsx    # Debate grid layout
│       │   ├── DebateSection.jsx # Debate sections
│       │   └── DebateStats.jsx   # Platform stats
│       └── profile/              # Profile features
│           ├── EditProfile.jsx   # Profile editing
│           ├── ProfileCard.jsx   # Profile display
│           ├── UserDebateHistory.jsx # User history
│           └── UserStats.jsx     # User statistics
├── pages/                        # Route pages
│   ├── AdminPanelPage.jsx        # Admin dashboard
│   ├── DebatePage.jsx            # Debate view
│   ├── HomePage.jsx              # Homepage
│   ├── LoginPage.jsx             # Login
│   ├── ProfilePage.jsx           # User profile
│   ├── RegisterPage.jsx          # Registration
│   └── ReplayPage.jsx            # Debate replay
├── services/                     # API services
│   ├── argumentsApi.js           # Arguments API
│   ├── serverApi.js              # Main API service
│   └── votingApi.js              # Voting API
├── stores/                       # MobX stores
│   ├── authStore.js              # Authentication state
│   └── usersStore.js             # Users data management
├── utils/                        # Utilities
│   ├── adminAuth.js              # Admin authentication
│   ├── brandColors.js            # Brand colors
│   ├── constants.js              # App constants
│   ├── errorHandler.js           # Error handling
│   ├── formatters.js             # Data formatters
│   ├── statistics.js             # Statistics helpers
│   └── validators.js             # Input validation
├── App.jsx                       # Main app component
└── main.jsx                      # Entry point
```

## 🔧 Key Features

### Authentication
- **Login/Register**: User authentication with JWT
- **Admin Panel**: Protected admin routes and functionality
- **Profile Management**: Edit user profiles and view statistics

### Debates
- **Live Debates**: Real-time debate participation
- **Debate Creation**: Create new debates with topics
- **Argument System**: Post and vote on arguments
- **Replay System**: Watch finished debates

### Admin Features
- **User Management**: View and manage users
- **Debate Management**: Create, edit, delete debates
- **Analytics**: Platform statistics and insights

## 📊 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Debates
- `GET /api/debates` - Get all debates
- `GET /api/debates/:id` - Get specific debate
- `POST /api/debates` - Create new debate
- `PUT /api/debates/:id` - Update debate
- `DELETE /api/debates/:id` - Delete debate
- `POST /api/debates/:id/register` - Register for debate
- `POST /api/debates/:id/finish` - Finish debate

### Arguments
- `GET /api/debates/arguments` - Get all arguments
- `POST /api/debates/:id/arguments` - Create argument
- `PUT /api/debates/:id/arguments/:argumentId` - Update argument
- `DELETE /api/debates/:id/arguments/:argumentId` - Delete argument

### Voting
- `PATCH /api/debates/:id/vote/user1` - Vote for user 1
- `PATCH /api/debates/:id/vote/user2` - Vote for user 2
- `GET /api/debates/:id/votes` - Get debate votes

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool
- **MobX** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
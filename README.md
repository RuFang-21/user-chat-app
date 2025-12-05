# User Explorer App

A React Native application for exploring and managing user data from JSONPlaceholder API, built with Expo, TypeScript, and Tamagui.

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd user-explore
yarn install
```

2. **Start the development server:**

```bash
yarn start
```

3. **Run on specific platforms:**

```bash
yarn ios         # Run on iOS simulator
yarn android     # Run on Android simulator/device
```

## Features Implemented

### Features

- ✅ **User Authentication**: Login screen with form validation
- ✅ **User List Display**: Dashboard showing all users from JSONPlaceholder API
- ✅ **Search Functionality**: Real-time search across user name, email, phone, and city
- ✅ **User Detail View**: Detailed information display for individual users
- ✅ **Pull to Refresh**: Refresh user list with pull-down gesture
- ✅ **Navigation**: Bottom tab and stack navigation with proper routing
- ✅ **Debounced Search**: Optimized search with 300ms debounce to reduce API calls
- ✅ **Loading States**: Spinner indicators during data fetching
- ✅ **Error Handling**: User-friendly error messages for API failures
- ✅ **Empty States**: Proper messaging when no users found
- ✅ **Responsive UI**: Clean, organized card layout with icons
- ✅ **Type Safety**: Full TypeScript implementation with proper typing


## Technical Architecture

### Core Technologies

- **React Native with Expo**: Cross-platform mobile development framework
- **TypeScript**: Type safety and enhanced development experience
- **Tamagui**: Performance-optimized design system with compile-time styling
- **React Navigation**: Bottom Tab and Stack navigation
- **Apisauce**: HTTP client for API communication
- **Lodash**: Utility library for debouncing

### Project Structure

```
app/
├── components/          # Reusable UI components (Screen, Text, TextInput, etc.)
├── screens/            # Screen components
│   ├── DashboardScreen/    # User list with search
│   ├── UserDetailScreen/   # Individual user details
│   └── LoginScreen/        # Authentication screen
├── hooks/              # Custom React hooks
│   └── useUsers.ts         # User data management hook
├── services/           # API and external services
│   └── api/
│       ├── index.ts        # API client with methods
│       └── types.ts        # TypeScript interfaces
├── navigators/         # Navigation configuration
│   ├── BottomTabNavigators/   # Bottom tab setup
│   └── AppNavigator.tsx       # Main navigation structure
├── context/            # React Context providers
│   └── AuthContext.tsx     # Authentication state management
└── theme/              # Tamagui theme configuration
```

### API Integration

The application fetches user data from JSONPlaceholder API:

**Endpoints Used:**

- `GET https://jsonplaceholder.typicode.com/users` - Fetch all users
- `GET https://jsonplaceholder.typicode.com/users/:id` - Fetch single user

### State Management

**Custom Hooks Pattern:**

- `useUsers()` hook manages all user-related state and operations
- Provides functions: `loadUsers()`, `searchUsers()`, `getUserById()`
- Handles loading states, error states, and data caching
- Search filtering implemented client-side for better performance

**Authentication Context:**

- `AuthContext` provides login/logout functionality
- Persists authentication state (implementation ready for token storage)

### Key Implementation Details

#### 1. Search Functionality

- Debounced search with 300ms delay using lodash
- Searches across: name, email, phone, and city fields
- Client-side filtering for instant results
- Clears filter when search query is empty

#### 2. User List Display

- FlatList with optimized rendering
- Pull-to-refresh functionality
- Shows total user count in header
- Empty state when no results found
- Card-based layout with icons for email, phone, and location

#### 3. User Detail Screen

- Organized sections: Contact Information, Address, Company
- Reusable detail item components
- Proper loading and error states
- ScrollView for content overflow

#### 4. Navigation Flow

```
AuthStack (Login) → MainNavigator
  └── BottomTabNavigator (Dashboard)
       └── StackNavigator (UserDetail)
```

### Technical Decisions

1. **Tamagui over Styled Components**: Chosen for better performance with compile-time styling
2. **Custom Hook Pattern**: Centralized data fetching logic in `useUsers` hook for reusability
3. **TypeScript Strict Mode**: Full type safety to catch errors during development
4. **Functional Components**: Used exclusively with React hooks (no class components)

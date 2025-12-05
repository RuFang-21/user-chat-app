# User Chat App

A React Native application for chatting with users, built with Expo, TypeScript, and Tamagui.

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
cd user-chat-app
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
- ✅ **Dashboard**: List of users with avatars and latest message preview
- ✅ **Chat Interface**:
  - Real-time chat UI with bubbles
  - Sent/Received message distinction
  - Timestamps
  - Optimistic UI updates for sending messages
- ✅ **User Profile**:
  - Detailed user information (Name, Phone, Email, Website)
  - Custom SVG icons for contact details
  - Block/Unblock user functionality
- ✅ **Settings**:
  - Developer information
  - Portfolio link
  - App version display
- ✅ **Navigation**: Bottom tab and stack navigation with proper routing
- ✅ **State Management**: Global state for blocked users using Zustand
- ✅ **Data Fetching**: Efficient data fetching and caching with React Query

## Technical Architecture

### Core Technologies

- **React Native with Expo**: Cross-platform mobile development framework
- **TypeScript**: Type safety and enhanced development experience
- **Tamagui**: Performance-optimized design system with compile-time styling
- **React Navigation**: Bottom Tab and Stack navigation
- **React Query (@tanstack/react-query)**: Powerful asynchronous state management
- **Zustand**: Small, fast and scalable bearbones state-management solution
- **Apisauce**: HTTP client for API communication

### Project Structure

```
app/
├── components/          # Reusable UI components (Screen, Text, Button, etc.)
├── screens/            # Screen components
│   ├── DashboardScreen/    # User list
│   ├── ChatScreen/         # Chat interface
│   ├── UserDetailScreen/   # User profile & blocking
│   ├── SettingsScreen/     # App settings & info
│   └── LoginScreen/        # Authentication
├── services/           # API and external services
│   └── api/            # API client (ResponseRift)
├── store/              # Global state stores (Zustand)
│   └── useBlockStore.ts    # Blocked users management
├── navigators/         # Navigation configuration
│   ├── BottomTabNavigators/   # Main tab navigation
│   └── AppNavigator.tsx       # Root stack navigation
└── theme/              # Tamagui theme configuration
```

### API Integration

The application fetches user data from ResponseRift API:

**Endpoints Used:**

- `GET https://responserift.dev/api/users` - Fetch all users
- `GET https://responserift.dev/api/users/:id` - Fetch single user
- `GET https://responserift.dev/api/posts` - Fetch posts (messages)
- `POST https://responserift.dev/api/posts` - Create new post (message)

### State Management

**React Query:**

- Handles server state (Users, Posts)
- Caching and background updates
- Optimistic updates for chat messages

**Zustand:**

- Handles client state
- `useBlockStore`: Manages the list of blocked user IDs

### Key Implementation Details

#### 1. Chat Functionality

- **UI**: Custom chat bubbles with dynamic styling based on sender/receiver.
- **Logic**: Mocked logic to differentiate "sent" vs "received" messages for demo purposes (since API returns all posts from same user).
- **Updates**: Optimistic UI updates ensure the chat feels responsive when sending a message.

#### 2. User Detail & Blocking

- **Profile**: Displays user details with custom SVG icons.
- **Blocking**: Users can be blocked/unblocked. This state is persisted in the `useBlockStore` and affects the UI (e.g., button state).

#### 3. Navigation Flow

```
AuthStack (Login) → MainNavigator
  └── BottomTabNavigator
       ├── DashboardStack (Dashboard → Chat → UserDetail)
       └── SettingsStack (Settings)
```

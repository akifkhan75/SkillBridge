# SkillBridge - React Native

This is the React Native version of the SkillBridge application, a platform designed to connect skilled workers with customers seeking their services. The app features distinct user flows for customers and workers, AI-powered service request analysis using the Google Gemini API, real-time chat, and comprehensive dashboards.

## Features

-   **Dual User Roles:** Separate, feature-rich interfaces for Customers and Workers.
-   **AI Service Analysis:** Customers describe their needs in natural language, and the Gemini API analyzes the request to categorize it, determine urgency, and find matching professionals.
-   **Worker Matching:** Finds and displays the best-matched workers based on skills, availability, and location.
-   **Worker Dashboard:** A comprehensive dashboard for workers to manage job requests, view earnings, update their profile, and track performance analytics.
-   **Customer Dashboard:** An intuitive interface for customers to request services, browse professionals by category, and view worker profiles.
-   **Real-time Chat:** Integrated chat functionality for seamless communication between customers and workers.
-   **Multi-language Support:** The application is built with internationalization in mind, supporting English, Arabic, and Urdu.

## Technology Stack

-   **Framework:** React Native
-   **State Management:** Redux Toolkit
-   **Navigation:** React Navigation (Native Stack, Drawer)
-   **Styling:** Styled Components
-   **AI Integration:** Google Gemini API
-   **Mock Backend:** Express.js

## Prerequisites

Before you begin, ensure you have the following installed on your development machine. Please follow the **React Native CLI Quickstart** guide for your specific OS on the [official React Native documentation](https://reactnative.dev/docs/environment-setup).

-   **Node.js:** (v18 or newer)
-   **npm** or **Yarn**
-   **Watchman** (recommended for macOS)
-   **Java Development Kit (JDK)**
-   **Android Development Environment:**
    -   Android Studio
    -   Android SDK and build tools
-   **iOS Development Environment (macOS only):**
    -   Xcode
    -   CocoaPods

## Getting Started

Follow these steps to get the application running on your local machine.

### 1. API Key Setup

This application uses the Google Gemini API for its AI-powered service analysis. You will need a valid API key for these features to work.

-   Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   The application expects the API key to be available as an environment variable named `API_KEY`. You must configure this in your build environment. For guidance on how to set up environment variables in React Native, refer to the official documentation or community best practices for your target platform (e.g., using `gradle.properties` for Android or Xcode build settings for iOS).

### 2. Backend Server Setup

The app relies on a local mock backend to serve data. This must be running before you start the mobile app.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start the mock server
# It will run on http://localhost:3002
npm start
```
Leave this terminal window running. The server provides all the user, worker, and job data for the application.

### 3. Mobile App Setup

In a **new terminal window**, set up the React Native application.

```bash
# 1. Navigate to the project root directory
# (If you are in the backend directory, run `cd ..`)

# 2. Install dependencies
npm install

# 3. For iOS, install the CocoaPods dependencies
cd ios
pod install
cd ..
```

### 4. Running the Application

Ensure your emulator/simulator is running or a physical device is connected and properly configured.

**To run on Android:**
```bash
npx react-native run-android
```

**To run on iOS:**
```bash
npx react-native run-ios
```

Once the build is complete, the SkillBridge application will launch on your selected device or simulator.

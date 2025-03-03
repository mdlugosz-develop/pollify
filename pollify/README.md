# Pollify

Pollify is a modern web application built with Next.js that allows users to create, share, and participate in polls. The platform provides a seamless experience for community engagement through interactive polling.

## Features

- 🔐 Secure authentication with Supabase
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🌓 Dark/Light mode support
- 📱 Fully responsive design
- 👥 User profiles and community features
- ⚡ Real-time updates
- 🔒 Protected routes with middleware
- 🎯 Type-safe development with TypeScript

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Authentication:** Supabase Auth
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Context
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pollify.git
cd pollify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```bash
# Example environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/contexts` - React context providers
- `/lib` - Utility functions and configurations
- `/types` - TypeScript type definitions

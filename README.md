# AI-Driven Event Management System

A comprehensive event management system built with Next.js, Material-UI, and AI capabilities using Groq's Mistral model.

## Features

- Role-based access control (SuperAdmin, Admin, Committee Members, Attendees)
- Event creation and management
- AI-powered email generation and content recommendations using Mistral
- Real-time chat system
- QR code generation for event check-in/out
- Interactive quizzes and points system
- Reimbursement management

## Prerequisites

- Node.js 18.x or later
- MongoDB database
- Groq API key (sign up at https://console.groq.com)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/AIUtssavBot/HACKXPLORE_New.git
cd event-management-system
```

2. Install dependencies:
```bash
npm install
```your_nextauth_secret

3. Configure environment variables:
- Copy `.env.local.example` to `.env.local`
- Update the following variables:
  - `MONGODB_URI`: Your MongoDB connection string
  - `NEXTAUTH_SECRET`: Generate a random string for session encryption
  - `GROQ_API_KEY`: Your Groq API key
  - `GROQ_MODEL`: Set to "mistral-8x7b-instruct" (or your preferred Mistral model)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure
your_nextauth_secret
- `/src/app` - Next.js pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and AI agents
- `/src/models` - MongoDB schemas
- `/src/styles` - Theme and global styles

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## AI Features

The system uses Groq's Mistral model for:
- Generating sponsorship emails
- Creating content recommendations
- Generating event quizzes
- Analyzing feedback
- Providing intelligent responses

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 

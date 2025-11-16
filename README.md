# Portfolio Website - Derrick Appah

A modern, responsive portfolio website built with React and Supabase.

## Features

- 🎨 Modern, clean UI design
- 📱 Fully responsive
- 🚀 Supabase backend integration
- ✨ Animated statistics counters
- 📧 Contact form with success feedback
- 🎯 Custom favicon and branding

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: CRACO (Create React App Configuration Override)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/derrickappah/portfolio-app.git
cd portfolio-app
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the `frontend` directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Building for Production

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/build` directory.

## Deployment

This project is configured for Vercel deployment. The `vercel.json` file in the root directory configures Vercel to:
- Build from the `frontend` directory
- Serve the React app with proper routing

## Project Structure

```
portfolio-app/
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── lib/        # Utilities and Supabase client
│   │   ├── services/   # API services
│   │   └── styles/     # CSS files
│   └── package.json
├── vercel.json         # Vercel configuration
└── README.md
```

## Environment Variables

Make sure to set these environment variables in your Vercel project settings:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## License

© 2025 Derrick Appah. All rights reserved.

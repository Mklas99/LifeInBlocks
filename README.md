# My Life Calendar

A modern web application inspired by lifeweeks.app that allows you to visualize your life in weeks based on your birthdate and life expectancy.

## Features

### Core Features
- **Input Form**:
  - Date of birth input
  - Custom life expectancy setting (default: 90 years)
  - Milestone management (add/remove important life events)

- **Weekly Grid Display**:
  - Visual representation of your entire life in weeks
  - Color-coded squares:
    - Past weeks (gray)
    - Current week (highlighted blue)
    - Future weeks (light gray/white)
    - Milestones (custom colors)

- **Responsive UI**:
  - Dark/light mode toggle
  - Mobile-friendly layout
  - Smooth animations and transitions

### Additional Features
- **Local Storage**:
  - Your data is saved in your browser
  - No account required, privacy focused
  - Remembers your theme preference

## Technologies Used

- **React**: Frontend UI library
- **TypeScript**: Type safety
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Animations and transitions
- **Date-fns**: Date manipulation
- **Vite**: Build tool and development environment

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-life-calendar.git
   cd my-life-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

The build files will be in the `dist` directory.

## Deployment

You can deploy this application on any static hosting service like:
- GitHub Pages
- Netlify
- Vercel
- Surge

## Project Structure

```
src/
├── assets/       # Static assets
├── components/   # React components
├── hooks/        # Custom React hooks
├── styles/       # Theme and style utilities
├── types/        # TypeScript type definitions
├── utils/        # Utility functions
├── App.tsx       # Main application component
└── main.tsx      # Application entry point
```

## License

MIT

## Acknowledgments

- Inspired by [lifeweeks.app](https://lifeweeks.app)
- Color palette and design inspiration from modern UI trends

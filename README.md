🏉 The Turnstile - Progressive Web App
A modern, feature-rich Progressive Web App for tracking rugby league match attendance, earning badges, and connecting with fellow fans.
✨ Features

📱 Progressive Web App - Install on any device, works offline
🎯 Match Logging - Track every match you attend
🏆 Badge System - Unlock achievements and milestones
📊 Personal Dashboard - View your stats and progress
📅 Fixtures - Stay updated with upcoming matches
🏟️ Stadium Info - Learn about different grounds
🔥 Real-time Sync - Data syncs across devices via Firebase

🚀 Quick Start
Prerequisites

Node.js (v18 or higher)
npm or yarn
A Firebase project (for production)

Installation

Clone or download the project files
Set up your project structure:

the-turnstile/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
├── src/
│   ├── App.jsx
│   ├── firebase-config.js
│   └── index.js
├── package.json
└── README.md

Create package.json:

json{
  "name": "the-turnstile",
  "version": "1.0.0",
  "description": "Rugby League Match Tracker PWA",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "deploy": "firebase deploy"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "firebase": "^10.7.0"
  },
  "devDependencies": {
    "react-scripts": "^5.0.1"
  }
}

Install dependencies:

bashnpm install -g netlify-cli

Deploy:

bashnpm run build
netlify deploy --prod
Follow the prompts to link your site.
Option 3: Vercel

Install Vercel CLI:

bashnpm install -g vercel

Deploy:

bashnpm run build
vercel --prod
Option 4: GitHub Pages

Install gh-pages:

bashnpm install --save-dev gh-pages

Add to package.json:

json{
  "homepage": "https://yourusername.github.io/the-turnstile",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

Deploy:

bashnpm run deploy
🗄️ Firebase Setup
Firestore Collections
Create these collections in your Firebase Console:
matches Collection
javascript{
  id: "auto-generated",
  userId: "user-id",
  homeTeam: "Wigan Warriors",
  awayTeam: "St Helens",
  homeScore: 24,
  awayScore: 18,
  venue: "DW Stadium",
  date: "2025-10-20",
  competition: "Super League",
  notes: "Amazing atmosphere!",
  createdAt: timestamp,
  synced: true
}
users Collection
javascript{
  id: "user-id",
  email: "user@example.com",
  displayName: "John Doe",
  badges: [
    {
      id: "first_match",
      name: "First Match",
      unlocked: true,
      unlockedAt: timestamp
    }
  ],
  stats: {
    totalMatches: 15,
    currentStreak: 3,
    favoriteTeam: "Wigan Warriors"
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
fixtures Collection
javascript{
  id: "auto-generated",
  homeTeam: "Leeds Rhinos",
  awayTeam: "Hull FC",
  date: "2025-10-21T15:00:00Z",
  venue: "Headingley Stadium",
  competition: "Super League",
  round: "Round 15",
  status: "scheduled"
}
teams Collection
javascript{
  id: "auto-generated",
  name: "Wigan Warriors",
  shortName: "Wigan",
  logo: "url-to-logo",
  colors: {
    primary: "#0066B2",
    secondary: "#FFFFFF"
  },
  stadium: "DW Stadium",
  founded: 1872,
  league: "Super League"
}
Firestore Security Rules
javascriptrules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own matches
    match /matches/{matchId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Everyone can read fixtures and teams
    match /fixtures/{fixtureId} {
      allow read: if true;
      allow write: if false; // Only admins can write (use Firebase Admin SDK)
    }
    
    match /teams/{teamId} {
      allow read: if true;
      allow write: if false; // Only admins can write
    }
  }
}
🔐 Authentication Setup

Go to Firebase Console → Authentication
Enable Email/Password sign-in method
(Optional) Enable Google sign-in for easier registration

📱 PWA Installation
iOS (Safari)

Open the app in Safari
Tap the Share button
Scroll down and tap "Add to Home Screen"
Tap "Add"

Android (Chrome)

Open the app in Chrome
Tap the three-dot menu
Tap "Install app" or "Add to Home Screen"

Desktop (Chrome/Edge)

Open the app
Look for the install icon in the address bar
Click "Install"

🎨 Customization
Changing Colors
Edit the Tailwind classes in App.jsx:
javascript// Primary gradient
from-cyan-400 to-blue-500

// Background
bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900

// Cards
bg-gradient-to-br from-slate-800 to-slate-900
Adding New Badge Types
Edit the BADGES array in App.jsx:
javascript{
  id: 'custom_badge',
  name: 'Custom Badge',
  description: 'Description here',
  icon: '🎯',
  rarity: 'rare',
  unlocked: false,
  progress: 0,
  target: 10
}
Modifying Teams/Competitions
Update the teams and competitions in the dropdown options within LogMatchScreen.
🔧 Troubleshooting
Service Worker Not Updating
Clear your browser cache and hard reload:

Chrome: Ctrl/Cmd + Shift + R
Safari: Cmd + Option + R

Or programmatically:
javascript// In your app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  });
}
Firebase Connection Issues

Check your Firebase config in firebase-config.js
Verify Firebase project is active
Check browser console for errors
Ensure Firestore rules allow access

Icons Not Showing

Verify all icon files exist in public/icons/
Check manifest.json paths
Regenerate icons if needed

📊 Analytics
Enable Firebase Analytics:
javascriptimport { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Log custom events
logEvent(analytics, 'match_logged', {
  team: 'Wigan Warriors',
  competition: 'Super League'
});
🚀 Performance Optimization
Lazy Loading
javascriptimport { lazy, Suspense } from 'react';

const BadgesScreen = lazy(() => import('./screens/BadgesScreen'));

<Suspense fallback={<div>Loading...</div>}>
  <BadgesScreen />
</Suspense>
Image Optimization
Use WebP format for icons and compress images:
bashnpm install sharp
javascriptconst sharp = require('sharp');

sharp('icon.png')
  .resize(512, 512)
  .webp({ quality: 90 })
  .toFile('icon-512x512.webp');
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📄 License
MIT License - feel free to use this project for your own rugby league tracking needs!
🎯 Roadmap

 Social features (friend leaderboards)
 Team-specific statistics
 Match prediction game
 Photo uploads for matches
 Export data to CSV
 Dark/Light theme toggle
 Multi-language support
 Integration with official league APIs

💡 Tips

Test offline functionality: Turn off your internet connection and verify the app works
Monitor bundle size: Use npm run build to check production size
Regular backups: Export your Firestore data regularly
User feedback: Add a feedback form to collect user suggestions

📞 Support
For issues or questions:

Create an issue on GitHub
Contact: support@theturnstile.app
Documentation: https://docs.theturnstile.app


Made with ❤️ for rugby league fans by rugby league fans
#UpThePies 🏉
npm install

5. **Configure Firebase:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Copy your Firebase config
   - Update `src/firebase-config.js` with your credentials

6. **Generate PWA icons:**

   Create a 512x512 icon and use a tool like [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) to generate all sizes needed.

### Development
```bash
npm start
```

Your app will open at `http://localhost:3000`

### Building for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 📦 Deployment Options

### Option 1: Firebase Hosting (Recommended)

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase:**
```bash
firebase login
```

3. **Initialize Firebase:**
```bash
firebase init hosting
```

Select your project and configure:
- Public directory: `build`
- Single-page app: Yes
- Automatic builds: No

4. **Deploy:**
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project.firebaseapp.com`

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
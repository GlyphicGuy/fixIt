# Fix-It Hub 🔧

A campus-based repair and skill-sharing platform built with React, promoting sustainability and the circular economy by connecting students who need items fixed with students who have repair skills.

## 🌟 Features

### Pages
- **Home Page** - Browse repair listings with search, category filtering, stats dashboard, and featured fixers
- **Listing Detail Page** - View complete listing information, contact fixers, and see interested helpers
- **New Listing Page** - Post repair requests with photos, descriptions, and categories
- **Profile Page** - Manage skills, view badges, and track your repair listings

### Components
- **Navbar** - Responsive navigation with routing
- **Footer** - Site-wide footer with links and contact info
- **ListingCard** - Display repair requests with images and status
- **SkillProfileCard** - Show fixer profiles with ratings and badges
- **SearchBar** - Real-time search functionality
- **StatsSection** - Platform impact statistics
- **HowItWorks** - Step-by-step guide for users

## 🚀 Getting Started

### Prerequisites
- Node.js 22.12 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd fixIt
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Database Viewer

To view and inspect the MongoDB database in your browser:

1. Make sure the backend server is running (`npm run dev` in the `server` directory)

2. Open `server/db-viewer.html` in your browser or visit it directly:
```bash
open server/db-viewer.html
# or on Linux: xdg-open server/db-viewer.html
# or just drag the file into your browser
```

The database viewer provides:
- **Live Statistics** - Total users, listings, open/fixed counts
- **Users Collection** - View all users with their skills, ratings, and activity
- **Listings Collection** - Browse all listings with status, interested fixers, and details
- **Table & JSON Views** - Toggle between formatted table and raw JSON data
- **Real-time Refresh** - Update data with the refresh button

**API Endpoints:**
- `GET /api/db/stats` - Database statistics
- `GET /api/db/users` - All users (passwords excluded)
- `GET /api/db/listings` - All listings with populated references

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM
- **Backend** (Planned): Node.js, Express, MongoDB

## 📁 Project Structure

```
fixIt/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ListingCard.jsx
│   │   ├── SkillProfileCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── StatsSection.jsx
│   │   └── HowItWorks.jsx
│   ├── pages/           # Main application pages
│   │   ├── HomePage.jsx
│   │   ├── ListingDetailPage.jsx
│   │   ├── NewListingPage.jsx
│   │   └── ProfilePage.jsx
│   ├── data/            # Mock data (will be replaced with API calls)
│   │   └── mockData.js
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 📊 Key Data Models

### User
- Name, email, photo
- Array of skills (e.g., "Sewing", "Soldering", "Bike Repair")
- Badges earned
- Rating and fixes completed

### Listing
- Title, description, category
- Photo URL
- Status ('open', 'fixed')
- Posted by (user reference)
- Posted date

## 🎨 Categories

- **Tech** - Electronics, computers, phones
- **Clothing** - Sewing, mending, alterations
- **Furniture** - Woodworking, assembly, repairs
- **Other** - Bikes, sports equipment, misc items

## 🔜 Upcoming Features

### Backend Integration
- [ ] Express.js REST API
- [ ] MongoDB database connection
- [ ] User authentication (JWT)
- [ ] Image upload functionality
- [ ] Real-time messaging between users
- [ ] Email notifications

### Frontend Enhancements
- [ ] Advanced filtering and sorting
- [ ] User reviews and ratings system
- [ ] Booking/scheduling system
- [ ] Image gallery for listings
- [ ] Mobile app version
- [ ] Admin dashboard

## 🤝 Contributing

This is a college project. Contributions and suggestions are welcome!

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌱 Sustainability Mission

Fix-It Hub promotes the circular economy by:
- Reducing waste through repair instead of replacement
- Building a skill-sharing community
- Extending the life of products
- Educating students about sustainability
- Creating a culture of resourcefulness

## 📧 Contact

For questions or feedback, contact us at support@fixithub.edu

---

Built with ❤️ for a more sustainable campus community

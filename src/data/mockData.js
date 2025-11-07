// Mock data for Fix-It Hub

export const mockListings = [
  {
    id: 1,
    title: "Laptop Screen Crack",
    description: "My laptop screen has a crack in the corner. Still works but needs fixing.",
    category: "Tech",
    photoUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    status: "open",
    postedBy: "Alice Johnson",
    postedDate: "2025-11-05"
  },
  {
    id: 2,
    title: "Bike Tire Flat",
    description: "My bike has a flat tire and I need help fixing it before the weekend.",
    category: "Other",
    photoUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400",
    status: "open",
    postedBy: "Bob Smith",
    postedDate: "2025-11-04"
  },
  {
    id: 3,
    title: "Hole in Jeans",
    description: "Favorite pair of jeans has a hole in the knee. Looking for someone who can patch it.",
    category: "Clothing",
    photoUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    status: "open",
    postedBy: "Carol White",
    postedDate: "2025-11-03"
  },
  {
    id: 4,
    title: "Broken Chair Leg",
    description: "Office chair has a wobbly leg that needs reinforcement.",
    category: "Furniture",
    photoUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?w=400",
    status: "fixed",
    postedBy: "David Lee",
    postedDate: "2025-11-01"
  },
  {
    id: 5,
    title: "Phone Charging Port Issue",
    description: "My phone won't charge properly. The port seems loose.",
    category: "Tech",
    photoUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    status: "open",
    postedBy: "Emma Davis",
    postedDate: "2025-11-06"
  },
  {
    id: 6,
    title: "Torn Backpack Strap",
    description: "My backpack strap is coming apart and needs sewing.",
    category: "Clothing",
    photoUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    status: "open",
    postedBy: "Frank Miller",
    postedDate: "2025-11-05"
  }
];

export const mockFixers = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@college.edu",
    skills: ["Basic Soldering", "Phone Repair", "Laptop Hardware"],
    badges: ["Tech Wizard", "Quick Responder"],
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    rating: 4.8,
    fixesCompleted: 15
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    email: "mike.r@college.edu",
    skills: ["Sewing & Mending", "Button Replacement", "Zipper Repair"],
    badges: ["Clothing Expert", "Sustainability Champion"],
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    rating: 4.9,
    fixesCompleted: 23
  },
  {
    id: 3,
    name: "Jessica Park",
    email: "j.park@college.edu",
    skills: ["Woodworking", "Furniture Assembly", "Basic Carpentry"],
    badges: ["Furniture Pro", "Helpful Helper"],
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    rating: 4.7,
    fixesCompleted: 12
  },
  {
    id: 4,
    name: "Alex Kim",
    email: "alex.kim@college.edu",
    skills: ["Bicycle Repair", "Basic Mechanics", "Tire Replacement"],
    badges: ["Bike Mechanic", "Community Star"],
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    rating: 4.6,
    fixesCompleted: 18
  },
  {
    id: 5,
    name: "Taylor Brown",
    email: "t.brown@college.edu",
    skills: ["Sewing & Mending", "Basic Soldering", "Jewelry Repair"],
    badges: ["Multi-Talented", "Patient Teacher"],
    photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
    rating: 4.9,
    fixesCompleted: 20
  }
];

export const categories = [
  "All",
  "Tech",
  "Clothing",
  "Furniture",
  "Other"
];

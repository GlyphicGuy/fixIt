const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Listing = require('./models/Listing');
const connectDB = require('./config/db');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });
connectDB();

// Sample users (passwords will be hashed automatically)
const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    skills: [],
    badges: [],
    bio: 'Computer Science student who loves sustainability!'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    skills: ['Basic Soldering', 'Phone Repair', 'Laptop Hardware'],
    badges: ['Tech Wizard', 'Quick Responder'],
    rating: 4.8,
    fixesCompleted: 15,
    bio: 'Engineering student passionate about fixing electronics!'
  },
  {
    name: 'Mike Rodriguez',
    email: 'mike.r@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    skills: ['Sewing & Mending', 'Button Replacement', 'Zipper Repair'],
    badges: ['Clothing Expert', 'Sustainability Champion'],
    rating: 4.9,
    fixesCompleted: 23,
    bio: 'Fashion design major who believes in repairing, not replacing!'
  },
  {
    name: 'Jessica Park',
    email: 'j.park@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    skills: ['Woodworking', 'Furniture Assembly', 'Basic Carpentry'],
    badges: ['Furniture Pro', 'Helpful Helper'],
    rating: 4.7,
    fixesCompleted: 12,
    bio: 'Architecture student with a passion for woodworking!'
  },
  {
    name: 'Alex Kim',
    email: 'alex.kim@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    skills: ['Bicycle Repair', 'Basic Mechanics', 'Tire Replacement'],
    badges: ['Bike Mechanic', 'Community Star'],
    rating: 4.6,
    fixesCompleted: 18,
    bio: 'Mechanical engineering student and bike enthusiast!'
  },
  {
    name: 'Taylor Brown',
    email: 't.brown@college.edu',
    password: 'password123',
    photoUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
    skills: ['Sewing & Mending', 'Basic Soldering', 'Jewelry Repair'],
    badges: ['Multi-Talented', 'Patient Teacher'],
    rating: 4.9,
    fixesCompleted: 20,
    bio: 'Art student who loves teaching others how to fix things!'
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Listing.deleteMany();

    console.log('🗑️  Data Destroyed!');

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('👥 Users Created!');

    // Create sample listings using the first user (Alice)
    const aliceId = createdUsers[0]._id;
    const bobId = createdUsers[1]._id;
    const carolId = createdUsers[2]._id;

    const sampleListings = [
      {
        title: 'Laptop Screen Crack',
        description: 'My laptop screen has a crack in the corner. Still works but needs fixing.',
        category: 'Tech',
        photoUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
        status: 'open',
        postedBy: aliceId
      },
      {
        title: 'Bike Tire Flat',
        description: 'My bike has a flat tire and I need help fixing it before the weekend.',
        category: 'Other',
        photoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
        status: 'open',
        postedBy: bobId
      },
      {
        title: 'Hole in Jeans',
        description: 'Favorite pair of jeans has a hole in the knee. Looking for someone who can patch it.',
        category: 'Clothing',
        photoUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        status: 'open',
        postedBy: carolId
      },
      {
        title: 'Broken Chair Leg',
        description: 'Office chair has a wobbly leg that needs reinforcement.',
        category: 'Furniture',
        photoUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
        status: 'fixed',
        postedBy: aliceId
      },
      {
        title: 'Phone Charging Port Issue',
        description: 'My phone won\'t charge properly. The port seems loose.',
        category: 'Tech',
        photoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        status: 'open',
        postedBy: bobId
      },
      {
        title: 'Torn Backpack Strap',
        description: 'My backpack strap is coming apart and needs sewing.',
        category: 'Clothing',
        photoUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        status: 'open',
        postedBy: carolId
      }
    ];

    await Listing.insertMany(sampleListings);
    console.log('📋 Listings Created!');

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Listing.deleteMany();

    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to Database
connectDB();

const promoteUser = async () => {
    // Get email from command line argument
    const targetEmail = process.argv[2];

    if (!targetEmail) {
        console.log('⚠️  Please provide an email address.');
        console.log('Usage: node promoteAdmin.js <user_email>');
        process.exit(1);
    }

    try {
        // Wait small delay to ensure DB connection
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = await User.findOne({ email: targetEmail });

        if (!user) {
            console.log(`❌ User with email "${targetEmail}" not found.`);
            process.exit(1);
        }

        // Update role
        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! User "${user.name}" is now an ADMIN.`);
        console.log(`👉 You must LOGOUT and LOGIN again on the frontend to see changes.`);

        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

promoteUser();

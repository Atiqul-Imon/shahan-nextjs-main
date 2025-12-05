/**
 * Script to check admin users in MongoDB
 * Run with: npx ts-node scripts/check-admin-users.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  access_token: String,
  refresh_token: String,
  createdAt: Date
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function checkAdminUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!\n');

    // Get all users
    const allUsers = await User.find({}).select('name email role createdAt').lean();
    
    console.log('=== ALL USERS ===');
    console.log(`Total users: ${allUsers.length}\n`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role || 'user'}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Get admin users
    const adminUsers = await User.find({ role: 'admin' }).select('name email role createdAt').lean();
    
    console.log('=== ADMIN USERS ===');
    console.log(`Total admins: ${adminUsers.length}\n`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('\nAllowed registration emails:');
      console.log('  - imonatikulislam@gmail.com');
      console.log('  - shahan24h@gmail.com');
      console.log('  - atiqulimon.dev@gmail.com');
      console.log('\nTo create an admin user:');
      console.log('  1. Register one of the allowed emails');
      console.log('  2. Update the user role to "admin" in MongoDB');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }

    // Check allowed emails
    const allowedEmails = [
      "imonatikulislam@gmail.com",
      "shahan24h@gmail.com",
      "atiqulimon.dev@gmail.com"
    ];

    console.log('=== ALLOWED REGISTRATION EMAILS ===');
    allowedEmails.forEach((email, index) => {
      const user = allUsers.find(u => u.email === email);
      if (user) {
        console.log(`${index + 1}. ${email} - ${user.role === 'admin' ? '✅ ADMIN' : '❌ User (not admin)'}`);
      } else {
        console.log(`${index + 1}. ${email} - ⚠️  Not registered`);
      }
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdminUsers();


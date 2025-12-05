/**
 * Password Reset Script
 * Run with: npx ts-node scripts/reset-password.ts <email> <new-password>
 * Or run without args to use default email and generate random password
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  access_token: String,
  refresh_token: String,
  createdAt: Date
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

async function resetPassword(email: string, newPassword?: string) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    // Find user or create if doesn't exist
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`⚠️  User with email "${email}" not found!`);
      console.log(`📝 Creating new user...\n`);
      
      // Generate password if not provided
      const passwordToSet: string = newPassword || generateSecurePassword(12);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwordToSet, salt);

      // Create new user
      user = new User({
        name: email.split('@')[0], // Use email prefix as name
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user'
      });
      
      await user.save();
      
      console.log('✅ User created successfully!\n');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📋 LOGIN CREDENTIALS');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`Email:    ${email}`);
      console.log(`Password: ${passwordToSet}`);
      console.log('═══════════════════════════════════════════════════════\n');
      console.log('⚠️  IMPORTANT: Save this password securely!');
      console.log('⚠️  This password will not be shown again.\n');

      await mongoose.disconnect();
      console.log('✅ Disconnected from MongoDB');
      return;
    }

    console.log(`📧 Found user: ${user.name} (${user.email})`);
    console.log(`👤 Current role: ${user.role || 'user'}\n`);

    // Generate password if not provided
    const passwordToSet: string = newPassword || generateSecurePassword(12);
    
    // Hash the password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToSet, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    console.log('✅ Password reset successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${passwordToSet}`);
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANT: Save this password securely!');
    console.log('⚠️  This password will not be shown again.\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Get email from command line args or use default
const email = process.argv[2] || 'atiqulimon.dev@gmail.com';
const newPassword: string | undefined = process.argv[3]; // Optional custom password

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npx ts-node scripts/reset-password.ts <email> [new-password]');
  process.exit(1);
}

resetPassword(email, newPassword);


import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// User Model - HARUS sama dengan model asli
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  full_name: String,
  profile_picture: String,
  bio: String,
  phone_number: String,
  date_of_birth: Date,
  gender: String,
  fitness_level: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

// DAFTAR USER DAN PASSWORD YANG BENAR
// Tambahkan user Anda di sini dengan format: email/username: password
const CORRECT_PASSWORDS = {
  'tes@tes.com': '220405',
  'tesuser': '220405',
  // Tambahkan user lain di sini jika ada
};

async function fixAllPasswords() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    console.log('📋 Getting all users...');
    const allUsers = await User.find({});
    console.log(`✅ Found ${allUsers.length} users\n`);

    for (const user of allUsers) {
      console.log('─────────────────────────────────────────');
      console.log('👤 User:', user.username || user.email);
      console.log('   - ID:', user._id);
      console.log('   - Email:', user.email);
      console.log('   - Username:', user.username);
      console.log('   - Role:', user.role);
      
      // Cek apakah ada password yang benar untuk user ini
      const correctPassword = CORRECT_PASSWORDS[user.email] || 
                             CORRECT_PASSWORDS[user.username];

      if (correctPassword) {
        console.log('   - Correct password found:', correctPassword);
        
        // Test current password
        if (user.password) {
          const isMatch = await bcrypt.compare(correctPassword, user.password);
          console.log('   - Current password valid:', isMatch ? '✅ YES' : '❌ NO');
          
          if (!isMatch) {
            console.log('   ⚠️  FIXING PASSWORD...');
            const hashedPassword = await bcrypt.hash(correctPassword, 10);
            user.password = hashedPassword;
            await user.save();
            console.log('   ✅ Password UPDATED!');
            
            // Verify
            const user2 = await User.findById(user._id);
            const isMatch2 = await bcrypt.compare(correctPassword, user2.password);
            console.log('   ✅ Verification:', isMatch2 ? 'SUCCESS' : 'FAILED');
          } else {
            console.log('   ✅ Password already correct, no changes needed');
          }
        } else {
          console.log('   ⚠️  NO PASSWORD IN DB - Setting password...');
          const hashedPassword = await bcrypt.hash(correctPassword, 10);
          user.password = hashedPassword;
          await user.save();
          console.log('   ✅ Password SET!');
        }
      } else {
        console.log('   ⚠️  No correct password defined for this user');
        console.log('   💡 Add to CORRECT_PASSWORDS object if needed');
      }
    }

    console.log('\n═════════════════════════════════════════');
    console.log('✅ ALL PASSWORDS FIXED!\n');
    console.log('📝 Login credentials:');
    for (const [identifier, password] of Object.entries(CORRECT_PASSWORDS)) {
      console.log(`   - ${identifier} : ${password}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixAllPasswords();

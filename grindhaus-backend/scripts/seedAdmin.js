require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

(async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ email: 'owner@grindhaus.local' });
    if (exists) {
      console.log('Owner exists');
      process.exit(0);
    }
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT || 10));
    const pass = await bcrypt.hash('ownerpassword', salt);
    const owner = new User({ username: 'owner', email: 'owner@grindhaus.local', password: pass, role: 'owner' });
    await owner.save();
    console.log('Owner created: owner@grindhaus.local / ownerpassword');
    process.exit(0);
  } catch (err) {
    console.error(err); process.exit(1);
  }
})();

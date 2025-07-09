import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true, // ✅ fixed spelling
  },
  email: {
    type: String,
    required: true,
    unique: true,    // optional but useful
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // ✅ fixed option name
});

const User = models.User || mongoose.model("User", userSchema);
export default User;

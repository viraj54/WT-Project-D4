import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'technician', 'citizen'], required: true },
    phone: { type: String },
    name: { type: String, trim: true },
    governmentId: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

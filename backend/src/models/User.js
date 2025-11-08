import mongoose from 'mongoose';
import PlanSchema from './Plan.js';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentWeek: { type: Number, default: 1 },
    data: { type: mongoose.Schema.Types.Mixed },
    plans: { type: [PlanSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', UserSchema);

export default User;

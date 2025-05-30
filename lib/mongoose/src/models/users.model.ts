import { model, Schema } from 'mongoose';
import { User } from '@interfaces/users.interface';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  // Add timestamps for createdAt and updatedAt
  timestamps: true,
  // Use virtuals in JSON representation
  toJSON: { virtuals: true },
  // Use virtuals in Object representation
  toObject: { virtuals: true }
});

export const UserModel = model<User>('User', UserSchema);

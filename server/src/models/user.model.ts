import { Schema, model, Document } from 'mongoose';

export type UserRole = 'ADMIN' | 'GENERAL_USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['ADMIN', 'GENERAL_USER'],
      required: true,
      default: 'GENERAL_USER'
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      required: true,
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>('User', userSchema);
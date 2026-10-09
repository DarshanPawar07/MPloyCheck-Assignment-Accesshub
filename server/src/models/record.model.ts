import { Schema, model, Document, Types } from 'mongoose';

export type RecordStatus = 'ACTIVE' | 'INACTIVE';
export type AccessLevel = 'READ' | 'WRITE';

export interface IRecord extends Document {
  title: string;
  description: string;
  department: string;
  ownerId: Types.ObjectId;
  accessLevel: AccessLevel;
  status: RecordStatus;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    accessLevel: {
      type: String,
      enum: ['READ', 'WRITE'],
      required: true,
      default: 'READ'
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

export const RecordModel = model<IRecord>('Record', recordSchema);
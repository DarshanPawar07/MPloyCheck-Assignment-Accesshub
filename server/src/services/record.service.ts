import { RecordModel } from '../models/record.model';
import { User } from '../models/user.model';
import { delay } from '../utils/delay.util';

interface GetRecordsOptions {
  userId: string;
  role: 'ADMIN' | 'GENERAL_USER';
  delayMs?: number;
}

export const getRecords = async ({
  userId,
  role,
  delayMs = 0
}: GetRecordsOptions) => {
  // Simulate API latency when requested.
  await delay(delayMs);

  if (role === 'ADMIN') {
    return RecordModel.find()
      .populate('ownerId', 'userId name email role')
      .sort({ createdAt: -1 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
    throw new Error('User not found');
  }

  return RecordModel.find({
    ownerId: user._id,
    status: 'ACTIVE'
  })
    .populate('ownerId', 'userId name email role')
    .sort({ createdAt: -1 });
};

export const getRecordById = async (
  recordId: string,
  userId: string,
  role: 'ADMIN' | 'GENERAL_USER'
) => {
  const record = await RecordModel.findById(recordId)
    .populate('ownerId', 'userId name email role');

  if (!record) {
    throw new Error('Record not found');
  }

  if (role === 'ADMIN') {
    return record;
  }

  const owner = record.ownerId as any;

  if (owner.userId !== userId) {
    throw new Error('You do not have access to this record');
  }

  if (record.status !== 'ACTIVE') {
    throw new Error('Record is inactive');
  }

  return record;
};

export type RecordStatus = 'ACTIVE' | 'INACTIVE';
export type AccessLevel = 'READ' | 'WRITE';

export interface RecordOwner {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'GENERAL_USER';
}

export interface AccessRecord {
  _id: string;
  title: string;
  description: string;
  department: string;
  ownerId: RecordOwner | string;
  accessLevel: AccessLevel;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsResponse {
  success: boolean;
  message?: string;
  meta?: {
    requestedDelay: number;
    processedAsynchronously: boolean;
  };
  data: AccessRecord[];
}

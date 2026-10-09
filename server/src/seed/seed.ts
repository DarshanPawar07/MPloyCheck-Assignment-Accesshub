import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import connectDatabase from '../config/database';
import { User } from '../models/user.model';
import { RecordModel } from '../models/record.model';

dotenv.config();

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();

    console.log('Clearing existing data...');

    await User.deleteMany({});
    await RecordModel.deleteMany({});

    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    const hashedUserPassword = await bcrypt.hash('User@123', 10);

    const admin = await User.create({
      userId: 'admin01',
      name: 'AccessHub Admin',
      email: 'admin@accesshub.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    });

    const user01 = await User.create({
      userId: 'user01',
      name: 'Rahul Sharma',
      email: 'rahul@accesshub.com',
      password: hashedUserPassword,
      role: 'GENERAL_USER',
      status: 'ACTIVE'
    });

    const user02 = await User.create({
      userId: 'user02',
      name: 'Priya Mehta',
      email: 'priya@accesshub.com',
      password: hashedUserPassword,
      role: 'GENERAL_USER',
      status: 'ACTIVE'
    });

    const user03 = await User.create({
      userId: 'user03',
      name: 'Amit Patil',
      email: 'amit@accesshub.com',
      password: hashedUserPassword,
      role: 'GENERAL_USER',
      status: 'ACTIVE'
    });

    await RecordModel.insertMany([
      {
        title: 'Project Alpha',
        description: 'Internal engineering project information',
        department: 'Engineering',
        ownerId: user01._id,
        accessLevel: 'WRITE',
        status: 'ACTIVE'
      },
      {
        title: 'Employee Onboarding',
        description: 'Employee onboarding documentation',
        department: 'Human Resources',
        ownerId: user01._id,
        accessLevel: 'READ',
        status: 'ACTIVE'
      },
      {
        title: 'Financial Report Q3',
        description: 'Quarterly financial information',
        department: 'Finance',
        ownerId: user02._id,
        accessLevel: 'READ',
        status: 'ACTIVE'
      },
      {
        title: 'Infrastructure Access',
        description: 'Infrastructure and deployment details',
        department: 'Engineering',
        ownerId: user02._id,
        accessLevel: 'WRITE',
        status: 'ACTIVE'
      },
      {
        title: 'Recruitment Pipeline',
        description: 'Current recruitment pipeline information',
        department: 'Human Resources',
        ownerId: user03._id,
        accessLevel: 'READ',
        status: 'ACTIVE'
      },
      {
        title: 'Product Roadmap',
        description: 'Upcoming product roadmap',
        department: 'Product',
        ownerId: user03._id,
        accessLevel: 'WRITE',
        status: 'ACTIVE'
      },
      {
        title: 'System Audit',
        description: 'System access audit information',
        department: 'Security',
        ownerId: admin._id,
        accessLevel: 'WRITE',
        status: 'ACTIVE'
      }
    ]);

    console.log('Database seeded successfully.');
    console.log('');
    console.log('Demo accounts:');
    console.log('Admin      → admin01 / Admin@123');
    console.log('User       → user01 / User@123');
    console.log('User       → user02 / User@123');
    console.log('User       → user03 / User@123');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
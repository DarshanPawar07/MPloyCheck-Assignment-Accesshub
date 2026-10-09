
/*import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';

dotenv.config();
import routes from './routes';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200'
  })
);

app.use(express.json());
app.use('/api', routes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AccessHub API is running',
    timestamp: new Date().toISOString()
  });
});

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`AccessHub API running on http://localhost:${PORT}`);
  });
};

startServer();*/


import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import connectDatabase from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`AccessHub API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start AccessHub API:', error);
    process.exitCode = 1;
  }
};

void startServer();

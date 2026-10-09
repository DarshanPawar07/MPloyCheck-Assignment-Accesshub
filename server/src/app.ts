
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

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

export default app;

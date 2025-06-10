import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import v1Routes from './routes/v1';

const app = express();

const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// Enable cors for frontend origin from .env
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    optionsSuccessStatus: 200,
  })
);

// HTTP request logger (dev or prod)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response comprension
app.use(compression());

// Cookie parser
app.use(cookieParser());

app.get('/', (_, res) => {
  res.send('Hello world');
});

app.use('/api/v1', v1Routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

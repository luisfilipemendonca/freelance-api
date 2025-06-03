import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';

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

app.get('/', (_, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

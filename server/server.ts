import express, { Request, Response } from 'express';
import cors from "cors";
import 'dotenv/config'
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRouter.js';
import rateLimit from "express-rate-limit";
import projectRouter from './routes/projectRoutes.js';

const app = express();
const port = 3000;

app.set("trust proxy", 1);

app.use(express.json({ limit: '50mb' }));

const corsOptions = {
  origin: process.env.TRUSTED_ORIGIN?.split(',') || [],
  credentials: true
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});

app.use(limiter);

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use('/api/user', userRouter);
app.use('/api/project',projectRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Server is Live!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
import express from 'express';
import cors from 'cors';
import { AuthRouter, GameRouter, LeaderboardRouter } from './routes';
import { setupSwagger } from './config/swagger';

const allowedOrigins = (process.env.CORS_URL || '')
	.split(',')
	.map((origin: String) => origin.trim());

const app = express();

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use('/api/auth', AuthRouter);
app.use('/api/games', GameRouter);
app.use('/api/leaderboard', LeaderboardRouter);

export default app;

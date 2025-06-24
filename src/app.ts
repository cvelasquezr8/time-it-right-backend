import express from 'express';
import cors from 'cors';
import { AuthRouter, GameRouter, LeaderboardRouter } from './routes';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://localhost:5173'],
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

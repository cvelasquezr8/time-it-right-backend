import { Router } from 'express';
import { GameController } from '@/controllers';
import { GameService } from '@/services';
import { authMiddleware } from '@/middlewares/auth.middleware';

const GameRouter = Router();
const gameService = new GameService();
const gameController = new GameController(gameService);

/**
 * @swagger
 * /games/start:
 *   post:
 *     summary: Start a new game session
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Game started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game started successfully
 *                 game:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     expiredAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request (e.g. missing user ID)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
GameRouter.post('/start/', authMiddleware, gameController.startGame);

/**
 * @swagger
 * /games/stop/{gameId}:
 *   post:
 *     summary: Stop a running game session
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the game session to stop
 *     responses:
 *       200:
 *         description: Game stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Game stopped successfully
 *       400:
 *         description: Game already stopped, expired, or unauthorized
 *       401:
 *         description: Unauthorized
 */
GameRouter.post('/stop/:gameId', authMiddleware, gameController.stopGame);

export default GameRouter;

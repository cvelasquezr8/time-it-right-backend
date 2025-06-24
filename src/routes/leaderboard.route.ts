import { Router } from 'express';
import { LeaderboardController } from '@/controllers';
import { LeaderboardService } from '@/services';

const LeaderboardRouter = Router();
const leaderboardService = new LeaderboardService();
const leaderboardController = new LeaderboardController(leaderboardService);

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     tags: [Leaderboard]
 *     description: Returns the top 10 users with the best average deviation in their games.
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leaderboard retrieved successfully
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: 8af8693a-ec0b-4fc1-90a2-70cb08a0cc18
 *                       userName:
 *                         type: string
 *                         example: johndoe
 *                       totalGames:
 *                         type: integer
 *                         example: 12
 *                       averageDeviation:
 *                         type: number
 *                         example: 436
 *                       bestDeviation:
 *                         type: number
 *                         example: 3
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal Server Error
 */
LeaderboardRouter.get('/', leaderboardController.getLeaderboard);

export default LeaderboardRouter;

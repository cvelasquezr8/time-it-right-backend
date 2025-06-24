import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
/**
 *
 * (e.g., // generated-with-GPT
 */
const options: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Time It Right API',
			version: '1.0.0',
			description: 'API documentation for Time It Right challenge',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		servers: [
			{
				url: 'http://localhost:3000/api',
			},
		],
		tags: [
			{
				name: 'Auth',
				description: 'Authentication endpoints',
			},
			{
				name: 'Games',
				description: 'Game logic endpoints',
			},
			{
				name: 'Leaderboard',
				description: 'Top player rankings',
			},
		],
	},
	apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

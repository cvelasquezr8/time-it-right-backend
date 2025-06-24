import app from './app';
import { envs } from '@/config/envs';
import { sequelize } from '@/data/sequelize.database';
import { createLogger } from './config';

const PORT = envs.port;
const logger = createLogger('server');

(async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		logger.info('✅ Database connection established');

		app.listen(PORT, () => {
			logger.info(`🚀 Server is running on port ${PORT}`);
		});
	} catch (err) {
		logger.error(`❌ Unable to connect to DB: ${err}`);
	}
})();

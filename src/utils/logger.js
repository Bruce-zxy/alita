import Logger from 'js-logger';
import Config from '@/config';

Logger.useDefaults({
  ...Config.logger,
});

const logger = Logger.get('Rant');

logger.debug('log test ...');

export default logger;

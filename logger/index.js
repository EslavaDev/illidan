const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [],
});

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
} else {
  logger.add(new transports.Console());
}

module.exports = logger;

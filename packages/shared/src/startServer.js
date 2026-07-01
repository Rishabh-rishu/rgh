function startServer({ app, logger, serviceName, port, host = '127.0.0.1', onListening }) {
  const server = app.listen(port, host, () => {
    logger.info(`${serviceName} running at http://${host}:${port}`);
    if (onListening) {
      onListening();
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`${serviceName} could not start because ${host}:${port} is already in use.`);
      logger.error(`Stop the process using port ${port}, or change the service port in .env.`);
      process.exit(1);
    }

    if (err.code === 'EPERM') {
      logger.error(`${serviceName} could not start because the terminal cannot listen on ${host}:${port}.`);
      logger.error('Try running the command in an unrestricted terminal, or set HOST=127.0.0.1 in .env.');
      process.exit(1);
    }

    logger.error(`${serviceName} failed to start: ${err.message}`);
    process.exit(1);
  });

  return server;
}

module.exports = { startServer };

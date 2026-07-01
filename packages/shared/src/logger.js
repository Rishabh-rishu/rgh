function createLogger(serviceName) {
  return {
    info: (message, meta = {}) => console.log(`[${serviceName}] INFO:`, message, meta),
    warn: (message, meta = {}) => console.warn(`[${serviceName}] WARN:`, message, meta),
    error: (message, meta = {}) => console.error(`[${serviceName}] ERROR:`, message, meta),
  };
}

module.exports = { createLogger };

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, meta: Record<string, any> = {}) {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      message,
      environment: process.env.NODE_ENV || 'development',
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      // In production, output structured JSON to stdout/stderr
      if (level === 'error') {
        console.error(JSON.stringify(logObject));
      } else if (level === 'warn') {
        console.warn(JSON.stringify(logObject));
      } else {
        console.log(JSON.stringify(logObject));
      }
    } else {
      // In development, output pretty readable messages
      const color =
        level === 'error'
          ? '\x1b[31m'
          : level === 'warn'
          ? '\x1b[33m'
          : level === 'debug'
          ? '\x1b[36m'
          : '\x1b[32m';
      const reset = '\x1b[0m';
      console.log(
        `[${logObject.timestamp}] ${color}${level.toUpperCase()}${reset}: ${message}`,
        Object.keys(meta).length ? meta : ''
      );
    }
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | string, meta?: Record<string, any>) {
    const errorMeta = error instanceof Error 
      ? { error_name: error.name, error_message: error.message, stack: error.stack }
      : { error_message: error };
    this.log('error', message, { ...errorMeta, ...meta });
  }

  debug(message: string, meta?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, meta);
    }
  }
}

export const logger = new Logger();

import { Axiom } from '@axiomhq/js';

const axiom = process.env.AXIOM_TOKEN 
  ? new Axiom({
      token: process.env.AXIOM_TOKEN,
    })
  : null;

const dataset = process.env.AXIOM_DATASET || 'pds006-logs';

export interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
  userId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

class Logger {
  private async sendToAxiom(event: LogEvent) {
    if (!axiom) {
      console.log('[Axiom disabled]', event);
      return;
    }

    try {
      await axiom.ingest(dataset, [{
        ...event,
        timestamp: event.timestamp || new Date(),
        environment: process.env.NODE_ENV || 'development',
        service: 'pds006-api',
      }]);
    } catch (error) {
      console.error('Failed to send log to Axiom:', error);
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    const event: LogEvent = { level: 'info', message, metadata };
    console.info(`[INFO] ${message}`, metadata);
    this.sendToAxiom(event);
  }

  warn(message: string, metadata?: Record<string, any>) {
    const event: LogEvent = { level: 'warn', message, metadata };
    console.warn(`[WARN] ${message}`, metadata);
    this.sendToAxiom(event);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const event: LogEvent = { 
      level: 'error', 
      message, 
      metadata: {
        ...metadata,
        error: error?.message,
        stack: error?.stack,
      }
    };
    console.error(`[ERROR] ${message}`, error, metadata);
    this.sendToAxiom(event);
  }

  debug(message: string, metadata?: Record<string, any>) {
    const event: LogEvent = { level: 'debug', message, metadata };
    console.debug(`[DEBUG] ${message}`, metadata);
    this.sendToAxiom(event);
  }

  async logRequest(data: {
    method: string;
    endpoint: string;
    statusCode: number;
    duration: number;
    userId?: string;
    metadata?: Record<string, any>;
  }) {
    const event: LogEvent = {
      level: 'info',
      message: `${data.method} ${data.endpoint} - ${data.statusCode}`,
      ...data,
    };
    
    this.sendToAxiom(event);
  }

  async flush() {
    if (axiom) {
      await axiom.flush();
    }
  }
}

export const logger = new Logger();
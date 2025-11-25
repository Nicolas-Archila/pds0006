import { Elysia } from 'elysia';
import { logger } from '@core/utils/logger';

export const axiomPlugin = new Elysia({ name: 'axiom-logger' })
  .derive(({ set }) => {
    set.startTime = Date.now();
    return {};
  })
  .onAfterResponse(({ request, set }) => {
    const duration = Date.now() - (set.startTime || Date.now());
    const url = new URL(request.url);
    
    logger.logRequest({
      method: request.method,
      endpoint: url.pathname,
      statusCode: set.status || 200,
      duration,
      metadata: {
        query: url.searchParams.toString(),
        userAgent: request.headers.get('user-agent'),
      },
    });
  })
  .onError(({ error, request }) => {
    const url = new URL(request.url);
    
    logger.error(
      `Error in ${request.method} ${url.pathname}`,
      error instanceof Error ? error : new Error(String(error)),
      {
        statusCode: 500,
        endpoint: url.pathname,
      }
    );
  });
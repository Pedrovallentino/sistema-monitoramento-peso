import Fastify from 'fastify';
import cors from '@fastify/cors';
import { statusRoutes } from './routes/status.routes';
import { telemetryRoutes } from './routes/telemetry.routes';

const buildApp = () => {
  const app = Fastify({
    logger: true
  });

  // Register CORS (GLOBAL)
  app.register(cors, {
    origin: '*'
  });

  // Register routes
  app.register(statusRoutes);
  app.register(telemetryRoutes);

  return app;
};

export default buildApp;

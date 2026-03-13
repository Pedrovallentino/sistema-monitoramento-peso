import { FastifyInstance } from 'fastify';
import { telemetryService } from '../services/telemetry.service';

export async function statusRoutes(fastify: FastifyInstance) {
  fastify.get('/api/status', async (request, reply) => {
    const status = telemetryService.getCurrentStatus();
    return status;
  });
}

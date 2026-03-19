import { FastifyInstance } from 'fastify';
import { telemetryService } from '../services/telemetry.service';

/**
 * Endpoint protegido de ingestão.
 *
 * Peculiaridades:
 * - A rota chama `telemetryService.processMeasurement(...)` para garantir que firmware real
 *   e simulação atravessem o MESMO fluxo de negócio.
 * - O parâmetro `dataSource` é fixado como `'firmware'` aqui (para depuração via `/api/status`).
 */
interface TelemetryPayload {
  deviceId: string;
  weightKg: number;
}

export async function telemetryRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: TelemetryPayload }>('/api/telemetry', async (request, reply) => {
    // 1. Security Check: API Key
    const apiKey = request.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
      return reply.code(401).send({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    // 2. Payload Validation
    const { deviceId, weightKg } = request.body;

    if (!deviceId || typeof deviceId !== 'string') {
      return reply.code(400).send({ error: 'Bad Request: Missing or invalid deviceId' });
    }

    if (typeof weightKg !== 'number') {
      return reply.code(400).send({ error: 'Bad Request: Missing or invalid weightKg' });
    }

    // 3. Update State
    try {
      telemetryService.processMeasurement(weightKg, 'firmware');
      // Log for debug
      // console.log(`Received telemetry from ${deviceId}: ${weightKg}kg`);
      
      return reply.code(200).send({ message: 'Telemetry received successfully' });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}

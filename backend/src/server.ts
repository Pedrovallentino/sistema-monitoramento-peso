import * as dotenv from 'dotenv';
dotenv.config();

import buildApp from './app';
import { startTelemetrySimulationIfEnabled } from './simulation/startTelemetrySimulation';

/**
 * Ponto de entrada da API.
 *
 * Peculiaridades:
 * - Se `ENABLE_SIMULATION=true`, inicia o simulador automaticamente durante o startup,
 *   alimentando o MESMO pipeline de processamento usado pelo endpoint `POST /api/telemetry`.
 */

const start = async () => {
  const app = buildApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  try {
    startTelemetrySimulationIfEnabled();

    // Start HTTP Server
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server listening on port ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

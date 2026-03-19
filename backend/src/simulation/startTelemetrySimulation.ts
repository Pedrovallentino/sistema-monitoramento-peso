/**
 * startTelemetrySimulation
 *
 * Peculiaridades:
 * - Controla a inicialização do simulador via variável de ambiente `ENABLE_SIMULATION=true|false`.
 * - Não altera a lógica de negócio; apenas liga/desliga a geração periódica.
 */

import { TelemetrySimulator } from '../modules/telemetrySimulator/telemetrySimulator';

export function startTelemetrySimulationIfEnabled(): TelemetrySimulator | null {
  const enabled = (process.env.ENABLE_SIMULATION ?? 'false').toLowerCase() === 'true';
  if (!enabled) return null;

  const simulator = new TelemetrySimulator();
  simulator.start('simulation');

  // eslint-disable-next-line no-console
  console.log('Telemetry simulation enabled (ENABLE_SIMULATION=true).');
  return simulator;
}


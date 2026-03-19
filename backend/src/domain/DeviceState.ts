/**
 * Modelo do estado consolidado do dispositivo.
 *
 * Peculiaridades:
 * - O estado inclui tanto valores brutos (`weightKg`) quanto valores derivados
 *   (`gasPercentage`, `status`) e contagem de eventos (`swapCount`).
 * - Tanto leituras de firmware real quanto leituras do simulador devem atualizar
 *   este mesmo estado (uma única fonte de verdade).
 */

import type { GasStatus } from '../config/gasConfig';

export type DataSource = 'simulation' | 'firmware';

export interface DeviceState {
  weightKg: number;
  gasPercentage: number;
  status: GasStatus;
  swapCount: number;
  lastUpdate: number; // timestamp UNIX

  /**
   * Fonte mais recente que alimentou o backend.
   * - `firmware`: leitura real recebida via `POST /api/telemetry`
   * - `simulation`: leitura gerada pelo simulador
   */
  dataSource?: DataSource;
}

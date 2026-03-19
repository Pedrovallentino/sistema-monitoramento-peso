/**
 * Store em memória do backend.
 *
 * Peculiaridades:
 * - Guarda um único estado central (incluindo valores derivados) para que
 *   o endpoint `GET /api/status` seja consistente tanto com firmware real quanto com simulação.
 */

import { DeviceState } from '../domain/DeviceState';
import type { GasStatus } from '../config/gasConfig';

const DEFAULT_STATUS: GasStatus = 'Nível Crítico';

/**
 * In-memory store for device state.
 * Singleton pattern or simple module-level variable.
 */
let currentState: DeviceState = {
  weightKg: 0,
  gasPercentage: 0,
  status: DEFAULT_STATUS,
  lastUpdate: 0,
  swapCount: 0,
  dataSource: undefined,
};

export const memoryStore = {
  getState: (): DeviceState => {
    return { ...currentState };
  },

  updateState: (newState: Partial<DeviceState>): void => {
    currentState = {
      ...currentState,
      ...newState,
    };
  },

  incrementSwapCount: (): void => {
    currentState.swapCount++;
  },
};

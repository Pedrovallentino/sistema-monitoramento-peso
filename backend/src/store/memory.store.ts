import { DeviceState } from '../domain/DeviceState';

/**
 * In-memory store for device state.
 * Singleton pattern or simple module-level variable.
 */
let currentState: DeviceState = {
  weightKg: 0,
  lastUpdate: 0,
  gasSwapCount: 0,
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

  incrementGasSwapCount: (): void => {
    currentState.gasSwapCount++;
  },
};

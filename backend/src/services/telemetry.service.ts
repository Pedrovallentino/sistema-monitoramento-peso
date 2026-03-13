import { memoryStore } from '../store/memory.store';

const GAS_SWAP_THRESHOLD_KG = Number(process.env.GAS_SWAP_THRESHOLD_KG ?? 5);

export const telemetryService = {
  /**
   * Updates the weight and detects gas cylinder swaps.
   * @param weight The new weight value from the sensor.
   */
  updateWeight: (weight: number): void => {
    if (typeof weight !== 'number' || isNaN(weight)) {
      console.warn('Received invalid weight value:', weight);
      return;
    }

    const currentState = memoryStore.getState();
    const previousWeight = currentState.weightKg;

    // A primeira leitura nunca deve contar como troca
    const isFirstReading = previousWeight === 0;

    // Lógica de detecção de troca
    if (!isFirstReading && weight - previousWeight >= GAS_SWAP_THRESHOLD_KG) {
      memoryStore.incrementGasSwapCount();
    }

    const timestamp = Math.floor(Date.now() / 1000);

    memoryStore.updateState({
      weightKg: weight,
      lastUpdate: timestamp,
    });
  },

  /**
   * Retrieves the current state of the device.
   */
  getCurrentStatus: () => {
    return memoryStore.getState();
  },
};

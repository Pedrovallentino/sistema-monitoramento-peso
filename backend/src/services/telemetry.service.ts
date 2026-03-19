import { memoryStore } from '../store/memory.store';
import { GAS_SWAP_THRESHOLD_KG, computeGasPercentage, computeGasStatus } from '../config/gasConfig';
import type { DataSource } from '../domain/DeviceState';

/**
 * TelemetryService
 * - Centraliza a lógica de atualização do estado a partir de uma medição de peso.
 * - Tanto leituras reais (firmware) quanto leituras simuladas devem chamar a mesma função
 *   para evitar duplicação de regras de negócio.
 */

export const telemetryService = {
  /**
   * Processa uma medição de peso (KG) e atualiza o estado do backend.
   * @param weightKg Peso atual medido (ou simulado).
   * @param dataSource Fonte da medição (para depuração via `/api/status`).
   */
  processMeasurement: (weightKg: number, dataSource: DataSource): void => {
    if (typeof weightKg !== 'number' || isNaN(weightKg)) {
      console.warn('Received invalid weightKg value:', weightKg);
      return;
    }

    const currentState = memoryStore.getState();
    const previousWeightKg = currentState.weightKg;

    // A primeira leitura nunca deve contar como troca
    const isFirstReading = previousWeightKg === 0 && currentState.lastUpdate === 0;

    // Lógica de detecção de troca
    if (!isFirstReading && weightKg - previousWeightKg >= GAS_SWAP_THRESHOLD_KG) {
      memoryStore.incrementSwapCount();
    }

    const timestamp = Math.floor(Date.now() / 1000); // UNIX em segundos

    // Atualiza valores derivados a partir do peso bruto.
    const gasPercentage = computeGasPercentage(weightKg);
    const status = computeGasStatus(gasPercentage);

    memoryStore.updateState({
      weightKg: weightKg,
      gasPercentage,
      status,
      lastUpdate: timestamp,
      dataSource,
    });
  },

  /**
   * Retrieves the current state of the device.
   */
  getCurrentStatus: () => {
    return memoryStore.getState();
  },
};

/**
 * TelemetrySimulator
 * Gera leituras de peso de forma determinística/suavizada e alimenta o backend
 * pela MESMA função de processamento usada pela telemetria real.
 *
 * Peculiaridades:
 * - O simulador NUNCA atualiza o estado diretamente; ele chama `telemetryService.processMeasurement`.
 * - Ele simula:
 *   - consumo gradual (peso decresce)
 *   - variação de ruído pequeno
 *   - troca de botijão (quando chega perto do "vazio", o peso dá um salto)
 * - A contagem de trocas (`swapCount`) é aplicada exclusivamente pela regra de negócio do backend,
 *   garantindo que firmware real e simulação produzem efeitos iguais no estado central.
 */

import type { DataSource } from '../../domain/DeviceState';
import { telemetryService } from '../../services/telemetry.service';
import { NET_WEIGHT_KG, TARE_WEIGHT_KG } from '../../config/gasConfig';

export type TelemetrySimulatorOptions = {
  intervalMs?: number;
  consumptionRateKgPerSec?: number;
  emptyWeightKg?: number;
  fullWeightKg?: number;
  initialWeightKg?: number;
  measurementNoiseKg?: number;
};

const randBetween = (min: number, max: number): number => min + Math.random() * (max - min);

export class TelemetrySimulator {
  private timer?: NodeJS.Timeout;
  private running = false;
  private currentWeightKg: number;

  private readonly intervalMs: number;
  private readonly consumptionRateKgPerSec: number;
  private readonly emptyWeightKg: number;
  private readonly fullWeightKg: number;
  private readonly measurementNoiseKg: number;

  constructor(options: TelemetrySimulatorOptions = {}) {
    this.intervalMs = options.intervalMs ?? Number(process.env.TELEMETRY_SIM_INTERVAL_MS ?? 1000);
    this.consumptionRateKgPerSec =
      options.consumptionRateKgPerSec ?? Number(process.env.TELEMETRY_SIM_CONSUMPTION_KG_PER_SEC ?? 0.05);
    this.emptyWeightKg = options.emptyWeightKg ?? Number(process.env.TELEMETRY_SIM_EMPTY_WEIGHT_KG ?? (TARE_WEIGHT_KG + 0.2));
    this.fullWeightKg = options.fullWeightKg ?? Number(process.env.TELEMETRY_SIM_FULL_WEIGHT_KG ?? (TARE_WEIGHT_KG + NET_WEIGHT_KG));
    this.measurementNoiseKg = options.measurementNoiseKg ?? Number(process.env.TELEMETRY_SIM_NOISE_KG ?? 0.05);

    this.currentWeightKg =
      options.initialWeightKg ??
      Number(process.env.TELEMETRY_SIM_INITIAL_WEIGHT_KG ?? (TARE_WEIGHT_KG + NET_WEIGHT_KG));
  }

  start(source: DataSource = 'simulation'): void {
    if (this.running) return;
    this.running = true;

    const tick = () => {
      // Consumo gradual (peso decresce).
      const delta = this.consumptionRateKgPerSec * (this.intervalMs / 1000);
      let nextWeight = this.currentWeightKg - delta;

      // Ruído de medição pequeno para não ficar totalmente "liso".
      if (this.measurementNoiseKg > 0) {
        nextWeight += randBetween(-this.measurementNoiseKg, this.measurementNoiseKg);
      }

      // Quando chega perto do "vazio", simula a troca do botijão (salto de peso).
      if (nextWeight <= this.emptyWeightKg) {
        nextWeight = this.fullWeightKg + randBetween(-this.measurementNoiseKg, this.measurementNoiseKg);
      }

      this.currentWeightKg = Math.max(0, nextWeight);

      // Alimenta o backend pelo mesmo fluxo do firmware real.
      telemetryService.processMeasurement(this.currentWeightKg, source);
    };

    // Primeiro tick imediato para acelerar a demonstração.
    tick();
    this.timer = setInterval(tick, this.intervalMs);
  }

  stop(): void {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = undefined;
    this.running = false;
  }
}


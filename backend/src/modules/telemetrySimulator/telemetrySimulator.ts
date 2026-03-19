/**
 * TelemetrySimulator
 * Gera leituras de peso de forma determinística/suavizada e alimenta o backend
 * pela MESMA função de processamento usada pela telemetria real.
 *
 * Peculiaridades:
 * - O simulador NUNCA atualiza o estado diretamente; ele chama `telemetryService.processMeasurement`.
 * - Ele simula:
 *   - consumo gradual (peso decresce)
 *   - variação de ruído pequeno apenas na leitura reportada (sensor)
 *   - troca de botijão (quando chega perto do "vazio", o peso dá um salto)
 * - A contagem de trocas (`swapCount`) é aplicada exclusivamente pela regra de negócio do backend,
 *   garantindo que firmware real e simulação produzem efeitos iguais no estado central.
 */

import type { DataSource } from '../../domain/DeviceState';
import { telemetryService } from '../../services/telemetry.service';
import { NET_WEIGHT_KG, TARE_WEIGHT_KG } from '../../config/gasConfig';

export type TelemetrySimulatorOptions = {
  intervalMs?: number;
  /**
   * Taxa de consumo em kg por segundo (modo legado).
   * Se definido (via opções ou env), tem prioridade sobre os parâmetros de kg/dia.
   */
  consumptionRateKgPerSec?: number;
  /**
   * Taxa de consumo realista em kg por dia.
   * Usado junto com `timeScale` para acelerar a simulação sem perder plausibilidade.
   */
  consumptionKgPerDay?: number;
  /**
   * Fator que acelera o tempo da simulação.
   * Ex.: `timeScale=1000` => 1s de tempo real equivale a 1000s na simulação.
   */
  timeScale?: number;
  emptyWeightKg?: number;
  fullWeightKg?: number;
  initialWeightKg?: number;
  measurementNoiseKg?: number;
};

const randBetween = (min: number, max: number): number => min + Math.random() * (max - min);

export class TelemetrySimulator {
  private timer?: NodeJS.Timeout;
  private running = false;
  // Peso "verdadeiro" (subjacente) usado para o consumo determinístico.
  // O ruído entra apenas na leitura enviada ao backend.
  private trueWeightKg: number;
  private lastTickAtMs: number;

  private readonly intervalMs: number;
  private readonly consumptionRateKgPerSec: number;
  private readonly consumptionKgPerDay: number;
  private readonly timeScale: number;
  private readonly emptyWeightKg: number;
  private readonly fullWeightKg: number;
  private readonly measurementNoiseKg: number;

  constructor(options: TelemetrySimulatorOptions = {}) {
    this.intervalMs = options.intervalMs ?? Number(process.env.TELEMETRY_SIM_INTERVAL_MS ?? 1000);
    const consumptionRateKgPerSecEnv = process.env.TELEMETRY_SIM_CONSUMPTION_KG_PER_SEC;
    const hasLegacyRate =
      options.consumptionRateKgPerSec !== undefined || (consumptionRateKgPerSecEnv !== undefined && consumptionRateKgPerSecEnv !== '');

    this.consumptionRateKgPerSec = hasLegacyRate
      ? options.consumptionRateKgPerSec ?? Number(consumptionRateKgPerSecEnv)
      : 0;

    // Defaults plausíveis para "decaimento realista" (para demonstração o `timeScale` acelera).
    // Valores podem ser ajustados via env sem recompilar.
    this.consumptionKgPerDay = options.consumptionKgPerDay ?? Number(process.env.TELEMETRY_SIM_CONSUMPTION_KG_PER_DAY ?? 0.4);
    // Objetivo: levar o peso do estado "cheio" ao "vazio" em aproximadamente ~1 dia (tempo real),
    // usando a taxa em kg/dia multiplicada por `timeScale`.
    // Delta padrão: (tare + net) -> (tare + 0.2) ~ NET - 0.2 = 12.8kg (com defaults do frontend/backend)
    // Taxa padrão: 0.4 kg/dia * 32 = 12.8 kg/dia
    this.timeScale = options.timeScale ?? Number(process.env.TELEMETRY_SIM_TIME_SCALE ?? 32);

    this.emptyWeightKg = options.emptyWeightKg ?? Number(process.env.TELEMETRY_SIM_EMPTY_WEIGHT_KG ?? (TARE_WEIGHT_KG + 0.2));
    this.fullWeightKg = options.fullWeightKg ?? Number(process.env.TELEMETRY_SIM_FULL_WEIGHT_KG ?? (TARE_WEIGHT_KG + NET_WEIGHT_KG));
    // Ruído menor para o decaimento parecer uma "tendência" (consumo) e não uma variação brusca.
    this.measurementNoiseKg = options.measurementNoiseKg ?? Number(process.env.TELEMETRY_SIM_NOISE_KG ?? 0.01);

    this.trueWeightKg =
      options.initialWeightKg ??
      Number(process.env.TELEMETRY_SIM_INITIAL_WEIGHT_KG ?? (TARE_WEIGHT_KG + NET_WEIGHT_KG));

    this.lastTickAtMs = Date.now();
  }

  start(source: DataSource = 'simulation'): void {
    if (this.running) return;
    this.running = true;

    const tick = () => {
      const nowMs = Date.now();
      const dtRealSec = Math.max(0, (nowMs - this.lastTickAtMs) / 1000);
      this.lastTickAtMs = nowMs;

      // Consumo gradual (peso decresce).
      // Dois modos:
      // - Legacy: taxa direta kg/s.
      // - Realista: kg/dia * timeScale (acelera o tempo sem mudar a "taxa diária").
      const deltaKg = this.consumptionRateKgPerSec > 0
        ? this.consumptionRateKgPerSec * dtRealSec
        : (this.consumptionKgPerDay / 86400) * (this.timeScale * dtRealSec);

      // Atualiza o "peso verdadeiro" com base no consumo.
      this.trueWeightKg = Math.max(0, this.trueWeightKg - deltaKg);

      // Quando chega perto do "vazio", simula a troca do botijão (salto de peso).
      // A troca é baseada no peso verdadeiro para manter o tempo realista até o mínimo.
      if (this.trueWeightKg <= this.emptyWeightKg) {
        this.trueWeightKg = this.fullWeightKg;
      }

      // Ruído de medição aplicado apenas ao que é "reportado" (leitura do sensor).
      const measurementNoise =
        this.measurementNoiseKg > 0 ? randBetween(-this.measurementNoiseKg, this.measurementNoiseKg) : 0;
      const measuredWeightKg = Math.max(0, this.trueWeightKg + measurementNoise);

      // Alimenta o backend pelo mesmo fluxo do firmware real.
      telemetryService.processMeasurement(measuredWeightKg, source);
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


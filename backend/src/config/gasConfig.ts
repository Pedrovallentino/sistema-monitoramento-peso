/**
 * Config e regras de negócio relacionadas ao cálculo de nível de gás.
 *
 * Peculiaridades:
 * - Mantém as regras de percentual/status em um único lugar para que telemetria real e simulação
 *   produzam exatamente os mesmos valores derivados.
 * - Os valores padrão (tare/net e thresholds) foram alinhados com os defaults atuais do frontend,
 *   reduzindo divergências visuais durante o uso com dados simulados.
 */

export type GasStatus = 'Nível Adequado' | 'Nível Médio' | 'Nível Crítico';

export const TARE_WEIGHT_KG = Number(process.env.TARE_WEIGHT_KG ?? 15.0);
export const NET_WEIGHT_KG = Number(process.env.NET_WEIGHT_KG ?? 13.0);

export const STATUS_HIGH_PERCENTAGE = Number(process.env.STATUS_HIGH_PERCENTAGE ?? 40);
export const STATUS_MEDIUM_PERCENTAGE = Number(process.env.STATUS_MEDIUM_PERCENTAGE ?? 20);

export const GAS_SWAP_THRESHOLD_KG = Number(process.env.GAS_SWAP_THRESHOLD_KG ?? 5);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export function computeGasPercentage(weightKg: number): number {
  if (typeof weightKg !== 'number' || isNaN(weightKg)) return 0;

  const gasWeight = Math.max(0, weightKg - TARE_WEIGHT_KG);
  const percentage = (gasWeight / NET_WEIGHT_KG) * 100;
  return clamp(percentage, 0, 100);
}

export function computeGasStatus(gasPercentage: number): GasStatus {
  if (gasPercentage > STATUS_HIGH_PERCENTAGE) return 'Nível Adequado';
  if (gasPercentage > STATUS_MEDIUM_PERCENTAGE) return 'Nível Médio';
  return 'Nível Crítico';
}


export const calculatePercentage = (
  currentWeight: number,
  tareWeight: number,
  netWeight: number
): number => {
  if (currentWeight <= tareWeight) return 0;
  const gasWeight = currentWeight - tareWeight;
  const percentage = (gasWeight / netWeight) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

export const getStatusColor = (percentage: number): string => {
  if (percentage > 40) return '#22c55e'; // green-500
  if (percentage > 20) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

export const getStatusText = (percentage: number): string => {
  if (percentage > 40) return 'Nível Adequado';
  if (percentage > 20) return 'Nível Médio';
  return 'Nível Crítico';
};

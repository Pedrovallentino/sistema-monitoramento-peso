import React from 'react';
import { Fuel, Droplets, AlertTriangle } from 'lucide-react';
import { calculatePercentage, getStatusColor, getStatusText } from '../utils/gasHelpers';
import { useGasStore } from '../store/useGasStore';
import clsx from 'clsx';

interface GasStatusCardProps {
  currentWeight: number;
}

export const GasStatusCard: React.FC<GasStatusCardProps> = ({ currentWeight }) => {
  const { settings } = useGasStore();
  const percentage = calculatePercentage(currentWeight, settings.tareWeight, settings.netWeight);
  const color = getStatusColor(percentage);
  const statusText = getStatusText(percentage);

  // Calculate gas weight only
  const gasWeight = Math.max(0, currentWeight - settings.tareWeight);

  // Determine status level for styling
  const statusLevel = percentage > 40 ? 'high' : percentage > 20 ? 'medium' : 'low';

  const getStatusStyles = () => {
    switch (statusLevel) {
      case 'high':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-100 dark:border-emerald-800',
          icon: <Fuel size={24} className="text-emerald-500" />
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-800',
          icon: <Droplets size={24} className="text-amber-500" />
        };
      case 'low':
        return {
          bg: 'bg-rose-50 dark:bg-rose-900/20',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-100 dark:border-rose-800',
          icon: <AlertTriangle size={24} className="text-rose-500" />
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col items-center text-center h-full justify-between">
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 md:mb-6">
        <div className="text-left">
          <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100">Nível do Gás</h3>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Monitoramento em Tempo Real</p>
        </div>
        <div className={clsx("p-2 md:p-3 rounded-xl transition-colors duration-300", styles.bg)}>
          {styles.icon}
        </div>
      </div>

      {/* Main Gauge */}
      <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] aspect-square flex items-center justify-center my-4 md:my-6">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke="currentColor"
            strokeWidth="18"
            fill="transparent"
            className="text-gray-100 dark:text-gray-700"
          />
          {/* Progress Circle */}
          <circle
            cx="128"
            cy="128"
            r="110"
            stroke={color}
            strokeWidth="18"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={2 * Math.PI * 110 * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-sm"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white tabular-nums tracking-tight">
            {percentage.toFixed(0)}<span className="text-xl sm:text-2xl text-gray-400 font-bold ml-1">%</span>
          </span>
          <div className={clsx("mt-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide border", styles.bg, styles.text, styles.border)}>
            {statusText}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="w-full grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Peso Bruto</p>
          <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white tabular-nums">
            {currentWeight.toFixed(2)}
            <span className="text-xs md:text-sm font-medium text-gray-400 ml-1">{settings.unit}</span>
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
          <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Gás Líquido</p>
          <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white tabular-nums">
            {gasWeight.toFixed(2)}
            <span className="text-xs md:text-sm font-medium text-gray-400 ml-1">{settings.unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

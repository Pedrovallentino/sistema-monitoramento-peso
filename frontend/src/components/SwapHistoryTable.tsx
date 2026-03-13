import React from 'react';
import { useGasStore } from '../store/useGasStore';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Clock } from 'lucide-react';

export const SwapHistoryTable: React.FC = () => {
  const { history, settings } = useGasStore();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date) 
        ? format(date, "dd 'de' MMM, HH:mm", { locale: ptBR })
        : 'Data inválida';
    } catch (error) {
      return 'Erro na data';
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="p-6 text-center">
        <History className="mx-auto text-gray-400 mb-2" size={32} />
        <p className="text-gray-500 dark:text-gray-400">Nenhum histórico de troca registrado.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Data</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Peso Inicial</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Peso Final (Antigo)</th>
            <th className="px-4 py-3 font-medium whitespace-nowrap">Duração</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {history.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap font-medium">
                {formatDate(record.date)}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {record.initialWeight?.toFixed(2) ?? '0.00'} {settings.unit}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {record.finalWeight?.toFixed(2) ?? '0.00'} {settings.unit}
              </td>
              <td className="px-4 py-3 flex items-center gap-1 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <Clock size={14} />
                {record.durationDays} dias
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

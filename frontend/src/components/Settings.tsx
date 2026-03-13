import React, { useState } from 'react';
import { useGasStore } from '../store/useGasStore';
import { Save, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings, clearHistory } = useGasStore();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: name === 'unit' || name === 'theme' ? value : Number(value)
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    // Could add toast notification here
    alert('Configurações salvas!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Configurações</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peso do Botijão Vazio (Tara)
            </label>
            <input
              type="number"
              name="tareWeight"
              value={localSettings.tareWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Peso do Gás (Líquido)
            </label>
            <input
              type="number"
              name="netWeight"
              value={localSettings.netWeight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidade de Medida
            </label>
            <select
              name="unit"
              value={localSettings.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">Quilogramas (kg)</option>
              <option value="lb">Libras (lb)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intervalo de Atualização (ms)
            </label>
            <input
              type="number"
              name="updateInterval"
              value={localSettings.updateInterval}
              onChange={handleChange}
              step="100"
              min="500"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => {
            if(confirm('Tem certeza que deseja limpar todo o histórico?')) clearHistory();
          }}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <RefreshCw size={18} />
          Resetar Histórico
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          <Save size={18} />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

import axios from 'axios';

// Permite rodar localmente apontando para o backend (ex: `VITE_API_URL=http://localhost:3000/api`).
// Mantém o fallback para o deploy existente para não quebrar ambientes já configurados.
const API_URL = import.meta.env.VITE_API_URL ?? 'https://api-sistema-monitoramento-peso.onrender.com/api';

export interface DeviceStatus {
  weightKg: number;
  lastUpdate: number;
  gasPercentage: number;
  status: string;
  swapCount: number;
  dataSource?: 'simulation' | 'firmware';
}

export const api = {
  getStatus: async (): Promise<DeviceStatus> => {
    const response = await axios.get<DeviceStatus>(`${API_URL}/status`);
    return response.data;
  },
  
  // Placeholder if we ever need to send settings to backend (not requested currently)
};

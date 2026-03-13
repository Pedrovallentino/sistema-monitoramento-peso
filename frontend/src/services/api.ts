import axios from 'axios';

const API_URL = 'https://monitoramento-de-peso-api.onrender.com/api';

export interface DeviceStatus {
  weightKg: number;
  lastUpdate: number;
  gasSwapCount: number;
}

export const api = {
  getStatus: async (): Promise<DeviceStatus> => {
    const response = await axios.get<DeviceStatus>(`${API_URL}/status`);
    return response.data;
  },
  
  // Placeholder if we ever need to send settings to backend (not requested currently)
};

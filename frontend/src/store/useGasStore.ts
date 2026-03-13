import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SwapRecord {
  id: string;
  date: string; // ISO string
  initialWeight: number;
  finalWeight: number;
  durationDays: number;
}

interface Settings {
  tareWeight: number;
  netWeight: number;
  unit: 'kg' | 'lb';
  updateInterval: number; // ms
  theme: 'light' | 'dark';
}

export interface Reading {
  timestamp: number;
  weight: number;
}

interface GasState {
  // Persisted Data
  settings: Settings;
  history: SwapRecord[];
  readings: Reading[]; // Time series data for charts
  lastKnownSwapCount: number;
  lastSwapDate: string; // ISO string
  lastRecordedWeight: number; // To track final weight before swap

  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  addSwapRecord: (record: SwapRecord) => void;
  updateSwapData: (currentCount: number, currentWeight: number) => void;
  clearHistory: () => void;
  addReading: (weight: number) => void;
}

const DEFAULT_SETTINGS: Settings = {
  tareWeight: 15.0, // Common P13 empty weight
  netWeight: 13.0,  // P13 gas weight
  unit: 'kg',
  updateInterval: 2000,
  theme: 'light', // or 'system'
};

export const useGasStore = create<GasState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      history: [],
      readings: [],
      lastKnownSwapCount: -1, // -1 to indicate initialization
      lastSwapDate: new Date().toISOString(),
      lastRecordedWeight: 0,

      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      addSwapRecord: (record) => 
        set((state) => ({ history: [record, ...state.history] })),

      clearHistory: () => set({ history: [], readings: [] }),

      addReading: (weight) => 
        set((state) => {
          const now = Date.now();
          const newReading = { timestamp: now, weight };
          // Keep last 100 readings to avoid bloat
          const updatedReadings = [...state.readings, newReading].slice(-100); 
          return { readings: updatedReadings };
        }),

      updateSwapData: (currentCount, currentWeight) => {
        const state = get();
        
        // Initialize if first run
        if (state.lastKnownSwapCount === -1) {
          set({ 
            lastKnownSwapCount: currentCount, 
            lastRecordedWeight: currentWeight,
            // Don't reset lastSwapDate if it exists? 
            // Actually if it's first run ever, lastSwapDate is Now.
          });
          return;
        }

        // Check for swap
        if (currentCount > state.lastKnownSwapCount) {
          const now = new Date();
          const lastDate = new Date(state.lastSwapDate);
          const durationMs = now.getTime() - lastDate.getTime();
          const durationDays = parseFloat((durationMs / (1000 * 60 * 60 * 24)).toFixed(1));

          const newRecord: SwapRecord = {
            id: crypto.randomUUID(),
            date: now.toISOString(),
            initialWeight: currentWeight, // The weight right now is the new bottle
            finalWeight: state.lastRecordedWeight, // The last weight we saw was the old bottle
            durationDays,
          };

          set((s) => ({
            history: [newRecord, ...s.history],
            lastKnownSwapCount: currentCount,
            lastSwapDate: now.toISOString(),
            lastRecordedWeight: currentWeight,
          }));
        } else {
          // Just update weight
          set({ lastRecordedWeight: currentWeight });
        }
      },
    }),
    {
      name: 'gas-monitor-storage',
    }
  )
);

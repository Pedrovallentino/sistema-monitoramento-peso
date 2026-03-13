import React from 'react';
import { Terminal, Wifi, Activity, Cpu } from 'lucide-react';
import clsx from 'clsx';

interface TechnicalPanelProps {
  rawData: any;
  latencyMs: number;
  isConnected: boolean;
  lastUpdateTimestamp: number;
}

export const TechnicalPanel: React.FC<TechnicalPanelProps> = ({ 
  rawData, 
  latencyMs, 
  isConnected, 
  lastUpdateTimestamp 
}) => {
  return (
    <div className="bg-slate-900 text-slate-200 rounded-xl shadow-lg p-6 font-mono text-sm">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
        <Terminal className="text-green-400" />
        <h3 className="font-bold text-green-400 uppercase tracking-wider">Painel Técnico</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
            <div className="flex items-center gap-2">
              <Wifi size={16} className={isConnected ? "text-green-500" : "text-red-500"} />
              <span>Conectividade</span>
            </div>
            <span className={clsx("font-bold", isConnected ? "text-green-400" : "text-red-400")}>
              {isConnected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <span>Latência API</span>
            </div>
            <span className="font-bold text-blue-400">{latencyMs} ms</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-purple-400" />
              <span>Device ID</span>
            </div>
            <span className="font-bold text-purple-400">
              {rawData?.deviceId || "N/A (Backend Missing)"}
            </span>
          </div>

          <div className="p-3 bg-slate-800 rounded border border-slate-700">
            <span className="text-slate-400 text-xs uppercase block mb-1">Última Atualização (Device)</span>
            <span className="text-white">
              {lastUpdateTimestamp 
                ? new Date(lastUpdateTimestamp * 1000).toLocaleString() 
                : "Nunca"}
            </span>
          </div>
        </div>

        {/* Raw JSON */}
        <div className="flex flex-col h-full">
          <span className="text-slate-400 text-xs uppercase mb-2">Raw JSON Payload</span>
          <div className="bg-black p-4 rounded border border-slate-700 overflow-auto flex-1 max-h-[200px] text-xs">
            <pre className="text-green-500">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

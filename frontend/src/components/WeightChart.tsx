import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGasStore } from '../store/useGasStore';
import { format } from 'date-fns';

export const WeightChart: React.FC = () => {
  const { readings, settings } = useGasStore();

  const data = readings.map(r => ({
    time: r.timestamp,
    weight: r.weight,
    formattedTime: format(new Date(r.timestamp), 'HH:mm:ss')
  }));

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-gray-400">Aguardando dados para gerar gráfico...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10, // Reduced right margin for mobile
            left: -20, // Adjusted left margin to fit y-axis labels
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="formattedTime" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[0, 'auto']} 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            tickLine={false}
            axisLine={false}
            unit={settings.unit}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
            itemStyle={{ color: '#F9FAFB' }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="#0ea5e9" 
            fill="#e0f2fe" 
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

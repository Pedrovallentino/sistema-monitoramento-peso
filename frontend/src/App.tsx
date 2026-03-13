import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { GasStatusCard } from './components/GasStatusCard';
import { SwapHistoryTable } from './components/SwapHistoryTable';
import { WeightChart } from './components/WeightChart';
import { TechnicalPanel } from './components/TechnicalPanel';
import { Settings } from './components/Settings';
import { useGasStore } from './store/useGasStore';
import { api } from './services/api';
import type { DeviceStatus } from './services/api';
import { Menu, WifiOff, Activity, Clock } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(0);
  const { settings, updateSwapData, addReading } = useGasStore();

  useEffect(() => {
    const fetchData = async () => {
      const start = Date.now();
      try {
        const data = await api.getStatus();
        const end = Date.now();
        
        setStatus(data);
        setIsConnected(true);
        setLatency(end - start);
        
        // Update store with new data
        updateSwapData(data.gasSwapCount, data.weightKg);
        addReading(data.weightKg);
        
      } catch (error) {
        console.error("Failed to fetch status", error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchData();

    // Polling
    const interval = setInterval(fetchData, settings.updateInterval);
    return () => clearInterval(interval);
  }, [settings.updateInterval, updateSwapData, addReading]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            {/* Hero Section with Central Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
              
              {/* Center Column: Hero Status Card (Mobile: 1st, Tablet: Full Width or 1st, Desktop: Center) */}
              <div className="order-1 xl:order-2 md:col-span-2 xl:col-span-1 h-full min-h-[350px] md:min-h-[400px]">
                <GasStatusCard currentWeight={status?.weightKg ?? 0} />
              </div>

              {/* Left Column: Quick Stats (Mobile: 2nd, Tablet: 1st row left, Desktop: Left) */}
              <div className="flex flex-col gap-6 order-2 xl:order-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 md:p-6 flex-1 h-full">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                       <Activity size={20} />
                     </div>
                     <h4 className="font-semibold text-gray-700 dark:text-gray-200">Resumo de Consumo</h4>
                  </div>
                  <div className="h-[300px] md:h-[400px] w-full min-h-[300px] md:min-h-[400px]">
                    <WeightChart />
                  </div>
                </div>
              </div>

              {/* Right Column: Activity & Info (Mobile: 3rd, Tablet: 1st row right, Desktop: Right) */}
              <div className="flex flex-col gap-6 order-3 xl:order-3">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 md:p-6 flex-1">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                         <Clock size={20} />
                       </div>
                       <h4 className="font-semibold text-gray-700 dark:text-gray-200">Última Atividade</h4>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <span className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">Trocas Detectadas</span>
                        <span className="font-bold text-xl md:text-2xl text-gray-800 dark:text-white">{status?.gasSwapCount ?? 0}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <span className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">Latência da Rede</span>
                        <span className={`font-bold text-base md:text-lg ${latency < 100 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {latency}ms
                        </span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* History Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
               <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white">Histórico Recente</h3>
               </div>
               <div className="p-4 md:p-6 overflow-x-auto">
                 <SwapHistoryTable />
               </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Histórico Completo</h2>
            <SwapHistoryTable />
          </div>
        );
      case 'charts':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 animate-in slide-in-from-bottom-4 duration-500 h-[500px]">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Análise Detalhada</h2>
            <WeightChart />
          </div>
        );
      case 'technical':
        return (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <TechnicalPanel 
              rawData={status} 
              latencyMs={latency} 
              isConnected={isConnected}
              lastUpdateTimestamp={status?.lastUpdate ?? 0}
            />
          </div>
        );
      case 'settings':
        return (
          <div className="animate-slide-up">
            <Settings />
          </div>
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        {/* Topbar */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 h-16 md:h-20 z-10 sticky top-0 transition-all duration-300 w-full">
          <div className="w-full px-4 md:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 touch-manipulation"
              aria-label="Abrir menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white capitalize tracking-tight truncate max-w-[200px] md:max-w-none">
                {activeTab === 'dashboard' ? 'Painel de Controle' : 
                 activeTab === 'history' ? 'Histórico de Trocas' :
                 activeTab === 'charts' ? 'Gráficos e Análises' :
                 activeTab === 'technical' ? 'Diagnóstico Técnico' : 'Configurações'}
              </h2>
              <p className="text-xs text-gray-500 hidden md:block">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

            <div className="flex items-center gap-3 md:gap-6">
              {!isConnected && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-xs font-bold animate-pulse">
                  <WifiOff size={14} />
                  <span>DESCONECTADO</span>
                </div>
              )}
              {/* Mobile Disconnected Icon */}
              {!isConnected && (
                 <div className="md:hidden p-2 bg-rose-50 text-rose-600 rounded-full animate-pulse">
                    <WifiOff size={18} />
                 </div>
              )}

              <div className="flex items-center gap-2 md:gap-3 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100 dark:border-gray-700">
                <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-sm ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline">
                  {isConnected ? 'Sistema Online' : 'Sistema Offline'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 scroll-smooth w-full">
          <div className="w-full space-y-6 md:space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

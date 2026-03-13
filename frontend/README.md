# SmartGás Monitor Frontend

## Visão Geral

Esta aplicação frontend faz parte de um sistema IoT abrangente para monitoramento remoto de níveis de gás em botijões. Ela serve como um painel web que visualiza dados em tempo real de um dispositivo embarcado via uma API backend. O sistema não coleta dados diretamente do hardware; em vez disso, consome dados processados da API.

A aplicação é construída com React, TypeScript e Tailwind CSS, fornecendo uma interface responsiva e com tema escuro otimizada para interpretação rápida de dados em vários dispositivos.

## Arquitetura do Sistema

O sistema IoT consiste em três camadas principais:

1. **Firmware Embarcado (Raspberry Pi Pico W)**: Mede o peso do botijão usando uma célula de carga, calcula níveis de gás, detecta trocas de botijão e envia telemetria via Wi-Fi.
2. **Servidor Backend (API)**: Recebe e valida telemetria, armazena estado, detecta eventos (ex.: trocas), calcula métricas derivadas (ex.: porcentagem de gás, histórico) e expõe endpoints REST.
3. **Painel Web Frontend**: Exibe dados processados em uma interface amigável, fazendo polling da API para atualizações.

O frontend atua exclusivamente como uma camada de visualização, dependendo totalmente do backend para dados. Ele não se comunica diretamente com o hardware.

### Fluxo de Dados
- O dispositivo embarcado envia atualizações periódicas para o backend.
- O backend processa e armazena dados, expondo-os via `GET /api/status`.
- O frontend faz polling deste endpoint em intervalos configuráveis, atualiza a UI e gerencia estado local para recursos como histórico e gráficos.

### Resposta Esperada da API
```json
{
  "weightKg": number,
  "gasRemainingKg": number,
  "gasPercentage": number,
  "swapCount": number,
  "history": [],
  "lastUpdate": number
}
```
O timestamp `lastUpdate` determina o status online/offline.

## Arquitetura do Frontend

A aplicação segue uma arquitetura baseada em componentes usando hooks do React e Zustand para gerenciamento de estado. Ela enfatiza atualizações em tempo real, design responsivo e acessibilidade.

### Estrutura do Projeto
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── GasStatusCard.tsx    # Exibição principal do nível de gás com medidor
│   │   ├── Settings.tsx         # Painel de configuração do usuário
│   │   ├── Sidebar.tsx          # Menu de navegação
│   │   ├── SwapHistoryTable.tsx # Histórico de trocas de botijão
│   │   ├── TechnicalPanel.tsx   # Informações técnicas/depuração
│   │   └── WeightChart.tsx      # Gráfico de série temporal do peso
│   ├── services/
│   │   └── api.ts               # Cliente API para comunicação com backend
│   ├── store/
│   │   └── useGasStore.ts       # Loja Zustand para estado da app
│   ├── utils/
│   │   └── gasHelpers.ts        # Funções utilitárias para cálculos
│   ├── App.tsx                  # Componente principal da app com roteamento
│   ├── main.tsx                 # Ponto de entrada
│   ├── index.css                # Estilos globais com Tailwind
│   └── style.css                # Estilos adicionais
├── package.json                 # Dependências e scripts
├── vite.config.ts               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind CSS
├── tsconfig.json                # Configuração do TypeScript
└── index.html                   # Template HTML
```

### Componentes Principais

- **[`App.tsx`](src/App.tsx)**: Componente raiz gerenciando abas, barra lateral, polling e renderização de conteúdo. Trata busca de dados via [`api.getStatus`](src/services/api.ts) e atualiza a loja.
- **[`GasStatusCard.tsx`](src/components/GasStatusCard.tsx)**: Exibe nível de gás com um medidor circular, usando [`calculatePercentage`](src/utils/gasHelpers.ts) e [`getStatusColor`](src/utils/gasHelpers.ts).
- **[`WeightChart.tsx`](src/components/WeightChart.tsx)**: Renderiza um gráfico de linha do peso ao longo do tempo usando Recharts, originado de [`readings`](src/store/useGasStore.ts).
- **[`SwapHistoryTable.tsx`](src/components/SwapHistoryTable.tsx)**: Tabela de histórico de trocas, formatada com date-fns.
- **[`TechnicalPanel.tsx`](src/components/TechnicalPanel.tsx)**: Painel de depuração mostrando dados brutos da API, latência e status de conexão.
- **[`Settings.tsx`](src/components/Settings.tsx)**: Formulário para configurar peso de tara, peso líquido, unidades e intervalo de atualização, atualizando [`settings`](src/store/useGasStore.ts).
- **[`Sidebar.tsx`](src/components/Sidebar.tsx)**: Componente de navegação com abas para painel, histórico, gráficos, técnico e configurações.

### Gerenciamento de Estado
- **[`useGasStore.ts`](src/store/useGasStore.ts)**: Loja Zustand com persistência. Gerencia configurações, histórico, leituras e detecção de trocas via [`updateSwapData`](src/store/useGasStore.ts). Inclui ações como [`addReading`](src/store/useGasStore.ts) e [`addSwapRecord`](src/store/useGasStore.ts).

### Utilitários
- **[`gasHelpers.ts`](src/utils/gasHelpers.ts)**: Funções para cálculo de porcentagem, cores de status e texto baseado em níveis de gás.

### Integração com API
- **[`api.ts`](src/services/api.ts)**: Cliente baseado em Axios definindo interface [`DeviceStatus`](src/services/api.ts) e método [`getStatus`](src/services/api.ts).

### Estilização
- Usa Tailwind CSS com cores de marca personalizadas e animações definidas em [`tailwind.config.js`](tailwind.config.js) e [`index.css`](src/index.css).
- Suporte a modo escuro com design responsivo.

## Tecnologias Utilizadas
- **React 19**: Framework de UI com hooks.
- **TypeScript**: Segurança de tipos.
- **Vite**: Ferramenta de build e servidor de desenvolvimento.
- **Tailwind CSS**: Estilização utility-first.
- **Zustand**: Gerenciamento de estado com persistência.
- **Axios**: Cliente HTTP.
- **Recharts**: Biblioteca de gráficos.
- **Lucide React**: Ícones.
- **Date-fns**: Formatação de datas.
- **clsx**: Nomes de classes condicionais.

## Configuração e Instalação

1. Certifique-se de que Node.js e npm estão instalados.
2. Clone o repositório e navegue para o diretório frontend.
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```
5. Construa para produção:
   ```sh
   npm run build
   ```

A app assume que a API backend está rodando em `http://localhost:3000/api/status`. Atualize [`API_URL`](src/services/api.ts) se necessário.

## Uso

- **Painel**: Visualize nível de gás em tempo real, gráfico e histórico recente.
- **Histórico**: Tabela completa de histórico de trocas.
- **Gráficos**: Gráfico detalhado de peso.
- **Técnico**: Informações de depuração e dados brutos.
- **Configurações**: Configure pesos, unidades e intervalo de polling.

Os dados são atualizados automaticamente com base no intervalo configurado. O status offline é indicado quando as chamadas da API falham.

## Contribuição

Este repositório foca na camada de apresentação do frontend. As contribuições devem se alinhar com a arquitetura do sistema, enfatizando usabilidade e desempenho.

## Licença

Não especificada no código fornecido. Consulte as diretrizes do projeto.
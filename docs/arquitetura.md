# Arquitetura do Sistema de Monitoramento de Peso

## 1. Objetivo
Definir a arquitetura real do sistema implementado para monitoramento de peso de botijão, com foco em fluxo de dados, componentes e limitações atuais.

## 2. Escopo
O sistema em produção no repositório contempla:
- Backend HTTP em Node.js/TypeScript com Fastify.
- Frontend web em React/TypeScript.
- Integração com firmware externo por requisições HTTP.

Observação: o código de firmware não está presente neste repositório.

## 3. Visão de Componentes

### 3.1 Backend
Responsabilidades principais:
- Receber telemetria por `POST /api/telemetry`.
- Validar API key e payload.
- Atualizar estado atual em memória.
- Detectar troca de botijão por variação de peso.
- Expor estado atual por `GET /api/status`.

Tecnologias:
- Node.js
- TypeScript
- Fastify
- dotenv

### 3.2 Frontend
Responsabilidades principais:
- Consumir periodicamente `GET /api/status`.
- Exibir peso, percentual calculado localmente e indicadores de operação.
- Manter configurações e histórico local no navegador.

Tecnologias:
- React
- TypeScript
- Vite
- Zustand (persist)
- Axios
- Recharts
- Tailwind CSS

### 3.3 Dispositivo/Firmware (externo ao repositório)
Responsabilidades esperadas:
- Medir peso.
- Enviar `deviceId` e `weightKg` para o backend.

## 4. Fluxos de Execução

### 4.1 Fluxo de escrita (telemetria)
1. Firmware envia `POST /api/telemetry` com `X-API-Key`.
2. Backend valida autenticação e payload.
3. Backend aplica regra de troca de botijão.
4. Backend atualiza estado em memória.

### 4.2 Fluxo de leitura (dashboard)
1. Frontend realiza polling de `GET /api/status`.
2. Backend retorna o estado atual (`weightKg`, `lastUpdate`, `gasSwapCount`).
3. Frontend atualiza UI, histórico local e séries para gráfico.

## 5. Modelo de Dados Principal
Estado retornado em `GET /api/status`:
- `weightKg`: peso atual em quilogramas.
- `lastUpdate`: timestamp Unix em segundos da última atualização.
- `gasSwapCount`: contador de trocas detectadas pelo backend.

Payload aceito em `POST /api/telemetry`:
- `deviceId`: identificador do dispositivo.
- `weightKg`: peso medido em quilogramas.

## 6. Decisões Arquiteturais Relevantes
- Backend sem banco de dados (estado volátil em memória).
- CORS aberto globalmente no backend.
- Autenticação por API key apenas no endpoint de ingestão.
- Cálculo de percentual de gás realizado no frontend, com base em configurações locais.
- Histórico detalhado de trocas mantido no frontend (persistência local do navegador).

## 7. Limitações Atuais
- Reinício do backend zera estado atual e contador de trocas.
- `GET /api/status` não expõe `deviceId`.
- Frontend depende de endpoint configurado no cliente para comunicação.
- Não há suíte de testes automatizados implementada no estado atual do projeto.

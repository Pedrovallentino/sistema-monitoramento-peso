# API de Monitoramento de Peso (Backend Cloud)

Backend desenvolvido em Node.js com TypeScript e Fastify, projetado para atuar como hub central em um sistema de monitoramento de peso IoT. Ele recebe dados de telemetria de dispositivos embarcados (como Raspberry Pi Pico W) via HTTP e expõe o estado atual para clientes frontend.

## 📋 Visão Geral

Este sistema atua como a única fonte de verdade para o monitoramento. Diferente de versões anteriores baseadas em USB, este backend é "cloud-ready" e desacoplado de hardware local.

**Fluxo de Dados:**
1.  **Firmware (Cliente):** Envia dados periodicamente via `POST /api/telemetry`.
2.  **Backend (Hub):** Valida a API Key, processa o payload e atualiza o estado em memória.
3.  **Frontend (Cliente):** Consome o estado atual via `GET /api/status`.

**Características:**
*   **100% HTTP:** Comunicação padronizada para internet.
*   **Segurança:** Autenticação via API Key para ingestão de dados.
*   **Stateless:** Pronto para deploy em plataformas como Render, Railway ou Fly.io.
*   **In-Memory:** Alta performance para dados em tempo real.

## 🚀 Tecnologias

*   Node.js
*   TypeScript
*   Fastify

## 📂 Estrutura do Projeto

```text
backend/
 ├─ src/
 │   ├─ server.ts              # Ponto de entrada (inicia servidor HTTP)
 │   ├─ app.ts                 # Configuração da aplicação Fastify e rotas
 │   ├─ domain/
 │   │   └─ DeviceState.ts     # Modelo de dados (Interface)
 │   ├─ services/
 │   │   └─ telemetry.service.ts # Lógica de atualização de estado
 │   ├─ routes/
 │   │   ├─ status.routes.ts   # Endpoint público de leitura
 │   │   └─ telemetry.routes.ts # Endpoint protegido de escrita
 │   └─ store/
 │       └─ memory.store.ts    # Armazenamento volátil (Singleton)
 ├─ .env                       # Configurações (Porta e API Key)
 ├─ package.json
 └─ tsconfig.json
```

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Porta do Servidor HTTP
PORT=3000

# Chave de Segurança para Telemetria (Defina uma string forte)
API_KEY=MINHA_CHAVE_SECRETA_FORTE
```

## 📦 Instalação

```bash
npm install
```

## ▶️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## � API Endpoints

### 1. Ingestão de Telemetria (Para Firmware)

Recebe atualizações de peso do dispositivo.

*   **URL:** `/api/telemetry`
*   **Método:** `POST`
*   **Headers Obrigatórios:**
    *   `Content-Type: application/json`
    *   `X-API-Key: <Sua API_KEY definida no .env>`
*   **Payload (JSON):**
    ```json
    {
      "deviceId": "pico-w-001",
      "weightKg": 12.45
    }
    ```
*   **Respostas:**
    *   `200 OK`: Sucesso.
    *   `401 Unauthorized`: API Key inválida ou ausente.
    *   `400 Bad Request`: Payload inválido.

### 2. Status Atual (Para Frontend)

Retorna o último peso registrado e o timestamp da atualização.

*   **URL:** `/api/status`
*   **Método:** `GET`
*   **Acesso:** Público (não requer autenticação).
*   **Resposta (JSON):**
    ```json
    {
      "weightKg": 12.45,
      "lastUpdate": 1734350400
    }
    ```

## 🛠️ Exemplo de Uso (cURL)

**Simular envio do Firmware:**
```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -H "X-API-Key: MINHA_CHAVE_SECRETA_FORTE" \
  -d '{"deviceId": "test-dev", "weightKg": 25.5}'
```

**Ler status:**
```bash
curl http://localhost:3000/api/status
```

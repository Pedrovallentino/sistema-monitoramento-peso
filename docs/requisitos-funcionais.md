## Requisitos Funcionais (RF)

**Convenção de dados principais**
O sistema utiliza os seguintes campos como base no status retornado pela API:
`weightKg` (peso em kg), `lastUpdate` (timestamp Unix em segundos) e `gasSwapCount` (contador de trocas).

<a id="rf-01"></a>
### RF01 - Receber telemetria autenticada
O backend deve receber dados de telemetria em `POST /api/telemetry` apenas quando o header `X-API-Key` for válido.

<a id="rf-02"></a>
### RF02 - Validar payload de telemetria
O backend deve validar a presença e tipo de `deviceId` (string) e `weightKg` (number), retornando erro quando inválido.

<a id="rf-03"></a>
### RF03 - Atualizar estado atual do dispositivo
Após telemetria válida, o backend deve atualizar `weightKg` e `lastUpdate` no estado corrente.

<a id="rf-04"></a>
### RF04 - Detectar troca de botijão
O backend deve detectar troca quando houver aumento de peso igual ou superior ao limiar configurado (`GAS_SWAP_THRESHOLD_KG`) entre leituras consecutivas válidas, ignorando a primeira leitura.

<a id="rf-05"></a>
### RF05 - Expor status atual para consumo do frontend
O backend deve disponibilizar `GET /api/status` com os campos `weightKg`, `lastUpdate` e `gasSwapCount`.

<a id="rf-06"></a>
### RF06 - Atualizar dashboard por polling configurável
O frontend deve consultar periodicamente `GET /api/status` com intervalo configurável em settings.

<a id="rf-07"></a>
### RF07 - Calcular e exibir nível de gás no frontend
O frontend deve calcular percentual de gás com base em `tareWeight` e `netWeight` configurados localmente e apresentar indicador visual de nível.

<a id="rf-08"></a>
### RF08 - Manter histórico local e leituras para visualização
O frontend deve manter histórico de trocas e série de leituras em armazenamento local para exibição de tabela e gráficos.

<a id="rf-09"></a>
### RF09 - Exibir painel técnico
O frontend deve exibir informações técnicas de diagnóstico, incluindo conectividade, latência e payload bruto retornado pela API.

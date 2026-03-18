## Casos de Uso

Estrutura dos casos de uso baseada em ator, objetivo, resumo do fluxo e rastreabilidade com requisitos e histórias.

<a id="uc-01"></a>
### UC01 - Enviar telemetria
***Ator:*** Firmware
**Objetivo:** Enviar leituras de peso ao backend com autenticação por API key.
**Resumo do fluxo:** Firmware envia `POST /api/telemetry` com `deviceId` e `weightKg` -> backend valida API key e payload -> backend atualiza estado em memória e aplica regra de troca -> backend retorna confirmação. Em caso de API key inválida, retorna 401. Em caso de payload inválido, retorna 400.
**Observação:** A atualização do estado ocorre apenas para requisições válidas.

**RF Relacionados:** [RF-01](requisitos-funcionais.md#rf-01), [RF-02](requisitos-funcionais.md#rf-02), [RF-03](requisitos-funcionais.md#rf-03), [RF-04](requisitos-funcionais.md#rf-04)
**RNF Relacionados:** [RNF-02](requisitos-nao-funcionais.md#rnf-02), [RNF-03](requisitos-nao-funcionais.md#rnf-03), [RNF-04](requisitos-nao-funcionais.md#rnf-04), [RNF-06](requisitos-nao-funcionais.md#rnf-06)
**Histórias Relacionadas:** [HU-01](historias-de-usuario.md#hu-01), [HU-03](historias-de-usuario.md#hu-03)

<a id="uc-02"></a>
### UC02 - Consultar status atual
***Ator:*** Operador do painel web
**Objetivo:** Obter o estado mais recente do monitoramento no frontend.
**Resumo do fluxo:** Frontend chama `GET /api/status` -> backend retorna `weightKg`, `lastUpdate` e `gasSwapCount` -> frontend atualiza os indicadores da interface. Em falha de comunicação, o frontend sinaliza estado offline.

**RF Relacionados:** [RF-05](requisitos-funcionais.md#rf-05), [RF-06](requisitos-funcionais.md#rf-06)
**RNF Relacionados:** [RNF-01](requisitos-nao-funcionais.md#rnf-01), [RNF-04](requisitos-nao-funcionais.md#rnf-04)
**Histórias Relacionadas:** [HU-02](historias-de-usuario.md#hu-02)

<a id="uc-03"></a>
### UC03 - Acompanhar nível e histórico de consumo
***Ator:*** Operador do painel web
**Objetivo:** Visualizar nível atual de gás e evolução de consumo.
**Resumo do fluxo:** Frontend calcula o nível de gás com base no peso e configurações locais -> atualiza gráfico de leituras -> exibe histórico de trocas derivado de `gasSwapCount` e dados persistidos localmente.
**Observação:** O histórico detalhado é mantido no navegador do usuário.

**RF Relacionados:** [RF-04](requisitos-funcionais.md#rf-04), [RF-07](requisitos-funcionais.md#rf-07), [RF-08](requisitos-funcionais.md#rf-08)
**RNF Relacionados:** [RNF-02](requisitos-nao-funcionais.md#rnf-02), [RNF-05](requisitos-nao-funcionais.md#rnf-05)
**Histórias Relacionadas:** [HU-03](historias-de-usuario.md#hu-03)

<a id="uc-04"></a>
### UC04 - Configurar parâmetros locais do painel
***Ator:*** Operador do painel web
**Objetivo:** Ajustar parâmetros de cálculo e atualização do frontend.
**Resumo do fluxo:** Usuário altera tara, peso líquido, unidade e intervalo de atualização -> frontend salva configurações localmente -> polling e cálculos passam a usar os novos parâmetros.

**RF Relacionados:** [RF-06](requisitos-funcionais.md#rf-06), [RF-07](requisitos-funcionais.md#rf-07)
**RNF Relacionados:** [RNF-05](requisitos-nao-funcionais.md#rnf-05)
**Histórias Relacionadas:** [HU-04](historias-de-usuario.md#hu-04)

<a id="uc-05"></a>
### UC05 - Consultar diagnóstico técnico
***Ator:*** Operador do painel web
**Objetivo:** Verificar sinais operacionais para diagnóstico básico da aplicação.
**Resumo do fluxo:** Usuário acessa aba técnica -> frontend exibe conectividade, latência da API e payload bruto retornado por `GET /api/status`.
**Observação:** O backend não expõe `deviceId` no status atual.

**RF Relacionados:** [RF-09](requisitos-funcionais.md#rf-09), [RF-05](requisitos-funcionais.md#rf-05)
**RNF Relacionados:** [RNF-06](requisitos-nao-funcionais.md#rnf-06)
**Histórias Relacionadas:** [HU-05](historias-de-usuario.md#hu-05)

## Histórias de Usuário - Sistema

---

### Perfil: Firmware

<a id="hu-01"></a>
#### Story HU01
Como dispositivo de medição, devo enviar o peso com autenticação, para que o backend aceite apenas dados autorizados.

Critérios de aceitação:
- Requisição sem API key válida é rejeitada.
- Requisição com payload inválido é rejeitada.
- Requisição válida atualiza o estado atual.

**UC Relacionados:** [UC01](casos-de-uso.md#uc-01)
**RF Relacionados:** [RF-01](requisitos-funcionais.md#rf-01), [RF-02](requisitos-funcionais.md#rf-02), [RF-03](requisitos-funcionais.md#rf-03)
**RNF Relacionados:** [RNF-03](requisitos-nao-funcionais.md#rnf-03), [RNF-04](requisitos-nao-funcionais.md#rnf-04), [RNF-06](requisitos-nao-funcionais.md#rnf-06)

---

### Perfil: Operador do Painel Web

<a id="hu-02"></a>
#### Story HU02
Como operador do painel, devo ver o estado mais recente do botijão, para acompanhar a operação em tempo quase real.

Critérios de aceitação:
- O frontend consulta periodicamente GET /api/status.
- Peso e contador de trocas são atualizados na tela.
- Em falha de comunicação, o painel indica estado offline.

**UC Relacionados:** [UC02](casos-de-uso.md#uc-02)
**RF Relacionados:** [RF-05](requisitos-funcionais.md#rf-05), [RF-06](requisitos-funcionais.md#rf-06), [RF-07](requisitos-funcionais.md#rf-07)
**RNF Relacionados:** [RNF-01](requisitos-nao-funcionais.md#rnf-01), [RNF-05](requisitos-nao-funcionais.md#rnf-05)

<a id="hu-03"></a>
#### Story HU03
Como operador do painel, devo visualizar eventos de troca e histórico, para entender o ciclo de consumo e reposição.

Critérios de aceitação:
- Trocas são detectadas no backend por aumento de peso acima do limiar.
- O contador de trocas é refletido no frontend.
- Histórico e gráfico são mantidos localmente no navegador.

**UC Relacionados:** [UC01](casos-de-uso.md#uc-01), [UC03](casos-de-uso.md#uc-03)
**RF Relacionados:** [RF-04](requisitos-funcionais.md#rf-04), [RF-08](requisitos-funcionais.md#rf-08)
**RNF Relacionados:** [RNF-02](requisitos-nao-funcionais.md#rnf-02), [RNF-06](requisitos-nao-funcionais.md#rnf-06)

<a id="hu-04"></a>
#### Story HU04
Como operador do painel, devo configurar tara, peso líquido e intervalo de atualização, para adaptar a visualização à operação real.

Critérios de aceitação:
- O painel permite alterar parâmetros de configuração.
- As configurações são persistidas localmente.
- Cálculos e frequência de atualização passam a usar os novos parâmetros.

**UC Relacionados:** [UC04](casos-de-uso.md#uc-04)
**RF Relacionados:** [RF-06](requisitos-funcionais.md#rf-06), [RF-07](requisitos-funcionais.md#rf-07)
**RNF Relacionados:** [RNF-05](requisitos-nao-funcionais.md#rnf-05)

---

### Perfil: Operador Técnico

<a id="hu-05"></a>
#### Story HU05
Como operador técnico, devo visualizar latência, conectividade e retorno bruto da API, para identificar rapidamente falhas de comunicação.

Critérios de aceitação:
- A aba técnica exibe status online/offline.
- A aba técnica exibe latência da requisição.
- O payload retornado pela API é apresentado para inspeção.

**UC Relacionados:** [UC05](casos-de-uso.md#uc-05)
**RF Relacionados:** [RF-09](requisitos-funcionais.md#rf-09), [RF-05](requisitos-funcionais.md#rf-05)
**RNF Relacionados:** [RNF-06](requisitos-nao-funcionais.md#rnf-06)

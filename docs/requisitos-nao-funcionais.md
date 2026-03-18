## Requisitos Não Funcionais (RNF)

<a id="rnf-01"></a>
### RNF01 - Desempenho para consulta de status
O sistema deve responder consultas de status de forma adequada para uso com polling frequente no frontend.

<a id="rnf-02"></a>
### RNF02 - Persistência volátil no backend
O estado do backend é mantido apenas em memória durante a execução e pode ser perdido em reinício.

<a id="rnf-03"></a>
### RNF03 - Segurança mínima de ingestão
A ingestão de telemetria deve exigir API key válida.

<a id="rnf-04"></a>
### RNF04 - Interoperabilidade por HTTP/JSON
A comunicação entre firmware, backend e frontend deve usar contratos HTTP e JSON.

<a id="rnf-05"></a>
### RNF05 - Manutenibilidade e consistência de validação
O código deve manter tipagem e validações explícitas para reduzir inconsistências entre payload e estado.

<a id="rnf-06"></a>
### RNF06 - Observabilidade operacional básica
O backend deve manter logs básicos de operação e o frontend deve informar estado de conectividade ao usuário.

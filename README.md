# Sistema de Monitoramento de Gás com Firmware Embarcado, API e Frontend Web

## 1. Visão geral

Este repositório reúne, em um único lugar, todos os componentes necessários para o funcionamento de um sistema de monitoramento de botijão de gás baseado em pesagem contínua. O objetivo do sistema é medir o peso do botijão por meio de hardware embarcado, transmitir essas informações para uma API e disponibilizar os dados em uma interface web para acompanhamento em tempo real.

O sistema é composto por três blocos principais:

1. **Firmware embarcado**, executado em uma Raspberry Pi Pico W, responsável por ler os dados do sensor de peso e enviar telemetria.
2. **Backend**, responsável por receber os dados do firmware, processá-los, aplicar regras de negócio e expor os resultados por meio de uma API HTTP.
3. **Frontend**, responsável por consumir a API e apresentar os dados de maneira clara para o usuário final.

---

## 2. Objetivo do sistema

O projeto foi concebido para monitorar o estado de um botijão de gás a partir do seu peso. A lógica central é simples: como o gás é consumido ao longo do tempo, o peso total do botijão diminui gradualmente. A partir dessa informação, o sistema consegue:

- informar o peso atual do botijão;
- estimar a porcentagem restante de gás;
- exibir o status atual do botijão;
- identificar quando houve troca do botijão;
- contabilizar o número de trocas realizadas;
- disponibilizar essas informações em uma interface web.

O sistema pode ser utilizado tanto em ambiente acadêmico quanto como base para aplicações reais de monitoramento residencial, comercial ou industrial, desde que sejam feitas as devidas adaptações de segurança, persistência e robustez.

---

## 3. Arquitetura geral

A arquitetura adota separação clara de responsabilidades entre hardware, backend e interface web.

### 3.1 Fluxo de funcionamento

O fluxo de funcionamento do sistema ocorre da seguinte forma:

1. O sensor de carga mede o peso do conjunto.
2. O firmware embarcado lê o valor do sensor.
3. O firmware converte a leitura em um valor de peso.
4. O firmware envia esse valor para a API por meio de uma requisição HTTP/HTTPS.
5. O backend recebe a telemetria, valida os dados e aplica regras de negócio.
6. O backend atualiza o estado atual do sistema.
7. O frontend consulta a API periodicamente ou sob demanda.
8. O frontend exibe ao usuário o peso, o percentual restante, o status e os demais indicadores.

### 3.2 Componentes da arquitetura

#### Firmware
Responsável pela aquisição dos dados físicos. É a camada que faz a ponte entre o sensor e a API.

#### Backend
Responsável pelo processamento lógico das informações. Atua como núcleo da aplicação, centralizando regras de negócio e padronizando os dados para consumo externo.

#### Frontend
Responsável pela visualização dos dados. Atua como camada de apresentação, sem acessar diretamente o hardware.

---

## 4. Organização do repositório

A estrutura exata pode variar de acordo com a evolução do projeto, mas conceitualmente o repositório está organizado em três áreas:

```text
/
├── backend/         # API e lógica de negócio
├── frontend/        # Aplicação web
├── firmware/        # Código embarcado da Raspberry Pi Pico W

4.1 Diretório backend

Contém a API responsável por receber telemetria do firmware e fornecer dados ao frontend.

4.2 Diretório frontend

Contém a aplicação web que apresenta o estado do botijão ao usuário.

5. Tecnologias utilizadas
5.1 Firmware embarcado

O firmware foi desenvolvido para a Raspberry Pi Pico W, utilizando linguagem C e o ecossistema oficial do Pico SDK.

Principais tecnologias:

Linguagem C

Raspberry Pi Pico SDK

CMake

Ninja

lwIP

CYW43 driver

mbedTLS (quando usado HTTPS)

HX711 para leitura da célula de carga

Wi-Fi integrado da Pico W

Papel dessas tecnologias

C: oferece controle de baixo nível sobre o hardware e bom desempenho.

Pico SDK: fornece bibliotecas e infraestrutura para programar a Pico W.

CMake + Ninja: utilizados para configuração e compilação do firmware.

lwIP: stack de rede leve usada para conexões TCP/IP.

CYW43: driver responsável pela interface Wi-Fi da Pico W.

mbedTLS: biblioteca criptográfica utilizada quando a comunicação precisa ocorrer via HTTPS/TLS.

HX711: conversor analógico-digital utilizado com células de carga.

5.2 Backend

O backend foi implementado com foco em simplicidade, desempenho e clareza estrutural.

Principais tecnologias:

Node.js

TypeScript

Fastify

dotenv

CORS

armazenamento em memória

JSON como formato de troca de dados

Papel dessas tecnologias

Node.js: ambiente de execução do backend.

TypeScript: fornece tipagem estática e melhora a manutenção do código.

Fastify: framework HTTP leve, rápido e adequado para APIs REST.

dotenv: leitura de variáveis de ambiente.

CORS: permite consumo da API pelo frontend em ambiente de desenvolvimento e produção.

Armazenamento em memória: mantém o estado atual do sistema sem banco de dados persistente.

JSON: formato padrão de envio e retorno de dados entre firmware, backend e frontend.

5.3 Frontend

O frontend foi desenvolvido como uma aplicação web moderna para visualização dos dados do sistema.

Principais tecnologias:

React

TypeScript

Vite

HTML

CSS

bibliotecas de componentes visuais

bibliotecas de gráficos, quando aplicável

Papel dessas tecnologias

React: construção da interface de forma componentizada.

TypeScript: tipagem dos dados recebidos da API.

Vite: ambiente de desenvolvimento e build do frontend.

HTML/CSS: estrutura e estilização da interface.

Bibliotecas visuais: organização de cards, painéis, indicadores e layout.

Bibliotecas de gráficos: exibição visual do consumo e da evolução dos dados.

6. Responsabilidades de cada camada
6.1 Responsabilidades do firmware

O firmware é responsável por:

inicializar o hardware;

configurar os pinos utilizados pelo sensor;

conectar a Raspberry Pi Pico W à rede Wi-Fi;

ler o sensor de peso;

converter a leitura bruta em peso;

montar o payload de telemetria;

enviar os dados à API;

repetir o processo em intervalos regulares.

O firmware não deve conter regras avançadas de apresentação de dados. Seu papel é coletar e transmitir.

6.2 Responsabilidades do backend

O backend é responsável por:

receber os dados enviados pelo firmware;

validar os dados recebidos;

manter o estado atual do sistema;

processar regras de negócio;

detectar troca de botijão;

contabilizar quantidade de trocas;

calcular ou disponibilizar informações derivadas;

expor endpoints para consumo pelo frontend.

O backend é a fonte de verdade lógica do sistema.
Mesmo que o frontend apresente os dados e o firmware faça as leituras, é no backend que o comportamento do sistema deve ser centralizado.

6.3 Responsabilidades do frontend

O frontend é responsável por:

consultar a API;

interpretar os dados retornados;

apresentar peso, percentual, status e trocas;

exibir o estado do sistema de forma amigável;

organizar as informações em uma interface clara;

atualizar periodicamente os dados exibidos.

O frontend não deve assumir regras críticas de negócio que já existam no backend. Sua função principal é apresentação e interação.

7. Comunicação entre os componentes
7.1 Comunicação entre firmware e backend

A comunicação entre firmware e backend ocorre por rede, utilizando requisições HTTP ou HTTPS.

Protocolo utilizado

HTTP em ambiente local ou testes simples;

HTTPS quando a API está publicada em ambiente externo, especialmente em serviços como Render, Vercel, etc.

Direção da comunicação

A comunicação é iniciada pelo firmware.

Firmware  --->  Backend
Tipo de requisição

Normalmente:

método POST

conteúdo em application/json

Exemplo conceitual de payload:

{
  "deviceId": "pico-001",
  "weightKg": 23.54,
  "swapDetected": false
}
Observações importantes

Se a API estiver hospedada externamente, o firmware não deve usar IP local.

Nesse cenário, deve usar o domínio público do serviço.

Quando for usada conexão HTTPS, o firmware precisa suportar TLS.

Em casos de hospedagem em plataformas como Render, a API pode exigir porta 443 para HTTPS.

7.2 Comunicação entre frontend e backend

A comunicação entre frontend e backend também ocorre por HTTP/HTTPS, mas por requisições GET para consulta do estado atual.

Direção da comunicação
Frontend  --->  Backend
Exemplo de endpoint de leitura
GET /api/status

Exemplo conceitual de retorno:

{
  "weightKg": 23.54,
  "gasPercentage": 62,
  "status": "EM_USO",
  "swapCount": 3,
  "lastUpdate": "2026-03-13T14:30:00Z"
}
CORS

Como frontend e backend podem estar em origens diferentes durante desenvolvimento ou produção, é necessário habilitar CORS no backend.

8. Regras de negócio principais
8.1 Peso atual

O peso atual representa a leitura mais recente processada pelo sistema.

8.2 Percentual restante de gás

A porcentagem restante é derivada do peso, de acordo com a lógica adotada para tara e carga útil do botijão.

Essa regra depende de parâmetros definidos no projeto, como:

peso do botijão vazio;

peso total com carga cheia;

faixa válida de operação.

8.3 Status do botijão

O sistema pode classificar o botijão em estados como:

cheio;

em uso;

baixo;

crítico;

trocado.

Esses nomes podem variar de acordo com a implementação do frontend e do backend, mas a ideia é indicar de forma objetiva a condição atual.

8.4 Detecção de troca

A detecção de troca ocorre quando o sistema identifica um comportamento incompatível com consumo gradual, como um salto significativo de peso após um período de esvaziamento.

Essa lógica deve ser implementada preferencialmente no backend.

8.5 Contagem de trocas

Cada troca identificada pelo sistema incrementa um contador, que passa a fazer parte do estado global exposto para o frontend.

9. Comportamento do sistema

O sistema trabalha de forma cíclica e reativa.

No firmware

lê o sensor;

calcula o peso;

envia a telemetria;

aguarda o próximo ciclo.

No backend

recebe o payload;

processa;

atualiza o estado.

No frontend

consulta o backend;

renderiza a interface;

atualiza as informações apresentadas.

Em outras palavras, o sistema é orientado por dois fluxos complementares:

Fluxo de escrita: firmware envia dados para o backend.

Fluxo de leitura: frontend consulta dados do backend.

10. Modos de execução e reprodução do projeto
10.1 Execução local do backend

Para executar o backend localmente, é necessário:

instalar as dependências;

configurar as variáveis de ambiente;

iniciar o servidor.

Exemplo conceitual:

cd backend
npm install
npm run dev

Se houver build de produção:

npm run build
npm start
10.2 Execução local do frontend

Para executar o frontend localmente:

cd frontend
npm install
npm run dev

Depois, acessar a URL local informada pelo Vite no terminal.

10.3 Compilação do firmware

A compilação do firmware depende do ambiente configurado com:

Pico SDK

CMake

Ninja

toolchain ARM

Fluxo conceitual:

mkdir build
cd build
cmake -G Ninja ..
ninja

O resultado esperado é um arquivo .uf2, que deve ser gravado na Raspberry Pi Pico W.

10.4 Gravação do firmware na Pico W

Em geral, o processo consiste em:

conectar a placa em modo de boot;

copiar o arquivo .uf2 gerado para a unidade montada;

reiniciar a placa.

11. Requisitos para reprodução

Para reproduzir o projeto corretamente, é importante compreender que ele possui dependências em três frentes distintas:

11.1 Requisitos de software

Node.js

npm

ambiente de desenvolvimento para frontend

ambiente de desenvolvimento para backend

Pico SDK

CMake

Ninja

compilador ARM compatível

11.2 Requisitos de hardware

Raspberry Pi Pico W

HX711

célula de carga

fonte/alimentação adequada

acesso a rede Wi-Fi

11.3 Requisitos de integração

configuração correta de host da API no firmware;

liberação de CORS no backend;

formato consistente do JSON entre firmware e backend;

contratos de dados consistentes entre backend e frontend.

12. Variáveis de ambiente e configuração
12.1 Backend

O backend utiliza variáveis de ambiente para parametrizar sua execução, como por exemplo:

porta do servidor;

chave de autenticação, se aplicável;

parâmetros auxiliares de execução.

Um arquivo .env costuma ser utilizado para isso.

Exemplo conceitual:

PORT=3000
API_KEY=SUA_CHAVE_SECRETA
12.2 Frontend

O frontend também pode depender de variáveis de ambiente, especialmente para definir a URL base da API.

Exemplo conceitual:

VITE_API_BASE_URL=http://localhost:3000

ou, em produção:

VITE_API_BASE_URL=https://seu-backend.exemplo.com
12.3 Firmware

O firmware normalmente depende de definições em arquivos .h, incluindo:

SSID da rede Wi-Fi;

senha;

host da API;

porta;

endpoint;

token de autenticação, se houver.

13. Ambientes de teste

Ao longo do desenvolvimento, o sistema pode ser testado em dois contextos:

13.1 Ambiente local

backend executando na máquina do desenvolvedor;

frontend executando localmente;

firmware enviando dados para IP local da máquina.

Esse cenário é útil para validações iniciais.

13.2 Ambiente publicado

API implantada em plataforma externa;

frontend podendo ser hospedado separadamente;

firmware enviando dados para domínio público.

Nesse cenário, o uso de HTTPS torna-se relevante e pode exigir configuração adicional no firmware.

14. Sobre HTTPS no firmware

Quando a API está hospedada externamente, especialmente em plataformas públicas, o firmware pode precisar se comunicar com ela usando HTTPS.

Isso acrescenta complexidade ao projeto, pois envolve:

resolução DNS;

handshake TLS;

configuração do mbedTLS;

possível validação de certificado;

maior consumo de memória;

maior sensibilidade a configurações do build.

Para reprodução do projeto, este é um dos pontos mais importantes e mais avançados.
Quem estiver tentando reproduzir o sistema precisa entender que a comunicação do firmware com uma API local por HTTP é muito mais simples do que a comunicação com uma API externa por HTTPS.

15. Limitações atuais do projeto

Dependendo da versão do código, o projeto pode possuir algumas limitações, por exemplo:

ausência de persistência em banco de dados;

estado mantido apenas em memória;

dependência de rede Wi-Fi estável;

necessidade de ajustes finos para HTTPS no firmware;

regras de negócio calibradas para um cenário específico de botijão;

ausência de autenticação robusta entre todos os componentes;

ausência de observabilidade avançada.

Essas limitações não impedem o funcionamento do sistema como prova de conceito ou protótipo, mas precisam ser consideradas em cenários de produção.

16. Possíveis evoluções

O projeto pode evoluir em diversas direções:

persistência histórica em banco de dados;

autenticação mais robusta para o firmware;

envio de alertas automáticos;

dashboards com histórico de consumo;

múltiplos dispositivos por usuário;

gerenciamento remoto de sensores;

calibração automática do sensor;

tolerância a falhas e reconexão;

uso de filas ou processamento assíncrono;

telemetria e observabilidade.

17. O que é mais importante entender para reproduzir o sistema

Para alguém que pretende reproduzir o projeto, os pontos mais importantes são:

17.1 Entender a separação de responsabilidades

o firmware coleta;

o backend processa;

o frontend exibe.

17.2 Entender o contrato de dados

O formato do JSON enviado pelo firmware deve ser aceito pelo backend, e o formato exposto pelo backend deve ser compreendido pelo frontend.

17.3 Entender o ambiente de rede

A configuração muda bastante quando a API está local e quando está publicada na internet.

17.4 Entender o nível de complexidade do firmware

O firmware é a parte mais sensível do sistema, especialmente quando há Wi-Fi e HTTPS.

17.5 Entender as regras de negócio

Sem compreender como o peso é interpretado, não é possível validar corretamente a porcentagem de gás, o status ou a contagem de trocas.

18. Resumo final

Este repositório documenta e centraliza um sistema de monitoramento de gás baseado em três camadas integradas:

Firmware embarcado, para leitura e transmissão de dados físicos;

Backend, para processamento de regras de negócio e exposição de API;

Frontend, para visualização das informações.

A proposta do projeto é oferecer uma arquitetura clara e reproduzível, em que cada parte do sistema tenha função bem definida e em que o fluxo de dados possa ser compreendido do hardware até a interface final.

A reprodução do projeto exige atenção especial à configuração do ambiente de desenvolvimento, à comunicação entre os componentes e, principalmente, à integração entre firmware e API quando a comunicação ocorre por rede externa com HTTPS.
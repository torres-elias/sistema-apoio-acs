# authController

## Visão geral

`authController` é a camada de orquestração entre a UI (ou `AuthContext`) e o `authService` que fala com o Firebase. Sua função principal é:

- Invocar as operações puras de autenticação (`login`, `logout`) do `authService`.
- Traduzir erros para mensagens amigáveis usando `translateError`.
- Normalizar as respostas e propagar erros em um formato consistente para os consumidores.

## Localização

- Código: `src/controllers/authController.js`
- Testes: `src/controllers/tests/authController.test.js`

## API

- `login(email: string, password: string): Promise<User>`
  - Tenta autenticar e retorna o `user` do Firebase em caso de sucesso.
  - Em caso de falha, lança um `Error` com mensagem traduzida (via `translateError`) e `code` anexado.

- `logout(): Promise<void>`
  - Executa a operação de sign-out no `authService`.
  - Em caso de falha, lança um `Error` com mensagem traduzida e `code` anexado.

## Por que usar um controller?

- Separação de responsabilidades: o `authService` se preocupa em falar com Firebase; o `authController` trata casos de uso e tradução de erros.
- Testabilidade: facilita mockar o `authService` nos testes de unidade do controller.
- Reutilização: vários consumidores (ex.: `AuthContext`, CLI, scripts) podem chamar o controller sem precisar conhecer detalhes do serviço.

## Testes

- Os testes de unidade estão em `src/controllers/tests/authController.test.js`.
- Eles mockam `src/services/authService.js` para simular sucesso/falha e validam comportamento do controller.

## Como rodar os testes (local)

1. Instale dependências:

```bash
npm install
```

2. Rode os testes em modo watch:

```bash
npm run test:watch
```

3. Rodar os testes uma vez (CI):

```bash
npm run test:run
```

## Como rodar os testes com Docker Compose

O repositório inclui um `docker-compose.yml` que instala dependências e executa os testes numa imagem `node:18`:

```bash
docker-compose run --rm tests
```

Isso executa os testes dentro do container e imprime os resultados no terminal.

## Notas

- `authController` não faz caching nem mantém estado. O estado de sessão deve ser observado por `AuthContext` (que usa `onAuthStateChanged`).
- Se precisar de comportamento adicional (p.ex. retry, logging centralizado), o controller é o lugar apropriado.

# AuthContext

## Visão geral

`AuthContext` é um provedor React que centraliza o estado de autenticação do aplicativo (usuário autenticado, estado de inicialização) e fornece ações para realizar login e logout. Ele utiliza o Firebase Authentication via `onAuthStateChanged` para manter o estado `user` sincronizado.

## Localização

- Implementação: `src/contexts/AuthContext.js`
- Documentação: `src/contexts/docs/AuthContext.md`

## Objetivos

- Isolar lógica de autenticação do restante da UI.
- Fornecer uma API simples (`useAuth()`) para componentes consumirem: `user`, `initializing`, `signIn`, `signOut`.
- Delegar chamadas concretas ao `authController` / `authService` (separação de responsabilidades).

## API pública

- `AuthProvider({ children })` — componente que deve envolver toda a árvore de navegação/app.
  - Ex.:
    ```jsx
    <AuthProvider>
      <App />
    </AuthProvider>
    ```

- `useAuth()` — hook que retorna o contexto com as chaves:
  - `user` (object | null): objeto do Firebase User quando autenticado; `null` caso contrário.
  - `initializing` (boolean): true enquanto o listener de autenticação inicializa (útil para mostrar carregamento inicial).
  - `signIn(email: string, password: string): Promise` — tenta autenticar o usuário. Erros são propagados (o controller já traduz mensagens onde aplicável).
  - `signOut(): Promise` — desloga o usuário.

## Comportamento e ciclo de vida

- Ao montar, `AuthProvider` se inscreve em `onAuthStateChanged(auth, callback)`:
  - `callback(user)` é chamado sempre que o estado de autenticação muda (login, logout, token refresh).
  - O estado local `user` é atualizado com o valor recebido do Firebase.
  - `initializing` é usado para sinalizar que a primeira resposta ainda não chegou — geralmente usado para mostrar um splash/loading enquanto a biblioteca de autenticação restaura a sessão.

- `signIn` e `signOut` não atualizam `user` diretamente; eles apenas acionam as operações correspondentes. O listener do Firebase (via `onAuthStateChanged`) é responsável por refletir a mudança no estado do contexto. Isso evita condições de corrida e mantém uma única fonte de verdade.

## Integração com navegação

- No `App.js`, envolva a aplicação com `AuthProvider` e decida qual stack renderizar com base em `user`/`initializing`:
  - Se `initializing` for `true`, mostrar um `ActivityIndicator` ou tela de splash.
  - Se `user` for não nulo, renderizar a stack principal (`Main`).
  - Caso contrário, renderizar a stack de autenticação (`Login`).

## Erros e mensagens

- O `AuthContext` delega a tradução de erros para o `authController` / `authService`. Quando `signIn` ou `signOut` rejeitam, o componente consumidor deve capturar o erro e apresentar uma mensagem amigável ao usuário (por exemplo, via `Alert`).

## Exemplo de uso

```jsx
import React from 'react';
import { Button, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <>
      <Text>{user?.email}</Text>
      <Button title="Sair" onPress={() => signOut()} />
    </>
  );
}
```

## Notas de implementação

- A implementação atual usa `authController` para encapsular chamadas ao serviço Firebase e traduzir erros via `translateError`.
- Mantemos `onAuthStateChanged` como fonte de verdade para o estado `user`. Essa abordagem garante que mudanças externas (por exemplo, renovação de token) também sejam refletidas automaticamente.

## Testes sugeridos

- Testar fluxo completo de login -> verificação de `user` no contexto -> renderização da stack `Main`.
- Testar logout -> `user` passa a `null` -> renderização da stack de login.
- Testar comportamento em inicialização com sessão válida e inválida (simular `initializing`).

## Considerações futuras

- Adicionar funções auxiliares para refresh de token ou atualização de perfil via `authController`.
- Expor papel/permissões e métodos de autorização (por exemplo `hasRole()`) se o app precisar de controle de acesso mais fino.

***
Documento gerado automaticamente. Atualize conforme específico do projeto.

---
title: "DOCUMENTO DE REQUISITOS"
---

## **1. Visão Geral** {#visão-geral}

O sistema visa digitalizar o trabalho de campo dos Agentes Comunitários de Saúde, permitindo o gerenciamento eficiente de famílias, indivíduos e indicadores de saúde em suas respectivas microáreas.

## **2. Requisitos Funcionais (RF)** {#requisitos-funcionais-rf}

### **2.1 Gestão de Acessos e Usuários** {#gestão-de-acessos-e-usuários}

- **RF-01 (Cadastro de ACS):** O sistema deve permitir que administradores cadastrem novos agentes.

  - **Campos:** Nome Completo, CPF (com máscara e validação de dígito verificador), E-mail e Senha.

  - **Regra de Senha:** Mínimo de 8 caracteres, incluindo ao menos uma letra e um número.

- **RF-02 (Autenticação):** O sistema deve autenticar o ACS via e-mail e senha.

  - **Persistência:** A sessão deve utilizar tokens (ex: JWT) para manter o usuário logado entre aberturas do app até que o logout seja solicitado.

  - **Segurança:** Bloqueio temporário após 5 tentativas mal-sucedidas.

### **2.2 Gestão de Territorialização (Famílias)** {#gestão-de-territorialização-famílias}

- **RF-03 (Cadastro de Família):** Registro do núcleo familiar e domiciliar.

  - **Dados Obrigatórios:** Logradouro, Número, Bairro, CEP (integração com API de busca de CEP recomendada).

  - **Atributos:** Tipo de moradia (Alvenaria, Madeira, Taipa, etc.) e identificação do Responsável Familiar (vínculo com RF-04).

- **RF-04 (Edição de Domicílio):** Permite a atualização de qualquer campo do endereço ou tipologia de moradia.

### **2.3 Gestão de Indivíduos** {#gestão-de-indivíduos}

- **RF-05 (Cadastro de Membro):** Vinculação de pessoas a uma família existente.

  - **Dados Obrigatórios:** Nome, CPF, Data de Nascimento e Sexo Biológico.

  - **Perfil Epidemiológico:** Checkbox para marcação de condições crônicas:

    - Hipertensão Arterial

    - Diabetes Mellitus

    - Deficiências (Física, Auditiva, Visual, Intelectual)

    - Gestante (se aplicável)

    - Tabagista

- **RF-06 (Vínculo Familiar):** O sistema não deve permitir o cadastro de um indivíduo sem que este esteja associado a um código de família ou endereço.

### **2.4 Recuperação e Manutenção de Dados** {#recuperação-e-manutenção-de-dados}

- **RF-07 (Busca Dinâmica):** Filtro global que processa:

  - Texto livre (Nome ou Endereço).

  - Filtros facetados (Ex: listar apenas \"Diabéticos\" na \"Rua X\").

- **RF-08 (Histórico de Alterações):** O sistema deve registrar um log interno de quem alterou o dado e em qual data/hora (Audit Log), garantindo a integridade da informação.

## **3. Requisitos Não Funcionais (RNF)** {#requisitos-não-funcionais-rnf}

| **Categoria**   | **Requisito**                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------|
| **Usabilidade** | Interface com alto contraste e fontes legíveis para uso em ambiente externo (sob sol).              |
| **Desempenho**  | O tempo de carregamento da listagem de famílias não deve exceder 2 segundos.                        |
| **Segurança**   | Criptografia de dados sensíveis (CPF e diagnósticos) em trânsito e em repouso (LGPD).               |
| **Plataforma**  | Compatibilidade com Android 8.0+ e iOS 14+.                                                         |
| **Offline**     | (Recomendado) Capacidade de salvar cadastros localmente (SQLite) e sincronizar ao detectar conexão. |

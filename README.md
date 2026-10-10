# 📋 Controle de Vagas

Aplicação web para gerenciamento e acompanhamento de candidaturas a vagas de emprego.

O **Controle de Vagas** permite cadastrar oportunidades, acompanhar o status de cada candidatura, registrar informações importantes e visualizar indicadores através de um dashboard.

O projeto foi desenvolvido com foco em **organização, segurança, responsividade e experiência de uso**, utilizando autenticação e banco de dados em nuvem.

---

## 🚀 Demonstração

> [Teste o App](https://controle-vagas-n7qi.onrender.com/)

---

## 📌 Sobre o projeto

Durante uma busca por oportunidades, é comum ter vagas salvas em diferentes plataformas, e-mails, planilhas e anotações.

Este projeto surgiu como uma solução para centralizar essas informações em um único lugar.

Com o sistema é possível:

- Criar uma conta de usuário.
- Fazer login e logout.
- Cadastrar novas vagas.
- Editar vagas existentes.
- Excluir vagas.
- Pesquisar vagas por empresa ou cargo.
- Filtrar vagas por status.
- Registrar a data da candidatura.
- Registrar modalidade de trabalho.
- Registrar localização.
- Registrar faixa salarial.
- Armazenar o link da oportunidade.
- Adicionar observações.
- Acompanhar o andamento dos processos seletivos.
- Visualizar estatísticas no dashboard.

---

## ✨ Funcionalidades

### 🔐 Autenticação

O sistema utiliza o Supabase Auth para gerenciamento dos usuários.

- Cadastro de usuário.
- Login.
- Logout.
- Proteção das rotas privadas.
- Recuperação da sessão através de cookies.
- Redirecionamento para login quando o usuário não está autenticado.

### 💼 Gerenciamento de vagas

Cada usuário possui suas próprias vagas.

É possível cadastrar:

| Campo | Descrição |
|---|---|
| Empresa | Nome da empresa |
| Cargo | Nome da posição |
| Modalidade | Remoto, híbrido ou presencial |
| Localização | Cidade, estado ou localização da vaga |
| Salário | Faixa salarial ou valor informado |
| Link | URL da oportunidade |
| Status | Situação atual da candidatura |
| Data da candidatura | Data em que a candidatura foi realizada |
| Observações | Anotações adicionais |

### 📊 Dashboard

O dashboard apresenta indicadores sobre as candidaturas cadastradas.

Atualmente são utilizados:

- Total de vagas.
- Vagas em que houve candidatura.
- Processos seletivos.
- Entrevistas.
- Distribuição das vagas por status.
- Distribuição por modalidade.
- Evolução mensal das candidaturas.

Os gráficos são construídos utilizando **Recharts**.

### 🔎 Pesquisa e filtros

A página de vagas permite:

- Pesquisar por empresa.
- Pesquisar por cargo.
- Filtrar por status.
- Visualizar informações importantes diretamente nos cartões.

### 📱 Interface responsiva

A interface foi desenvolvida para funcionar em:

- Desktop.
- Notebook.
- Tablet.
- Smartphone.

O menu lateral se adapta para dispositivos menores e pode ser aberto através do menu móvel.

---

## 🛠️ Tecnologias utilizadas

### Front-end

- **Next.js 16**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **Recharts**

### Back-end / infraestrutura

- **Supabase**
  - PostgreSQL
  - Supabase Auth
  - Row Level Security (RLS)

### Deploy

- **Render**
- **Supabase**

---

## 🏗️ Arquitetura

O projeto utiliza o **App Router do Next.js**.

Estrutura simplificada:

```text
controle-vagas/
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │
│   │   ├── cadastro/
│   │   │
│   │   ├── dashboard/
│   │   │
│   │   ├── login/
│   │   │
│   │   └── vagas/
│   │       ├── nova/
│   │       └── [id]/
│   │           └── editar/
│   │
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── DashboardGraficos.tsx
│   │   ├── ExcluirVagaButton.tsx
│   │   ├── FormularioEditarVaga.tsx
│   │   ├── FormularioNovaVaga.tsx
│   │   ├── Header.tsx
│   │   ├── ListaVagas.tsx
│   │   └── Sidebar.tsx
│   │
│   └── utils/
│       └── supabase/
│           ├── client.ts
│           ├── middleware.ts
│           ├── proteger-rota.ts
│           └── server.ts
│
├── middleware.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL através do Supabase.

A principal tabela é:

```text
vagas
```

### Estrutura

```text
id
user_id
empresa
cargo
descricao
localizacao
modalidade
salario
url
data_candidatura
status
observacoes
created_at
updated_at
```

### Status disponíveis

```text
SALVA
CANDIDATEI
PROCESSO
ENTREVISTA
APROVADO
REJEITADO
```

---

## 🔒 Segurança

A aplicação utiliza **Row Level Security (RLS)** do PostgreSQL/Supabase.

Cada vaga está vinculada ao usuário que a criou através do campo:

```text
user_id
```

As políticas de segurança garantem que um usuário autenticado somente consiga:

- visualizar suas próprias vagas;
- inserir vagas para sua própria conta;
- editar suas próprias vagas;
- excluir suas próprias vagas.

O `user_id` não precisa ser enviado manualmente pelo formulário. O banco utiliza o usuário autenticado para preencher esse campo.

---

## 🔑 Variáveis de ambiente

Crie um arquivo:

```text
.env.local
```

com as variáveis necessárias para o Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

> ⚠️ Nunca envie arquivos `.env.local` para o GitHub.

Adicione ao `.gitignore`:

```text
.env*
```

---

## 💻 Instalação local

### 1. Clone o repositório

```bash
git clone https://github.com/VitorFoppa/controle-vagas.git
```

Entre na pasta:

```bash
cd controle-vagas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie:

```text
.env.local
```

e informe as credenciais do seu projeto Supabase.

### 4. Execute o projeto

```bash
npm run dev
```

O projeto ficará disponível em:

```text
http://localhost:3000
```

---

## 🧪 Desenvolvimento

Para verificar possíveis problemas antes do deploy:

```bash
npm run lint
```

E para gerar a versão de produção:

```bash
npm run build
```

Para executar a versão de produção localmente:

```bash
npm start
```

---


## 🎯 Objetivo do projeto

Além de ser uma ferramenta pessoal para organização de candidaturas, este projeto foi desenvolvido como **projeto de portfólio**, colocando em prática conceitos de desenvolvimento web moderno, incluindo:

- Desenvolvimento com React e Next.js.
- TypeScript.
- Componentização.
- App Router.
- Autenticação.
- Controle de acesso.
- PostgreSQL.
- Row Level Security.
- Integração com APIs/BaaS.
- Responsividade.
- Gerenciamento de estado no cliente.
- Construção de dashboards.
- Deploy de aplicações web.

---

## 👨‍💻 Autor

**Vitor Foppa**

Desenvolvedor em formação, com foco em **Java, backend, aplicações web e soluções relacionadas ao agronegócio**.

### Tecnologias e interesses

```text
Java
Spring Boot
Next.js
React
TypeScript
JavaScript
PostgreSQL
Supabase
Docker
Git
Cloud
```

---

## 📄 Licença

Este projeto está disponível para fins de estudo e portfólio.

Consulte o arquivo `LICENSE` para obter informações sobre os termos de utilização.
```


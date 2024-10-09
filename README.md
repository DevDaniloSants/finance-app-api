# FinanceApp - Backend

![FinanceApp](https://img.freepik.com/free-vector/back-end-typographic-header-software-development-process-website-interface-design-improvement-programming-coding-it-profession-isolated-flat-vector-illustration_613284-210.jpg?t=st=1728516105~exp=1728519705~hmac=5a2b78841e320257e84768acf7166fb39b257911871fd1781117f2f8d633eb8c&w=1480)

**FinanceApp Backend** é a API que alimenta a aplicação de gerenciamento financeiro. Desenvolvido com um foco em escalabilidade e eficiência, este backend permite que os usuários gerenciem suas transações financeiras de forma segura e eficaz.

## 🚀 Principais Funcionalidades

- **Gestão de Usuários**: Permite a criação e gerenciamento de usuários, com informações seguras.
- **Gestão de Transações**: CRUD (Criar, Ler, Atualizar, Deletar) de transações financeiras com categorização por tipo (receita, despesa, investimento).
- **API RESTful**: Fornece endpoints para integração fácil com o frontend e outros serviços.
- **Validação de Dados**: Utiliza a biblioteca Zod para validação de dados de entrada, garantindo a integridade das informações.

## ⚙️ Arquitetura

O **FinanceApp Backend** foi construído utilizando a **Clean Architecture**, que separa as responsabilidades em camadas distintas:

- **Controller**: Recebe as requisições, trata os erros, e retorna as respostas.
- **Use Case**: Implementa as regras de negócio. Por exemplo, o caso de uso `CreateUserUseCase` lida com a criação de usuários e a validação de e-mails.
- **Repository**: Faz a interação com o banco de dados para armazenar e recuperar dados.

## ⚙️ Tecnologias Utilizadas

- **Node.js**: Plataforma para executar o backend.
- **Express.js**: Framework para criação de APIs.
- **PostgreSQL**: Banco de dados relacional.
- **Prisma**: ORM para facilitar as interações com o banco de dados.
- **Zod**: Biblioteca para validação de esquemas de dados.
- **Jest**: Framework de testes para garantir a qualidade do código.
- **Docker**: Para containerização e facilitar o ambiente de desenvolvimento.
- **GitHub Actions**: Para automação de CI/CD.

## 🔧 Como Configurar o Backend

Siga os passos abaixo para configurar o backend do **FinanceApp** em sua máquina local:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DevDaniloSants/finance-app-api.git

2. **Instale as dependências**
   ```bash
   npm install

3. **Configure suas variáveis de ambiente*

  Crie um arquivo .env na raiz do projeto e adicione suas configurações de acordo com o arquivo `.env.example`

4. **Inicie o banco de dados**
   ```bash
   docker compose up -d

5. **Execute as migrações**
   ```bash
   npx prisma migrate dev

5. **Inicie a aplicação**
   ```bash
   npm start

## 🧪 Executando os Testes

Para rodar os testes automatizados, utilize o seguinte comando:
   ```bash
   npm test
````


## Scripts Disponíveis
O projeto inclui os seguintes scripts para facilitar o desenvolvimento e a manutenção:

`test`: Executa os testes utilizando Jest.

`test:watch`: Executa os testes em modo de observação.

`test:coverage`: Executa os testes e gera um relatório de cobertura.

`postinstall`: Inicializa o Husky e gera o cliente Prisma.

`prepare`: Prepara o Husky para hooks de commit.

`start:dev`: Inicia o servidor em modo de desenvolvimento.

`start`: Inicia o servidor.

`eslint:check`: Executa a verificação de estilo de código com ESLint.

`prettier:check`: Verifica o estilo de código com Prettier.

# Configurando e executando o projeto
Abaixo estão as instruções para configurar e executar o projeto localmente.

## Configurando variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto as seguintes variáveis de ambiente. 

O arquivo .env.example já está presente no repositório como exemplo.

Não há valores específicos para as variáveis de ambiente, então você deve definir os valores desejados para o seu ambiente. 

Atente-se para não deixar nenhuma variável vazia, pois isso pode causar problemas na execução do projeto.

### ADMIN_EMAIL e ADMIN_PASSWORD
Atente-se aos valores de ADMIN_EMAIL e ADMIN_PASSWORD, eles serão os valores que deverão ser utilizados para se autenticar como admin e acessar as rotas relacionadas a user.


## Iniciando dependencias

Na raiz do projeto, execute o seguinte comando para iniciar as dependências:

```bash
docker-compose up --build
```

## Executando as migrations
Após iniciar as dependências, você precisará executar as migrations para criar as tabelas necessárias no banco de dados.
Para executar as migrations, utilize o seguinte comando na raiz do projeto:

```bash
npm run migrate
```

## Executando o projeto
Após iniciar as dependências e executar as migrations, você já pode acessar o projeto em `http://localhost:3002`.

Se preferir executar o projeto em modo de desenvolvimento, utilize o seguinte comando na raiz do projeto:
```bash
npm run dev
```

Caso esteja usando o Visual Studio Code, você pode usar o debugger para executar o projeto em modo de desenvolvimento (Launch product-ll-api).

## Documentação da API (Swagger)
A documentação da API está disponível em `http://localhost:3002/api-docs` (ou na porta que você configurou no arquivo `.env`).

## Collection do Postman
A collection do Postman está disponível na pasta `.postman` do repositório.
Você pode importar a collection no Postman para facilitar os testes das rotas da API.

# Informações uteis
Abaixo estão algumas informações úteis para o entendimento do projeto.

## Criando um novo usuário
Para criar um novo usuário, é necessário ter um token de autenticação válido de um usuário admin.
Para obter o token, você deve utilizar a rota `/auth/login`, passando as credenciais do usuário admin que você definiu nas variáveis de ambiente.

## Recursos relacionados aos produtos favoritos
Os recursos relacionados aos produtos favoritos estão disponíveis nas rotas `/favorites` e utiliza o token de autenticação do usuário que está logado para relacionar os produtos favoritos ao usuário. Então, caso seja passado o token do usuário de id 1, serão listados os produtos favoritos do usuário de id 1.

# Próximos passos

### Maior cobertura de testes
### RefreshToken
### Rota para invalidar cache
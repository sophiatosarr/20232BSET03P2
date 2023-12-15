# 20232BSET03P2 
Inteli - Engenharia de Software | Avaliação 2023-2B P2

# Vulnerabilidades encontradas

### 1. **SQL Injection:**
   - Vulnerabilidade: As consultas SQL estão sendo construídas concatenando diretamente os valores fornecidos pelos usuários (`${name}`, `${animalType}`, `${id}`). Isso deixa o sistema vulnerável a ataques de SQL Injection, onde um invasor pode manipular as entradas para executar comandos maliciosos no banco de dados.
 

### 2. **Tratamento de Rotas:**
   - Funcionalidade ausente: A rota `POST /dogs` está vazia, não implementando nenhuma lógica. Isso pode causar um comportamento inesperado ou não desejado quando a rota é acessada.

### 3. **Falta de Verificação de Existência de Registro:**
   - No endpoint `POST /vote/:animalType/:id`, não há verificação se o registro com o ID fornecido existe antes de adicionar um voto. Isso pode resultar em operações de voto em registros que não existem.

### 4. **Exposição de Detalhes Internos:**
   - No tratamento de erros (`app.use`), a mensagem "Ocorreu um erro!" pode expor detalhes internos do sistema, o que não é ideal para produção. Mensagens mais genéricas devem ser enviadas para evitar vazamento de informações sensíveis.

### 5. **Ausência de Rota GET para /dogs:**
   - A rota `GET /dogs` foi definida, mas não foi implementada, o que significa que não será possível obter a lista de cães através dessa rota.

#Solução

### 1. **Prevenção de SQL Injection:**
- **Como foi corrigido:** As consultas SQL agora utilizam prepared statements, onde os valores são passados como parâmetros na consulta, em vez de serem diretamente concatenados na string SQL. Por exemplo, na inserção de gatos e cães (`INSERT INTO cats` e `INSERT INTO dogs`), os valores são passados como um array de parâmetros na função `db.run`.

### 2. **Verificação de Existência de Registro**
- **Como foi corrigido:** Antes de executar a atualização de votos no endpoint `POST /vote/:animalType/:id`, uma consulta é feita para contar o número de registros com o ID fornecido na tabela correspondente (`cats` ou `dogs`). Se nenhum registro for encontrado, é retornada uma resposta com status 404, indicando que o registro não foi encontrado.

### 3. **Tratamento de Erros Adequado:**
- **Como foi corrigido:** Foi adicionado um middleware de erro para capturar exceções não tratadas. Se ocorrer um erro durante as consultas ao banco de dados, ele será capturado e uma mensagem genérica de erro será enviada para o cliente, sem expor detalhes sensíveis da implementação.

### 4. **Implementação da Rota GET /dogs:**
- **Como foi corrigido:** Antes, a rota `GET /dogs` estava vazia. Agora, ela executa uma consulta no banco de dados para obter todos os registros da tabela `dogs` e envia a resposta com os dados obtidos.

Essas correções visam melhorar a segurança e a funcionalidade do sistema, garantindo que as consultas ao banco de dados sejam seguras contra injeção de SQL, verificando a existência de registros antes de realizar operações e tratando adequadamente possíveis erros que possam ocorrer durante a execução do servidor.
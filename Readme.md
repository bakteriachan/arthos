# Serviço de Autorização

## Funções Principais
- Registrar usuários
    > Utilizando um banco de dados, onde a senha será armazenada criptografada (hash).
- Autorizar usuários
    > O usuário envia seu (e-mail, senha) e o serviço valida esses dados comparando-os com o banco de dados, respondendo com um JWT.
- Validar Tokens
    > O usuário envia o token previamente enviado para validação.

### Documentacao
[Flow.md](Flow.md)

### Hash da Senha
Não é possível armazenar os dados dois usuários quaisquer no banco de dados, pois em caso de bazamento de dados, qualquer pessoa teria acesso a informações sensíveis sobre o usuário. Portanto, os dados primeiro passam por uma função.

```
senha = F(senha)
```
A função selecionada deve ser forte o suficiente para que não seja possível saber qual era a senha original. Existem diversos pacotes que garantem isso, como o bcrypt, por exemplo.

### JWT (JSON Web Token)
Um JWT é uma string de texto criptografada que contém o algoritmo usado para criptografia, os dados que estão sendo criptografados e um hash da chave usada para assiná-lo, para validar se o token foi criado por uma entidade confiável (nós). Tem o formato: `<algoritmo>.<dados>.<hash-da-chave>`. Para mais informações: [jwt.io](https://jwt.io)
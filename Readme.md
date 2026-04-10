# Authorization Service

## Funcoes Principais
- Registrar usuarios
    > Usando una base de datos, donde la senha sera guardada hasheada
- Autorizar usuarios
    > El usuario envia su (email, senha) y el servicio valida estos datos contra la base de datos, respondiendo con un JWT
- Validar Tokens
    > El usuario envia el token previamente enviado para validacion.

### Hash de senha
A senha dos usuarios nao pode ser armazeada en plano no banco de dados, porque em caso de vazamento de dados tudo mundo tera aceso a informacao delicada sobre o usuario, por isso as senhas primeiramente seran passadas por uma funcao.
```
senha = F(senha)
```
A funcao escolhida deve ser forte para assim nao saber qual era a senha original. Ja tem various pacotes que gerenciam que isso se cumpra, bcrypt por exemplo

### JWT (Json Web Token)
O JWT e uma cadena de texto encriptada que
contiene el algoritmo con el que se esta
encriptando, los datos que se encriptan, y un
hash de la llave con que se firmo, para validar
que el token fue creado por una entidad confiable
(nosotros mismos). Es de la forma
\<algoritmo\>.\<dados\>.\<hash-da-chave\>. Para
mas informacion [jwt.io](https://jwt.io)

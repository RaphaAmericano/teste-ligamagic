# Teste Ligamagic

### Variável de ambiente
Para configurar a aplicação, renomeie o arquivo `.env.example` dentro da basta **backend** para `.env`.
O arquivo precisa ter a variável `JWT_SECRET` preenchida com uma string. As outras váriaveis já estão preenchidas mas podem ser alteradas seguindo o padrão. O arquivo deve ficar semelhante a isso:
``` 
DB_HOST=db
DB_USER=user
DB_PASS=password
DB_NAME=ligamagic
JWT_SECRET=minhapalavrasecreta
```
### Iniciando o ambiente
Para iniciar o ambiente, é preciso utilizar o Docker. Execute o na linha de comando:
```
docker compose up -d
```
Em seguida, ao acessar `localhost` pelo navegador, irá abrir a página inicial da aplicação.
O banco é iniciado totalmente limpo, sem usuários cadastrados. Porém o cadastro é simples, apenas email e password, sem nenhum tipo de validação extra, como código enviado por email.  


## Decisões de UX
Procurei deixar a usabilidade do site mais parecida possível com a de outras aplicações da web, para que seja familiar ao usuário e assim ele consiga localizar com facilidade as funcionalidades.
Utilizei as cores dos botões para destacar os locais de ação, contrastando com aparência da plataforma que é em escala de cinza. 
Para informar o usuário com alertas e resultados das operações, utilizei um modal padrão de informes. Já para a operação de excluir carta, utilizei um modal de confirmação de cor diferente com a intenção de reforçar o alerta ao usuário do resultado dessa operação
## Decisões de Produto
 Optei por separar a funcionalidade de listagem de cartas e de adicionar/editar cartas em telas diferentes. 
 Acredito que assim fique mais claro para o usuário qual a funcionalidade de cada parte da aplicação. Também facilita a manutenção e desenvolvimento do projeto, com cada parte separada e dedicada, com seus eventos e estilização, evita conflitos nesses pontos. 

### API  

**Base URL:**  `http://localhost:8080/api`

**Autenticação:** Bearer Token (JWT) — incluir no header `Authorization: Bearer <token>` nas rotas protegidas.  

---

#### 1. Health Check

####  `GET /api`

Verifica se a API está funcionando.

**Headers:**

```
Content-Type: application/json
```
 
**Resposta de Sucesso (200):**

```json

{
	"status": "ok",
	"message": "API funcionando"
}

```
####  2. Autenticação

####  `POST /api/register`


Registra um novo usuário.  

**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json

{
	"email": "raphael.parkinson@gmail.com",
	"password": "senha123456"
}

```

**Resposta de Sucesso (200/201):**

```json
{
	"id": "uuid-do-usuario",
	"message": "Usuário registrado com sucesso"
}
```
**Resposta de Erro (400):**

```json

{
	"error": "Email e senha são obrigatórios"
}
``` 
 
---

  

####  `POST /api/login`
Autentica usuário e retorna token JWT.

**Headers:**

```
Content-Type: application/json
```
**Body (JSON):**

```json
{
	"email": "raphael.parkinson@gmail.com",
	"password": "123456"
}
```

**Resposta de Sucesso (200):**

```json

{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	"user": {
		"id": "uuid-do-usuario",
		"email": "raphael.parkinson@gmail.com"
	}
}
```

  

**Resposta de Erro (401):**

```json

{

"error": "Credenciais inválidas"

}

```

---

  

####  3. Cartas (Protegidas - Requer Token)


Todas as rotas abaixo requerem header:

```

Authorization: Bearer <seu-jwt-token>

```

  

####  `POST /api/card`

Cria uma nova carta com imagem (multipart/form-data).


**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

  

**Campos do Formulário:**

  

| Campo | Tipo | Obrigatório | Descrição |

|-------|------|-------------|-----------|

| `name_pt` | string | Sim | Nome em português (máx. 255 chars) |

| `name_en` | string | Sim | Nome em inglês (máx. 255 chars) |

| `card_game` | string | Sim | Jogo: `magic`, `pokemon` ou `yugioh` |

| `card_set` | string | Sim | Código/identificador do set |

| `rarity` | string | Sim | Raridade (ex: `C`, `U`, `R`, `M`, `RH`, `H`, `UR`, `IR`, `SIR`, `HR`, `PROMO`, `SR`, `ScR`, `UtR`, `CR`, `GR`, `StR`, `QCScR`) |

| `image` | file | Sim | Arquivo de imagem (JPEG, PNG, WebP, GIF - máx. 5MB) |

  

**Resposta de Sucesso (200/201):**

```json

{
	"id": "c54264fe-2008-b691-6e85-fdebd7053e91",
	"message": "Carta registrada com sucesso"
}

```

**Respostas de Erro:**

```json

// 400 - Campos obrigatórios

{ "error": "Todos os campos são obrigatórios." }

```


---

  

####  `GET /api/cards`

Lista todas as cartas do usuário autenticado.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Resposta de Sucesso (200):**

```json
{
	"items": [
		{
			"id": "c54264fe-2008-b691-6e85-fdebd7053e91",
			"name_en": "Path of Shadows",
			"name_pt": "Caminho das Sombras",
			"card_set": "dom",
			"card_game": "magic",
			"rarity": "U",
			"img_url": "http://localhost:8080/uploads/abc123.png"
		}
	],
	"count": 1
}
```

  

**Resposta de Erro (401):**

```json

{ "error": "Token inválido ou ausente." }

```

---

  

####  `GET /api/card/:id`

Busca uma carta específica do usuário pelo ID.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parâmetros de URL:**

-  `id` (UUID) — ID da carta

  

**Resposta de Sucesso (200):**

```json
{
	"id": "c54264fe-2008-b691-6e85-fdebd7053e91",
	"name_pt": "Caminho das Sombras",
	"name_en": "Path of Shadows",
	"card_game": "magic",
	"card_set": "dom",
	"rarity": "U",
	"img_url": "http://localhost:8080/uploads/abc123.png"
}
```

  

**Resposta de Erro (404):**

```json
{ "error": "Carta não encontrada" }
```

---

####  `PUT /api/card/:id`
Atualiza campos de uma carta (application/x-www-form-urlencoded).

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/x-www-form-urlencoded
```

**Parâmetros de URL:**
-  `id` (UUID) — ID da carta

**Body (form-urlencoded) — todos opcionais, pelo menos um obrigatório:**

| Campo | Tipo | Descrição |

|-------|------|-----------|

| `name_pt` | string | Novo nome em português (máx. 255 chars) |

| `name_en` | string | Novo nome em inglês (máx. 255 chars) |

| `card_game` | string | Novo jogo: `magic`, `pokemon` ou `yugioh` |

| `card_set` | string | Novo set |

| `rarity` | string | Nova raridade |

**Resposta de Sucesso (200):**

```json
{ "message": "Carta atualizada com sucesso" }
```
**Respostas de Erro:**

```json

// 400 - Nenhum dado para atualizar

{ "error": "Nenhum dado para atualizar" }

```
---


####  `POST /api/card/:id/image`

Faz upload/substitui a imagem de uma carta (multipart/form-data).

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Parâmetros de URL:**

-  `id` (UUID) — ID da carta

  **Campo do Formulário:**

| Campo | Tipo | Obrigatório | Descrição |

|-------|------|-------------|-----------|

| `image` | file | Sim | Arquivo de imagem (JPEG, PNG, WebP, GIF - máx. 5MB) |

  

**Resposta de Sucesso (200):**

```json
{
	"message": "Imagem atualizada com sucesso",
	"img_url": "http://localhost:8080/uploads/novo-arquivo.png"
}
```

**Respostas de Erro:**

```json

// 400 - Imagem obrigatória

{ "error": "Imagem é obrigatória" }

```

---

####  `DELETE /api/card/:id`
  
Deleta uma carta do usuário.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```


**Parâmetros de URL:**

-  `id` (UUID) — ID da carta

**Resposta de Sucesso (200):**

```json

{ "message": "Carta deletada com sucesso" }

```

**Resposta de Erro (404):**

```json

{ "error": "Carta não encontrada" }

``` 

---
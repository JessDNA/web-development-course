# Web API de Utilitários

## Descrição
Servidor HTTP com dois utilitários: processamento de texto (lowercase, uppercase) e processamento de números (minimum, maximum).

## Como Executar

```bash
# Instalar dependências (se necessário)
npm install

# Iniciar o servidor
npm start
```

O servidor rodará em: `http://localhost:3001`

## Endpoints

### 1. Utilitário de Texto (POST)

**Rota:** `POST /text/:action`

**Ações disponíveis:**
- `lowercase`: Converte texto para minúscula
- `uppercase`: Converte texto para maiúscula

**Exemplo de requisição:**
```bash
curl -X POST http://localhost:3001/text/lowercase \
  -H "Content-Type: application/json" \
  -d '{"input":"Lorem Ipsum"}'
```

**Resposta esperada:**
```json
{
  "entrada": "Lorem Ipsum",
  "acao": "lowercase",
  "saida": "lorem ipsum"
}
```

---

### 2. Utilitário de Número (GET)

**Rota:** `GET /number/:action?input=numero1,numero2,numero3`

**Ações disponíveis:**
- `minimum`: Retorna o menor número da lista
- `maximum`: Retorna o maior número da lista

**Exemplo de requisição:**
```bash
curl "http://localhost:3001/number/minimum?input=10,1,100"
```

**Resposta esperada:**
```json
{
  "entrada": "10,1,100",
  "acao": "minimum",
  "saida": 1
}
```

---

## Testes

### Teste Texto - Lowercase
```bash
curl -X POST http://localhost:3001/text/lowercase \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello World"}'
```

### Teste Texto - Uppercase
```bash
curl -X POST http://localhost:3001/text/uppercase \
  -H "Content-Type: application/json" \
  -d '{"input":"Hello World"}'
```

### Teste Número - Minimum
```bash
curl "http://localhost:3001/number/minimum?input=50,20,80,5"
```

### Teste Número - Maximum
```bash
curl "http://localhost:3001/number/maximum?input=50,20,80,5"
```

# Event Manager API

API RESTful (Node.js + Express + Joi + Sequelize/SQLite) para gestão de eventos com limite de vagas.

## Como rodar
```bash
npm install
npm start
```
Servidor em `http://localhost:3000`.

## Rotas
| Método | Rota | Descrição |
|---|---|---|
| POST | /events | Cria evento (`title`, `date` ISO, `capacity` > 0) |
| GET | /events | Lista eventos com `registrationsCount` |
| POST | /events/:id/register | Inscreve participante (`participantName`, `email`) |

## Roteiro de testes manuais
1. `POST /events` sem `capacity` -> **400**
   ```json
   { "title": "Workshop Node", "date": "2026-11-10T19:00:00Z" }
   ```
2. `POST /events` válido -> **201**
   ```json
   { "title": "Workshop Node", "date": "2026-11-10T19:00:00Z", "capacity": 2 }
   ```
3. `POST /events/1/register` duas vezes -> **201**
   ```json
   { "participantName": "Maria", "email": "maria@email.com" }
   ```
4. Terceira inscrição -> **403** `{ "message": "Evento lotado" }`
5. `GET /events` -> `registrationsCount: 2`
6. Extras: e-mail inválido -> **400**; `POST /events/999/register` -> **404**

## Testes automatizados no Postman
Importe `EventManager.postman_collection.json` (Import > arquivo), abra o Collection Runner e clique em **Run**.
Cada requisição já tem scripts `pm.test` validando status e respostas.

## Parte 2: Testes e Documentação
```bash
npm test            # Jest + Supertest, com banco mockado
npm run swagger     # gera/atualiza swagger_output.json
npm start           # painel em http://localhost:3000/api-docs
```
O `app.js` apenas exporta o Express; o `server.js` faz o `sync()` e o `listen()`.

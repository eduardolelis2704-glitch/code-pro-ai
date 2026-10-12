# CODE PRO AI

Sistema independente da mentoria CODE PRO SELLERS, com SDR de vendas, CS de mentorados, painel e integração opcional com [OpenWA](https://github.com/rmyndharis/OpenWA). **Não utiliza WeSales**.

## Iniciar

Requer Node.js 22+. Faça uma cópia de `.env.example` para `.env`, configure `ADMIN_TOKEN` e execute:

```sh
npm start
```

Abra http://localhost:3100 e entre com seu token. Há um painel de demonstração sem enviar mensagens. Configure OpenWA separado em um servidor com Docker e cadastre o webhook `https://seu-dominio/webhooks/openwa` no OpenWA. Veja instruções em `docs/DEPLOY.md`.

## Segurança

- `SEND_ENABLED=false` é o padrão. Nenhuma mensagem sai automaticamente até habilitar e testar.
- `AI_ENABLED=false` é o padrão. Sem configuração de modelo, há somente triagem determinística.
- Endpoint webhook requer `WEBHOOK_TOKEN` no query string; mantenha segredo e use HTTPS.
- Utilize número de testes e contatos com consentimento. OpenWA não é uma API oficial e pode resultar em bloqueio.
- Banco JSON local é adequado a demonstrações; para operação com equipe e volume, migrar para PostgreSQL e adicionar fila, rate limits e autenticação individual.

## API resumida

`GET /api/overview`, `GET /api/contacts`, `GET /api/contacts/:id`, `POST /api/contacts`, `POST /api/contacts/:id/message`, `PATCH /api/contacts/:id`, `POST /api/contacts/:id/tasks`, `GET /api/events`, `POST /webhooks/openwa`.

`POST /api/simulate` testa atendimento sem WhatsApp. `POST /api/jobs/run` verifica tarefas vencidas e follow-ups, mas não envia com a automação desativada.

## Estado do projeto

MVP inicial com UI funcional e backend, não é uma instalação em produção. Ainda requer VPS/servidor para OpenWA, credenciais e pareamento do número. Sem dados de clientes importados.

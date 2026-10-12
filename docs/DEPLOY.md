# Configuração e publicação

1. Instale Node.js 22+ ou faça build da imagem Docker do CODE PRO AI. Crie e configure o arquivo `.env`. Defina valores aleatórios, fortes e diferentes para `ADMIN_TOKEN`, `WEBHOOK_TOKEN` e `OPENWA_WEBHOOK_SECRET`; não envie segredos para o GitHub.
2. Inicie com `npm start`. Abra `http://localhost:3100`, informe o token administrativo e teste pelo simulador. Nenhuma mensagem é enviada por padrão.
3. Em VPS com Docker, instale o OpenWA separadamente, seguindo as instruções oficiais: `git clone https://github.com/rmyndharis/OpenWA.git`, `cd OpenWA`, `docker compose up -d`. Use o painel do OpenWA para conectar **número dedicado de testes**, via QR. Evite hospedar sessões persistentes em plataformas exclusivamente serverless.
4. Crie uma chave **operator**, limitada à sessão da mentoria. Configure `OPENWA_URL`, `OPENWA_API_KEY` e `OPENWA_SESSION_ID` no CODE PRO AI. A API principal do OpenWA usa `/api`.
5. Cadastre no OpenWA um webhook para `https://SEU-DOMINIO/webhooks/openwa?token=SEU_WEBHOOK_TOKEN` assinando evento `message.received` e configure o **segredo de assinatura** igual a `OPENWA_WEBHOOK_SECRET`. O backend valida `X-OpenWA-Signature: sha256=<hex>` sobre o corpo bruto com HMAC-SHA256 e rejeita requisições inválidas. Use HTTPS e proteja a URL; o token na URL é uma segunda barreira e pode aparecer em logs. Aplique minimização de logs sensíveis. Verifique a estrutura do payload pela funcionalidade de simulação e logs. Nunca publique tokens.
6. Faça testes com número de testes autorizado, verifique deduplicação de mensagens e roteamento. Só então considere `SEND_ENABLED=true` e `AI_ENABLED=true`. O sistema **não agenda jobs sozinho**: uma chamada periódica autenticada a `POST /api/jobs/run` deverá ser configurada no servidor para monitoramento de tarefas.
7. Configure política de retenção, consentimento LGPD, autenticação por usuário, backups e monitoramento antes de atender clientes reais. O armazenamento JSON local do MVP não é indicado para operação em múltiplas instâncias.

## Limitações atuais

O painel de contatos e a simulação funcionam mesmo sem o OpenWA. Mensagens reais dependem de conexão externa e devem ser homologadas contra o payload real do OpenWA. Agendamento externo (Google Calendar/Cal.com), pagamentos, e base de conhecimento específica da mentoria ainda não estão integrados. Handoff para humano significa suspender resposta automática, não transferir mensagens para outro software.

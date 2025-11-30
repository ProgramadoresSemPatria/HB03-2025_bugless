# Configuracao do GitHub App - BugLess

Este guia explica como configurar o GitHub App para habilitar reviews automaticas de Pull Requests.

## 1. Criar GitHub App

1. Acesse: **GitHub > Settings > Developer Settings > GitHub Apps > New GitHub App**

2. Preencha os campos:

| Campo | Valor |
|-------|-------|
| GitHub App name | `BugLess Code Review` (ou nome de sua preferencia) |
| Homepage URL | `https://seu-dominio.com` |
| Webhook URL | `https://seu-dominio.com/webhooks/github` |
| Webhook secret | Gere uma string segura (veja abaixo) |

Para gerar um webhook secret seguro:
```bash
openssl rand -hex 32
```

## 2. Permissoes Necessarias

Na secao **Permissions**, configure:

| Permissao | Acesso | Motivo |
|-----------|--------|--------|
| **Pull requests** | Read & Write | Ler PRs e postar comentarios |
| **Contents** | Read | Ler codigo e diffs |
| **Metadata** | Read | Informacoes do repositorio (obrigatorio) |

## 3. Eventos para Assinar

Na secao **Subscribe to events**, marque:

- [x] **Pull request**

## 4. Apos Criar o App

Apos clicar em "Create GitHub App", voce vera a pagina do app criado:

1. **App ID**: Anote o numero (ex: `123456`)
2. **Private Key**: Role ate o final e clique em "Generate a private key"
   - Um arquivo `.pem` sera baixado
3. **Webhook Secret**: O valor que voce definiu no passo 1

## 5. Variaveis de Ambiente

Adicione ao arquivo `.env` do backend:

```env
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpA...(conteudo completo)...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=seu-webhook-secret-aqui
```

### Formatando a Private Key

A private key deve estar em uma unica linha, com `\n` no lugar das quebras de linha.

**Opcao 1 - Comando Linux/Mac:**
```bash
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' your-app-name.private-key.pem
```

**Opcao 2 - Manualmente:**
1. Abra o arquivo `.pem`
2. Substitua cada quebra de linha por `\n`
3. Coloque entre aspas duplas

**Exemplo:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKC...
...
-----END RSA PRIVATE KEY-----
```

Vira:
```
"-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKC...\n...\n-----END RSA PRIVATE KEY-----"
```

## 6. Teste Local com Smee.io

Para testar webhooks localmente sem expor sua maquina:

1. Acesse https://smee.io e clique em **"Start a new channel"**

2. Copie a URL gerada (ex: `https://smee.io/abc123xyz`)

3. Instale o smee-client:
```bash
npm install -g smee-client
```

4. Execute o proxy:
```bash
smee -u https://smee.io/abc123xyz -t http://localhost:3000/webhooks/github
```

5. Configure a URL do Smee como **Webhook URL** no GitHub App (temporariamente)

6. Abra um PR em um repositorio com o app instalado para testar

## 7. Instalar o App em Repositorios

1. Acesse: `https://github.com/apps/SEU-APP-NAME/installations/new`

2. Selecione a conta ou organizacao

3. Escolha:
   - **All repositories**: Instalar em todos os repos
   - **Only select repositories**: Escolher repos especificos

4. Clique em **Install**

## 8. Verificar Funcionamento

Apos a instalacao:

1. Abra um Pull Request em um repositorio com o app instalado

2. Verifique os logs do backend:
```
[GitHubWebhook] Received event: pull_request (delivery-id)
[GitHubWebhook] Processing PR #1 (opened) for owner/repo
[Worker] Processing submission: xxx
[Worker] Review created: yyy
[GitHubWebhook] Posted review to owner/repo#1
```

3. O comentario deve aparecer no PR automaticamente

## 9. Troubleshooting

### Webhook nao chega
- Verifique se a URL do webhook esta correta
- Verifique se o servidor esta acessivel publicamente (ou use Smee.io)
- Confira os logs de webhook no GitHub App (Settings > Advanced > Recent Deliveries)

### Signature invalida
- Verifique se `GITHUB_WEBHOOK_SECRET` esta correto
- Verifique se nao ha espacos extras

### Erro ao buscar diff
- Verifique se a permissao `Contents: Read` esta habilitada
- Verifique se a `GITHUB_PRIVATE_KEY` esta formatada corretamente

### Erro ao postar comentario
- Verifique se a permissao `Pull requests: Write` esta habilitada

## 10. Arquitetura

```
GitHub PR Aberto
       |
       v
POST /webhooks/github
       |
       v
Valida X-Hub-Signature-256
       |
       v
Busca diff do PR (Octokit API)
       |
       v
Cria Submission + GitHubPullRequest
       |
       v
Worker processa com AI
       |
       v
Posta comentario no PR
```

## 11. Referencias

- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Octokit.js](https://github.com/octokit/octokit.js)
- [Webhook Events](https://docs.github.com/en/webhooks/webhook-events-and-payloads)

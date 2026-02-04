# 🚀 Sistema de Deploy Edy-Bike - Netlify

## Deploy Automático via CLI

### Instalação
```bash
npm install -g netlify-cli
```

### Autenticação (primeira vez)
```bash
netlify login
```
Isso abrirá o navegador para você autorizar o Netlify CLI.

### Deploy Manual

**Preview Deploy (teste):**
```powershell
.\deploy.ps1
```

**Production Deploy:**
```powershell
.\deploy.ps1 --prod
```

### Deploy via Interface Web

1. Acesse: https://app.netlify.com
2. Clique em "Add new site" → "Import from GitHub"
3. Selecione: **Evolvetech-Johnn/Edybike**
4. As configurações serão detectadas automaticamente do `netlify.toml`
5. Clique em "Deploy site"

### Continuous Deployment

Após conectar no Netlify, todo `git push origin main` dispara deploy automático:

```bash
git add .
git commit -m "suas alterações"
git push origin main
# ↑ Netlify detecta e faz rebuild automaticamente
```

### Variáveis de Ambiente

Configure no painel Netlify:
- **Site settings** → **Environment variables**
- Adicione: `VITE_API_URL` = URL do seu backend

### Comandos Úteis

**Status do site:**
```bash
netlify status
```

**Ver logs de build:**
```bash
netlify watch
```

**Abrir painel:**
```bash
netlify open
```

**Limpar cache e rebuild:**
No painel: **Deploys → Trigger deploy → Clear cache and deploy**

---

## 🔒 Safety Checks

O script `deploy.ps1` automaticamente:
1. ✅ Verifica node_modules
2. ✅ Executa `npm run predeploy`
3. ✅ Valida build (dist/index.html)
4. ✅ Só faz deploy se tudo passar

**Garantia: Deploy nunca quebrará!** 🛡️

---

## 📊 Arquivos de Configuração

- `netlify.toml` - Configuração de build e redirects
- `.netlify/state.json` - Estado do site
- `frontend/.env.production` - Variáveis de produção
- `deploy.ps1` - Script de deploy automático

---

## 🐛 Troubleshooting

**Erro: "Site not linked"**
```bash
netlify link
```

**Build timeout**
- Limpe cache no painel Netlify

**404 em rotas**
- Verifique `netlify.toml` tem redirects
- ✅ Já configurado!

---

**Tudo pronto para deploy!** 🚀

# ✅ Configurações Netlify - Edy-Bike

## 🎯 Build Settings (Verifique no Painel)

### Base Directory
```
frontend
```

### Build Command
```
npm run build
```

### Publish Directory
```
dist
```

### Deploy Triggers
- ✅ **Production branch:** `main`
- ✅ **Deploy previews:** On pull requests

---

## ⚙️ Build Environment Variables

Configure em: **Site settings → Environment variables → Add a variable**

### Variáveis Necessárias (se houver backend):

| Key | Value | Descrição |
|-----|-------|-----------|
| `VITE_API_URL` | `https://seu-backend.com/api` | URL da API backend |
| `NODE_VERSION` | `20` | Versão do Node.js (opcional) |

---

## 🚀 Deploy Checklist

- [x] Repositório conectado: `Evolvetech-Johnn/Edybike`
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Deploy branch: `main`

### Depois de configurar:
1. Clique em **"Deploy site"** ou **"Save"**
2. O Netlify iniciará o primeiro build automaticamente
3. Aguarde ~3-5 minutos

---

## 📊 O que o Netlify Fará:

1. **Clone** do repositório GitHub
2. **Install** de dependências (`npm install`)
3. **Build** do projeto (`npm run build`)
4. **Verificação** automática (nossa script predeploy)
5. **Publicação** em URL temporária

---

## 🌐 Após o Deploy

Você receberá uma URL tipo:
```
https://random-name-123456.netlify.app
```

**Para customizar o nome:**
- **Site settings** → **Domain management** → **Edit site name**

---

## 🔄 Continuous Deployment Ativo

Todo `git push origin main` agora dispara rebuild automático! 🎉

```bash
# Exemplo de workflow
git add .
git commit -m "atualização do site"
git push origin main
# ↑ Netlify detecta e rebuilda automaticamente
```

---

## ✅ Status Esperado no Netlify

**Durante build, você verá:**
```
✓ Installing dependencies
✓ Running build command
✓ Verifying build
✓ Build succeeded in ~3s
✓ Deploy succeeded
```

**Se algo der errado, verifique:**
- Logs de build no painel
- Nossa documentação em DEPLOY.md

---

**Tudo configurado! Aguarde o primeiro deploy. 🚀**

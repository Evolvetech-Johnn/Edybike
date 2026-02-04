# Edy-Bike - E-commerce Platform

Sistema de e-commerce moderno para venda de bicicletas e equipamentos, desenvolvido com React, TypeScript, Tailwind CSS e Node.js.

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **Vite** - Build tool e dev server
- **React Router** - Navegação SPA
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- MongoDB Atlas (conta gratuita)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd Edy-Bike
```

### 2. Configure o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend`:
```env
PORT=3000
MONGODB_URI=sua_connection_string_mongodb
JWT_SECRET=seu_jwt_secret_aqui
```

### 3. Configure o Frontend

```bash
cd frontend
npm install
```

### 4. Seed do Banco de Dados (Opcional)

Para popular o banco com dados iniciais:
```bash
cd backend
npm run seed
```

## 🚀 Executando o Projeto

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Produção

**Build do Frontend:**
```bash
cd frontend
npm run build
```

O build será gerado na pasta `frontend/dist`.

## 📦 Deploy no Netlify

### Pré-deploy (Verificação Local)

Antes de fazer deploy, sempre execute:
```bash
cd frontend
npm run predeploy
```

Este comando verifica:
- ✅ Tipagem TypeScript
- ✅ Linting (ESLint)
- ✅ Build de produção

### Deploy Automático

1. Conecte o repositório ao Netlify
2. As configurações em `netlify.toml` serão usadas automaticamente
3. O script predeploy executará antes de cada deploy para garantir qualidade

### Variáveis de Ambiente no Netlify

Configure no painel do Netlify:
- `VITE_API_URL` - URL do backend em produção

## 📁 Estrutura do Projeto

```
Edy-Bike/
├── backend/              # API Node.js + Express
│   ├── controllers/      # Lógica de negócio
│   ├── models/          # Modelos MongoDB
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middlewares (auth, etc)
│   └── server.js        # Entry point
│
├── frontend/            # Aplicação React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── context/     # Context API (Auth, etc)
│   │   ├── services/    # Serviços API
│   │   ├── types/       # TypeScript type definitions
│   │   └── App.tsx      # Componente raiz
│   ├── public/          # Assets estáticos
│   └── index.html       # HTML template
│
└── README.md
```

## 🔐 Acesso Admin

Para acessar o painel administrativo:
1. Navegue para `/admin/login`
2. Use as credenciais criadas via seed script ou crie um usuário admin manualmente

## 🛠️ Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia dev server (Vite)
- `npm run build` - Build de produção
- `npm run lint` - Executa ESLint
- `npm run preview` - Preview do build local
- `npm run predeploy` - Verificação completa pré-deploy

### Backend
- `npm start` - Inicia servidor de produção
- `npm run server` - Inicia com nodemon (auto-reload)
- `npm run seed` - Popular banco de dados

## 📝 Funcionalidades

- ✅ Catálogo de produtos com filtros por categoria
- ✅ Detalhes do produto
- ✅ Sistema de estoque
- ✅ Painel administrativo protegido
- ✅ CRUD de produtos e categorias
- ✅ Autenticação JWT
- ✅ Design responsivo
- ✅ TypeScript para type safety
- ✅ Tailwind CSS para estilização moderna

## 🎨 Design System

O projeto usa uma paleta de cores personalizada:
- **Primária (Azul)**: `#0066cc`
- **Secundária (Vermelho)**: `#e63946`
- **Fonte**: Inter (Google Fonts)

As cores e estilos estão configurados no `tailwind.config.js`.

## 📄 Licença

Este projeto é privado e proprietário.

## 👨‍💻 Desenvolvimento

Para contribuir ou reportar issues, entre em contato com o time de desenvolvimento.

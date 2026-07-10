# Especificações Técnicas - Landing Pages de Alto Impacto (Padrão Evolvetech)

Este documento descreve a stack, as bibliotecas, a estrutura e os padrões visuais utilizados nesta Landing Page (Projeto Diego Garcia). Use este documento como um guia (boilerplate) para criar novas Landing Pages de alto padrão no futuro.

## 1. Stack Tecnológica Base

- **Framework Front-end**: React 18
- **Linguagem**: TypeScript
- **Bundler e Build Tool**: Vite
- **Estilização**: Tailwind CSS (v3.4+)
- **Animações**: Framer Motion (v11+)
- **Gerenciamento de Pacotes**: npm ou yarn

## 2. Tipografia e Cores (Design System)

### Tipografia
- **Títulos e Destaques (Display)**: `Fraunces` (Google Fonts) - Traz um tom editorial, elegante, sério e de autoridade.
- **Corpo do Texto (Body)**: `Inter` (Google Fonts) - Moderna, super legível, sem serifa, transmite clareza e tecnologia.
- **Monospace (Detalhes/Eyebrows)**: `JetBrains Mono` - Usado em small caps, etiquetas e small texts para contraste.

### Paleta de Cores Padrão (Exemplo)
```css
/* tailwind.config.js - colors */
colors: {
  bg: '#F5F1E7',         /* Fundo off-white elegante */
  ink: '#142138',        /* Azul marinho profundo/preto (texto principal) */
  'ink-soft': '#3B4863', /* Variante mais suave para subtítulos e descrições */
  gold: '#A97B2F',       /* Cor de destaque premium (CTAs, detalhes) */
}
```

## 3. Padrões de Animação (Framer Motion)

Para criar o aspecto de "Alto Impacto" (motion promax), usamos:
- **Reveal on Scroll**: Elementos surgindo com fade-in e deslize de baixo para cima (`y: 20` para `y: 0`).
- **Stagger Children**: Em listas, cards ou grids, o container pai anima e os filhos surgem em sequência com um pequeno delay.
- **Barra de Progresso Global**: Uma linha no topo da página atrelada ao scroll do usuário (`useScroll` + `scaleX`).
- **Efeitos Spring**: Animações com propriedades de mola (`type: 'spring', stiffness: 100, damping: 20`) em vez de transições lineares, o que deixa o movimento muito mais natural.

## 4. Estrutura de Diretórios Recomendada

```text
/src
  /components     # Todos os blocos visuais da LP (Hero, Diagnostico, Servicos, etc)
  /data           # content.ts -> Centraliza todos os textos, dados e links. NUNCA deixe texto hardcoded nos componentes.
  App.tsx         # O layout principal orquestrando a ordem dos componentes
  index.css       # Tailwind directives e custom utilities (como pulse-glow, hide-scrollbar)
  main.tsx        # React root e StrictMode
```

## 5. Boas Práticas (UX/UI Premium)

1. **Separação de Dados e Visual**: Sempre isole o conteúdo (textos) da estrutura (TSX). Use um arquivo `content.ts` (ou JSON) para facilitar futuras edições do cliente sem tocar no layout.
2. **Uso de Eyebrows**: Pequenos textos acima dos títulos (ex: `01 — O PROBLEMA`), em maiúsculas, com tracking largo (letra espaçada). Eles guiam a leitura e dão respiro.
3. **Glassmorphism e Bordas Sutis**: Elementos de card com fundos translúcidos ou da mesma cor do fundo principal com transparência e bordas super finas (`border-ink/5` ou `border-white/10`).
4. **Sem Scrollbars Visíveis**: Esconder a scrollbar padrão (`::-webkit-scrollbar { display: none; }`) em áreas de muito texto ou overflow para manter a interface limpa.
5. **Gradients no CTA**: Seções de fechamento (call to action) com fundos escuros (Dark Mode) ou gradientes pesados para criar quebra visual e focar a atenção do usuário no botão final.
6. **Linguagem Positiva e Cordial**: Substituir palavras como "Problema" por "Desafio" ou "Oportunidade"; focar sempre em crescimento.

## 6. Comando de Inicialização Rápida

Para iniciar um novo projeto com essa mesma stack de forma rápida:

```bash
npm create vite@latest nome-do-projeto -- --template react-ts
cd nome-do-projeto
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

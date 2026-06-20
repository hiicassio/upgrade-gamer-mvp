# UPGrade Gamer — MVP

Comunidade gamer de Campo Grande/MS para troca, compra e venda de jogos.

## Estrutura do projeto

```
xpzonecg-cadastro/
├── .vscode/                # Config do editor (launch, settings)
├── public/                 # Site estático (deploy Vercel)
│   ├── index.html          # Landing principal
│   ├── anunciar.html       # Formulário de anúncio
│   ├── vitrine.html        # Vitrine de loots
│   ├── assets/
│   │   ├── images/         # Background e imagens gerais
│   │   ├── consoles/       # Capas de jogos/consoles
│   │   ├── jogos/          # Artes de jogos
│   │   └── vitrine/        # Imagens da vitrine
│   ├── css/
│   │   ├── style.css       # Design system completo
│   │   └── animations.css
│   └── js/
│       ├── config.js       # URLs e constantes
│       ├── main.js         # Menu, animações, scroll
│       └── script.js
├── src/                    # SCSS experimental (futuro)
├── package.json
├── vercel.json
└── README.md
```

## Abrir no Cursor / VS Code

1. **File → Open Folder** e selecione a pasta `xpzonecg-cadastro` (a raiz do projeto)
2. Ou abra o arquivo `xpzonecg-cadastro.code-workspace` na raiz
3. **Não** use workspace multi-pasta — a raiz do projeto já inclui `public/`, `src/` e `.vscode/`

## Deploy (Vercel)

1. Conecte o repositório na Vercel
2. **Root Directory:** raiz do projeto
3. **Output Directory:** `public`
4. Deploy automático a cada push na branch

## Desenvolvimento local

Na raiz do projeto:

```bash
npm run dev
```

Abra `http://localhost:3000`

## Páginas

| URL | Descrição |
|-----|-----------|
| `/` | Landing com CTA para WhatsApp |
| `/anunciar.html` | Anunciar jogo via moderação |
| `/vitrine.html` | Loots em destaque |

## Branch

Trabalho de refinamento na branch `feat/refinamento-mvp`.

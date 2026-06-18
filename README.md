# UPGrade Gamer — MVP

Comunidade gamer de Campo Grande/MS para troca, compra e venda de jogos.

## Estrutura do projeto

```
xpzonecg-cadastro/
├── public/                 # Pasta de deploy (Vercel)
│   ├── index.html          # Landing principal
│   ├── anunciar.html       # Formulário de anúncio
│   ├── vitrine.html        # Vitrine de loots
│   ├── assets/
│   │   ├── images/         # Background e imagens gerais
│   │   ├── consoles/       # Capas de jogos/consoles
│   │   └── vitrine/        # Imagens da vitrine
│   ├── css/
│   │   └── style.css       # Design system completo
│   └── js/
│       ├── config.js       # URLs e constantes
│       └── main.js         # Menu, animações, scroll
├── src/                    # SCSS experimental (futuro)
├── package.json
└── README.md
```

## Deploy (Vercel)

1. Conecte o repositório na Vercel
2. **Root Directory:** raiz do projeto
3. **Output Directory:** `public`
4. Deploy automático a cada push na branch

## Desenvolvimento local

```bash
cd public
npx serve .
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

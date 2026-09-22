# FinanceScope — CLAUDE.md

Hackathon Hagenthon 2026 · Tema 02 Inclusione Finanziaria · Accenture Application Engineering

## Progetto

Web app single-file (`index.html`) per migliorare la visibilità finanziaria personale di utenti con bassa alfabetizzazione finanziaria. Zero dipendenze esterne eccetto Anthropic API.

## File

```
App/
├── index.html          # Tutta l'app (HTML + CSS + JS)
├── design-system.html  # Design system visivo interattivo — apri nel browser come riferimento
├── README.md           # Specifiche complete del progetto
└── .claude/agents/     # Agenti specializzati
    ├── design-agent.md
    ├── code-agent.md
    ├── accessibility-validator.md
    └── test-agent.md
```

## Design System

Il file `design-system.html` è la fonte visiva di verità per l'interfaccia. Contiene:
- **Token CSS** completi (colori, spaziatura, bordi, motion)
- **Palette**: violet (`#7C3AED` / `#A855F7`) × teal (`#14B8A6` / `#2DD4BF`), semantic rose/amber/green
- **Tipografia**: Inter unico typeface, scale 10→40px
- **Componenti** da atomi (btn, badge, semaforo, input) a organismi (modal, tab bar, summary strip)
- **Pattern vietati**: niente gradient clip su parole singole, niente box-shadow per elevazione, niente fade-in automatici

Prima di qualsiasi modifica CSS o layout, consultare `design-system.html` e il `design-agent`.

## Regole globali (tutti gli agenti)

1. **Single file**: non creare mai file JS o CSS separati. Tutto in `index.html`.
2. **Modello AI**: usare solo `claude-sonnet-4-6` nelle chiamate Anthropic.
3. **Header obbligatori** per le chiamate API in-browser:
   - `anthropic-beta: pdfs-2024-09-25`
   - `anthropic-dangerous-direct-browser-access: true`
4. **Linguaggio utente**: ogni testo visibile all'utente deve essere in italiano semplice, senza gergo finanziario non spiegato.
5. **Nessun consiglio finanziario**: l'app informa e semplifica, non consiglia investimenti o strategie.

## Agenti disponibili

| Agente | Trigger |
|---|---|
| `design-agent` | CSS, palette, layout, componenti visivi |
| `code-agent` | Logica JS, API, PDF parsing, stato, modal |
| `accessibility-validator` | Review linguaggio, WCAG, comprensibilità |
| `test-agent` | Test funzionali, edge case, regressioni |

## Stack

- Frontend: HTML5 + CSS3 + Vanilla JS ES6+
- AI: Anthropic API `claude-sonnet-4-6`
- PDF: FileReader API → base64 → document message
- Deploy: apertura diretta di `index.html` nel browser

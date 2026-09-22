# FinanceScope — CLAUDE.md

Hackathon Hagenthon 2026 · Tema 02 Inclusione Finanziaria · Accenture Application Engineering

## Progetto

Web app single-file (`index.html`) per migliorare la visibilità finanziaria personale di utenti con bassa alfabetizzazione finanziaria. Zero dipendenze esterne eccetto Anthropic API.

## File

```
App/
├── index.html          # Tutta l'app (HTML + CSS + JS)
├── README.md           # Specifiche complete del progetto
└── .claude/agents/     # Agenti specializzati
    ├── design-agent.md
    ├── code-agent.md
    ├── accessibility-validator.md
    └── test-agent.md
```

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

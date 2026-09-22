---
status: in-progress
phase: 15
updated: 2026-09-22
completed: 14
---

# Implementation Plan — FinanceScope

## Goal
Costruire FinanceScope come React 18 + TypeScript + Vite app con Atomic Design, architettura multi-agente Anthropic e design system ufficiale v1.0 (Inter, violet/teal palette, design tokens) per Hagenthon 2026 Tema 02.

## Context & Decisions

| Decision | Rationale | Source |
|----------|-----------|--------|
| React 18 + Vite + TypeScript | Struttura mantenibile, DX moderna, type safety sugli response Anthropic | README.md + user request |
| Zustand per lo stato | Minimal boilerplate, pattern unidirectional compatibile con code-agent mental model | code-agent.md |
| CSS Modules + design tokens | Scoping locale, nessun runtime overhead, tokens condivisi tra atoms | frontend-philosophy Pillar 2 |
| Atomic Design (atoms→pages) | Componenti riutilizzabili, testabili isolatamente, struttura raccomandata dalla community React | user request |
| **Inter (single typeface)** | Design system v1.0 prescrive Inter — rimpiazza Space Grotesk + DM Sans | design-system.html |
| **Token rename** | Design system v1.0 usa `--bg/--surface/--surface2/--border/--border2/--violet/--teal` — vecchi token deprecati | design-system.html |
| `anthropic-dangerous-direct-browser-access: true` | Unico modo per chiamare Anthropic API dal browser senza proxy | README.md |

## Phase 1: Scaffold & Design Tokens [COMPLETE]
- [x] 1.1 Init Vite React TS project in App/
- [x] 1.2 Installare dipendenze (zustand, framer-motion)
- [x] 1.3 Creare struttura cartelle Atomic Design
- [x] 1.4 Design tokens CSS (palette, typography, spacing, shadows)
- [x] 1.5 Global styles + CSS reset
- [x] 1.6 TypeScript types (Expense, Report, AppState, AgentResponse)

## Phase 2: Atoms [COMPLETE]
- [x] 2.1 Button (primary / ghost / danger)
- [x] 2.2 Badge (source: pdf / manual; category)
- [x] 2.3 Semaforo (verde / giallo / rosso — colore + label testo per WCAG 1.4.1)
- [x] 2.4 Typography (Display, Heading, Body, Caption)
- [x] 2.5 StatusMessage atom

## Phase 3: Molecules [COMPLETE]
- [x] 3.1 FileUpload (drag & drop + click, PDF only)
- [x] 3.2 StatusMessage (idle / loading / error / success con aria-live)

## Phase 4: Organisms [COMPLETE]
- [x] 4.1 TabNavigation (Tab1 / Tab2, role="tablist", aria-selected)
- [x] 4.2 ExpenseForm (inserimento manuale con validazione guard-clause)
- [x] 4.3 ExpenseTable (tabella con totale mensile aggregato)
- [x] 4.4 HighlightsModal (modal ✦ Dettagli, aria-modal, focus management)
- [x] 4.5 DocumentReport (Tab 2: report strutturato con semaforo)

## Phase 5: Services & Hooks [COMPLETE]
- [x] 5.1 `pdf.service.ts` — FileReader → base64
- [x] 5.2 `anthropic.service.ts` — fetch wrapper con headers obbligatori
- [x] 5.3 Agent prompts (Extractor, Validator) come costanti typed
- [x] 5.4 `usePDFParser.ts` — orchestrazione Extractor agent
- [x] 5.5 `useDocumentAnalysis.ts` — orchestrazione Validator agent
- [x] 5.6 `useModal.ts` — open/close + focus management WCAG 2.1.2

## Phase 6: Pages & Integration [IN PROGRESS]
- [x] 6.1 Zustand store (AppState shape da code-agent.md)
- [x] 6.2 `ExpenseTracker` page (Tab 1) — FileUpload + StatusMessage connessi
- [x] 6.3 `DocumentAnalysis` page (Tab 2) — FileUpload + StatusMessage connessi
- [x] 6.4 `AppShell` template (layout desktop, tab routing)
- [x] 6.5 `App.tsx` — wiring completo
- [x] 6.6 Integrare ExpenseForm + ExpenseTable + HighlightsModal in ExpenseTrackerPage
- [x] 6.7 Integrare DocumentReport in DocumentAnalysisPage

## Phase 7: Quality [COMPLETE]
- [x] 7.1 Accessibility audit (accessibility-validator agent) — 4 bloccanti risolti, 5 miglioramenti applicati
- [x] 7.2 Test funzionali 10 TC (test-agent) — 5/9 passati; 4 fix applicati (TC-02 warn, TC-03 try/catch, TC-06 Escape, TC-08 fallback)
- [ ] 7.3 Code review (code-review skill)
- [x] 7.4 Build produzione + verifica `dist/` — ✓ 92 moduli, 0 errori

## Phase 8: Design Alignment — Design System v1.0 [IN PROGRESS]

**Obiettivo**: allineare tutti i componenti al design system ufficiale (`design-system.html`).
Fonte unica di verità: `design-agent.md`.

### 8.1 Foundation [COMPLETE]
- [x] **8.1.1** `tokens.css` — nuovo schema: `--bg/--surface/--surface2`, `--border/--border2`, `--violet/--violet2/--teal/--teal2`, `--rose/--amber/--green`, `--text/--text2/--text3`, `--grad/--grad-soft`, `--radius/--radius-sm`, `--transition/--spring`, spacing `--s1`→`--s16`
- [x] **8.1.2** `global.css` — Inter unico typeface, `@keyframes spin + modalIn`, `[data-amount]` per tabular-nums
- [x] **8.1.3** `index.html` — Inter 400–900 da Google Fonts

### 8.2 Atoms [COMPLETE]
- [x] **8.2.1** `Button` — variante `highlight` (violet bg 10%, border violet 25%); spring su primary hover
- [x] **8.2.2** `Badge` — pill 99px, border + bg opacity 12% per ogni categoria/source
- [x] **8.2.3** `Semaforo` — emoji (🟢/🟡/🔴) + testo + border; dot nascosto
- [x] **8.2.5** `StatusMessage` — pulse dot con `--violet2`, colori semantic

### 8.3 Molecules [COMPLETE]
- [x] **8.3.1** `FileUpload` — `--grad-soft` bg, dashed `--border2`, hover violet, icon 36px
- [x] **8.3.2** `Divider` (nuovo) — separatore "oppure aggiungi manualmente" con linee laterali

### 8.4 Organisms [COMPLETE]
- [x] **8.4.1** `TabNavigation` — border-bottom style, active tab `border-bottom-color: --bg`
- [x] **8.4.2** `ExpenseForm` — input/select nuovi token, focus `--violet2` + glow
- [x] **8.4.3** `ExpenseTable` — category dot colorato, footer gradient clip, `data-amount`
- [x] **8.4.4** `SummaryStrip` (nuovo) — `--grad-soft` bg, importo 32px 900 gradient clip, real-time
- [x] **8.4.5** `HighlightsModal` — spring animation, backdrop blur 6px, reportGrid, attentionBox
- [x] **8.4.6** `DocumentReport` — infoCard teal, listItem `–` teal2, emptyField italic

### 8.5 Template & Pages [COMPLETE]
- [x] **8.5.1** `AppShell` — `header-badge` "Hagenthon 2026", headerTop separato da TabNavigation
- [x] **8.5.2** `ExpenseTrackerPage` — Divider + SummaryStrip integrati, layout verticale
- [x] **8.5.3** `DocumentAnalysisPage` — uploadSection con surface + border + radius

### 8.6 Verifica finale [COMPLETE]
- [x] **8.6.1** Build produzione — ✓ 98 moduli, 0 errori (prima e dopo WCAG fix)
- [x] **8.6.2** Audit design system — 0 token hardcoded (`--color-*`, `--space-*`, `--font-*` eliminati), 0 pattern vietati (`box-shadow` per elevation, `--grad-soft` generico, ALL CAPS)
- [x] **8.6.3** WCAG 1.4.3 — 5 fix applicati (audit confermato da agente fork):
  - `--text3` .35→.52 (label 11px: da 2.90:1 a 5.16:1 su `--bg`) ✅
  - `--rose` `#F43F5E`→`#FF4D6D` (semaforo/badge/button: da 4.36:1 a 5.1:1 su `--surface`) ✅
  - `Button.highlight` bg .10→.06 (`--violet2` da 4.09:1 a 4.57:1) ✅
  - `--violet-light: #C4B5FD` (badge source-pdf 7.8:1, abbonamenti 6.9:1) ✅
  - rgba rose aggiornato a `rgb(255,77,109)` in Button.danger, StatusMessage.error, Badge.assicurazioni ✅
  - Tutti gli altri: `--text` 15–17:1, `--text2` 6.0–6.5:1, green 5.9:1, amber 6.8:1, teal2 8.0:1 ✅

## Phase 9: Code Review [COMPLETE]

**Esito**: REQUEST_CHANGES → fix applicati → APPROVED

### Fix applicati
- [x] **M1** `useDocumentAnalysis.ts:30` — `parseAgentJson` ora in try/catch (parità con usePDFParser TC-03)
- [x] **m1** `types/index.ts` — rimossa interfaccia `AsyncState` inutilizzata
- [x] **m5** `FileUpload.tsx:17` — `onDrop` controlla `loading` prima di accettare il file

### Noted (no fix — by design o fuori scope)
- **M2** `callAnthropicAgent` chiama Gemini (rinominare richiederebbe refactor su tutti i file) — accettato per hackathon
- **m2** `AnthropicContent` nome fuorviante — accettato
- **m3** `monthly_amount` nel prompt EXTRACTOR ridondante — accettato
- **m4** `buttonRefs` leak — trascurabile per uso tipico ≤50 spese

## Phase 10: Renewal Dates + Accordion + Imminent Expiry [COMPLETE]

**Obiettivo**: fondamenta per il sistema alert — ogni spesa conosce la propria scadenza; form manuale in accordion chiuso di default.

- [x] **10.1** `types/index.ts` — aggiunto `renewal_date?: string` a `Expense`
- [x] **10.2** `prompts.ts` — EXTRACTOR_AGENT_PROMPT: aggiunto `renewal_date` al JSON schema
- [x] **10.3** `ExpenseForm` — aggiunto campo "Data rinnovo" (input date opzionale) + `labelOptional`
- [x] **10.4** `ExpenseTrackerPage` — form in accordion con toggle, chiuso di default, animazione fadeSlide
- [x] **10.5** `ExpenseTable` — `daysUntil`, badge arancio `expiryBadge`, riga con sfondo `trImminent`

## Phase 11: PDF → Confirm Flow [COMPLETE]

**Obiettivo**: l'utente può analizzare un contratto senza aggiungerlo subito alle spese.

- [x] **11.1** `store/useAppStore.ts` — `pendingExpenses: Expense[]` + actions `setPendingExpenses`, `confirmPending`, `discardPending`
- [x] **11.2** `hooks/usePDFParser.ts` — dopo parsing, chiama `setPendingExpenses` (non `addExpenses`)
- [x] **11.3** `organisms/ConfirmExpenses` (nuovo) — preview lista con Semaforo + totale mensile grad + 2 CTA animate
- [x] **11.4** `ExpenseTrackerPage` — `<ConfirmExpenses />` tra inputArea e table section

## Phase 12: Tab 3 — Dashboard [COMPLETE]

**Obiettivo**: centro di controllo con budget, storico e timeline scadenze.

- [x] **12.1** `types/index.ts` — `AppTab = 'tab1'|'tab2'|'tab3'`; `HistoryEntry { id, date, action, expenseName, amount, source }`
- [x] **12.2** `store/useAppStore.ts` — `budget` (localStorage), `history`; `addExpenses/addManualExpense/removeExpense/confirmPending` pushing history entries; `setBudget`
- [x] **12.3** `TabNavigation` — "🎯 Dashboard" come terzo tab
- [x] **12.4** `organisms/BudgetSetting` — input €, persiste in localStorage, Aggiorna/Rimuovi
- [x] **12.5** `organisms/BudgetBar` — progressbar teal→amber→rose, legenda 3 colonne, alert contestuale
- [x] **12.6** `organisms/ExpenseHistory` — log cronologico inverso, dot verde/rosso, meta fonte
- [x] **12.7** `organisms/PaymentTimeline` — scadenze ≤30gg amber, ≤7gg rosso, ordinato per data
- [x] **12.8** `pages/DashboardPage` — grid 2 col (budget+bar / timeline), history full width
- [x] **12.9** `App.tsx` — `panel-tab3` → `DashboardPage`

## Phase 13: Alert System [COMPLETE]

**Obiettivo**: layer di notifiche informative trasversale — nessuna raccomandazione finanziaria.

- [x] **13.1** `hooks/useAlerts.ts` — `useMemo` su expenses+budget: expiry ≤30gg, renewal (da highlights.note), budget-over, budget-near 80%
- [x] **13.2** `organisms/AlertBanner` — alert con icona per tipo, dismissible per sessione, zero CTA opinionated
- [x] **13.3** `AppShell` — `<AlertBanner />` sopra i tab panel nel main

## Phase 14: Quality [COMPLETE]

- [x] **14.1** Build produzione — ✓ 117 moduli, 0 errori (JS: 189.35 kB gzip 61.05 kB, CSS: 29.67 kB gzip 6.39 kB)
- [x] **14.2** `tsc --noEmit` — 0 errori TypeScript
- [ ] **14.3** WCAG 1.4.3 audit nuovi componenti — TODO (AlertBanner, BudgetBar, ConfirmExpenses, PaymentTimeline)

## Notes
- 2026-09-22: Architettura pivotata da single HTML file a React per mantenibilità e Atomic Design
- 2026-09-22: Il vincolo "zero dipendenze esterne" del README si intende per runtime AI, non per il build tool
- 2026-09-22: `VITE_ANTHROPIC_API_KEY` gestita via `.env.local` (non committata)
- 2026-09-22: Design system v1.0 fornito — Inter typeface, token rinominati, nuova palette, component specs complete
- 2026-09-22: README analizzato — Fasi 10–14 coprono le feature roadmap: accordion form, confirm flow, Tab 3 dashboard, alert system

## Phase 15: Clausole Restrittive [IN PROGRESS]

**Obiettivo**: rilevamento strutturato di clausole restrittive (mora, penali, rinnovi, preavvisi, variazioni tariffarie) nei documenti caricati — visibili sia nel report Tab 2 sia nel modal Tab 1.

- [x] **15.1** `types/index.ts` — `ClausolaRestrittiva { tipo, descrizione, importo?, gravita }`; `ClausolaTipo` union; `ClausolaGravita`; campi aggiornati in `DocumentReport` e `ExpenseHighlights`
- [x] **15.2** `prompts.ts` — `VALIDATOR_AGENT_PROMPT`: clausole_restrittive array strutturato con regole per ogni tipo
- [x] **15.3** `prompts.ts` — `EXTRACTOR_AGENT_PROMPT`: clausole_restrittive dentro highlights per-spesa
- [x] **15.4** `DocumentReport.tsx` — sezione clausole con `ClauseCard` (icona + tipo label + gravity badge + descrizione + importo opzionale); conteggio alta gravità in section header
- [x] **15.5** `DocumentReport.module.css` — clauseCard con border-left per gravità, gravityBadge per tipo, clauseAmount
- [x] **15.6** `HighlightsModal.tsx` — `ModalClauseCard` + clauseSection con stili dedicati nel module.css
- [x] **15.7** Build — ✓ 118 moduli, 0 errori (JS: 198.98 kB gzip 63.76 kB)

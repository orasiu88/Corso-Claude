# FinanceScope — Hagenthon 2026
### Tema 02 · Inclusione Finanziaria · Accenture Application Engineering

---

## Prompt di progetto (raffinato)

> Costruire una web app in HTML + JavaScript puro (single file, zero dipendenze esterne tranne la Anthropic API) che migliori la **visibilità finanziaria personale** di utenti con bassa alfabetizzazione finanziaria, attraverso capability distinte attivate tramite agentic coding multi-agente.
>
> **Architettura agenti** (ispirata a opencode-workspace + Claude subagents):
> - **Design Agent** — responsabile dello stile visivo (palette Revolut-inspired: vivace, dark, gradients vibranti)
> - **Code Agent** — scrive la logica applicativa (parsing PDF, chiamate API, gestione stato)
> - **Accessibility Validator Agent** — verifica che l'output sia comprensibile a utenti con bassa alfabetizzazione finanziaria (linguaggio semplice, label chiare, zero gergo)
> - **Test Agent** — esegue test funzionali simulati (edge case: PDF vuoto, spesa a 0€, documento non riconosciuto)

---

## Funzionalità dell'applicazione

### Tab 1 — Tracker Spese Ricorrenti

L'utente gestisce tutte le proprie spese periodiche in un unico posto.

**Caricamento da PDF** (funzionalità principale e differenziante)
L'utente carica qualsiasi documento con costi ricorrenti — bolletta, contratto di abbonamento, mutuo, polizza assicurativa. L'AI non si limita a estrarre l'importo: analizza i vincoli contrattuali, identifica le condizioni economiche rilevanti, rileva le clausole restrittive e produce un set di *tips educativi* pensati per chi non ha familiarità col linguaggio finanziario. Per ogni documento caricato il sistema restituisce:
- Importo mensile o periodico normalizzato
- Data di scadenza/rinnovo contrattuale
- Eventuali variazioni di costo previste (es. adeguamento ISTAT, cambio tariffa in data X)
- Vincoli da ricordare (penali di recesso, clausole di rinnovo automatico, preavvisi minimi)
- **Clausole restrittive strutturate** per tipologia e gravità:
  - 💸 Mora/interessi di ritardo (es. "Ritardo pagamento: commissione di 5€ al giorno")
  - 🚪 Penale di recesso anticipato
  - 🔄 Rinnovo automatico con preavviso obbligatorio
  - 📣 Preavviso minimo per disdetta
  - 📈 Variazioni di costo programmate (adeguamento ISTAT, fasce orarie)
  - ℹ️ Altre clausole vincolanti
- Tips di comprensione in linguaggio semplice ("Questo contratto si rinnova da solo: se vuoi uscire devi disdire almeno 30 giorni prima")
- Semaforo di chiarezza 🟢/🟡/🔴 generato dal Validator Agent

Ogni spesa estratta da PDF mostra il bottone **"✦ Dettagli"** nella tabella, che apre un modal con tutti questi dati senza lasciare la pagina.

**Flusso analisi → conferma aggiunta** *(roadmap)*
Quando l'utente carica un contratto non ancora firmato (o in fase di valutazione), può analizzarlo senza aggiungerlo subito alle spese. Il sistema mostra il report completo con un'azione biforcata: **"Aggiungi alle mie spese"** oppure **"Salva solo l'analisi"**. Questo consente di usare FinanceScope anche come strumento di pre-valutazione prima della firma, e di confermare l'aggiunta solo quando il contratto è effettivamente attivo.

**Inserimento manuale** *(sezione a comparsa, chiusa di default)*
Un accordion nascosto permette di aggiungere spese che non hanno un documento PDF (es. spese in contanti, abbonamenti informali). Campi: nome, importo, frequenza mensile/annuale, categoria, data di rinnovo. La sezione è chiusa di default per non distrarre chi usa principalmente il caricamento PDF.

**Tabella riepilogativa**
Tutte le spese — da PDF o manuali — sono normalizzate a valore mensile e mostrate in tabella con categoria, frequenza, importo al mese e, per quelle da PDF, il bottone "✦ Dettagli". Le spese con scadenza imminente sono evidenziate visivamente.

---

### Tab 2 — Analisi Documento Finanziario

L'utente carica una bolletta o un contratto e ottiene un report strutturato con le informazioni chiave tradotte in linguaggio semplice:
- Importo/rata mensile o periodica
- Data scadenza / rinnovo / prossima lettura
- Condizioni economiche rilevanti (prezzo al kWh, tasso, canone base)
- Variazioni di costo previste e relative date
- Clausole e vincoli contrattuali importanti
- **Clausole restrittive rilevate automaticamente**: mora, penali di recesso, rinnovi automatici, preavvisi, variazioni tariffarie — ognuna con tipo, descrizione in linguaggio semplice, eventuale importo e livello di gravità (alta/media/bassa)
- Semaforo di comprensibilità 🟢/🟡/🔴

Output: visualizzazione inline senza export. Il report può essere usato come punto di partenza prima di aggiungere la spesa al Tab 1.

---

### Tab 3 — Dashboard Finanziaria *(roadmap)*

Centro di controllo della propria situazione finanziaria, composto da tre sezioni integrate.

**Budget personalizzabile**
L'utente imposta un budget mensile massimo (es. 800 €/mese per spese fisse). Il sistema confronta in tempo reale il totale delle spese ricorrenti con il budget impostato e mostra un indicatore visivo — barra di avanzamento con soglie cromatiche (verde sotto l'80%, arancione tra 80% e 100%, rosso oltre il 100%). In caso di superamento, un alert contestuale spiega quali voci contribuiscono maggiormente allo sforamento.

**Storico delle spese**
Registro cronologico di ogni spesa aggiunta o rimossa, con data di registrazione e fonte (PDF o manuale). Permette di vedere l'evoluzione delle spese nel tempo — es. quante spese sono state aggiunte nell'ultimo mese, se il totale mensile è aumentato rispetto al periodo precedente.

**Prossimi pagamenti e scadenze**
Timeline dei prossimi rinnovi e pagamenti ordinati per data, calcolata a partire dalle date inserite nei contratti o impostate manualmente. Ogni voce mostra giorni mancanti, importo previsto e tipo di evento (pagamento, rinnovo automatico, scadenza con decisione richiesta).

---

### Sistema di alert trasversale *(roadmap)*

Un layer di notifiche attivo su tutta l'app che segnala situazioni che richiedono attenzione dell'utente, senza mai fornire raccomandazioni finanziarie:

| Trigger | Messaggio tipo |
|---|---|
| Scadenza contratto entro 30 giorni | "Il contratto [Nome] scade il [Data]. Ricordati di valutare se rinnovarlo o disdirlo." |
| Cambio tariffa imminente | "Il contratto [Nome] prevede una variazione di costo il [Data]: da [X] a [Y] €/mese." |
| Rinnovo automatico in arrivo | "Il contratto [Nome] si rinnova automaticamente il [Data]. Il preavviso minimo per disdire è [N] giorni." |
| Budget superato | "Le tue spese fisse ([X] €) hanno superato il budget impostato ([Y] €)." |
| Soglia budget all'80% | "Sei all'80% del budget mensile. Hai ancora [Z] € disponibili per spese fisse." |

Gli alert sono informativi e contestuali: non suggeriscono mai cosa fare, ma assicurano che l'utente abbia le informazioni necessarie per decidere autonomamente.

---

## Requisiti Hackathon (Tema 02 — Inclusione Finanziaria)

### Obiettivo
Supportare l'educazione alla finanza personale di base, aiutando le persone con bassa alfabetizzazione finanziaria a comprendere concetti e gestire meglio le proprie finanze quotidiane.

### Scenario educativo scelto
**Gestione del budget personale + Lettura di documenti finanziari** — l'utente impara a vedere quanto spende ogni mese, a capire i termini chiave dei propri contratti/bollette e a tenere sotto controllo scadenze e variazioni di costo.

### Vincoli rispettati
- [x] Scenario educativo preciso (gestione budget + lettura documenti)
- [x] Miglioramento tangibile: l'utente vede il totale spese mensili che prima non conosceva, capisce i vincoli dei propri contratti e riceve alert sulle scadenze
- [x] Nessuna raccomandazione di investimento o consulenza finanziaria personalizzata
- [x] Capability software concreta (parsing AI di PDF, normalizzazione importi, report strutturato, modal highlights per-spesa, sistema alert, dashboard budget)
- [x] Linguaggio semplice, accessibile a utenti con bassa alfabetizzazione finanziaria

### Cosa è stato evitato
- ✗ Chatbot generico senza logica applicativa
- ✗ Pura riscrittura di testi senza capability software
- ✗ Consigli finanziari o di investimento
- ✗ Semplificazioni che alterano il significato originale dei documenti
- ✗ Demo non collegate a un processo reale

### Deliverable richiesti

| # | Deliverable | Contenuto |
|---|---|---|
| 01 | **User Difficulty Statement** | Utente target: persona comune (20–50 anni) che non sa quante spese ricorrenti ha, non capisce il linguaggio dei contratti che firma, e non riceve nessun avviso quando una tariffa cambia o un contratto scade. Non ha strumenti semplici per aggregare, capire e tenere sotto controllo le spese mensili. |
| 02 | **Before / After Simplicity Evidence** | Prima: PDF bolletta con terminologia tecnica (prezzo unitario energia, quota fissa, spread, F1/F2/F3, penale recesso). Dopo: "Paghi circa 45 €/mese. Il contratto scade il 31/12/2025 e si rinnova da solo: devi disdire almeno 30 giorni prima. Il prezzo dell'energia è 0,22 € per ogni kWh." |
| 03 | **Risk & Clarity Note** | Semplificato: gergo tecnico → linguaggio comune, date sparse → timeline ordinata, clausole nascoste → tips visibili. Non alterato: importi numerici, date, condizioni contrattuali. Ambiguità evitata: il semaforo 🟢/🟡/🔴 segnala esplicitamente quando qualcosa nel documento non è chiaro o richiede attenzione. |

---

## Stack tecnico

| Componente | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript (ES6+) |
| AI | Anthropic API — `claude-sonnet-4-6` |
| PDF parsing | FileReader API → base64 → inviato come document a Claude |
| Architettura agenti | Prompts separati per agente, chiamate parallele con `Promise.all` |
| Persistenza | localStorage per budget, storico e scadenze (roadmap) |
| Deploy | Single HTML file, zero build step |

---

## Architettura agenti (Claude Code / opencode-workspace pattern)

```
┌─────────────────────────────────────────────┐
│         User Action (upload / form)          │
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────▼────────────┐
          │   Orchestrator Agent    │
          │  (coordina il flusso)   │
          └──┬─────────┬────────┬──┘
             │         │        │
    ┌────────▼──┐  ┌───▼────┐  ┌▼───────────┐
    │  Extractor│  │Formatter│  │ Validator  │
    │  Agent    │  │ Agent   │  │ Agent      │
    │(estrae    │  │(formatta│  │(verifica   │
    │ dati PDF, │  │ output, │  │ chiarezza, │
    │ vincoli,  │  │ tips    │  │ semaforo,  │
    │ scadenze) │  │ educativi│  │ alert)     │
    └────────┬──┘  └───┬────┘  └┬───────────┘
             └─────────┴────────┘
                       │
          ┌────────────▼────────────┐
          │      UI Renderer        │
          │ (tabella / report /     │
          │  dashboard / alert)     │
          └─────────────────────────┘
```

---

## Stato di sviluppo

| Funzionalità | Stato |
|---|---|
| Tab 1 — Caricamento PDF + estrazione spese AI | ✅ Implementato |
| Tab 1 — Modal "✦ Dettagli" con highlights contratto | ✅ Implementato |
| Tab 1 — Tips educativi per ogni contratto | ✅ Incluso nell'Extractor Agent |
| Tab 1 — Inserimento manuale (accordion) | ✅ Implementato |
| Tab 1 — Flusso analisi → conferma aggiunta | ✅ Implementato |
| Tab 1 — Gestione date rinnovo/scadenza per-spesa | ✅ Implementato |
| Tab 2 — Analisi documento + report AI | ✅ Implementato |
| Tab 3 — Dashboard budget personalizzabile | ✅ Implementato |
| Tab 3 — Storico spese cronologico | ✅ Implementato |
| Tab 3 — Timeline prossimi pagamenti | ✅ Implementato |
| Sistema alert trasversale (scadenze, tariffe, budget) | ✅ Implementato |

---

## File di progetto

```
financescope/
├── index.html          # App completa (single file)
├── design-system.html  # Design system navigabile
└── README.md           # Questo file
```

---

## Come usare

1. Aprire `index.html` nel browser (Chrome/Firefox/Edge moderni)
2. La API key è pre-configurata per la demo
3. **Tab 1**: caricare un PDF (bolletta, contratto, abbonamento) per l'analisi AI completa
   - Le spese estratte mostrano il badge "📎 da PDF" e il bottone "✦ Dettagli"
   - "✦ Dettagli" apre il modal con highlights, vincoli contrattuali e tips educativi
4. **Tab 2**: caricare una bolletta o un contratto per il report AI standalone

---

## Note per la demo (Hagenthon)

- Tempo di sviluppo: 5 ore (hackathon Accenture Application Engineering, 22 settembre 2026)
- Team: 2 persone
- Il sistema usa 3 prompt separati per simulare l'architettura multi-agente (Extractor, Formatter, Validator)
- **Tab 1**: l'Extractor Agent estrae spese, vincoli contrattuali, variazioni di costo previste e tips educativi in un'unica chiamata API; il modal è generato lato client senza chiamate aggiuntive
- **Tab 2**: il semaforo 🟢/🟡/🔴 è l'output del Validator Agent che valuta la chiarezza del documento originale
- Il modal highlights si chiude cliccando fuori, sul bottone ✕ o con il tasto Escape
- Le funzionalità in roadmap (dashboard, alert, accordion manuale, flusso conferma) sono documentate e pronte per la fase di sviluppo successiva

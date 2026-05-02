<div align="center">

```
███████╗██╗███╗   ██╗███████╗ █████╗  █████╗ ████████╗██╗  ██╗██╗
██╔════╝██║████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║
█████╗  ██║██╔██╗ ██║███████╗███████║███████║   ██║   ███████║██║
██╔══╝  ██║██║╚██╗██║╚════██║██╔══██║██╔══██║   ██║   ██╔══██║██║
██║     ██║██║ ╚████║███████║██║  ██║██║  ██║   ██║   ██║  ██║██║
╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝
```

### *Should you sign this?*

**The only tool that tells a common Indian "should I sign this?" in plain language — before they make a financial mistake.**

---

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![RBI Compliant](https://img.shields.io/badge/RBI_FPC-Compliant-F0A500?style=for-the-badge)
![Privacy](https://img.shields.io/badge/Zero_Storage-Privacy_First-16A34A?style=for-the-badge)

<br/>

[**Live Demo**](https://finsaathi.vercel.app) · [**Report a Bug**](https://github.com/your-username/finsaathi/issues) · [**Request Feature**](https://github.com/your-username/finsaathi/issues)

</div>

---

## The Problem

400 million Indians sign financial documents every year.

Every single one of them receives a multi-page agreement written in dense English legalese — full of jargon, buried clauses, and terms deliberately designed to be incomprehensible. A borrower in Dharwad signs a personal loan with a 5% foreclosure penalty buried in clause 14.3, page 7, in 8pt font. They had no idea. That penalty is 150% above the RBI limit.

**Every fintech app in India — Groww, ET Money, Paisabazaar — works after you've signed.** They track your EMIs. They monitor your credit. They help you manage money you've already committed.

Nobody sat at the decision moment. The 10 minutes before you sign. That moment was completely unprotected.

**FinSaathi owns that moment.**

---

## What It Does

Upload any loan agreement, insurance policy, or credit card document. FinSaathi reads every clause, cross-references it against RBI benchmarks, and hands you back a verdict in plain language — in your language — in under 20 seconds.

```
                        ┌─────────────────────┐
                        │   Upload Document   │
                        │  (PDF · Max 10MB)   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Text Extraction Layer     │
                    │        (pdf-parse)          │
                    └──────────────┬──────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │          Gemini 1.5 Flash              │
               │        Prompt 1: Extraction            │
               │  Detects 47 clause types · JSON out   │
               └───────────────────┬───────────────────┘
                                   │
          ┌────────────────────────▼────────────────────────┐
          │              Risk Scoring Engine                │
          │   Benchmarks from RBI FPC · IRDAI · Court DB   │
          │      CRITICAL · HIGH · MEDIUM · LOW            │
          └────────────────────────┬────────────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │          Gemini 1.5 Flash              │
               │        Prompt 2: Explanation           │
               │  Plain language · 7 Indian languages  │
               └───────────────────┬───────────────────┘
                                   │
                        ┌──────────▼──────────┐
                        │      Risk Card       │
                        │  Verdict · Clauses  │
                        │  Hindi · Negotiate  │
                        └─────────────────────┘
```

---

## The Risk Card

The output isn't a text wall. It's a structured verdict built for a first-generation borrower.

```
┌─────────────────────────────────────────────────────────┐
│  🔴  DO NOT SIGN          2 Critical · 1 High · 0 Med  │
│  We found serious issues. Do not sign without advice.  │
└─────────────────────────────────────────────────────────┘

  FORECLOSURE PENALTY                            🔴 CRITICAL
  ─────────────────────────────────────────────────────────
  Industry max: 2%  │  This document: 5%  │  150% above RBI limit
  ████████████████████████░░░░░  5%
  
  EN: If you repay your loan early, you must pay 5% of the 
      remaining amount as a penalty.

  HI: अगर आप समय से पहले लोन चुकाते हैं, तो आपको बची 
      राशि का 5% जुर्माना देना होगा।

  💡 Ask the lender to cap this at 2% — RBI/2023-24/55 
     prohibits higher rates for individual borrowers.
```

---

## Features

### Core
- **47 Clause Types Detected** — processing fees, foreclosure penalties, penal interest, lock-in periods, auto-renewal, arbitration, insurance bundling, variable rates, cross-default, lien on account, and 37 more
- **RBI Benchmark Engine** — every flag cites a real RBI circular or IRDAI guideline. Not vibes. Law.
- **Two-Prompt Gemini Pipeline** — extraction and explanation are separate, parallelizable, and independently debuggable
- **Three-Layer Fallback** — Gemini down? Rule-based regex scanner activates. Never a blank screen.
- **Fake Document Detector** — flags structurally suspicious documents (no RBI reg number, no stamp duty, interest above 60% APR)

### Language
- **7 Indian Languages** — English, Hindi, Kannada, Tamil, Telugu, Marathi, Gujarati
- **Voice Input + Output** — Web Speech API, no external dependency, works in Chrome natively
- **Noto Sans rendering** — correct script rendering for all Devanagari and South Indian scripts

### Legal Intelligence
- **AI Legal Chatbot** — document-aware Q&A. Knows your specific clauses. Not a generic chatbot.
- **Escalation Detection** — pattern-matches for urgency signals and routes to human lawyer
- **Negotiation Tips** — every CRITICAL flag comes with a one-line negotiation move

### Privacy & Security
- **Zero Persistence** — documents processed in memory, discarded after response, never written to disk
- **No-cache headers** — `Cache-Control: no-store` on all document API routes
- **Self-hostable** — entire stack runs in a Docker container. Enterprise clients: documents never leave your network.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 14, App Router | SSR + API routes in one project |
| Language | TypeScript (strict) | Type safety across all clause/risk interfaces |
| Styling | Tailwind CSS + shadcn/ui | Institutional design, zero runtime CSS |
| AI Model | Gemini 1.5 Flash | 1M token context, free tier, 8–15s per doc |
| PDF Parsing | pdf-parse | Server-side only, no external service |
| Fonts | IBM Plex Sans, DM Serif Display, Noto Sans | Full Indian language coverage |
| Deployment | Vercel | Zero-config, edge-ready |
| Database | None | Fully stateless — privacy by architecture |

---

## Benchmark Database

FinSaathi's moat isn't the AI. It's the knowledge layer the AI doesn't have.

```json
{
  "foreclosure_penalty": {
    "max": 2.0,
    "unit": "percent",
    "source": "RBI Circular RBI/2023-24/55",
    "note": "Banned entirely for floating rate loans to individuals"
  },
  "penal_interest": {
    "max": 2.0,
    "unit": "percent_per_month",
    "source": "RBI Circular Aug 2023",
    "note": "Cannot be compounded — RBI Aug 2023 circular"
  },
  "insurance_bundling": {
    "mandatory_allowed": false,
    "source": "IRDAI Circular 2021",
    "note": "Mandatory insurance with loans is prohibited"
  }
}
```

Raw Gemini doesn't know these numbers. FinSaathi does. That's the product.

---

## Getting Started

### Prerequisites
- Node.js 20+
- Google AI (Gemini) API Key — [get it free here](https://aistudio.google.com/)

### Installation

```bash
# Clone
git clone https://github.com/your-username/finsaathi.git
cd finsaathi

# Install
npm install

# Environment
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
GEMINI_API_KEY=your_key_here
```

That's it. One variable. No database. No auth service. No Redis. No S3.

---

## Project Structure

```
finsaathi/
├── app/
│   ├── page.tsx                  # Landing — upload + hero
│   ├── analyze/page.tsx          # Risk Card results
│   └── api/
│       ├── extract/route.ts      # PDF parse → Gemini Prompt 1
│       ├── analyze/route.ts      # Risk scoring → Gemini Prompt 2
│       └── chat/route.ts         # Legal chatbot endpoint
├── components/
│   ├── UploadZone.tsx            # Drag-and-drop upload
│   ├── RiskCard.tsx              # Main results component
│   ├── ClauseFlag.tsx            # Individual clause card
│   ├── VerdictBanner.tsx         # SIGN / CAUTION / DO NOT SIGN
│   ├── LanguageToggle.tsx        # 7-language switcher
│   ├── LegalChatbot.tsx          # Floating chat with escalation
│   └── LoadingCard.tsx           # Animated analysis state
├── lib/
│   ├── gemini.ts                 # Gemini client
│   ├── benchmarks.json           # RBI / IRDAI rate limits
│   ├── riskScorer.ts             # Scoring engine
│   ├── fallbackScanner.ts        # Regex fallback (API down)
│   └── sampleDoc.ts              # Demo document (triggers DO NOT SIGN)
└── types/
    └── index.ts                  # All TypeScript interfaces
```

---

## Regulatory Foundation

Every flag FinSaathi raises has a legal source. This is not a chatbot making things up.

| Regulation | What It Governs | How FinSaathi Uses It |
|---|---|---|
| RBI Fair Practices Code 2023 | Lenders must ensure borrowers understand terms | Benchmark for all fee disclosures |
| RBI KFS Mandate Oct 2024 | Key Fact Statement required before disbursement | Risk Card is the consumer-side KFS |
| RBI Circular RBI/2023-24/55 | Foreclosure penalty caps for individuals | CRITICAL flag trigger above 2% |
| RBI Circular Aug 2023 | Penal interest cannot be compounded | CRITICAL flag for compounding clauses |
| IRDAI Circular 2021 | Mandatory insurance bundling prohibited | Always CRITICAL regardless of amount |

---

## Competitive Landscape

| Who | What they do | The gap |
|---|---|---|
| ET Money / Groww | Investment tracking | Starts *after* you've signed |
| Paisabazaar | Loan comparison | Compares products, not *your document* |
| Digio / Signzy | Digital signing, KYC | Verifies identity, not content |
| ChatGPT / Claude | Can analyze if prompted correctly | You need to know what a foreclosure clause *is* to ask |
| Bank apps | Lender's own tools | A bank will never tell you their terms are bad |

**There is no direct Indian consumer competitor doing exactly this.**

---

## Roadmap

- [x] PDF clause extraction + RBI benchmark scoring
- [x] 7-language vernacular output
- [x] Legal chatbot with escalation detection
- [x] Voice input + output (Web Speech API)
- [x] Fake document detector
- [x] Rule-based fallback scanner
- [ ] Fine-tuned clause detection model (replacing Gemini for extraction)
- [ ] State-specific money lending act database (Karnataka, Maharashtra, TN)
- [ ] Legal professional review loop (RLHF for Indian financial law)
- [ ] Lawyer marketplace with rating system
- [ ] B2B white-label API for NBFCs
- [ ] Document history + negotiation tracking (Pro tier)
- [ ] WhatsApp integration (send doc → get verdict on chat)

---

## The One Liner

> *Every other fintech app in India helps you manage money you've already committed.*
> *FinSaathi is the first to protect you at the moment you commit it.*

---

## Built By

**Team Chai & Deploy** — Vibethon 2026, Fintech & Financial Inclusion Track

---

<div align="center">

Built with purpose for 400 million Indians who deserve to understand what they're signing.

**[⭐ Star this repo](https://github.com/your-username/FinSaathi)** if FinSaathi belongs in every Indian's phone.

</div>
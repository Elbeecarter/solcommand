# SolCommand — The Solana Unified Intelligence Terminal

> One interface. Every edge. All of Solana.

SolCommand is a production-ready DeFi command center built on 
Solana, integrating all 5 Eitherway Frontier Hackathon partners 
into a single unified platform. It combines market intelligence, 
yield management, MEV-protected trading, strategy automation, 
and onchain reputation into one military-grade terminal interface.

**Live App:** [coming soon]  
**Demo Video:** [coming soon]  
**Built with:** Eitherway · Birdeye · Quicknode · Kamino · DFlow · Solflare

---

## What Makes SolCommand Different

Most DeFi apps do one thing. SolCommand does everything and 
connects them intelligently. A whale signal from Birdeye can 
automatically trigger a DFlow swap, confirmed on Quicknode, 
deposited into Kamino yield vaults, and executed via Solflare 
— all from a single saved Playbook.

No other app connects all five protocols in one place.

---

## Features

### INTEL — Market Intelligence
**Partners: Birdeye + Quicknode**
- Live token scanner with volume anomaly detection
- Real-time whale transaction feed via Quicknode webhooks
- Smart money signals when high-score wallets accumulate
- Market metrics: Fear/Greed index, DEX volume, active wallets

### VAULT — Yield Management
**Partners: Kamino**
- Live Kamino vault positions with real-time APY display
- Out-of-range detection with automated rebalance suggestions
- AI Coach analyzes positions using Birdeye data
- Auto-rebalance rules triggered by Quicknode price webhooks

### EXECUTE — MEV-Protected Trading
**Partners: DFlow + Solflare**
- DFlow-routed swaps with MEV protection on every trade
- Solflare transaction simulation before signing
- Limit orders with visual fill-progress indicators
- Full wallet overview: SOL, USDC, total portfolio value

### PLAYBOOKS — Strategy Automation
**Partners: All 5**
- Visual no-code strategy builder: Trigger → Condition → Action → Exit
- Runs automated multi-step strategies across all protocols
- Community playbook marketplace to fork top strategies
- Per-playbook performance tracking: runs, win rate, total PnL

### REPUTATION — Onchain Identity
**Partners: Birdeye + Solflare**
- Reputation score 0 to 1000 based on verifiable onchain history
- Tiers: Degen, Trader, Alpha, Whale
- Copy-trading feed to follow high-score wallets in real time
- Global leaderboard with 30-day PnL rankings

---

## Partner Integration Details

| Partner | How It Is Used |
|---------|---------------|
| Birdeye | Token prices, whale tracking, wallet PnL history, volume anomaly detection, smart money signals |
| Quicknode | RPC backbone, real-time webhooks for price triggers and whale transactions, block streaming |
| Kamino | Vault positions, APY data, strategy rebalancing, yield optimization engine |
| DFlow | All swap routing, MEV protection on execution, limit order management |
| Solflare | Wallet authentication, transaction simulation, signing flow, deep linking |

---

## Architecture

User Wallet (Solflare)
│
▼
┌─────────────────────────────┐
│         SolCommand          │
│                             │
│  INTEL  │ VAULT  │ EXECUTE  │
│  PLAY   │         REPUTE   │
└─────────────────────────────┘
│
├── Birdeye API (market data + whale intel)
├── Quicknode RPC + Webhooks (real-time feeds)
├── Kamino v2 API (vault positions + APY)
├── DFlow Router (swap execution + MEV)
└── Solflare SDK (wallet + tx simulation)
---

## Why This Survives 30 Days Post-Hackathon

1. **Playbooks** create a self-reinforcing community loop as users share strategies
2. **Reputation system** gives users an onchain identity worth protecting and growing
3. **Copy-trading feed** brings passive users back daily to follow smart money
4. **All 5 integrations** means no single protocol change can break the whole app

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/solcommand.git
cd solcommand

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your API keys (see Environment Variables section below)

# Run locally
npm run dev
```

---

## Environment Variables

BIRDEYE_API_KEY=your_birdeye_key
QUICKNODE_ENDPOINT=your_quicknode_endpoint
QUICKNODE_WEBHOOK_SECRET=your_webhook_secret

---

## Submission

Built for the **Eitherway Frontier Hackathon 2026**
Primary track: **Birdeye**
Additional integrations: Quicknode, Kamino, DFlow, Solflare

---

## License

MIT

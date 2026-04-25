# SolCommand — Integration Documentation

This document explains how each partner is deeply 
integrated into SolCommand.

---

## 1. Birdeye — Market Intelligence Layer

**Role in SolCommand:** Core data engine

**Endpoints Used:**
- `/defi/price` — Live token prices for ticker strip
- `/defi/price_volume/single` — Volume data for 
  anomaly detection
- `/defi/txs/token` — Transaction feed for whale tracker
- `/wallet/portfolio` — Wallet holdings display
- `/wallet/token_list` — Token balances per wallet
- `/defi/token_trending` — Trending tokens for 
  INTEL scanner

**How It Powers The Product:**
- The INTEL tab is entirely powered by Birdeye data
- Volume anomaly detector flags tokens with greater 
  than 5x average volume using price_volume endpoint
- Smart money signals fire when 3 or more high-score 
  wallets accumulate the same token
- Whale tracker pulls large transactions in real time
- Reputation scores are calculated using wallet PnL 
  history from Birdeye wallet endpoints
- Copy-trading feed ranks wallets by verified 
  onchain PnL from Birdeye data

**Why This Is Deep Integration:**
Birdeye is not just a price display. It is the 
intelligence engine that powers alerts, reputation 
scores, whale tracking, anomaly detection, and the 
entire social copy-trading layer.

---

## 2. Quicknode — Real-Time Data Infrastructure

**Role in SolCommand:** RPC backbone and webhook engine

**Features Used:**
- Solana Mainnet RPC endpoint for all onchain reads
- Quicknode Streams for real-time transaction monitoring
- Webhooks that trigger Playbook automations when 
  price or wallet conditions are met

**How It Powers The Product:**
- All blockchain reads go through Quicknode RPC
- Whale transactions are detected via Quicknode 
  stream subscriptions
- Playbook triggers use Quicknode webhooks to fire 
  actions when conditions are met onchain
- Price alert webhooks notify users and trigger 
  automated rebalances in Kamino vaults
- Block streaming powers the live status indicators 
  throughout the interface

**Why This Is Deep Integration:**
Quicknode is the real-time nervous system of 
SolCommand. Without it the whale tracker, playbook 
automation, and live data feeds would not function.

---

## 3. Kamino — Yield Strategy Engine

**Role in SolCommand:** Vault position management 
and yield optimization

**Endpoints Used:**
- `/v2/strategies` — All available vault strategies
- `/v2/user/positions` — User's current positions
- `/v2/strategies/{address}/metrics` — APY and 
  utilization data per vault

**How It Powers The Product:**
- VAULT tab shows all user positions with live APY
- Out-of-range detection alerts users when 
  positions need rebalancing
- AI Coach analyzes positions using Birdeye price 
  data and suggests optimal moves
- Auto-rebalance rules trigger via Quicknode 
  webhooks when price conditions are met
- Unclaimed fees are tracked and displayed in 
  real time

**Why This Is Deep Integration:**
Kamino is not just displayed — it is managed. 
Users can view, rebalance, and automate their 
entire yield strategy from inside SolCommand 
without ever visiting the Kamino website.

---

## 4. DFlow — MEV-Protected Execution

**Role in SolCommand:** All trade execution and 
order routing

**Features Used:**
- DFlow swap routing API for best price discovery
- MEV protection on every swap execution
- Limit order placement and management
- Prediction market routing

**How It Powers The Product:**
- Every swap in the EXECUTE tab goes through 
  DFlow routing
- MEV-PROTECTED badge confirms protection is active
- Price impact and slippage shown before execution
- Limit orders use DFlow infrastructure
- Playbook ACTION steps execute trades via DFlow
- Best route is automatically selected across 
  all available liquidity sources

**Why This Is Deep Integration:**
DFlow handles 100% of trade execution in 
SolCommand. No trade bypasses DFlow routing. 
The measurable improvement in execution quality 
is visible to users on every single swap.

---

## 5. Solflare — Wallet Experience Layer

**Role in SolCommand:** Primary authentication 
and transaction interface

**Features Used:**
- Solflare wallet adapter for connection
- Transaction simulation before signing
- Deep linking for mobile compatibility
- In-app browser support
- Custom signing flow for all onchain actions

**How It Powers The Product:**
- Solflare is the only wallet provider — it is 
  not an afterthought
- Transaction simulation shows users exactly 
  what will change in their wallet before they sign
- Every Playbook action that touches the chain 
  goes through Solflare signing
- Deep linking enables mobile users to open 
  transactions directly in Solflare app
- Wallet data powers the portfolio display, 
  reputation score inputs, and copy-trading feed

**Why This Is Deep Integration:**
Solflare is the core UX layer of SolCommand. 
The wallet is not just a connect button — it is 
the identity, the transaction interface, and the 
security layer for every onchain action.

---

## Architecture Summary

User (Solflare Wallet)
│
▼
SolCommand
│
┌────┴────┐
│         │
Birdeye   Quicknode
(Intel)   (Streams)
│         │
└────┬────┘
│
┌────┴────┐
│         │
Kamino    DFlow
(Vault)  (Execute)
│         │
└────┬────┘
│
Solflare
(Sign + Send)

---

## Deployment

- Platform: Eitherway
- Network: Solana Mainnet
- Status: Live and publicly accessible

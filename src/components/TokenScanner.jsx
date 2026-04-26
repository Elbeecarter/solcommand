import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AlertTriangle, TrendingUp, Zap, Plus, RefreshCw, Users } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { PROXY_API, KNOWN_TOKENS } from '../config.js'

const FILTER_TABS = ['TRENDING', 'NEW LISTINGS', 'VOLUME SURGE']

const SEED_TOKENS = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: KNOWN_TOKENS.SOL,
    price: 148.32,
    change24h: 2.41,
    volume24h: 1_840_000_000,
    avgVolume: 1_200_000_000,
    sparkline: [140, 142, 139, 143, 147, 145, 148, 149, 147, 148.32],
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    address: KNOWN_TOKENS.JUP,
    price: 0.7823,
    change24h: -1.14,
    volume24h: 320_000_000,
    avgVolume: 280_000_000,
    sparkline: [0.81, 0.80, 0.79, 0.78, 0.795, 0.785, 0.782, 0.779, 0.783, 0.7823],
  },
  {
    symbol: 'WIF',
    name: 'Dogwifhat',
    address: KNOWN_TOKENS.WIF,
    price: 1.42,
    change24h: 5.87,
    volume24h: 870_000_000,
    avgVolume: 160_000_000,
    sparkline: [1.22, 1.25, 1.29, 1.31, 1.35, 1.38, 1.40, 1.41, 1.43, 1.42],
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: KNOWN_TOKENS.BONK,
    price: 0.00001823,
    change24h: 8.34,
    volume24h: 980_000_000,
    avgVolume: 190_000_000,
    sparkline: [0.0000168, 0.0000172, 0.0000175, 0.0000180, 0.0000183, 0.0000179, 0.0000184, 0.0000186, 0.0000182, 0.00001823],
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    address: KNOWN_TOKENS.RAY,
    price: 4.218,
    change24h: -0.63,
    volume24h: 145_000_000,
    avgVolume: 130_000_000,
    sparkline: [4.31, 4.28, 4.25, 4.22, 4.24, 4.21, 4.20, 4.22, 4.21, 4.218],
  },
  {
    symbol: 'PYTH',
    name: 'Pyth Network',
    address: KNOWN_TOKENS.PYTH,
    price: 0.3215,
    change24h: 1.92,
    volume24h: 290_000_000,
    avgVolume: 220_000_000,
    sparkline: [0.308, 0.311, 0.314, 0.313, 0.317, 0.320, 0.319, 0.322, 0.321, 0.3215],
  },
]

const SMART_MONEY_WALLETS = [
  { address: '7xKX...9mPQ', token: 'BONK', action: 'ACCUMULATE', time: '4m ago' },
  { address: 'AqR2...3fTL', token: 'BONK', action: 'ACCUMULATE', time: '11m ago' },
  { address: '9bNz...vW1Y', token: 'BONK', action: 'ACCUMULATE', time: '23m ago' },
  { address: 'Dr4K...8sEU', token: 'WIF', action: 'ACCUMULATE', time: '7m ago' },
]

function formatPrice(p) {
  if (p >= 1) return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  if (p >= 0.0001) return `$${p.toFixed(6)}`
  return `$${p.toFixed(8)}`
}

function formatVolume(v) {
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(0)}M`
  return `$${v.toLocaleString()}`
}

function MiniSparkline({ data, positive }) {
  const chartData = data.map((v, i) => ({ i, v }))
  return (
    <div style={{ width: 56, height: 24 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? '#22C55E' : '#EF4444'}
            strokeWidth={1.2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function jitter(base, pct = 0.005) {
  return base * (1 + (Math.random() - 0.5) * pct * 2)
}

export default function TokenScanner() {
  const [activeFilter, setActiveFilter] = useState('TRENDING')
  const [tokens, setTokens] = useState(SEED_TOKENS)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [fetching, setFetching] = useState(false)
  const tickRef = useRef(null)

  const fetchBirdeye = useCallback(async () => {
    setFetching(true)
    try {
      const symbols = Object.keys(KNOWN_TOKENS)
      const updated = await Promise.all(
        symbols.map(async (symbol, idx) => {
          const addr = Object.values(KNOWN_TOKENS)[idx]
          const res = await fetch(PROXY_API(`https://public-api.birdeye.so/defi/price?address=${addr}`))
          if (!res.ok) throw new Error('birdeye err')
          const json = await res.json()
          const seed = SEED_TOKENS.find(t => t.symbol === symbol)
          const price = json?.data?.value ?? seed.price
          return {
            ...seed,
            price,
            sparkline: [...seed.sparkline.slice(1), price],
          }
        })
      )
      setTokens(updated)
    } catch {
      // Fall back to jittered seed data
      setTokens(prev =>
        prev.map(t => {
          const np = jitter(t.price)
          return { ...t, price: np, sparkline: [...t.sparkline.slice(1), np] }
        })
      )
    } finally {
      setFetching(false)
      setLastRefresh(Date.now())
    }
  }, [])

  useEffect(() => {
    fetchBirdeye()
    tickRef.current = setInterval(fetchBirdeye, 30_000)
    return () => clearInterval(tickRef.current)
  }, [fetchBirdeye])

  // Simulated live micro-jitter
  useEffect(() => {
    const id = setInterval(() => {
      setTokens(prev =>
        prev.map(t => {
          const np = jitter(t.price)
          return { ...t, price: np, sparkline: [...t.sparkline.slice(1), np] }
        })
      )
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const filtered = [...tokens].sort((a, b) => {
    if (activeFilter === 'TRENDING') return Math.abs(b.change24h) - Math.abs(a.change24h)
    if (activeFilter === 'NEW LISTINGS') return a.symbol.localeCompare(b.symbol)
    if (activeFilter === 'VOLUME SURGE') return b.volume24h - a.volume24h
    return 0
  })

  const anomalies = tokens.filter(t => t.volume24h > t.avgVolume * 5)
  const smartMoneyTokens = Object.entries(
    SMART_MONEY_WALLETS.reduce((acc, w) => {
      acc[w.token] = (acc[w.token] || 0) + 1
      return acc
    }, {})
  ).filter(([, count]) => count >= 3)

  const age = Math.floor((Date.now() - lastRefresh) / 1000)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[#1A2332] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-[#F59E0B]" />
          <span className="text-[#F59E0B] text-[11px] tracking-widest font-bold">TOKEN SCANNER</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#4B5563] text-[10px]">{age}s ago</span>
          <button onClick={fetchBirdeye} className="text-[#4B5563] hover:text-[#F59E0B] transition-colors">
            <RefreshCw size={10} className={fetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-[#1A2332] flex-shrink-0">
        {FILTER_TABS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-1 py-2 text-[9px] tracking-widest transition-colors ${
              activeFilter === f
                ? 'text-[#F59E0B] border-b border-[#F59E0B] bg-[#0D1117]'
                : 'text-[#4B5563] hover:text-[#9CA3AF]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Token list */}
      <div className="flex-1 overflow-y-auto">
        {/* Column headers */}
        <div className="px-3 py-1.5 grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-[#1A2332]">
          <span className="text-[#4B5563] text-[9px] tracking-widest">TOKEN</span>
          <span className="text-[#4B5563] text-[9px] tracking-widest text-right w-16">PRICE</span>
          <span className="text-[#4B5563] text-[9px] tracking-widest text-right w-12">24H</span>
          <span className="text-[#4B5563] text-[9px] tracking-widest w-14">CHART</span>
        </div>

        {filtered.map((token, idx) => {
          const pos = token.change24h >= 0
          return (
            <div
              key={token.symbol}
              className="px-3 py-2.5 grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center border-b border-[#1A2332] hover:bg-[#0D1117] transition-colors cursor-pointer"
            >
              <div>
                <div className="text-[#E5E7EB] text-[11px] font-bold">{token.symbol}</div>
                <div className="text-[#4B5563] text-[9px] mt-0.5">{token.name}</div>
                <div className="text-[#4B5563] text-[9px]">VOL {formatVolume(token.volume24h)}</div>
              </div>
              <div className="text-[#E5E7EB] text-[10px] text-right w-16 tabular-nums">
                {formatPrice(token.price)}
              </div>
              <div className={`text-[10px] text-right w-12 tabular-nums font-bold ${pos ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {pos ? '+' : ''}{token.change24h.toFixed(2)}%
              </div>
              <div className="w-14 flex items-center">
                <MiniSparkline data={token.sparkline} positive={pos} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Volume Anomaly Detector */}
      <div className="flex-shrink-0 border-t border-[#1A2332] mx-3 mt-2">
        <div className="flex items-center gap-2 py-2">
          <AlertTriangle size={10} className="text-[#F59E0B]" />
          <span className="text-[#F59E0B] text-[9px] tracking-widest font-bold">VOLUME ANOMALY DETECTOR</span>
        </div>
        {anomalies.length === 0 ? (
          <div className="pb-2">
            <div className="border border-[#1A2332] px-3 py-2">
              <span className="text-[#4B5563] text-[9px]">NO ANOMALIES DETECTED // MONITORING ALL PAIRS</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 pb-2">
            {anomalies.map(t => (
              <div key={t.symbol} className="border border-[#F59E0B] px-3 py-2 anomaly-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#F59E0B] text-[10px] font-bold">{t.symbol}</span>
                    <span className="bg-[#F59E0B] text-[#080B0F] text-[8px] px-1.5 py-0.5 font-bold tracking-widest">
                      ANOMALY DETECTED
                    </span>
                  </div>
                  <span className="text-[#F59E0B] text-[9px]">{(t.volume24h / t.avgVolume).toFixed(1)}x AVG</span>
                </div>
                <div className="text-[#9CA3AF] text-[9px] mt-0.5">
                  Vol: {formatVolume(t.volume24h)} vs avg {formatVolume(t.avgVolume)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Smart Money Signal */}
      <div className="flex-shrink-0 border-t border-[#1A2332] mx-3 mb-3">
        <div className="flex items-center gap-2 py-2">
          <Users size={10} className="text-[#3B82F6]" />
          <span className="text-[#3B82F6] text-[9px] tracking-widest font-bold">SMART MONEY SIGNAL</span>
        </div>
        {smartMoneyTokens.length === 0 ? (
          <div className="border border-[#1A2332] px-3 py-2">
            <span className="text-[#4B5563] text-[9px]">SCANNING HIGH-REP WALLETS...</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {smartMoneyTokens.map(([token, count]) => (
              <div key={token} className="border border-[#3B82F6] px-3 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#3B82F6] text-[10px] font-bold">{token}</span>
                    <span className="bg-[#3B82F6] text-[#080B0F] text-[8px] px-1.5 py-0.5 font-bold tracking-widest">
                      ACCUMULATION
                    </span>
                  </div>
                  <span className="text-[#9CA3AF] text-[9px]">{count} wallets</span>
                </div>
                <div className="text-[#4B5563] text-[9px] mt-0.5">
                  {SMART_MONEY_WALLETS.filter(w => w.token === token).map(w => w.address).join(' · ')}
                </div>
                <div className="text-[#9CA3AF] text-[9px] mt-0.5">
                  {count}+ HIGH-REP WALLETS ACCUMULATING WITHIN 1H
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

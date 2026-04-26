import React, { useState, useEffect, useRef } from 'react'
import { Eye, ArrowUpRight, ArrowDownLeft, Repeat2, Waves, TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// Quicknode webhook simulation: on-chain whale tx feed
const WHALE_TEMPLATES = [
  { action: 'BUY',      symbol: 'SOL',  baseAmt: 120_000,  baseUsd: 17_800_000, protocol: 'Jupiter',   tier: 'MEGA' },
  { action: 'BUY',      symbol: 'WIF',  baseAmt: 850_000,  baseUsd: 1_207_000,  protocol: 'Raydium',   tier: 'LARGE' },
  { action: 'SELL',     symbol: 'BONK', baseAmt: 95_000_000_000, baseUsd: 1_732_000, protocol: 'Orca', tier: 'LARGE' },
  { action: 'BUY',      symbol: 'JUP',  baseAmt: 2_100_000, baseUsd: 1_641_000, protocol: 'Jupiter',  tier: 'LARGE' },
  { action: 'SELL',     symbol: 'RAY',  baseAmt: 45_000,   baseUsd: 189_500,    protocol: 'Raydium',   tier: 'MEDIUM' },
  { action: 'TRANSFER', symbol: 'SOL',  baseAmt: 33_000,   baseUsd: 4_890_000,  protocol: 'Wallet',    tier: 'MEGA' },
  { action: 'SELL',     symbol: 'SOL',  baseAmt: 8_400,    baseUsd: 1_245_000,  protocol: 'Jupiter',   tier: 'LARGE' },
  { action: 'BUY',      symbol: 'PYTH', baseAmt: 4_200_000, baseUsd: 1_350_000, protocol: 'Orca',     tier: 'LARGE' },
  { action: 'TRANSFER', symbol: 'JUP',  baseAmt: 9_000_000, baseUsd: 7_040_000, protocol: 'Wallet',   tier: 'MEGA' },
  { action: 'BUY',      symbol: 'BONK', baseAmt: 12_000_000_000, baseUsd: 218_800, protocol: 'Raydium', tier: 'MEDIUM' },
]

const SHORT_ADDRESSES = [
  '7xKXt...9mPQ',
  'AqR2F...3fTL',
  '9bNzH...vW1Y',
  'Dr4Km...8sEU',
  'FpJ3L...nB2R',
  'Hs8Wq...cE7K',
  'Kw6Rv...xA4M',
  'Mq9Tb...dF1Z',
]

const MARKET_INTEL_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  buyPressure: 45 + Math.random() * 30,
  volume: 800 + Math.random() * 1200,
  whaleCount: Math.floor(3 + Math.random() * 12),
}))

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
function jitterPct(base, pct = 0.15) {
  return Math.round(base * (1 + (Math.random() - 0.5) * pct))
}

function generateTx(id) {
  const tpl = randomItem(WHALE_TEMPLATES)
  const wallet = randomItem(SHORT_ADDRESSES)
  const usd = jitterPct(tpl.baseUsd)
  const secsAgo = Math.floor(Math.random() * 45)
  const timeLabel = secsAgo === 0 ? 'now' : secsAgo < 60 ? `${secsAgo}s ago` : `${Math.floor(secsAgo / 60)}m ago`
  return { id, ...tpl, wallet, usd, secsAgo, timeLabel, ts: Date.now() - secsAgo * 1000 }
}

const INITIAL_FEED = Array.from({ length: 18 }, (_, i) => generateTx(i))

function formatUsd(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

function formatAmt(n, symbol) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return `${n.toLocaleString()}`
}

const TIER_STYLES = {
  MEGA:   { bg: 'bg-[#7C3AED]', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]' },
  LARGE:  { bg: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]' },
  MEDIUM: { bg: 'bg-[#3B82F6]', text: 'text-[#3B82F6]', border: 'border-[#3B82F6]' },
}

const ACTION_ICON = {
  BUY:      <ArrowUpRight size={10} className="text-[#22C55E]" />,
  SELL:     <ArrowDownLeft size={10} className="text-[#EF4444]" />,
  TRANSFER: <Repeat2 size={10} className="text-[#3B82F6]" />,
}
const ACTION_COLOR = {
  BUY:      'text-[#22C55E]',
  SELL:     'text-[#EF4444]',
  TRANSFER: 'text-[#3B82F6]',
}

const MARKET_STATS_SEED = {
  fearGreed: 62,
  fearGreedLabel: 'GREED',
  solDominance: 58.3,
  dexVolume: 4.2,
  activeWallets: 182_400,
  netFlow: +320_000_000,
  topFlow: 'SOL',
}

function FearGreedDial({ value, label }) {
  const color = value >= 75 ? '#EF4444' : value >= 55 ? '#F59E0B' : value >= 45 ? '#9CA3AF' : value >= 25 ? '#3B82F6' : '#22C55E'
  const angle = -90 + (value / 100) * 180
  const r = 38
  const cx = 54; const cy = 54
  const startX = cx + r * Math.cos(((-90) * Math.PI) / 180)
  const startY = cy + r * Math.sin(((-90) * Math.PI) / 180)
  const endX = cx + r * Math.cos(((90) * Math.PI) / 180)
  const endY = cy + r * Math.sin(((90) * Math.PI) / 180)
  const needleX = cx + (r - 8) * Math.cos((angle * Math.PI) / 180)
  const needleY = cy + (r - 8) * Math.sin((angle * Math.PI) / 180)

  return (
    <div className="flex flex-col items-center">
      <svg width={108} height={62} viewBox="0 0 108 62">
        {/* arc bg */}
        <path d={`M${startX},${startY} A${r},${r} 0 0 1 ${endX},${endY}`} fill="none" stroke="#1A2332" strokeWidth={8} strokeLinecap="round" />
        {/* arc fill */}
        {[0, 25, 50, 75].map((start, idx) => {
          const end = [25, 50, 75, 100][idx]
          const clr = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'][idx]
          const sa = -90 + (start / 100) * 180
          const ea = -90 + (end / 100) * 180
          const sx = cx + r * Math.cos((sa * Math.PI) / 180)
          const sy = cy + r * Math.sin((sa * Math.PI) / 180)
          const ex = cx + r * Math.cos((ea * Math.PI) / 180)
          const ey = cy + r * Math.sin((ea * Math.PI) / 180)
          return (
            <path key={idx} d={`M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`}
              fill="none" stroke={clr} strokeWidth={5} strokeLinecap="butt" opacity={0.35} />
          )
        })}
        {/* needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={3} fill={color} />
        <text x={cx} y={cy + 14} textAnchor="middle" fill={color} fontSize={11} fontFamily="JetBrains Mono, monospace" fontWeight="bold">{value}</text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill="#9CA3AF" fontSize={8} fontFamily="JetBrains Mono, monospace">{label}</text>
      </svg>
    </div>
  )
}

export default function WhaleTracker() {
  const [feed, setFeed] = useState(INITIAL_FEED)
  const [filter, setFilter] = useState('ALL')
  const [marketStats, setMarketStats] = useState(MARKET_STATS_SEED)
  const [buyPct, setBuyPct] = useState(58)
  const [chartData] = useState(MARKET_INTEL_HISTORY)
  const idRef = useRef(INITIAL_FEED.length)

  // Quicknode webhook simulation: inject new whale tx every 5-12s
  useEffect(() => {
    const inject = () => {
      const newTx = generateTx(idRef.current++)
      setFeed(prev => [newTx, ...prev].slice(0, 50))
    }
    const schedule = () => {
      const delay = 5_000 + Math.random() * 7_000
      return setTimeout(() => {
        inject()
        tickRef.current = setTimeout(schedule, 0)
      }, delay)
    }
    const tickRef = { current: null }
    tickRef.current = schedule()
    return () => clearTimeout(tickRef.current)
  }, [])

  // Update buy pressure / stats
  useEffect(() => {
    const id = setInterval(() => {
      setBuyPct(prev => Math.min(85, Math.max(30, prev + (Math.random() - 0.48) * 3)))
      setMarketStats(prev => ({
        ...prev,
        fearGreed: Math.min(90, Math.max(20, prev.fearGreed + Math.round((Math.random() - 0.5) * 4))),
        solDominance: Math.min(70, Math.max(48, prev.solDominance + (Math.random() - 0.5) * 0.4)),
        activeWallets: Math.max(150_000, prev.activeWallets + Math.round((Math.random() - 0.5) * 2000)),
      }))
    }, 8_000)
    return () => clearInterval(id)
  }, [])

  const filtered = filter === 'ALL' ? feed : feed.filter(tx => tx.action === filter)

  const sells = feed.filter(t => t.action === 'SELL').reduce((s, t) => s + t.usd, 0)
  const buys  = feed.filter(t => t.action === 'BUY').reduce((s, t) => s + t.usd, 0)
  const total = buys + sells || 1
  const liveFlowPct = Math.round((buys / total) * 100)

  const fearGreedLabel =
    marketStats.fearGreed >= 75 ? 'EXTREME GREED'
    : marketStats.fearGreed >= 55 ? 'GREED'
    : marketStats.fearGreed >= 45 ? 'NEUTRAL'
    : marketStats.fearGreed >= 25 ? 'FEAR'
    : 'EXTREME FEAR'

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-[#1A2332] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Waves size={12} className="text-[#F59E0B]" />
          <span className="text-[#F59E0B] text-[11px] tracking-widest font-bold">WHALE TRACKER</span>
          <span className="text-[#4B5563] text-[9px]">// QUICKNODE STREAM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] blink-dot" />
          <span className="text-[#4B5563] text-[9px]">LIVE WEBHOOKS</span>
        </div>
      </div>

      {/* Market Intel strip */}
      <div className="border-b border-[#1A2332] px-4 py-2 grid grid-cols-5 gap-3 flex-shrink-0 bg-[#0D1117]">
        <div>
          <div className="text-[#4B5563] text-[9px] tracking-widest mb-0.5">FEAR/GREED</div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#F59E0B] text-[11px] font-bold">{marketStats.fearGreed}</span>
            <span className="text-[#9CA3AF] text-[9px]">{fearGreedLabel}</span>
          </div>
        </div>
        <div>
          <div className="text-[#4B5563] text-[9px] tracking-widest mb-0.5">SOL DOMINANCE</div>
          <div className="text-[#E5E7EB] text-[11px] font-bold">{marketStats.solDominance.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-[#4B5563] text-[9px] tracking-widest mb-0.5">DEX VOLUME</div>
          <div className="text-[#E5E7EB] text-[11px] font-bold">${marketStats.dexVolume.toFixed(1)}B</div>
        </div>
        <div>
          <div className="text-[#4B5563] text-[9px] tracking-widest mb-0.5">ACTIVE WALLETS</div>
          <div className="text-[#E5E7EB] text-[11px] font-bold">{(marketStats.activeWallets / 1000).toFixed(1)}K</div>
        </div>
        <div>
          <div className="text-[#4B5563] text-[9px] tracking-widest mb-0.5">NET FLOW</div>
          <div className={`text-[11px] font-bold ${marketStats.netFlow >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {marketStats.netFlow >= 0 ? '+' : ''}{formatUsd(Math.abs(marketStats.netFlow))}
          </div>
        </div>
      </div>

      {/* Buy/Sell pressure bar */}
      <div className="px-4 py-2 border-b border-[#1A2332] flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#22C55E] text-[9px] font-bold">BUY {liveFlowPct}%</span>
          <span className="text-[#4B5563] text-[9px] tracking-widest">24H WHALE FLOW</span>
          <span className="text-[#EF4444] text-[9px] font-bold">SELL {100 - liveFlowPct}%</span>
        </div>
        <div className="h-1.5 bg-[#1A2332] overflow-hidden">
          <div
            className="h-full bg-[#22C55E] transition-all duration-700"
            style={{ width: `${liveFlowPct}%` }}
          />
        </div>
      </div>

      {/* Chart mini */}
      <div className="px-4 pt-2 pb-1 border-b border-[#1A2332] flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#4B5563] text-[9px] tracking-widest">WHALE FLOW — 24H CHART</span>
        </div>
        <div style={{ height: 60 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="buyPressure" stroke="#F59E0B" strokeWidth={1.5} fill="url(#wg)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex border-b border-[#1A2332] flex-shrink-0">
        {['ALL', 'BUY', 'SELL', 'TRANSFER'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-[9px] tracking-widest transition-colors ${
              filter === f
                ? 'text-[#F59E0B] bg-[#0D1117] border-b border-[#F59E0B]'
                : 'text-[#4B5563] hover:text-[#9CA3AF]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed header */}
      <div className="px-3 py-1.5 grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 border-b border-[#1A2332] flex-shrink-0">
        <span className="text-[#4B5563] text-[9px] tracking-widest w-14">TIER</span>
        <span className="text-[#4B5563] text-[9px] tracking-widest">WALLET</span>
        <span className="text-[#4B5563] text-[9px] tracking-widest w-12">ACT</span>
        <span className="text-[#4B5563] text-[9px] tracking-widest w-10 text-right">TOKEN</span>
        <span className="text-[#4B5563] text-[9px] tracking-widest w-16 text-right">VALUE</span>
        <span className="text-[#4B5563] text-[9px] tracking-widest w-12 text-right">TIME</span>
      </div>

      {/* Feed rows */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((tx, idx) => {
          const tierStyle = TIER_STYLES[tx.tier] || TIER_STYLES.MEDIUM
          return (
            <div
              key={tx.id}
              className="px-3 py-2 grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-2 items-center border-b border-[#1A2332] hover:bg-[#0D1117] transition-colors slide-in-row"
              style={{ animationDelay: `${idx * 0}ms` }}
            >
              <div className={`w-14 text-[8px] px-1 py-0.5 border ${tierStyle.border} ${tierStyle.text} tracking-wider text-center`}>
                {tx.tier}
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <Eye size={9} className="text-[#4B5563] flex-shrink-0" />
                <span className="text-[#9CA3AF] text-[10px] truncate">{tx.wallet}</span>
              </div>
              <div className="flex items-center gap-1 w-12">
                {ACTION_ICON[tx.action]}
                <span className={`text-[9px] ${ACTION_COLOR[tx.action]}`}>{tx.action}</span>
              </div>
              <div className="text-[#E5E7EB] text-[10px] w-10 text-right font-bold">{tx.symbol}</div>
              <div className="text-[#E5E7EB] text-[10px] w-16 text-right tabular-nums">{formatUsd(tx.usd)}</div>
              <div className="text-[#4B5563] text-[9px] w-12 text-right">{tx.timeLabel}</div>
            </div>
          )
        })}
      </div>

      {/* Fear & Greed dial */}
      <div className="flex-shrink-0 border-t border-[#1A2332] px-4 py-3 bg-[#0D1117]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[#4B5563] text-[9px] tracking-widest mb-1">MARKET SENTIMENT</div>
            <FearGreedDial value={marketStats.fearGreed} label={fearGreedLabel} />
          </div>
          <div className="space-y-2 text-right">
            <div>
              <div className="text-[#4B5563] text-[9px]">TOP ACTIVITY</div>
              <div className="flex items-center gap-1 justify-end">
                <Flame size={10} className="text-[#F59E0B]" />
                <span className="text-[#F59E0B] text-[11px] font-bold">{marketStats.topFlow}</span>
              </div>
            </div>
            <div>
              <div className="text-[#4B5563] text-[9px]">TRANSACTIONS (1H)</div>
              <div className="text-[#E5E7EB] text-[11px] font-bold">{feed.length}</div>
            </div>
            <div>
              <div className="text-[#4B5563] text-[9px]">MEGA WHALES</div>
              <div className="text-[#7C3AED] text-[11px] font-bold">{feed.filter(t => t.tier === 'MEGA').length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

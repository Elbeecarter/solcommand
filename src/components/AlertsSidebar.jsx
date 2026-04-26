import React, { useState, useEffect, useRef } from 'react'
import { Bell, BellOff, Plus, X, Trash2, CheckCircle, AlertTriangle, Info, Zap, Target, Settings } from 'lucide-react'

const ALERT_TYPES = {
  CRITICAL: { color: 'text-[#EF4444]', border: 'border-[#EF4444]', bg: 'bg-[#EF4444]', label: 'CRITICAL' },
  WARNING:  { color: 'text-[#F59E0B]', border: 'border-[#F59E0B]', bg: 'bg-[#F59E0B]', label: 'WARNING' },
  INFO:     { color: 'text-[#3B82F6]', border: 'border-[#3B82F6]', bg: 'bg-[#3B82F6]', label: 'INFO' },
  SUCCESS:  { color: 'text-[#22C55E]', border: 'border-[#22C55E]', bg: 'bg-[#22C55E]', label: 'SIGNAL' },
}

const SEED_ALERTS = [
  {
    id: 1,
    type: 'CRITICAL',
    title: 'MEGA WHALE DETECTED',
    body: 'JUP — 9bNzH...vW1Y moved $7.04M to unknown wallet',
    time: '2m ago',
    ts: Date.now() - 120_000,
    read: false,
  },
  {
    id: 2,
    type: 'WARNING',
    title: 'VOLUME SURGE — WIF',
    body: 'Volume 5.4x above 7-day average in last 30 min',
    time: '7m ago',
    ts: Date.now() - 420_000,
    read: false,
  },
  {
    id: 3,
    type: 'SUCCESS',
    title: 'SMART MONEY SIGNAL',
    body: 'BONK: 3+ high-rep wallets accumulating within 1h window',
    time: '12m ago',
    ts: Date.now() - 720_000,
    read: true,
  },
  {
    id: 4,
    type: 'INFO',
    title: 'PRICE TARGET HIT',
    body: 'SOL crossed $148.00 upside target',
    time: '18m ago',
    ts: Date.now() - 1_080_000,
    read: true,
  },
  {
    id: 5,
    type: 'WARNING',
    title: 'LARGE SELL PRESSURE',
    body: 'RAY — sell flow exceeded buy flow by 3.1x in 15m',
    time: '24m ago',
    ts: Date.now() - 1_440_000,
    read: true,
  },
  {
    id: 6,
    type: 'SUCCESS',
    title: 'NEW TOKEN BREAKOUT',
    body: 'BONK broke 30-day high with strong volume confirmation',
    time: '31m ago',
    ts: Date.now() - 1_860_000,
    read: true,
  },
  {
    id: 7,
    type: 'INFO',
    title: 'QUICKNODE WEBHOOK',
    body: 'Monitoring 147 addresses — all feeds nominal',
    time: '45m ago',
    ts: Date.now() - 2_700_000,
    read: true,
  },
]

const SEED_RULES = [
  { id: 1, active: true,  label: 'Whale buy > $1M',       type: 'CRITICAL' },
  { id: 2, active: true,  label: 'Volume surge > 5x avg', type: 'WARNING' },
  { id: 3, active: true,  label: 'Smart money cluster',   type: 'SUCCESS' },
  { id: 4, active: false, label: 'New listing detected',  type: 'INFO' },
  { id: 5, active: true,  label: 'SOL dominance ±5%',     type: 'WARNING' },
  { id: 6, active: true,  label: 'Price target hit',      type: 'INFO' },
]

const PORTFOLIO_SEED = [
  { symbol: 'SOL',  pct: 48, exposure: '$72.4K', change: +2.41 },
  { symbol: 'WIF',  pct: 22, exposure: '$33.1K', change: +5.87 },
  { symbol: 'JUP',  pct: 15, exposure: '$22.6K', change: -1.14 },
  { symbol: 'BONK', pct: 10, exposure: '$15.0K', change: +8.34 },
  { symbol: 'RAY',  pct: 5,  exposure: '$7.5K',  change: -0.63 },
]

const NEW_ALERT_TEMPLATES = [
  { type: 'CRITICAL', title: 'SELL WALL DETECTED',       body: 'SOL — large sell wall forming at $152.00 level' },
  { type: 'SUCCESS',  title: 'MOMENTUM SIGNAL',          body: 'BONK showing bullish divergence on 1H chart' },
  { type: 'WARNING',  title: 'LIQUIDITY PULL',           body: 'JUP/USDC pool lost 12% TVL in last 10 min' },
  { type: 'INFO',     title: 'WALLET CLUSTER ACTIVITY',  body: 'Dr4Km...8sEU and 4 related wallets active simultaneously' },
  { type: 'SUCCESS',  title: 'WHALE ACCUMULATION',       body: 'Multiple MEGA wallets accumulating SOL < $145' },
  { type: 'CRITICAL', title: 'FLASH CRASH RISK',         body: 'WIF — thin orderbook detected, high volatility imminent' },
  { type: 'WARNING',  title: 'EXCHANGE OUTFLOW SPIKE',   body: 'SOL net outflow from exchanges: +$48M in 1h' },
]

let alertIdCounter = 100

export default function AlertsSidebar() {
  const [alerts, setAlerts] = useState(SEED_ALERTS)
  const [rules, setRules] = useState(SEED_RULES)
  const [view, setView] = useState('ALERTS') // ALERTS | RULES | EXPOSURE
  const [muted, setMuted] = useState(false)
  const [showAddRule, setShowAddRule] = useState(false)
  const [newRuleLabel, setNewRuleLabel] = useState('')
  const tickRef = useRef(null)

  // Inject new alerts periodically
  useEffect(() => {
    const schedule = () => {
      const delay = 10_000 + Math.random() * 15_000
      tickRef.current = setTimeout(() => {
        if (!muted) {
          const tpl = NEW_ALERT_TEMPLATES[Math.floor(Math.random() * NEW_ALERT_TEMPLATES.length)]
          setAlerts(prev => [{
            id: alertIdCounter++,
            ...tpl,
            time: 'just now',
            ts: Date.now(),
            read: false,
          }, ...prev].slice(0, 60))
        }
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(tickRef.current)
  }, [muted])

  const unreadCount = alerts.filter(a => !a.read).length

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })))
  }

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))
  }

  const addRule = () => {
    if (!newRuleLabel.trim()) return
    setRules(prev => [...prev, {
      id: Date.now(),
      active: true,
      label: newRuleLabel.trim(),
      type: 'INFO',
    }])
    setNewRuleLabel('')
    setShowAddRule(false)
  }

  const deleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id))
  }

  const TABS_VIEW = ['ALERTS', 'RULES', 'EXPOSURE']

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-[#1A2332] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={12} className="text-[#F59E0B]" />
          <span className="text-[#F59E0B] text-[11px] tracking-widest font-bold">ALERTS</span>
          {unreadCount > 0 && (
            <span className="bg-[#EF4444] text-[#fff] text-[8px] px-1.5 py-0.5 font-bold">{unreadCount}</span>
          )}
        </div>
        <button
          onClick={() => setMuted(m => !m)}
          className={`transition-colors ${muted ? 'text-[#4B5563]' : 'text-[#F59E0B]'}`}
          title={muted ? 'Unmute alerts' : 'Mute alerts'}
        >
          {muted ? <BellOff size={12} /> : <Bell size={12} />}
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-[#1A2332] flex-shrink-0">
        {TABS_VIEW.map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-1.5 text-[9px] tracking-widest transition-colors ${
              view === v
                ? 'text-[#F59E0B] bg-[#0D1117] border-b border-[#F59E0B]'
                : 'text-[#4B5563] hover:text-[#9CA3AF]'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* ALERTS view */}
      {view === 'ALERTS' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] text-[#4B5563] hover:text-[#9CA3AF] border-b border-[#1A2332] transition-colors"
            >
              <CheckCircle size={9} />
              MARK ALL READ
            </button>
          )}
          {alerts.map(alert => {
            const style = ALERT_TYPES[alert.type] || ALERT_TYPES.INFO
            return (
              <div
                key={alert.id}
                className={`px-3 py-2.5 border-b border-[#1A2332] transition-colors ${!alert.read ? 'bg-[#0D1117]' : ''}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                    <div className={`w-1 h-1 rounded-full flex-shrink-0 mt-1.5 ${alert.read ? 'bg-[#1A2332]' : style.bg}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[8px] px-1 py-0.5 border ${style.border} ${style.color} tracking-widest flex-shrink-0`}>
                          {style.label}
                        </span>
                        <span className={`text-[10px] font-bold ${alert.read ? 'text-[#9CA3AF]' : 'text-[#E5E7EB]'}`}>
                          {alert.title}
                        </span>
                      </div>
                      <div className="text-[#4B5563] text-[9px] mt-1 leading-tight">
                        {alert.body}
                      </div>
                      <div className="text-[#4B5563] text-[8px] mt-1">{alert.time}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-[#4B5563] hover:text-[#EF4444] transition-colors flex-shrink-0 mt-0.5"
                  >
                    <X size={9} />
                  </button>
                </div>
              </div>
            )
          })}
          {alerts.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <CheckCircle size={20} className="text-[#22C55E] mx-auto mb-2 opacity-50" />
                <div className="text-[#4B5563] text-[9px] tracking-widest">NO ACTIVE ALERTS</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RULES view */}
      {view === 'RULES' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-3 py-2 border-b border-[#1A2332] flex items-center justify-between">
            <span className="text-[#4B5563] text-[9px] tracking-widest">ALERT RULES</span>
            <button
              onClick={() => setShowAddRule(s => !s)}
              className="flex items-center gap-1 text-[#F59E0B] text-[9px] hover:opacity-80 transition-opacity"
            >
              <Plus size={9} />
              ADD
            </button>
          </div>

          {showAddRule && (
            <div className="px-3 py-2 border-b border-[#F59E0B] bg-[#0D1117]">
              <input
                type="text"
                value={newRuleLabel}
                onChange={e => setNewRuleLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addRule()}
                placeholder="Rule description..."
                className="w-full bg-[#080B0F] border border-[#1A2332] text-[#E5E7EB] text-[10px] px-2 py-1.5 outline-none focus:border-[#F59E0B] font-mono placeholder-[#4B5563]"
              />
              <div className="flex gap-2 mt-1.5">
                <button onClick={addRule} className="flex-1 text-[9px] text-[#080B0F] bg-[#F59E0B] py-1 font-bold tracking-widest hover:bg-[#FBBF24] transition-colors">
                  SAVE
                </button>
                <button onClick={() => setShowAddRule(false)} className="flex-1 text-[9px] text-[#4B5563] border border-[#1A2332] py-1 hover:text-[#9CA3AF] transition-colors">
                  CANCEL
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {rules.map(rule => {
              const style = ALERT_TYPES[rule.type] || ALERT_TYPES.INFO
              return (
                <div key={rule.id} className="px-3 py-2.5 border-b border-[#1A2332] flex items-center gap-2 hover:bg-[#0D1117] transition-colors">
                  <button onClick={() => toggleRule(rule.id)} className="flex-shrink-0">
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${rule.active ? 'bg-[#22C55E]' : 'bg-[#1A2332]'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-[#080B0F] transition-all ${rule.active ? 'left-4' : 'left-0.5'}`} />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[7px] px-1 border ${style.border} ${style.color} flex-shrink-0`}>{style.label}</span>
                      <span className={`text-[10px] truncate ${rule.active ? 'text-[#E5E7EB]' : 'text-[#4B5563]'}`}>{rule.label}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteRule(rule.id)} className="text-[#4B5563] hover:text-[#EF4444] flex-shrink-0 transition-colors">
                    <Trash2 size={9} />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="px-3 py-2 border-t border-[#1A2332] bg-[#0D1117] flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[#4B5563] text-[9px]">ACTIVE RULES</span>
              <span className="text-[#22C55E] text-[10px] font-bold">{rules.filter(r => r.active).length}/{rules.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* EXPOSURE view */}
      {view === 'EXPOSURE' && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-3 py-2 border-b border-[#1A2332] flex-shrink-0">
            <div className="text-[#4B5563] text-[9px] tracking-widest">PORTFOLIO EXPOSURE</div>
            <div className="text-[#E5E7EB] text-[12px] font-bold mt-0.5">$150.6K</div>
            <div className="text-[#22C55E] text-[9px]">+$3.2K TODAY (+2.2%)</div>
          </div>

          {/* Allocation bar */}
          <div className="px-3 py-2 border-b border-[#1A2332] flex-shrink-0">
            <div className="text-[#4B5563] text-[9px] mb-1.5 tracking-widest">ALLOCATION</div>
            <div className="flex h-3 overflow-hidden gap-0.5">
              {PORTFOLIO_SEED.map((token, idx) => {
                const colors = ['#F59E0B', '#3B82F6', '#22C55E', '#7C3AED', '#EF4444']
                return (
                  <div key={token.symbol} style={{ width: `${token.pct}%`, background: colors[idx] }} className="h-full" title={`${token.symbol} ${token.pct}%`} />
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {PORTFOLIO_SEED.map((token, idx) => {
                const colors = ['#F59E0B', '#3B82F6', '#22C55E', '#7C3AED', '#EF4444']
                return (
                  <div key={token.symbol} className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5" style={{ background: colors[idx] }} />
                    <span className="text-[9px] text-[#9CA3AF]">{token.symbol} {token.pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Token breakdown */}
          <div className="flex-1">
            {PORTFOLIO_SEED.map(token => {
              const pos = token.change >= 0
              return (
                <div key={token.symbol} className="px-3 py-2.5 border-b border-[#1A2332] hover:bg-[#0D1117] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target size={10} className="text-[#4B5563]" />
                      <span className="text-[#E5E7EB] text-[11px] font-bold">{token.symbol}</span>
                    </div>
                    <span className="text-[#E5E7EB] text-[10px] tabular-nums">{token.exposure}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <div className="w-full bg-[#1A2332] h-0.5 mr-2">
                      <div className="bg-[#F59E0B] h-0.5" style={{ width: `${token.pct}%` }} />
                    </div>
                    <span className={`text-[9px] font-bold flex-shrink-0 ${pos ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                      {pos ? '+' : ''}{token.change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[#4B5563] text-[9px] mt-0.5">{token.pct}% of portfolio</div>
                </div>
              )
            })}
          </div>

          <div className="flex-shrink-0 border-t border-[#1A2332] px-3 py-3 bg-[#0D1117]">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={9} className="text-[#F59E0B]" />
              <span className="text-[#4B5563] text-[9px] tracking-widest">RISK MONITOR</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[#4B5563] text-[9px]">Concentration risk</span>
                <span className="text-[#F59E0B] text-[9px] font-bold">MEDIUM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563] text-[9px]">Meme coin exposure</span>
                <span className="text-[#EF4444] text-[9px] font-bold">HIGH — 32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4B5563] text-[9px]">Correlation risk</span>
                <span className="text-[#22C55E] text-[9px] font-bold">LOW</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

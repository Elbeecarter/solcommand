import React, { useState } from 'react'
import { Terminal, Cpu, Radio, Activity, Shield, Zap } from 'lucide-react'
import IntelTab from './components/IntelTab.jsx'

const TABS = [
  { id: 'intel', label: 'INTEL', icon: Cpu },
  { id: 'command', label: 'COMMAND', icon: Terminal },
  { id: 'signals', label: 'SIGNALS', icon: Radio },
  { id: 'ops', label: 'OPS', icon: Activity },
]

function PlaceholderTab({ label }) {
  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="text-center space-y-3">
        <div className="text-[#F59E0B] font-mono text-xs tracking-widest opacity-40">
          ── {label} MODULE ──
        </div>
        <div className="text-[#4B5563] font-mono text-xs">
          STANDBY // AWAITING ACTIVATION
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('intel')
  const now = new Date()
  const timeStr = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <div className="min-h-screen bg-[#080B0F] font-mono flex flex-col">
      <div className="scanline" />

      {/* Top bar */}
      <header className="border-b border-[#1A2332] px-4 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] blink-dot" />
            <span className="text-[#F59E0B] text-xs font-bold tracking-[0.2em]">SOLCOMMAND</span>
          </div>
          <span className="text-[#1A2332] text-xs">|</span>
          <span className="text-[#4B5563] text-[10px] tracking-widest">TACTICAL INTELLIGENCE SYSTEM v2.1</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span className="text-[#4B5563] text-[10px]">MAINNET</span>
          </div>
          <span className="text-[#4B5563] text-[10px]">{timeStr}</span>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="border-b border-[#1A2332] px-4 flex items-center gap-0 flex-shrink-0">
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-widest border-b-2 transition-colors duration-150
                ${active
                  ? 'border-[#F59E0B] text-[#F59E0B] bg-[#0D1117]'
                  : 'border-transparent text-[#4B5563] hover:text-[#9CA3AF] hover:bg-[#0D1117]'
                }
              `}
            >
              <Icon size={11} />
              {tab.label}
            </button>
          )
        })}
        <div className="ml-auto flex items-center gap-3 py-2">
          <div className="flex items-center gap-1.5">
            <Shield size={10} className="text-[#22C55E]" />
            <span className="text-[#4B5563] text-[10px]">SECURE FEED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-[#F59E0B]" />
            <span className="text-[#4B5563] text-[10px]">LIVE</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'intel' && <IntelTab />}
        {activeTab === 'command' && <PlaceholderTab label="COMMAND" />}
        {activeTab === 'signals' && <PlaceholderTab label="SIGNALS" />}
        {activeTab === 'ops' && <PlaceholderTab label="OPS" />}
      </main>
    </div>
  )
}

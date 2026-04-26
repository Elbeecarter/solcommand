import React from 'react'
import TokenScanner from './TokenScanner.jsx'
import WhaleTracker from './WhaleTracker.jsx'
import AlertsSidebar from './AlertsSidebar.jsx'

export default function IntelTab() {
  return (
    <div className="h-full flex overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Column 1 — Token Scanner */}
      <div className="w-[34%] border-r border-[#1A2332] overflow-y-auto flex-shrink-0">
        <TokenScanner />
      </div>

      {/* Column 2 — Whale Tracker + Market Intel */}
      <div className="flex-1 border-r border-[#1A2332] overflow-y-auto">
        <WhaleTracker />
      </div>

      {/* Column 3 — Alerts Sidebar */}
      <div className="w-[23%] overflow-y-auto flex-shrink-0">
        <AlertsSidebar />
      </div>
    </div>
  )
}

import { useState } from 'react'
import { TIER_META } from '../data/schools'

const TIER_ORDER = ['legend', 'ritual', 'bar', 'local']

export default function SchoolPanel({ school, onSelectSpot, onClose }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(new Set())

  if (!school) return null

  const a = school.colors.primary

  const spots = filter === 'all'
    ? [...school.spots].sort((x, y) => TIER_ORDER.indexOf(x.tier) - TIER_ORDER.indexOf(y.tier))
    : school.spots.filter(s => s.tier === filter)

  const toggleExpand = id => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: 185, flexShrink: 0,
        background: `linear-gradient(135deg, ${a}55 0%, #0d0d16 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${a}15 1px, transparent 1px)`, backgroundSize: '18px 18px' }} />
        <div style={{
          position: 'absolute', right: -6, top: -6,
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 100,
          opacity: 0.07, color: '#fff', lineHeight: 1, userSelect: 'none', letterSpacing: 3,
        }}>{school.abbr}</div>

        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, width: 28, height: 28,
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, color: 'rgba(255,255,255,0.65)', fontSize: 13,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
        >✕</button>

        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 48 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 600, color: a, marginBottom: 3 }}>
            {school.conf} · {school.city}
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: 3, color: '#f0ece0', lineHeight: 1 }}>
            {school.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 12, color: 'rgba(240,236,224,0.55)', marginTop: 2 }}>
            {school.nick}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ padding: '16px 20px 60px', overflowY: 'auto', flex: 1 }}>

        {/* Lore */}
        <div style={{
          borderLeft: `2px solid ${a}`, padding: '8px 0 8px 13px', marginBottom: 18,
          fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
          fontSize: 12, color: 'rgba(240,236,224,0.55)', lineHeight: 1.65,
        }}>{school.lore}</div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 18 }}>
          {[
            { n: school.stats.spots, l: 'Spots Listed' },
            { n: school.stats.lore, l: 'Lore Entries' },
            { n: `${school.stats.verified}%`, l: 'Verified' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: 1, color: a, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Drink */}
        <div style={{
          background: `${a}12`, border: `1px solid ${a}28`, borderRadius: 7,
          padding: '12px 14px', marginBottom: 18, display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1, marginTop: 1 }}>{school.drink.icon}</span>
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2, color: a, marginBottom: 3 }}>{school.drink.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(240,236,224,0.55)', lineHeight: 1.5 }}>{school.drink.desc}</div>
          </div>
        </div>

        {/* Canon header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: a, flexShrink: 0 }}>The Canon</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 11, flexWrap: 'wrap' }}>
          {['all', 'legend', 'bar', 'local', 'ritual'].map(f => {
            const active = filter === f
            const tm = f !== 'all' ? TIER_META[f] : null
            return (
              <button key={f} onClick={() => { setFilter(f); setExpanded(new Set()) }} style={{
                fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 3, cursor: 'pointer', fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif", transition: 'all 0.15s',
                background: active ? (tm ? tm.bg : 'rgba(200,160,60,0.15)') : 'rgba(255,255,255,0.03)',
                color: active ? (tm ? tm.color : '#c8a03c') : 'rgba(240,236,224,0.3)',
                border: `1px solid ${active ? (tm ? tm.border : 'rgba(200,160,60,0.22)') : 'rgba(255,255,255,0.06)'}`,
              }}>
                {f === 'all' ? 'All' : TIER_META[f].label}
              </button>
            )
          })}
        </div>

        {/* Spot cards */}
        {spots.map(spot => {
          const tm = TIER_META[spot.tier]
          const isEx = expanded.has(spot.id)
          return (
            <div key={spot.id} style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 7, padding: '10px 12px', marginBottom: 6,
              cursor: 'pointer', transition: 'background 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.045)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            onClick={() => toggleExpand(spot.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{
                  fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase',
                  padding: '2px 6px', borderRadius: 2, fontWeight: 700, flexShrink: 0, marginTop: 2,
                  background: tm.bg, color: tm.color, border: `1px solid ${tm.border}`,
                }}>{spot.tier}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#f0ece0', marginBottom: 2 }}>{spot.name}</div>
                  {!isEx && <div style={{ fontSize: 11, color: 'rgba(240,236,224,0.55)', lineHeight: 1.4 }}>
                    {spot.desc.length > 80 ? spot.desc.slice(0, 80) + '…' : spot.desc}
                  </div>}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(240,236,224,0.3)', flexShrink: 0, marginTop: 2, transition: 'transform 0.2s', transform: isEx ? 'rotate(180deg)' : 'none' }}>▾</div>
              </div>

              {isEx && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize: 11, color: 'rgba(240,236,224,0.55)', lineHeight: 1.65, marginBottom: 9 }}>{spot.desc}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {spot.order && (
                      <div>
                        <div style={{ fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginBottom: 2 }}>Must Order</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: a }}>{spot.order}</div>
                      </div>
                    )}
                    {spot.est && (
                      <div>
                        <div style={{ fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginBottom: 2 }}>Est.</div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(240,236,224,0.6)' }}>{spot.est}</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 4 }}>
                      {spot.gameday && <span style={{ fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2, fontWeight: 700, background: 'rgba(200,160,60,0.15)', color: '#c8a03c', border: '1px solid rgba(200,160,60,0.22)' }}>Gameday</span>}
                      {spot.player && <span style={{ fontSize: 7, letterSpacing: '1px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2, fontWeight: 700, background: 'rgba(26,122,60,0.12)', color: '#6dce8d', border: '1px solid rgba(26,122,60,0.2)' }}>Player Spot</span>}
                    </div>
                  </div>
                  <div
                    onClick={e => { e.stopPropagation(); onSelectSpot(spot, school) }}
                    style={{
                      marginTop: 12, padding: '9px', textAlign: 'center',
                      background: `${a}15`, border: `1px solid ${a}28`, borderRadius: 5,
                      color: a, fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: 3,
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${a}25`}
                    onMouseLeave={e => e.currentTarget.style.background = `${a}15`}
                  >View Full Profile →</div>
                </div>
              )}
            </div>
          )
        })}

        {/* Ritual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 18, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: a, flexShrink: 0 }}>The Ritual</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>
        <p style={{ fontSize: 12, color: 'rgba(240,236,224,0.55)', lineHeight: 1.75, fontFamily: "'Playfair Display',serif", fontStyle: 'italic' }}>
          {school.ritual}
        </p>
      </div>
    </div>
  )
}

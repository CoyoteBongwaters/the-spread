import { useState } from 'react'
import { SCHOOLS } from '../data/schools'

export default function Header({ onSelectSchool }) {
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)

  const results = q.length > 1
    ? SCHOOLS.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.city.toLowerCase().includes(q.toLowerCase()) ||
        s.conf.toLowerCase().includes(q.toLowerCase()) ||
        s.nick.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 8)
    : []

  const pick = school => {
    onSelectSchool(school)
    setQ('')
    setFocused(false)
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 56,
      background: 'rgba(15,15,20,0.97)', backdropFilter: 'blur(20px)',
      borderBottom: '2px solid rgba(200,160,60,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', zIndex: 200,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 5, color: '#c8a03c' }}>
          THE SPREAD
        </span>
        <span style={{ fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: 10, color: 'rgba(200,160,60,0.5)', letterSpacing: 2, textTransform: 'uppercase' }}>
          College Food Atlas
        </span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 10, color: 'rgba(240,236,224,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          {SCHOOLS.length} Schools
        </span>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,236,224,0.3)', fontSize: 14, pointerEvents: 'none' }}>⌕</span>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 160)}
            placeholder="Search schools, cities..."
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${focused ? 'rgba(200,160,60,0.45)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 6, padding: '6px 12px 6px 32px',
              color: '#f0ece0', fontSize: 12, fontFamily: "'DM Sans',sans-serif",
              width: 200, outline: 'none', transition: 'border-color 0.2s',
            }}
          />
          {results.length > 0 && focused && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
              background: '#14141e', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.7)',
              zIndex: 300, maxHeight: 280, overflowY: 'auto',
            }}>
              {results.map(s => (
                <div
                  key={s.id}
                  onMouseDown={() => pick(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 13px', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.colors.primary, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#f0ece0' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(240,236,224,0.55)', marginTop: 1 }}>{s.city} · {s.conf}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(180,30,30,0.85)', color: '#ffd4d4',
          fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase',
          padding: '3px 9px', borderRadius: 3, fontWeight: 600,
          animation: 'pulse 2s infinite',
        }}>● Live</div>
      </div>
    </div>
  )
}

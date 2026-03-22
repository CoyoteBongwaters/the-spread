import { TIER_META } from '../data/schools'

export default function SpotProfile({ spot, school, onBack, onClose }) {
  if (!spot || !school) return null
  const tm = TIER_META[spot.tier]
  const a = school.colors.primary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: 165, flexShrink: 0,
        background: `linear-gradient(135deg, ${tm.dot}55 0%, #0d0d16 100%)`,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'flex-end', padding: '16px 20px',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />

        <button onClick={onBack} style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4, padding: '4px 10px', color: 'rgba(255,255,255,0.65)',
          fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
          fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
        >← Back</button>

        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          width: 28, height: 28, background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
          color: 'rgba(255,255,255,0.65)', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            display: 'inline-block', fontSize: 8, letterSpacing: '2px', textTransform: 'uppercase',
            fontWeight: 700, padding: '3px 9px', borderRadius: 3, marginBottom: 5,
            background: tm.bg, color: tm.color, border: `1px solid ${tm.border}`,
          }}>{spot.tier}</span>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 2, color: '#f0ece0', lineHeight: 1 }}>
            {spot.name}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,236,224,0.55)', marginTop: 3 }}>
            {school.name} · {school.city}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px 60px', overflowY: 'auto', flex: 1 }}>

        {/* Address */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 5, padding: '9px 12px', marginBottom: 16,
        }}>
          <span style={{ fontSize: 14 }}>📍</span>
          <span style={{ fontSize: 12, color: 'rgba(240,236,224,0.55)' }}>{spot.addr}</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: 'rgba(240,236,224,0.6)', lineHeight: 1.75, marginBottom: 16 }}>
          {spot.desc}
        </p>

        {/* Facts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {spot.order && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '10px 12px', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginBottom: 3 }}>Must Order</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: a }}>{spot.order}</div>
            </div>
          )}
          {spot.est && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '10px 12px' }}>
              <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginBottom: 3 }}>Established</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#f0ece0' }}>{spot.est}</div>
            </div>
          )}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '10px 12px' }}>
            <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.3)', marginBottom: 3 }}>Category</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: tm.color }}>{spot.tier.charAt(0).toUpperCase() + spot.tier.slice(1)}</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {spot.gameday && (
            <span style={{
              fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '5px 12px', borderRadius: 4, fontWeight: 600, border: '1px solid',
              background: 'rgba(200,160,60,0.15)', color: '#c8a03c', borderColor: 'rgba(200,160,60,0.22)',
            }}>🏈 Gameday Essential</span>
          )}
          {spot.player && (
            <span style={{
              fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '5px 12px', borderRadius: 4, fontWeight: 600, border: '1px solid',
              background: 'rgba(26,122,60,0.12)', color: '#6dce8d', borderColor: 'rgba(26,122,60,0.25)',
            }}>⭐ Player Spot</span>
          )}
        </div>
      </div>
    </div>
  )
}

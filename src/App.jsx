import { useState, useCallback } from 'react'
import Header from './components/Header'
import Map from './components/Map'
import SchoolPanel from './components/SchoolPanel'
import SpotProfile from './components/SpotProfile'
import './styles/global.css'

const PANEL_W = 460

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [selectedSpot, setSelectedSpot] = useState(null)   // { spot, school }
  const [panelOpen, setPanelOpen] = useState(false)
  const [view, setView] = useState('school')               // 'school' | 'spot'

  const selectSchool = useCallback(school => {
    setSelectedSchool(school)
    setSelectedSpot(null)
    setView('school')
    setPanelOpen(true)
  }, [])

  const selectSpot = useCallback((spot, school) => {
    setSelectedSchool(school)
    setSelectedSpot({ spot, school })
    setView('spot')
    setPanelOpen(true)
  }, [])

  const backToSchool = useCallback(() => {
    setSelectedSpot(null)
    setView('school')
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setSelectedSpot(null)
    setView('school')
    // Keep selectedSchool so spot pins stay on map
    // Only clear school if user hits "All Schools"
  }, [])

  const zoomOut = useCallback(() => {
    setPanelOpen(false)
    setSelectedSpot(null)
    setView('school')
    setTimeout(() => setSelectedSchool(null), 400)
  }, [])

  const panelVisible = panelOpen && selectedSchool

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a0f' }}>
      <Header onSelectSchool={selectSchool} />

      <Map
        selectedSchool={selectedSchool}
        onSelectSchool={selectSchool}
        onSelectSpot={selectSpot}
      />

      {/* Back to all schools button */}
      {selectedSchool && (
        <button
          onClick={zoomOut}
          style={{
            position: 'fixed', top: 68, left: 12, zIndex: 190,
            background: 'rgba(15,15,20,0.95)', border: '1px solid rgba(200,160,60,0.4)',
            borderRadius: 6, padding: '7px 14px', cursor: 'pointer',
            color: '#c8a03c', fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 13, letterSpacing: 3,
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(10px)', transition: 'background 0.15s',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,160,60,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(15,15,20,0.95)'}
        >
          ← All Schools
        </button>
      )}

      {/* School chip */}
      {selectedSchool && (
        <div style={{
          position: 'fixed', top: 68, left: '50%', transform: 'translateX(-50%)',
          zIndex: 190, background: 'rgba(15,15,20,0.95)',
          border: `1px solid ${selectedSchool.colors.primary}`,
          borderRadius: 20, padding: '5px 16px',
          fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase',
          color: '#f0ece0', backdropFilter: 'blur(10px)', whiteSpace: 'nowrap',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {selectedSchool.name.toUpperCase()} · {selectedSchool.city}
        </div>
      )}

      {/* Overlay */}
      {panelVisible && (
        <div
          onClick={closePanel}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(1px)',
            zIndex: 205, animation: 'fadeIn 0.3s ease',
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: `min(${PANEL_W}px, 100vw)`, height: '100vh',
        background: '#0d0d16',
        borderLeft: `1px solid ${selectedSchool ? selectedSchool.colors.primary + '30' : 'rgba(255,255,255,0.08)'}`,
        zIndex: 210,
        transform: panelVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {view === 'school' && selectedSchool && (
          <SchoolPanel
            school={selectedSchool}
            onSelectSpot={selectSpot}
            onClose={closePanel}
          />
        )}
        {view === 'spot' && selectedSpot && (
          <SpotProfile
            spot={selectedSpot.spot}
            school={selectedSpot.school}
            onBack={backToSchool}
            onClose={closePanel}
          />
        )}
      </div>

      {/* Hawaii / Alaska inset labels */}
      <div style={{
        position: 'fixed', bottom: 32, right: panelVisible ? `min(${PANEL_W}px, 100vw)` : 12,
        zIndex: 190, display: 'flex', gap: 6,
        transition: 'right 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        {['Hawaii', 'Alaska'].map(name => (
          <div key={name} style={{
            background: 'rgba(10,10,15,0.88)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '4px 8px',
            fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase',
            color: 'rgba(240,236,224,0.4)', backdropFilter: 'blur(10px)',
          }}>{name}</div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: 'fixed', bottom: 32, left: 12, zIndex: 190,
        background: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 7, padding: '10px 12px', backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}>
        {[
          { color: '#c8840a', label: 'Legend' },
          { color: '#1a5fb4', label: 'Bar Row' },
          { color: '#1a7a3c', label: 'Local' },
          { color: '#8b1a1a', label: 'Ritual' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.6)' }} />
            <span style={{ fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(240,236,224,0.8)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0,
        right: panelVisible ? `min(${PANEL_W}px, 100vw)` : 0,
        height: 24, background: 'rgba(15,15,20,0.97)',
        borderTop: '1px solid rgba(200,160,60,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 14px', zIndex: 195,
        transition: 'right 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 4, color: 'rgba(200,160,60,0.7)' }}>THE SPREAD</span>
        <span style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>The Definitive College Football Food Atlas</span>
      </div>
    </div>
  )
}

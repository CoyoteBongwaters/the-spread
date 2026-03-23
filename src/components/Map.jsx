import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { SCHOOLS, TIER_META } from '../data/schools'

const STYLE = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256, maxzoom: 19,
      attribution: '© CARTO © OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'base', type: 'raster', source: 'carto' }],
}

function injectCSS() {
  if (document.getElementById('map-pin-css')) return
  const s = document.createElement('style')
  s.id = 'map-pin-css'
  s.textContent = `
    .school-pin { width:44px;height:44px;cursor:pointer;display:flex;align-items:center;justify-content:center; }
    .school-pin-inner {
      width:38px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:2.5px solid rgba(255,255,255,0.9);
      box-shadow:0 3px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3);
      transition:filter .15s,box-shadow .15s,transform .15s;
    }
    .school-pin:hover .school-pin-inner {
      filter:brightness(1.15);
      box-shadow:0 6px 20px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4);
      transform:rotate(-45deg) scale(1.08);
    }
    .school-pin-inner.sel {
      box-shadow:0 6px 20px rgba(0,0,0,0.6), 0 0 0 3px rgba(255,255,255,0.9) !important;
      transform:rotate(-45deg) scale(1.1) !important;
    }
    .school-pin-lbl {
      transform:rotate(45deg);font-family:'Bebas Neue',sans-serif;
      font-size:11px;letter-spacing:.3px;color:#fff;text-align:center;
      line-height:1;user-select:none;pointer-events:none;
      text-shadow:0 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8);
    }
    .school-pin-lbl.sm { font-size:9px; }
    .spot-pin { width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s; }
    .spot-pin:hover { transform:scale(1.25); }
    .spot-pin-inner {
      width:28px;height:28px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2.5px solid rgba(255,255,255,0.95);
      box-shadow:0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3);
      font-size:12px;
    }
  `
  document.head.appendChild(s)
}

function makeSchoolPin(school) {
  const wrap = document.createElement('div')
  wrap.className = 'school-pin'
  const inner = document.createElement('div')
  inner.className = 'school-pin-inner'
  inner.style.background = school.colors.primary
  const lbl = document.createElement('div')
  lbl.className = 'school-pin-lbl' + (school.abbr.length > 3 ? ' sm' : '')
  lbl.textContent = school.abbr
  inner.appendChild(lbl)
  wrap.appendChild(inner)
  return { wrap, inner }
}

function makeSpotPin(spot) {
  const tm = TIER_META[spot.tier]
  const icons = { legend: '★', bar: '🍺', local: '📍', ritual: '🏈' }
  const wrap = document.createElement('div')
  wrap.className = 'spot-pin'
  const inner = document.createElement('div')
  inner.className = 'spot-pin-inner'
  inner.style.background = tm.dot
  inner.textContent = icons[spot.tier] || '•'
  wrap.appendChild(inner)
  return wrap
}

export default function Map({ selectedSchool, onSelectSchool, onSelectSpot }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const schoolPinRefs = useRef({})   // id -> inner el
  const spotMarkersRef = useRef([])
  const onSelectSchoolRef = useRef(onSelectSchool)
  const onSelectSpotRef = useRef(onSelectSpot)

  useEffect(() => { onSelectSchoolRef.current = onSelectSchool }, [onSelectSchool])
  useEffect(() => { onSelectSpotRef.current = onSelectSpot }, [onSelectSpot])

  // Init map once
  useEffect(() => {
    injectCSS()
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: [-96, 38],
      zoom: 4.4,
      minZoom: 4.0,
      maxZoom: 18,
      maxBounds: [[-180, 15], [-60, 72]],
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      SCHOOLS.forEach(school => {
        const { wrap, inner } = makeSchoolPin(school)
        schoolPinRefs.current[school.id] = inner
        wrap.addEventListener('click', e => {
          e.stopPropagation()
          onSelectSchoolRef.current(school)
        })
        new maplibregl.Marker({ element: wrap, anchor: 'bottom' })
          .setLngLat(school.coords)
          .addTo(map)
      })
    })

    return () => { map.remove(); mapRef.current = null }
  }, [])

  // React to school selection
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Update pin highlights
    Object.entries(schoolPinRefs.current).forEach(([id, el]) => {
      el.classList.toggle('sel', selectedSchool?.id === id)
    })

    // Remove old spot pins
    spotMarkersRef.current.forEach(m => m.remove())
    spotMarkersRef.current = []

    if (selectedSchool) {
      // Use realCoords for fly-to (Hawaii/Alaska have offset display coords)
      const flyTarget = selectedSchool.realCoords || selectedSchool.coords
      map.flyTo({ center: flyTarget, zoom: 13, duration: 1200, curve: 1.5 })

      // Add spot pins after fly starts
      setTimeout(() => {
        if (!mapRef.current) return
        selectedSchool.spots.forEach(spot => {
          const el = makeSpotPin(spot)
          el.addEventListener('click', e => {
            e.stopPropagation()
            onSelectSpotRef.current(spot, selectedSchool)
          })
          const m = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat(spot.coords)
            .addTo(mapRef.current)
          spotMarkersRef.current.push(m)
        })
      }, 400)
    } else {
      // Fly back out
      map.flyTo({ center: [-96, 38], zoom: 4.2, duration: 1000 })
    }
  }, [selectedSchool])

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', top: 56, left: 0, right: 0, bottom: 0 }}
    />
  )
}

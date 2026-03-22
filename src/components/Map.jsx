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

// SVG teardrop pin: 36×48px, tip exactly at bottom-center (18, 47).
// With stroke-width:2, outer edge of tip is at y≈48.
// anchor:'bottom' → coordinate aligns with element bottom = tip. Zero drift.
const PIN_W = 36
const PIN_H = 48
const PIN_PATH = 'M18,1 C8.5,1 1,8.5 1,18 C1,28.5 8.5,36 18,47 C27.5,36 35,28.5 35,18 C35,8.5 27.5,1 18,1Z'
const SVG_NS = 'http://www.w3.org/2000/svg'

const SPOT_ICONS = { legend: '★', bar: '🍺', local: '📍', ritual: '🏈' }

function injectCSS() {
  if (document.getElementById('map-pin-css')) return
  const s = document.createElement('style')
  s.id = 'map-pin-css'
  s.textContent = `
    .school-pin {
      position: relative;
      cursor: pointer;
      width: ${PIN_W}px;
      height: ${PIN_H}px;
    }
    .school-pin svg {
      display: block;
      transition: filter .15s, transform .15s;
      transform-origin: center bottom;
      filter: drop-shadow(0 3px 10px rgba(0,0,0,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.3));
    }
    .school-pin:hover svg {
      filter: drop-shadow(0 5px 16px rgba(0,0,0,0.65)) brightness(1.15);
      transform: scale(1.08);
    }
    .school-pin.sel svg {
      filter: drop-shadow(0 5px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 0 2px rgba(255,255,255,0.95)) !important;
      transform: scale(1.12) !important;
    }
    .school-pin-lbl {
      position: absolute;
      top: 8px;
      left: 0;
      right: 0;
      text-align: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 11px;
      letter-spacing: .3px;
      color: #fff;
      line-height: 1;
      user-select: none;
      pointer-events: none;
      text-shadow: 0 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8);
    }
    .school-pin-lbl.sm { font-size: 9px; }

    .spot-pin {
      position: relative;
      cursor: pointer;
    }
    .spot-pin-inner {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid rgba(255,255,255,0.95);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3);
      font-size: 12px;
      transition: transform .15s, box-shadow .15s;
    }
    .spot-pin:hover .spot-pin-inner {
      transform: scale(1.25);
      box-shadow: 0 4px 14px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4);
    }
    .spot-tooltip {
      position: absolute;
      bottom: calc(100% + 7px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(13,13,22,0.97);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 4px;
      padding: 4px 9px;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: #f0ece0;
      letter-spacing: .2px;
      pointer-events: none;
      opacity: 0;
      transition: opacity .12s;
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    .spot-pin:hover .spot-tooltip { opacity: 1; }
  `
  document.head.appendChild(s)
}

function makeSchoolPin(school) {
  const wrap = document.createElement('div')
  wrap.className = 'school-pin'

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('width', PIN_W)
  svg.setAttribute('height', PIN_H)
  svg.setAttribute('viewBox', `0 0 ${PIN_W} ${PIN_H}`)

  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', PIN_PATH)
  path.setAttribute('fill', school.colors.primary)
  path.setAttribute('stroke', 'rgba(255,255,255,0.9)')
  path.setAttribute('stroke-width', '2')
  path.setAttribute('stroke-linejoin', 'round')

  // Inner circle highlight
  const circle = document.createElementNS(SVG_NS, 'circle')
  circle.setAttribute('cx', '18')
  circle.setAttribute('cy', '17')
  circle.setAttribute('r', '7')
  circle.setAttribute('fill', 'rgba(255,255,255,0.15)')

  svg.appendChild(path)
  svg.appendChild(circle)
  wrap.appendChild(svg)

  const lbl = document.createElement('div')
  lbl.className = 'school-pin-lbl' + (school.abbr.length > 3 ? ' sm' : '')
  lbl.textContent = school.abbr
  wrap.appendChild(lbl)

  return { wrap }
}

function makeSpotPin(spot) {
  const tm = TIER_META[spot.tier]
  const SIZE = 30

  const wrap = document.createElement('div')
  wrap.className = 'spot-pin'
  wrap.style.width = SIZE + 'px'
  wrap.style.height = SIZE + 'px'

  const inner = document.createElement('div')
  inner.className = 'spot-pin-inner'
  inner.style.width = SIZE + 'px'
  inner.style.height = SIZE + 'px'
  inner.style.background = tm.dot
  inner.textContent = SPOT_ICONS[spot.tier] || '•'
  wrap.appendChild(inner)

  const tooltip = document.createElement('div')
  tooltip.className = 'spot-tooltip'
  tooltip.textContent = spot.name
  wrap.appendChild(tooltip)

  return wrap
}

export default function Map({ selectedSchool, onSelectSchool, onSelectSpot }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const schoolPinRefs = useRef({})  // id -> wrap el
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
      // Tightened bounds: continental US only
      maxBounds: [[-130, 24.5], [-60, 52]],
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      SCHOOLS.forEach(school => {
        const { wrap } = makeSchoolPin(school)
        schoolPinRefs.current[school.id] = wrap
        wrap.addEventListener('click', e => {
          e.stopPropagation()
          onSelectSchoolRef.current(school)
        })
        // anchor:'bottom' → coordinate at bottom-center of element = tip of SVG pin
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

    // Update pin highlight state
    Object.entries(schoolPinRefs.current).forEach(([id, el]) => {
      el.classList.toggle('sel', selectedSchool?.id === id)
    })

    // Remove old spot pins
    spotMarkersRef.current.forEach(m => m.remove())
    spotMarkersRef.current = []

    if (selectedSchool) {
      const flyTarget = selectedSchool.realCoords || selectedSchool.coords
      map.flyTo({ center: flyTarget, zoom: 13, duration: 1200, curve: 1.5 })

      setTimeout(() => {
        if (!mapRef.current) return
        selectedSchool.spots.forEach(spot => {
          const el = makeSpotPin(spot)
          el.addEventListener('click', e => {
            e.stopPropagation()
            onSelectSpotRef.current(spot, selectedSchool)
          })
          // anchor:'center' → coordinate at center of circle
          const m = new maplibregl.Marker({ element: el, anchor: 'center' })
            .setLngLat(spot.coords)
            .addTo(mapRef.current)
          spotMarkersRef.current.push(m)
        })
      }, 400)
    } else {
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

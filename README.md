# The Spread — College Football Food Atlas

The definitive food and culture guide for every college football town in America.

## Stack
- React 18 + Vite
- MapLibre GL JS (free, open source, no API key required)
- CARTO dark base map tiles (free)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Deploy to Vercel (free)

```bash
# Install Vercel CLI once
npm install -g vercel

# Deploy
vercel

# Follow prompts — done.
```

## Project Structure

```
src/
├── data/
│   └── schools.js        ← ALL school data lives here. Add schools here.
├── components/
│   ├── Map.jsx           ← MapLibre map, markers, fly-to
│   ├── Header.jsx        ← Nav + search
│   ├── SchoolPanel.jsx   ← Slide-in school profile
│   └── SpotCard.jsx      ← Individual spot tile (expandable)
├── styles/
│   └── global.css        ← Design system, CSS variables
├── App.jsx               ← Root, state management
└── main.jsx              ← Entry point
```

## Adding a New School

Open `src/data/schools.js` and add an entry to the `SCHOOLS` array:

```js
{
  id: 'school-id',                    // lowercase, no spaces
  name: 'School Name',
  abbreviation: 'ABBR',               // shown on map pin (max 4 chars)
  nickname: 'Mascot Name',
  city: 'City, ST',
  conference: 'SEC',                  // SEC | ACC | Big Ten | Big 12 | Independent | etc
  coordinates: [-longitude, latitude], // find on Google Maps, right-click → coordinates
  colors: {
    primary: '#HEX',                  // main pin color
    secondary: '#HEX',                // accent
    text: '#ffffff',                  // text on pin (usually white)
  },
  lore: '"Quote about the school food/culture."',
  stats: {
    spots: 0,
    loreEntries: 0,
    verified: 0,
  },
  spots: [
    {
      id: 'spot-id',
      name: 'Spot Name',
      tier: 'legend',                 // legend | bar | local | ritual
      address: 'Street address',
      description: 'Full description of the spot.',
      mustOrder: 'The thing to order',
      yearsOpen: 30,                  // how many years it's been open
      playerSighting: false,          // true if players known to eat here
      gameday: true,                  // true if this is a gameday spot
    },
  ],
  drink: {
    icon: '🍺',
    name: 'Drink Name',
    description: 'Description of the local drink.',
  },
  ritual: 'Description of the gameday ritual — written in present tense, from the ground.',
}
```

## Tier System

| Tier | Meaning |
|------|---------|
| `legend` | Been there forever, defines the school's food identity |
| `bar` | The bar scene — pregame, postgame, watch parties |
| `local` | Hidden gems, local institutions the tourists miss |
| `ritual` | The gameday ritual — not always food, always essential |

## Roadmap

- [ ] User reviews + submissions
- [ ] Student correspondent badges
- [ ] Gameday live mode (crowd reports, wait times)
- [ ] Away game visitor guide ("Coming to Athens for the first time?")
- [ ] React Native / Expo port for App Store
- [ ] School-specific lore timeline (historical entries)
- [ ] Search by food type, tier, conference

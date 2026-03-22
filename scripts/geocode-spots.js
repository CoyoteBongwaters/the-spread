const FSQ_KEY = process.env.FSQ_API_KEY

const SPOTS = [
  { school: 'fsu', id: 'clydes', name: "Clyde's & Costello's", city: 'Tallahassee', state: 'FL' },
  { school: 'fsu', id: 'poboys', name: "Po' Boys Creole Cafe", city: 'Tallahassee', state: 'FL' },
  { school: 'fsu', id: 'gaines', name: 'Gaines Street Pies', city: 'Tallahassee', state: 'FL' },
  { school: 'fsu', id: 'bullwinkles', name: "Bullwinkle's Saloon", city: 'Tallahassee', state: 'FL' },
  { school: 'fsu', id: 'midtown', name: 'Midtown Catering Cafe', city: 'Tallahassee', state: 'FL' },
  { school: 'bama', id: 'dreamland', name: 'Dreamland BBQ', city: 'Tuscaloosa', state: 'AL' },
  { school: 'bama', id: 'houndstooth', name: 'The Houndstooth', city: 'Tuscaloosa', state: 'AL' },
  { school: 'bama', id: 'citycafe', name: 'City Cafe', city: 'Tuscaloosa', state: 'AL' },
  { school: 'bama', id: 'gallettes', name: "Gallette's", city: 'Tuscaloosa', state: 'AL' },
  { school: 'lsu', id: 'canes', name: "Raising Cane's", city: 'Baton Rouge', state: 'LA' },
  { school: 'lsu', id: 'tigerland', name: 'Tigerland', city: 'Baton Rouge', state: 'LA' },
  { school: 'lsu', id: 'rocca', name: 'Rocca', city: 'Baton Rouge', state: 'LA' },
  { school: 'texas', id: 'franklin', name: 'Franklin Barbecue', city: 'Austin', state: 'TX' },
  { school: 'texas', id: 'trudys', name: "Trudy's", city: 'Austin', state: 'TX' },
  { school: 'texas', id: 'holeinwall', name: 'The Hole in the Wall', city: 'Austin', state: 'TX' },
  { school: 'texas', id: 'juan', name: 'Juan in a Million', city: 'Austin', state: 'TX' },
  { school: 'osu', id: 'schmidts', name: "Schmidt's Sausage Haus", city: 'Columbus', state: 'OH' },
  { school: 'osu', id: 'varsityclub', name: 'The Varsity Club', city: 'Columbus', state: 'OH' },
  { school: 'osu', id: 'skyline', name: 'Skyline Chili', city: 'Columbus', state: 'OH' },
  { school: 'michigan', id: 'zingermans', name: "Zingerman's Deli", city: 'Ann Arbor', state: 'MI' },
  { school: 'michigan', id: 'skeeps', name: 'Skeeps', city: 'Ann Arbor', state: 'MI' },
  { school: 'michigan', id: 'blimpy', name: 'Blimpy Burger', city: 'Ann Arbor', state: 'MI' },
  { school: 'georgia', id: 'varsity', name: 'The Varsity', city: 'Athens', state: 'GA' },
  { school: 'georgia', id: 'georgiatheater', name: 'Georgia Theatre', city: 'Athens', state: 'GA' },
  { school: 'georgia', id: 'weaverd', name: "Weaver D's", city: 'Athens', state: 'GA' },
  { school: 'tennessee', id: 'petes', name: "Pete's Coffee Shop", city: 'Knoxville', state: 'TN' },
  { school: 'tennessee', id: 'preservation', name: 'Preservation Pub', city: 'Knoxville', state: 'TN' },
  { school: 'usc', id: 'kingtaco', name: 'King Taco', city: 'Los Angeles', state: 'CA' },
  { school: 'usc', id: '901bar', name: '901 Bar and Grill', city: 'Los Angeles', state: 'CA' },
  { school: 'usc', id: 'langers', name: "Langer's Delicatessen", city: 'Los Angeles', state: 'CA' },
  { school: 'miami', id: 'versailles', name: 'Versailles Restaurant', city: 'Miami', state: 'FL' },
  { school: 'miami', id: 'titanic', name: 'Titanic Brewery', city: 'Coral Gables', state: 'FL' },
  { school: 'miami', id: 'lacarreta', name: 'La Carreta', city: 'Miami', state: 'FL' },
]

async function search(spot) {
  const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(spot.name)}&near=${encodeURIComponent(spot.city + ', ' + spot.state)}&limit=1`
  const res = await fetch(url, {
    headers: {
      'Authorization': FSQ_KEY,
      'Accept': 'application/json'
    }
  })
  const data = await res.json()
  if (data.results && data.results.length > 0) {
    const place = data.results[0]
    const lat = place.geocodes?.main?.latitude
    const lng = place.geocodes?.main?.longitude
    const name = place.name
    console.log(`✓ ${spot.school} | ${spot.id} | ${name} | [${lng}, ${lat}]`)
  } else {
    console.log(`✗ NO MATCH | ${spot.school} | ${spot.id} | ${spot.name}`)
  }
  await new Promise(r => setTimeout(r, 300))
}

async function main() {
  console.log('Geocoding spots via Foursquare...\n')
  for (const spot of SPOTS) {
    await search(spot)
  }
  console.log('\nDone.')
}

main().catch(console.error)

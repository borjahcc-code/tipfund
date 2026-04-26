const PLACES_KEY = 'tipfund_places_api_key'

export function getPlacesApiKey() {
  try { return localStorage.getItem(PLACES_KEY) || '' } catch { return '' }
}

export function savePlacesApiKey(key) {
  try { localStorage.setItem(PLACES_KEY, key) } catch {}
}

export async function detectNearbyRestaurants() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este dispositivo'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const apiKey = getPlacesApiKey()
        if (!apiKey) {
          reject(new Error('NO_API_KEY'))
          return
        }
        try {
          const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
              'Content-Type':    'application/json',
              'X-Goog-Api-Key':  apiKey,
              'X-Goog-FieldMask': 'places.displayName,places.id',
            },
            body: JSON.stringify({
              includedTypes: ['restaurant', 'bar', 'cafe'],
              maxResultCount: 3,
              locationRestriction: {
                circle: {
                  center: { latitude, longitude },
                  radius: 100,
                },
              },
            }),
          })
          if (!res.ok) throw new Error(`Places API ${res.status}`)
          const data = await res.json()
          const places = (data.places || [])
            .map(p => p.displayName?.text)
            .filter(Boolean)
          resolve(places)
        } catch (err) {
          reject(err)
        }
      },
      err => reject(err),
      { timeout: 8000, enableHighAccuracy: false }
    )
  })
}

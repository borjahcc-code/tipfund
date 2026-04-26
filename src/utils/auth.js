const USER_KEY = 'tipfund_user'

export function getUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

function saveUser(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)) } catch {}
}

export function handleGoogleCredential(credentialResponse) {
  try {
    const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
    const existing = getUser()
    const user = {
      google_id:    payload.sub,
      name:         payload.name,
      email:        payload.email,
      avatar_url:   payload.picture,
      signed_in_at: Date.now(),
      is_anonymous: false,
      anonymous_id: existing?.anonymous_id ?? null,
    }
    saveUser(user)
    return user
  } catch { return null }
}

export function createAnonymousUser() {
  const user = {
    google_id:    null,
    name:         'Tú',
    email:        null,
    avatar_url:   null,
    anonymous_id: crypto.randomUUID(),
    signed_in_at: Date.now(),
    is_anonymous: true,
  }
  saveUser(user)
  return user
}

export function logout() {
  try { localStorage.removeItem(USER_KEY) } catch {}
}

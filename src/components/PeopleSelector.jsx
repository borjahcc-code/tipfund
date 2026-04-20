import { useState, useRef } from 'react'

export default function PeopleSelector({ value, onChange, min = 2, max = 20 }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  function startEdit() {
    setDraft(String(value))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  function commit() {
    const n = parseInt(draft, 10)
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
    setEditing(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div className="people-selector">
      <button
        className="btn-circle"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >−</button>

      <div style={{ textAlign: 'center', flex: 1 }}>
        {editing ? (
          <input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKey}
            style={{
              width: 72, fontSize: 32, fontWeight: 700, textAlign: 'center',
              border: 'none', borderBottom: '2px solid var(--orange)',
              background: 'transparent', outline: 'none', color: 'var(--teal-dark)',
              fontFamily: 'inherit', padding: '2px 0'
            }}
          />
        ) : (
          <div
            className="people-count"
            onClick={startEdit}
            title="Toca para editar"
            style={{ cursor: 'text', userSelect: 'none' }}
          >
            {value}
          </div>
        )}
        <div className="people-label">
          {editing ? `mín ${min} · máx ${max}` : 'personas · toca para editar'}
        </div>
      </div>

      <button
        className="btn-circle"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >+</button>
    </div>
  )
}

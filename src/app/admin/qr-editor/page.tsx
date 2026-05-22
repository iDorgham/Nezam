'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QrEditorPage() {
  const [value, setValue] = useState('https://nezam.com/reserve/123')
  const [size, setSize] = useState(200)
  const [fgColor, setFgColor] = useState('#1DB954') // Default Spotify Green
  const [bgColor, setBgColor] = useState('#181818') // Dark background
  const [includeMargin, setIncludeMargin] = useState(true)

  return (
    <div style={{ 
      padding: '2rem', 
      color: 'var(--text-high)',
      backgroundColor: 'var(--background)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}
    className="animate-fadeIn"
    >
      <header>
        <h1 style={{ color: 'var(--primary)' }}>Advanced QR Generator</h1>
        <p style={{ color: 'var(--text-medium)' }}>Style and customize your reservation QR codes.</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Controls */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          border: '1px solid var(--surface-elevated)'
        }}>
          <div style={controlGroupStyle}>
            <label style={labelStyle}>QR Content (URL or ID)</label>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
          </div>

          <div style={controlGroupStyle}>
            <label style={labelStyle}>Foreground Color</label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ ...inputStyle, padding: '0', height: '40px', cursor: 'pointer' }} />
          </div>

          <div style={controlGroupStyle}>
            <label style={labelStyle}>Background Color</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ ...inputStyle, padding: '0', height: '40px', cursor: 'pointer' }} />
          </div>

          <div style={controlGroupStyle}>
            <label style={labelStyle}>Size ({size}px)</label>
            <input type="range" min="100" max="400" value={size} onChange={(e) => setSize(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)} id="margin" />
            <label htmlFor="margin" style={{ cursor: 'pointer' }}>Include Margin</label>
          </div>
        </div>

        {/* Preview */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--surface)', 
          padding: '2rem', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--surface-elevated)'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: bgColor,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            border: '1px solid var(--surface-elevated)'
          }}>
            <QRCodeSVG
              value={value}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              includeMargin={includeMargin}
              level="H"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const controlGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const labelStyle = {
  color: 'var(--text-medium)',
  fontSize: '0.9rem'
}

const inputStyle = {
  backgroundColor: 'var(--surface-elevated)',
  border: '1px solid var(--text-low)',
  color: 'var(--text-high)',
  padding: '0.6rem',
  borderRadius: '4px',
  fontSize: '1rem',
  width: '100%'
}

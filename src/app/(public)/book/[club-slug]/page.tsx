'use client'

import { useState } from 'react'

export default function BookingPage({ params }: { params: { clubSlug: string } }) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  // Mock data for tables
  const tables = [
    { id: '1', number: 'VIP 1', capacity: 6, minSpend: 1000, status: 'available' },
    { id: '2', number: 'VIP 2', capacity: 6, minSpend: 1000, status: 'reserved' },
    { id: '3', number: 'T 1', capacity: 4, minSpend: 500, status: 'available' },
    { id: '4', number: 'T 2', capacity: 4, minSpend: 500, status: 'available' },
    { id: '5', number: 'Bar 1', capacity: 2, minSpend: 200, status: 'available' },
    { id: '6', number: 'Bar 2', capacity: 2, minSpend: 200, status: 'available' },
  ]

  return (
    <div 
      className="animate-fadeIn"
      style={{ 
        padding: '2rem', 
        color: 'var(--text-high)',
        backgroundColor: 'var(--background)',
        minHeight: '100vh'
      }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)' }}>Book a Table</h1>
        <p style={{ color: 'var(--text-medium)' }}>Club: {params.clubSlug || 'Default Club'}</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Floor Plan / Grid */}
        <div style={{ 
          flex: 2, 
          backgroundColor: 'var(--surface)', 
          padding: '2rem', 
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          height: 'fit-content'
        }}>
          {tables.map((table) => (
            <div 
              key={table.id}
              onClick={() => table.status === 'available' && setSelectedTable(table.id)}
              style={{
                backgroundColor: selectedTable === table.id ? 'var(--primary)' : 'var(--surface-elevated)',
                color: selectedTable === table.id ? 'var(--background)' : 'var(--text-high)',
                padding: '1.5rem',
                borderRadius: '8px',
                cursor: table.status === 'available' ? 'pointer' : 'not-allowed',
                opacity: table.status === 'available' ? 1 : 0.5,
                border: selectedTable === table.id ? 'none' : '1px solid transparent',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (table.status === 'available' && selectedTable !== table.id) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedTable !== table.id) {
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{table.number}</div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {table.capacity} Guests
              </div>
              <div style={{ fontSize: '0.8rem', color: selectedTable === table.id ? 'var(--background)' : 'var(--text-medium)' }}>
                Min: ${table.minSpend}
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form Sidebar */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--surface)', 
          padding: '2rem', 
          borderRadius: '8px',
          height: 'fit-content'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Your Booking</h2>
          
          {selectedTable ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-medium)' }}>Selected Table: </span>
                <span style={{ fontWeight: 'bold' }}>
                  {tables.find(t => t.id === selectedTable)?.number}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-medium)' }}>Guest Name</label>
                <input type="text" style={inputStyle} placeholder="Full Name" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'var(--text-medium)' }}>Phone Number</label>
                <input type="text" style={inputStyle} placeholder="+123456789" />
              </div>

              <button style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--background)',
                border: 'none',
                padding: '0.8rem',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '1rem'
              }}>
                Confirm Reservation
              </button>
            </div>
          ) : (
            <p style={{ color: 'var(--text-medium)' }}>Select a table from the map to proceed.</p>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  backgroundColor: 'var(--surface-elevated)',
  border: '1px solid var(--text-low)',
  color: 'var(--text-high)',
  padding: '0.6rem',
  borderRadius: '4px',
  fontSize: '1rem'
}

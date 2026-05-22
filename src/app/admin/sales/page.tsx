'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase/client'

export default function SalesDashboard() {
  const [tables, setTables] = useState<any[]>([])
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState<any>(null)
  
  // Form State
  const [guestName, setGuestName] = useState('')
  const [guestContact, setGuestContact] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch all tables
      const { data: tablesData } = await supabase
        .from('tables')
        .select('*')
        .order('table_number', { ascending: true })
        
      setTables(tablesData || [])

      // 2. Fetch my bookings (for now we'll fetch all until we have auth users)
      const { data: bookingsData } = await supabase
        .from('reservations')
        .select(`
          id,
          guest_name,
          status,
          created_at,
          tables (table_number)
        `)
        .order('created_at', { ascending: false })
        
      setMyBookings(bookingsData?.map(b => ({
        id: b.id,
        guestName: b.guest_name,
        status: b.status,
        time: new Date(b.created_at).toLocaleDateString(),
        table: (b.tables as any)?.table_number || 'N/A'
      })) || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Subscribe to changes
    const channel = supabase
      .channel('sales-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => fetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTable) return
    
    setLoading(true)
    try {
      // 1. Create Reservation
      const { error: resError } = await supabase
        .from('reservations')
        .insert({
          table_id: selectedTable.id,
          guest_name: guestName,
          guest_contact: guestContact,
          status: 'pending'
        })
        
      if (resError) throw resError
      
      // 2. Update Table Status to 'reserved' (or leave as is if handling differently)
      // For now we'll just insert the reservation
      
      alert('Booking created successfully!')
      setShowModal(false)
      setGuestName('')
      setGuestContact('')
      setSelectedTable(null)
      fetchData()
    } catch (error: any) {
      alert('Error creating booking: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-high)',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
      className="animate-fadeIn"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Sales Dashboard</h1>
          <p style={{ color: 'var(--text-low)', fontSize: '0.85rem' }}>View tables and manage your bookings</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Rep: John Doe</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Rank #3 (This Month)</div>
          </div>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--surface-elevated)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '0.8rem', fontWeight: 'bold', justifyContent: 'center' }}>JD</div>
        </div>
      </div>

      {/* Performance Mini Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={miniCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>My Active Bookings</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{myBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length}</div>
        </div>
        <div style={miniCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Total Arrived</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1DB954' }}>{myBookings.filter(b => b.status === 'arrived').length}</div>
        </div>
        <div style={miniCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Commission Earned</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>5,200 EGP</div>
        </div>
      </div>

      {loading && tables.length === 0 ? (
        <div style={{ color: 'var(--text-low)', textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
          
          {/* Available Tables Grid */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Floor Tables</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Click a table to book</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {tables.map((table) => (
                <div 
                  key={table.id}
                  onClick={() => {
                    if (table.status === 'available') {
                      setSelectedTable(table)
                      setShowModal(true)
                    }
                  }}
                  style={{
                    ...tableItemStyle,
                    borderColor: table.status === 'available' ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.05)',
                    cursor: table.status === 'available' ? 'pointer' : 'not-allowed',
                    opacity: table.status === 'available' ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (table.status === 'available') {
                      e.currentTarget.style.borderColor = 'var(--primary)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (table.status === 'available') {
                      e.currentTarget.style.borderColor = 'rgba(29,185,84,0.2)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{table.table_number}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Cap: {table.capacity}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)', marginTop: '0.25rem' }}>{table.min_spend} EGP</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: table.status === 'available' ? '#1DB954' : '#ff4b4b',
                    marginTop: '0.5rem',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {table.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Recent Bookings */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>My Recent Bookings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myBookings.length > 0 ? (
                myBookings.map((booking) => (
                  <div key={booking.id} style={{ padding: '0.75rem', backgroundColor: 'var(--surface-elevated)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{booking.guestName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Table: {booking.table} • {booking.time}</div>
                    </div>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: booking.status === 'arrived' ? '#1DB954' : booking.status === 'pending' ? '#ffcc00' : '#ff4b4b',
                      backgroundColor: booking.status === 'arrived' ? 'rgba(29,185,84,0.1)' : booking.status === 'pending' ? 'rgba(255,204,0,0.1)' : 'rgba(255,75,75,0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-low)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No bookings made yet.</div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* New Booking Modal */}
      {showModal && selectedTable && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="animate-slideUp">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Book Table {selectedTable.table_number}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="sales-guest-name" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Guest Name</label>
                <input 
                  id="sales-guest-name"
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Smith"
                  style={inputStyle}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="sales-guest-contact" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Contact (Phone/Email)</label>
                <input 
                  id="sales-guest-contact"
                  type="text" 
                  value={guestContact}
                  onChange={(e) => setGuestContact(e.target.value)}
                  placeholder="+20 123 456 789"
                  style={inputStyle}
                />
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-low)' }}>Capacity:</span>
                  <span>{selectedTable.capacity} guests</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-low)' }}>Min. Spend:</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedTable.min_spend} EGP</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'var(--background)', 
                  border: 'none', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  fontWeight: 'bold', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '1rem'
                }}
              >
                {loading ? 'Creating...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const cardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '8px',
  padding: '1.5rem',
}

const miniCardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem'
}

const tableItemStyle = {
  backgroundColor: 'var(--surface-elevated)',
  border: '1px solid transparent',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem',
  transition: 'all 0.2s ease'
}

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100
}

const modalStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '12px',
  padding: '2rem',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
}

const inputStyle = {
  backgroundColor: 'var(--surface-elevated)',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fff',
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%'
}

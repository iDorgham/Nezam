'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../lib/supabase/client'

export default function ManagerDashboard() {
  const [stats, setStats] = useState([
    { label: 'Guests Arrived', value: '0/0', status: '0%', type: 'success' },
    { label: 'Available Tables', value: '0/0', status: '0% Free', type: 'warning' },
    { label: 'Pending Bookings', value: '0', status: '0', type: 'danger' },
  ])

  const [arrivals, setArrivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for floor occupancy (we'll keep this mocked until we have sections mapped)
  const sections = [
    { name: 'VIP Area', occupied: 8, total: 10, color: '#1DB954' },
    { name: 'Main Floor', occupied: 12, total: 20, color: '#0070f3' },
    { name: 'Bar', occupied: 5, total: 15, color: '#ff0055' },
  ]

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      const { data: resArrived } = await supabase.from('reservations').select('id').eq('status', 'arrived')
      const { data: resAll } = await supabase.from('reservations').select('id')
      const { data: tablesAvail } = await supabase.from('tables').select('id').eq('status', 'available')
      const { data: tablesAll } = await supabase.from('tables').select('id')
      const { data: resPending } = await supabase.from('reservations').select('id').eq('status', 'pending')

      const arrivedCount = resArrived?.length || 0
      const totalRes = resAll?.length || 0
      const availTables = tablesAvail?.length || 0
      const totalTables = tablesAll?.length || 0
      const pendingCount = resPending?.length || 0

      setStats([
        { 
          label: 'Guests Arrived', 
          value: `${arrivedCount}/${totalRes}`, 
          status: `${totalRes > 0 ? Math.round((arrivedCount / totalRes) * 100) : 0}%`, 
          type: 'success' 
        },
        { 
          label: 'Available Tables', 
          value: `${availTables}/${totalTables}`, 
          status: `${totalTables > 0 ? Math.round((availTables / totalTables) * 100) : 0}% Free`, 
          type: 'warning' 
        },
        { 
          label: 'Pending Bookings', 
          value: `${pendingCount}`, 
          status: 'Action needed', 
          type: 'danger' 
        },
      ])

      // Fetch live arrivals
      const { data: recentArrivals } = await supabase
        .from('reservations')
        .select(`
          created_at,
          guest_name,
          status,
          tables (table_number)
        `)
        .eq('status', 'arrived')
        .order('created_at', { ascending: false })
        .limit(5)

      setArrivals(recentArrivals?.map(r => ({
        time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name: r.guest_name,
        table: (r.tables as any)?.table_number || 'N/A',
        status: 'Arrived'
      })) || [])

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  
  const debouncedFetchData = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      fetchData()
    }, 300) // Wait 300ms after the last change
  }

  useEffect(() => {
    fetchData()
    
    // Subscribe to changes for real-time updates
    const channel = supabase
      .channel('manager-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => debouncedFetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => debouncedFetchData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  const handleSeed = async () => {
    if (!confirm('Are you sure you want to seed data? This will add new records.')) return
    
    setLoading(true)
    try {
      // 1. Create Venue
      const { data: venue, error: vErr } = await supabase
        .from('venues')
        .insert({ name: 'The Club', location: 'Main Street' })
        .select()
        .single()
        
      if (vErr || !venue) {
        alert('Failed to create venue: ' + vErr?.message)
        return
      }
      
      // 2. Create Tables
      const { data: tables, error: tErr } = await supabase
        .from('tables')
        .insert([
          { venue_id: venue.id, table_number: 'VIP 1', capacity: 6, min_spend: 10000, status: 'occupied' },
          { venue_id: venue.id, table_number: 'Table 1', capacity: 4, min_spend: 5000, status: 'occupied' },
          { venue_id: venue.id, table_number: 'Bar 1', capacity: 2, min_spend: 2000, status: 'available' },
          { venue_id: venue.id, table_number: 'Table 2', capacity: 4, min_spend: 5000, status: 'available' }
        ])
        .select()
        
      if (tErr || !tables) {
        alert('Failed to create tables: ' + tErr?.message)
        return
      }
      
      // 3. Create Reservations
      const vip1 = tables.find(t => t.table_number === 'VIP 1')
      const t1 = tables.find(t => t.table_number === 'Table 1')
      const b1 = tables.find(t => t.table_number === 'Bar 1')
      
      const { error: rErr } = await supabase
        .from('reservations')
        .insert([
          { table_id: vip1?.id, guest_name: 'John Doe', status: 'arrived' },
          { table_id: t1?.id, guest_name: 'Jane Smith', status: 'arrived' },
          { table_id: b1?.id, guest_name: 'Bob Johnson', status: 'pending' }
        ])
        
      if (rErr) {
        alert('Failed to create reservations: ' + rErr.message)
        return
      }
        
      alert('Data seeded successfully!')
      fetchData()
    } catch (error: any) {
      alert('Error seeding data: ' + error.message)
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Manager Dashboard</h1>
          <p style={{ color: 'var(--text-low)', fontSize: '0.85rem' }}>Live operations and guest management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={buttonStyle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export Report
          </button>
          <button style={{ ...buttonStyle, backgroundColor: '#ff9900', color: '#000' }} onClick={handleSeed}>
            Seed Data
          </button>
          <button style={{ ...buttonStyle, backgroundColor: 'var(--primary)', color: 'var(--background)' }}>
            + New Booking
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, color: 'var(--text-low)' }}>
          Loading real-time data...
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {stats.map((stat, index) => (
              <div key={index} style={cardStyle}>
                <div style={{ color: 'var(--text-low)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>{stat.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stat.value}</div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: stat.type === 'success' ? '#1DB954' : stat.type === 'warning' ? '#ffcc00' : '#ff4b4b',
                  backgroundColor: stat.type === 'success' ? 'rgba(29,185,84,0.1)' : stat.type === 'warning' ? 'rgba(255,204,0,0.1)' : 'rgba(255,75,75,0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {stat.status}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            
            {/* Live Arrivals */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Live Arrivals</h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {arrivals.length > 0 ? (
                  arrivals.map((arrival, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--surface-elevated)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-low)' }}>{arrival.time}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{arrival.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Table: {arrival.table}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#1DB954', backgroundColor: 'rgba(29,185,84,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {arrival.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: 'var(--text-low)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                    No arrivals registered yet tonight.
                  </div>
                )}
              </div>
            </div>

            {/* Floor Occupancy */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold' }}>Floor Occupancy</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {sections.map((section, index) => {
                  const percentage = (section.occupied / section.total) * 100
                  return (
                    <div key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                        <span>{section.name}</span>
                        <span style={{ color: 'var(--text-low)' }}>{section.occupied}/{section.total}</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--surface-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: section.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(var(--primary-rgb), 0.05)', borderRadius: '6px', border: '1px solid rgba(var(--primary-rgb), 0.1)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>Pro Tip</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-medium)' }}>Peak hours are approaching. Consider opening the backup bar section.</div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}

const cardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '8px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column' as const
}

const buttonStyle = {
  backgroundColor: 'var(--surface-elevated)',
  color: 'var(--text-high)',
  border: '1px solid var(--surface-elevated)',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  transition: 'all 0.15s ease'
}

const supabaseUrl = 'https://wypzseqcwwvtjijshuya.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHpzZXFjd3d2dGppanNodXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2ODc0MTksImV4cCI6MjA5NDI2MzQxOX0.STWDPY0mNIAvxWWzz3is_exIcbicLU_WGluYeTjMqk8'

async function seed() {
  console.log('Seeding data via REST API...')
  
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }

  try {
    // 1. Create Venue
    const vRes = await fetch(`${supabaseUrl}/rest/v1/venues`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: 'The Club', location: 'Main Street' })
    })
    
    const venues = await vRes.json()
    if (!vRes.ok) throw new Error(`Venue failed: ${JSON.stringify(venues)}`)
    const venue = venues[0]
    console.log('Venue created:', venue.id)
    
    // 2. Create Tables
    const tRes = await fetch(`${supabaseUrl}/rest/v1/tables`, {
      method: 'POST',
      headers,
      body: JSON.stringify([
        { venue_id: venue.id, table_number: 'VIP 1', capacity: 6, min_spend: 10000, status: 'occupied' },
        { venue_id: venue.id, table_number: 'Table 1', capacity: 4, min_spend: 5000, status: 'occupied' },
        { venue_id: venue.id, table_number: 'Bar 1', capacity: 2, min_spend: 2000, status: 'available' },
        { venue_id: venue.id, table_number: 'Table 2', capacity: 4, min_spend: 5000, status: 'available' }
      ])
    })
    
    const tables = await tRes.json()
    if (!tRes.ok) throw new Error(`Tables failed: ${JSON.stringify(tables)}`)
    console.log('Tables created:', tables.length)
    
    // 3. Create Reservations
    const vip1 = tables.find(t => t.table_number === 'VIP 1')
    const t1 = tables.find(t => t.table_number === 'Table 1')
    const b1 = tables.find(t => t.table_number === 'Bar 1')
    
    const rRes = await fetch(`${supabaseUrl}/rest/v1/reservations`, {
      method: 'POST',
      headers,
      body: JSON.stringify([
        { table_id: vip1?.id, guest_name: 'John Doe', status: 'arrived' },
        { table_id: t1?.id, guest_name: 'Jane Smith', status: 'arrived' },
        { table_id: b1?.id, guest_name: 'Bob Johnson', status: 'pending' }
      ])
    })
    
    const reservations = await rRes.json()
    if (!rRes.ok) throw new Error(`Reservations failed: ${JSON.stringify(reservations)}`)
    console.log('Reservations created successfully!')
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

seed()

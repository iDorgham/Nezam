'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase/client'
import { useAuth } from '../../../lib/auth/context'
import { useRouter } from 'next/navigation'

export default function CRMDashboard() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()

  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('regular') // regular, vip, blacklist

  useEffect(() => {
    if (!authLoading && (!user || (role !== 'manager' && role !== 'owner'))) {
      router.push('/login')
    }
  }, [user, role, authLoading, router])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('visit_count', { ascending: false })
        
      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && (role === 'manager' || role === 'owner')) {
      fetchClients()
    }
  }, [user, role])

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          name,
          phone,
          email,
          notes,
          visit_count: status === 'vip' ? 5 : 0 // Mocking some visits for VIPs
        })
        
      if (error) throw error
      
      alert('Client profile created successfully!')
      setShowModal(false)
      setName('')
      setPhone('')
      setEmail('')
      setNotes('')
      setStatus('regular')
      fetchClients()
    } catch (error: any) {
      alert('Error creating client: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div style={{ color: 'var(--text-low)', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Loading session...</div>
  }

  if (!user || (role !== 'manager' && role !== 'owner')) {
    return <div style={{ color: '#ff4b4b', textAlign: 'center', padding: '2rem', backgroundColor: '#121212', height: '100vh' }}>Unauthorized. Redirecting to login...</div>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>CRM & Guest Intelligence</h1>
          <p style={{ color: 'var(--text-low)', fontSize: '0.85rem' }}>Track heavy spenders, visit counts, and preferences</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--background)',
            border: 'none',
            padding: '0.6rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + Add New Client
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Total Profiles</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{clients.length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Heavy Spenders (VIP)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{clients.filter(c => c.visit_count >= 5).length}</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>Flagged / Blacklist</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff4b4b' }}>0</div>
        </div>
      </div>

      {/* Clients Table */}
      <div style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--surface-elevated)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-elevated)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-low)' }}>
              <th style={thStyle}>Guest Name</th>
              <th style={thStyle}>Contact</th>
              <th style={thStyle}>Visits</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-low)' }}>Loading clients...</td>
              </tr>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--surface-elevated)' }}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 'bold' }}>{client.name}</div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '0.8rem' }}>{client.phone || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-low)' }}>{client.email || ''}</div>
                  </td>
                  <td style={tdStyle}>{client.visit_count}</td>
                  <td style={tdStyle}>
                    <span style={{
                      fontSize: '0.7rem',
                      color: client.visit_count >= 5 ? 'var(--primary)' : 'var(--text-high)',
                      backgroundColor: client.visit_count >= 5 ? 'rgba(29,185,84,0.1)' : 'rgba(255,255,255,0.05)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {client.visit_count >= 5 ? 'VIP' : 'REGULAR'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>{client.notes || '—'}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-low)' }}>No client profiles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="animate-slideUp">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Add New Client</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-low)', cursor: 'pointer', fontSize: '1.25rem' }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="crm-name" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Full Name</label>
                <input id="crm-name" type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="crm-phone" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Phone Number</label>
                <input id="crm-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="crm-email" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Email Address</label>
                <input id="crm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="crm-status" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Status Level</label>
                <select id="crm-status" value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
                  <option value="regular">Regular Guest</option>
                  <option value="vip">VIP Member</option>
                  <option value="blacklist">Blacklist</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label htmlFor="crm-notes" style={{ fontSize: '0.8rem', color: 'var(--text-low)' }}>Internal Notes</label>
                <textarea id="crm-notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }} placeholder="Prefers table by the bar..." />
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
                {loading ? 'Creating...' : 'Create Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const statCardStyle = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--surface-elevated)',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.25rem'
}

const thStyle = {
  padding: '1rem',
  fontWeight: 'bold' as const,
  fontSize: '0.75rem'
}

const tdStyle = {
  padding: '1rem',
  fontSize: '0.85rem',
  verticalAlign: 'middle' as const
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
  maxWidth: '450px',
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

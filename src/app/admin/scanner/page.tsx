'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase/client'

export default function SecurityScanner() {
  const [scanInput, setScanInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [reservation, setReservation] = useState<any>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scanInput) return
    
    setLoading(true)
    setError('')
    setSuccess('')
    setReservation(null)
    
    try {
      // Search for reservation by QR code hash or guest name (for fallback)
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          guest_name,
          status,
          qr_code_hash,
          tables (table_number)
        `)
        .or(`qr_code_hash.eq.${scanInput},guest_name.ilike.%${scanInput}%`)
        .limit(1)
        .single()
        
      if (error || !data) {
        throw new Error('No reservation found for this code or name.')
      }
      
      setReservation(data)
    } catch (err: any) {
      setError(err.message || 'Failed to find reservation')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    if (!reservation) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'arrived' })
        .eq('id', reservation.id)
        
      if (error) throw error
      
      setSuccess(`${reservation.guest_name} has been checked in successfully!`)
      setReservation({ ...reservation, status: 'arrived' })
      setScanInput('')
    } catch (err: any) {
      setError(err.message || 'Failed to check in guest')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      style={{
        backgroundColor: '#121212',
        color: '#fff',
        minHeight: '100vh',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}
      className="animate-fadeIn"
    >
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>Security Scanner</h1>
        <p style={{ color: 'var(--text-low)', fontSize: '0.85rem' }}>Scan QR codes or search guest list</p>
      </div>

      {/* Scanner Simulator Box */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#1E1E1E',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {/* Camera Placeholder */}
        <div style={{
          width: '100%',
          height: '250px',
          backgroundColor: '#000',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          border: '2px dashed #1DB954',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Scan lines */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '2px',
            backgroundColor: '#1DB954',
            boxShadow: '0 0 10px #1DB954',
            animation: 'scan 2s linear infinite'
          }} />
          
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5">
            <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M12 7v10M8 12h8"/>
          </svg>
          <div style={{ color: '#A7A7A7', fontSize: '0.85rem' }}>Camera view active (Simulated)</div>
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleScan} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#A7A7A7' }}>Manual Code / Name Search</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Enter QR hash or Guest Name"
              style={{
                flex: 1,
                backgroundColor: '#2A2A2A',
                border: '1px solid transparent',
                color: '#fff',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#1DB954',
                color: '#000',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ color: '#ff4b4b', fontSize: '0.85rem', backgroundColor: 'rgba(255,75,75,0.1)', padding: '0.5rem', borderRadius: '4px', width: '100%' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: '#1DB954', fontSize: '0.85rem', backgroundColor: 'rgba(29,185,84,0.1)', padding: '0.5rem', borderRadius: '4px', width: '100%' }}>
            {success}
          </div>
        )}
      </div>

      {/* Result Card */}
      {reservation && (
        <div style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#1E1E1E',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{reservation.guest_name}</div>
              <div style={{ fontSize: '0.85rem', color: '#A7A7A7' }}>Table: {(reservation.tables as any)?.table_number || 'N/A'}</div>
            </div>
            <span style={{ 
              fontSize: '0.8rem', 
              color: reservation.status === 'arrived' ? '#1DB954' : reservation.status === 'pending' ? '#ffcc00' : '#ff4b4b',
              backgroundColor: reservation.status === 'arrived' ? 'rgba(29,185,84,0.1)' : reservation.status === 'pending' ? 'rgba(255,204,0,0.1)' : 'rgba(255,75,75,0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {reservation.status.toUpperCase()}
            </span>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />

          <div style={{ fontSize: '0.8rem', color: '#A7A7A7' }}>
            Code Hash: {reservation.qr_code_hash || 'N/A'}
          </div>

          {reservation.status !== 'arrived' ? (
            <button 
              onClick={handleCheckIn}
              disabled={loading}
              style={{
                backgroundColor: '#1DB954',
                color: '#000',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Processing...' : 'Confirm Check-In'}
            </button>
          ) : (
            <button 
              disabled
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#A7A7A7',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'not-allowed',
                marginTop: '0.5rem'
              }}
            >
              Already Checked In
            </button>
          )}
        </div>
      )}

      {/* Add CSS for scan animation */}
      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  )
}

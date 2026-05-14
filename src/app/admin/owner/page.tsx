'use client'

import { useState } from 'react'

export default function OwnerDashboard() {
  // Mock data for stats
  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+12%', positive: true },
    { label: 'Total Bookings', value: '45', change: '+5%', positive: true },
    { label: 'Guests Arrived', value: '120/150', change: '80%', positive: true },
    { label: 'Active Sales Reps', value: '8', change: 'All active', positive: true },
  ]

  // Mock data for sales leaderboard
  const salesLeaderboard = [
    { rank: 1, name: 'Ahmed Ali', sales: '$4,200', bookings: 12 },
    { rank: 2, name: 'Sara Hassan', sales: '$3,800', bookings: 10 },
    { rank: 3, name: 'Mohamed Amr', sales: '$2,450', bookings: 7 },
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
        <h1 style={{ color: 'var(--primary)' }}>Owner Dashboard</h1>
        <p style={{ color: 'var(--text-medium)' }}>Welcome back. Here is your venue overview.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--surface)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--surface-elevated)'
          }}>
            <div style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stat.value}</div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: stat.positive ? 'var(--primary)' : 'var(--danger)',
              fontWeight: 'bold'
            }}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sales Leaderboard */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Top Performing Sales</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {salesLeaderboard.map((rep) => (
              <div key={rep.rank} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'spaceBetween',
                padding: '0.8rem',
                backgroundColor: 'var(--surface-elevated)',
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: rep.rank === 1 ? 'var(--primary)' : 'var(--text-medium)' 
                  }}>
                    #{rep.rank}
                  </span>
                  <span>{rep.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{rep.sales}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-medium)' }}>{rep.bookings} books</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed Placeholder */}
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--surface)', 
          padding: '1.5rem', 
          borderRadius: '8px'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Live Activity Feed</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FeedItem time="2 mins ago" text="Ahmed Ali booked Table 4 for Guest 'John Doe'." />
            <FeedItem time="5 mins ago" text="Security verified Guest 'Sara' at the door." />
            <FeedItem time="15 mins ago" text="Table 12 marked as occupied." />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedItem({ time, text }: { time: string, text: string }) {
  return (
    <div style={{
      padding: '0.8rem',
      borderLeft: '2px solid var(--primary)',
      backgroundColor: 'var(--surface-elevated)',
      borderRadius: '0 4px 4px 0'
    }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>{time}</div>
      <div style={{ fontSize: '0.9rem' }}>{text}</div>
    </div>
  )
}

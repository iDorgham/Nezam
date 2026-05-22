'use client'

import { useState } from 'react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div style={{
      width: collapsed ? '60px' : '240px',
      backgroundColor: 'var(--surface)',
      height: '100vh',
      transition: 'width 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem 0',
      gap: '2rem',
      borderRight: '1px solid var(--surface-elevated)',
      overflow: 'hidden'
    }}
    onMouseEnter={() => setCollapsed(false)}
    onMouseLeave={() => setCollapsed(true)}
    >
      {/* Logo */}
      <div style={{ 
        color: 'var(--primary)', 
        fontWeight: 'bold',
        fontSize: '1.2rem',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        width: '100%',
        padding: '0 1rem'
      }}>
        {collapsed ? 'CR' : 'Club Reservation'}
      </div>
      
      {/* Nav Links */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem', 
        width: '100%' 
      }}>
        <SidebarItem 
          icon={<HomeIcon />} 
          label="Home" 
          collapsed={collapsed} 
          href="/"
        />
        <SidebarItem 
          icon={<MapIcon />} 
          label="Floor Plan" 
          collapsed={collapsed} 
          href="/admin/floor-plan" 
        />
        <SidebarItem 
          icon={<UsersIcon />} 
          label="Clients" 
          collapsed={collapsed} 
          href="/admin/crm"
        />
        <SidebarItem 
          icon={<DollarIcon />} 
          label="Sales" 
          collapsed={collapsed} 
          href="/admin/sales"
        />
        <SidebarItem 
          icon={<TrophyIcon />} 
          label="Leaderboard" 
          collapsed={collapsed} 
          href="/admin/leaderboard"
        />
        <SidebarItem 
          icon={<QrIcon />} 
          label="Scanner" 
          collapsed={collapsed} 
          href="/admin/scanner" 
        />
        <SidebarItem 
          icon={<DashboardIcon />} 
          label="Manager" 
          collapsed={collapsed} 
          href="/admin/manager" 
        />
        <SidebarItem 
          icon={<QrIcon />} 
          label="QR Editor" 
          collapsed={collapsed} 
          href="/admin/qr-editor" 
        />
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, collapsed, href }: { icon: React.ReactNode, label: string, collapsed: boolean, href: string }) {
  return (
    <a href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.8rem 1rem',
        width: '100%',
        cursor: 'pointer',
        color: 'var(--text-medium)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        fontSize: '1rem',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--text-high)';
        e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--text-medium)';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      >
        <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        {!collapsed && <span>{label}</span>}
      </div>
    </a>
  )
}

// Flat Icons (SVGs)
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )
}

function MapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
  )
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )
}

function DollarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  )
}

function QrIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><circle cx="12" cy="12" r="1"/></svg>
  )
}

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M6 4h12v5c0 3.3-2.7 6-6 6s-6-2.7-6-6V4zm6 11v4m-4 0h8"/></svg>
  )
}

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  )
}

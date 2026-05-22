'use client'

import React, { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import ProfileCard from './ProfileCard'
import ProfileSearch from './ProfileSearch'

interface ProfileGridProps {
  onPreview: (profileName: string) => void
}

export default function ProfileGrid({ onPreview }: ProfileGridProps) {
  const { profiles, selectedProfile, setSelectedProfile } = useSessionStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = profile.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || profile.category === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <ProfileSearch
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {filteredProfiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.name}
              profile={profile}
              isSelected={selectedProfile === profile.name}
              onSelect={() => setSelectedProfile(profile.name)}
              onPreview={() => onPreview(profile.name)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-ds-text-muted">
          No profiles found matching your criteria.
        </div>
      )}
    </div>
  )
}

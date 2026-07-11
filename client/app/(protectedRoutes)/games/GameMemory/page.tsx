"use client"
import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import PreviousButton from '@/components/ui/PreviousButton'
import { useScreenTimeSession } from '@/hooks/useScreenTimeSession.ts'
import { useSelectedChild } from '@/context/childContext'

function MemoryGames() {
    const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
    <div className='bg-section-alt'>
      <HomeButton href="/childAdventure" />
      <MemoryGame/>
      <PreviousButton/>
    </div>
  )
}

export default MemoryGames

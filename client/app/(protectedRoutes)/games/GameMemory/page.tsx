"use client"
import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import PreviousButton from '@/components/ui/PreviousButton'
import { useScreenTimeSession } from '@/hooks/Usescreentimesession'
import { useSelectedChild } from '@/context/childContext'

function MemoryGames() {
    const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <MemoryGame/>
      <PreviousButton/>
    </div>
  )
}

export default MemoryGames

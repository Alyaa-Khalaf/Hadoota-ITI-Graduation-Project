import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import PreviousButton from '@/components/ui/PreviousButton'

function MemoryGames() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <MemoryGame/>
      <PreviousButton/>
    </div>
  )
}

export default MemoryGames

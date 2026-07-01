import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import React from 'react'
import HomeButton from '@/components/ui/HomeButton'

function MemoryGames() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <MemoryGame/>
    </div>
  )
}

export default MemoryGames

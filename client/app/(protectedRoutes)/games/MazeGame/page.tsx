import MazeGame from '@/components/ChildGames/Games/MazeGame'
import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import PreviousButton from '@/components/ui/PreviousButton'
import React from 'react'

function page() {
  return (
  <>
    <MazeGame/>
      <PreviousButton/>
          <MemoryGame/>
          </>
  )
}

export default page
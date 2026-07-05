import MazeGame from '@/components/ChildGames/Games/MazeGame'
import MemoryGame from '@/components/ChildGames/Games/MemoryGame'
import PreviousButton from '@/components/ui/PreviousButton'
import { useSelectedChild } from '@/context/childContext'
import { useScreenTimeSession } from '@/hooks/Usescreentimesession'
import React from 'react'

function MazeGames() {
  const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
  <>
    <MazeGame/>
      <PreviousButton/>
          <MemoryGame/>
          </>
  )
}

export default MazeGames
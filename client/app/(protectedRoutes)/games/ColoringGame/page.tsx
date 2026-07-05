"use client";

import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import ColorMatchGame from '@/components/ChildGames/Games/colors'
import PreviousButton from '@/components/ui/PreviousButton'
import { useScreenTimeSession } from '@/hooks/Usescreentimesession'
import { useSelectedChild } from '@/context/childContext'

function ColoreingGame() {
  const { selectedChild } = useSelectedChild()
  
     useScreenTimeSession(selectedChild?._id)
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <ColorMatchGame/>
      <PreviousButton/>
    </div>
  )
}

export default ColoreingGame

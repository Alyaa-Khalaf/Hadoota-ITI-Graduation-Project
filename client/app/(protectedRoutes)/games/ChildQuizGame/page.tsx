"use client";

import React from 'react'
import ChildQuiz from '@/components/ChildGames/Games/ChildQuiz'
import HomeButton from '@/components/ui/HomeButton'
import PreviousButton from '@/components/ui/PreviousButton'
import { useSelectedChild } from '@/context/childContext'
import { useScreenTimeSession } from '@/hooks/Usescreentimesession'
function ChildQuizGame() {
  const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <PreviousButton/>
      <ChildQuiz/>
    </div>
  )
}

export default ChildQuizGame

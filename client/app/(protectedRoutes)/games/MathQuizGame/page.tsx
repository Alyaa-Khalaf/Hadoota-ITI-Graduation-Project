"use client";

import MathQuizGame from '@/components/ChildGames/Games/MemoryGame'
import PreviousButton from '@/components/ui/PreviousButton'
import { useSelectedChild } from '@/context/childContext';
import { useScreenTimeSession } from '@/hooks/useScreenTimeSession.ts';
import React from 'react'

function MathQuizGames() {
  const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
    <>
    <PreviousButton/>
    <MathQuizGame/>
    </>

  )
}

export default MathQuizGames
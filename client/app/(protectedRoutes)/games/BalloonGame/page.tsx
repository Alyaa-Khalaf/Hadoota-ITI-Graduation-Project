"use client";

import BalloonGame from '@/components/ChildGames/Games/balloon'
import { useSelectedChild } from '@/context/childContext'
import { useScreenTimeSession } from '@/hooks/useScreenTimeSession.ts'
import React from 'react'

function BallonGame() {
  const { selectedChild } = useSelectedChild()

   useScreenTimeSession(selectedChild?._id)
  return (
    <BalloonGame/>
  )
}

export default BallonGame
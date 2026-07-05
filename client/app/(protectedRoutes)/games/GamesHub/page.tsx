"use client";

import GamesHub from '@/components/ChildGames/GamesHub'
import ChildLayout from '@/components/layout/ChildLayout'
import { useSelectedChild } from '@/context/childContext'
import { useScreenTimeSession } from '@/hooks/Usescreentimesession'
import React from 'react'

function GameHub() {
  const { selectedChild } = useSelectedChild()
  
     useScreenTimeSession(selectedChild?._id)
  return (
    <div>
      <ChildLayout>

      <GamesHub/>
      </ChildLayout>
    </div>
  )
}

export default GameHub

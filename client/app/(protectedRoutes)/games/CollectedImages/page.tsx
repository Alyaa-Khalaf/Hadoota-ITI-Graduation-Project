import SpeedReactionGame from '@/components/ChildGames/Games/SpeedReactionGame'
import React from 'react'
import HomeButton from '@/components/ui/HomeButton'

function page() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      < SpeedReactionGame/>
    </div>
  )
}

export default page

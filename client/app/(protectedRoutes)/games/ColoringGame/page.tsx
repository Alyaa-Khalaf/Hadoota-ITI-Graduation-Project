import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import ColorMatchGame from '@/components/ChildGames/Games/colors'
import PreviousButton from '@/components/ui/PreviousButton'

function page() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <ColorMatchGame/>
      <PreviousButton/>
    </div>
  )
}

export default page

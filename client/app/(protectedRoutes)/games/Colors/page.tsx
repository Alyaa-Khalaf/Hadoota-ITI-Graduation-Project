import React from 'react'
import HomeButton from '@/components/ui/HomeButton'
import ColorMatchGame from '@/components/ChildGames/Games/colors'

function page() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <ColorMatchGame/>
    </div>
  )
}

export default page

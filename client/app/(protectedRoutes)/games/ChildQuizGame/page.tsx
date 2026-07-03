import React from 'react'
import ChildQuiz from '@/components/ChildGames/Games/ChildQuiz'
import HomeButton from '@/components/ui/HomeButton'
import PreviousButton from '@/components/ui/PreviousButton'
function page() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <PreviousButton/>
      <ChildQuiz/>
    </div>
  )
}

export default page

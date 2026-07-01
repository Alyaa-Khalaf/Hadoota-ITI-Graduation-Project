import React from 'react'
import ChildQuiz from '@/components/ChildGames/Games/ChildQuiz'
import HomeButton from '@/components/ui/HomeButton'
function page() {
  return (
    <div>
      <HomeButton href="/childAdventure" />
      <ChildQuiz/>
    </div>
  )
}

export default page

import ParentSubscribtion from '@/components/ParentDashboard/ParentSubscribtion'
import PreviousButton from '@/components/ui/PreviousButton'
import React from 'react'

function page() {
  return (
    <>
    <PreviousButton/>
    <h1 className='text-ink text-center text-2xl mt-8'>الإشتراكات</h1>
   <ParentSubscribtion/>
   </>
  )
}

export default page
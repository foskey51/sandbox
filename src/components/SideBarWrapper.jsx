import React from 'react'
import Sidebar from './Sidebar'

export default function SideBarWrapper({children}) {
  return (
    <div className='flex w-screen h-screen'>
        <Sidebar/>
        {children}
    </div>
  )
}

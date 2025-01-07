import React, { ReactNode } from 'react'

interface TopbarProps {
    children:ReactNode
}


const Topbar:React.FC<TopbarProps>  = ({children}) => {
  return (
    <div className='h-[80px] w-full border-b-[1px] border-neutral-500 flex items-center px-5 sticky top-0 z-5'>{children}</div>
  )
}

export default Topbar
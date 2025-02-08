import React from 'react'
import SearchRecent from '../pages/SearchRecent'

const SearchContainer:React.FC = () => {
  return (
      <div className='min-w-[37vw] bg-background  rounded-lg p-4 flex flex-col gap-4' >
          <SearchRecent/>
    </div>
  )
}

export default SearchContainer
import React from 'react'
import SearchRecent from '../pages/SearchRecent'

interface SearchContainerProps { 
  searches: string[];
}
const SearchContainer:React.FC<SearchContainerProps> = ({searches}) => {
  return (
      <div className='min-w-[37vw] bg-background  rounded-lg p-4 flex flex-col gap-4' >
          <SearchRecent history={searches} />
    </div>
  )
}

export default SearchContainer
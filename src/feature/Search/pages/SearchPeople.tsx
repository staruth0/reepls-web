import React from 'react'
import AuthorComponent from '../../Saved/Components/AuthorComponent';

const SearchPeople:React.FC = () => {
  return (
    <div className="people">
      <div className='space-y-4 mt-4'>
       <p>Leading in Politics</p>
        <AuthorComponent />
        <AuthorComponent />
        <AuthorComponent />
        <AuthorComponent />
      </div>
      <div className='space-y-4 mt-4'>
       <p>Leading in Business</p>
        <AuthorComponent />
        <AuthorComponent />
        <AuthorComponent />
        <AuthorComponent />
      </div>
   
    </div>
  );
}

export default SearchPeople
import React from 'react'
import AuthorComponent from '../../Saved/Components/AuthorComponent'

const SimilarProfiles:React.FC = () => {
  return (
    <div className="flex flex-col gap-6 px-3 ">
      <AuthorComponent />
      <AuthorComponent />
      <AuthorComponent />
      <AuthorComponent />
      <AuthorComponent />
    </div>
  );
}

export default SimilarProfiles
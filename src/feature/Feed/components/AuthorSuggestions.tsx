import React from 'react'
import SeeMore from './SeeMore';
import AuthorSugestionComponent from './AuthorSugestionComponent';


const AuthorSuggestions: React.FC = () => {
    
  return (
    <div className=" w-full flex flex-col gap-6 mt-4 py-1">
    
          <AuthorSugestionComponent/>
          <AuthorSugestionComponent/>
          <AuthorSugestionComponent/>
          <AuthorSugestionComponent/>
          <AuthorSugestionComponent/>
          
      <SeeMore />
    </div>
  );
}

export default AuthorSuggestions
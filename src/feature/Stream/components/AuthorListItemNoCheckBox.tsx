import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Publication } from '../../../models/datamodels';



interface AuthorListItemNoCheckboxProps {
  author: Publication;
}

const AuthorListItemNoCheckbox: React.FC<AuthorListItemNoCheckboxProps> = ({ author }) => {
 const navigate = useNavigate(); 
 const id = author._id || author.id; 
  return (
    <div className="flex items-center py-2 w-full">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-400 text-white font-bold mr-3">
        {author.title.charAt(0)}
      </div>

      {/* Author details section */}
      <div className="flex-grow">
        <p onClick={()=>navigate(`/stream/${id}`)} className="hover:underline cursor-pointer font-medium text-neutral-50 dark:text-neutral-50">
          {author.title}
        </p>
        <p className="text-sm text-neutral-100 dark:text-neutral-300">{author.description}</p>
        <p className="text-xs text-neutral-100 dark:text-neutral-400">
          {author.tags?.map(tag => `#${tag}`).join(' ')}
        </p>
      </div>
    </div>
  );
};

export default AuthorListItemNoCheckbox;
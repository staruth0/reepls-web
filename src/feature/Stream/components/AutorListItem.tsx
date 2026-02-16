import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the Author object
interface Author {
  id: string;
  name: string;
  description: string;
  tags: string[];
  selected: boolean;
}

// Define the props for the AuthorListItem component
interface AuthorListItemProps {
  author: Author;
  onToggleSelect: (id: string) => void;
}

const AuthorListItem: React.FC<AuthorListItemProps> = ({ author, onToggleSelect }) => {
 const navigate = useNavigate(); 
 const id = 'nd'
  return (
    <div className="flex items-center py-2 w-full">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-400 text-white font-bold mr-3">
        {author.name.charAt(0)}
      </div>

      {/* Author details section */}
      <div className="flex-grow">
        <p onClick={()=>navigate(`/stream/${id}`)} className="hover:underline cursor-pointer font-medium text-neutral-50 dark:text-neutral-50">
          {author.name}
        </p>
        <p className="text-sm text-neutral-100 dark:text-neutral-300">{author.description}</p>
        <p className="text-xs text-neutral-100 dark:text-neutral-400">
          {author.tags.map(tag => `#${tag}`).join(' ')}
        </p>
      </div>

      {/* Selection checkbox/toggle */}
      <div
        className={`w-5 h-5 rounded-full border-2 ${
          author.selected ? 'bg-primary-400 border-primary-400' : 'border-neutral-500'
        } cursor-pointer`}
        onClick={() => onToggleSelect(author.id)}
      ></div>
    </div>
  );
};

export default AuthorListItem;
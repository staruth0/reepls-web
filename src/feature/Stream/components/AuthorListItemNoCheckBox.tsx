import React from 'react';

interface Author {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

interface AuthorListItemNoCheckboxProps {
  author: Author;
}

const AuthorListItemNoCheckbox: React.FC<AuthorListItemNoCheckboxProps> = ({ author }) => {
  return (
    <div className="flex items-center py-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-400 text-white font-bold mr-3">
        {author.name.charAt(0)}
      </div>

      {/* Author details section */}
      <div className="flex-grow">
        <p className="font-medium text-neutral-50 dark:text-neutral-50">
          {author.name}
        </p>
        <p className="text-sm text-neutral-100 dark:text-neutral-300">{author.description}</p>
        <p className="text-xs text-neutral-100 dark:text-neutral-400">
          {author.tags.map(tag => `#${tag}`).join(' ')}
        </p>
      </div>
    </div>
  );
};

export default AuthorListItemNoCheckbox;
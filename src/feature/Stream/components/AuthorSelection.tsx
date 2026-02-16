import React, { useState } from 'react';
import AuthorListItem from './AutorListItem';

interface Author {
  id: string;
  name: string;
  description: string;
  tags: string[];
  selected: boolean;
}

interface AuthorSelectionProps {
  onSelectAuthors: (authors: { id: string; name: string }[]) => void;
  onClose: () => void;
  initialSelectedAuthors: { id: string; name: string }[];
}

const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Ako Max',
    description: 'Writer @ CMR FA magazine | MSc Data Science',
    tags: ['tech', 'science', 'education'],
    selected: false,
  },
  {
    id: '2',
    name: 'Ndifor Icha',
    description: 'Intern @AkwaData | Google Certified Engineer',
    tags: ['tech', 'science', 'data'],
    selected: false,
  },
  {
    id: '3',
    name: 'Ngameni Bertin',
    description: 'Independent Data Commentator',
    tags: ['datascience', 'science', 'ai'],
    selected: false,
  },
];

const AuthorSelection: React.FC<AuthorSelectionProps> = ({
  onSelectAuthors,
  onClose,
  initialSelectedAuthors,
}) => {
  const initialAuthors = mockAuthors.map(author => ({
    ...author,
    selected: initialSelectedAuthors.some(sa => sa.id === author.id)
  }));
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleToggleSelect = (id: string) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === id ? { ...author, selected: !author.selected } : author
      )
    );
  };

  const handleRemoveSelectedAuthor = (id: string) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author) =>
        author.id === id ? { ...author, selected: false } : author
      )
    );
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAuthors = authors.filter((author) => author.selected);

  const handleSelectButtonClick = () => {
    const finalSelection = selectedAuthors.map(author => ({ id: author.id, name: author.name }));
    onSelectAuthors(finalSelection);
    onClose();
  };

  return (
    <div className="p-6 bg-neutral-800 rounded-lg shadow-lg w-full max-w-md mx-auto text-neutral-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Find Authors</h3>
        <button
          onClick={handleSelectButtonClick}
          className="bg-primary-400 text-white px-4 py-2 rounded-full font-medium hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
        >
          Select
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedAuthors.map((author) => (
          <span
            key={author.id}
            className="flex items-center bg-neutral-600 text-neutral-50 px-3 py-1 rounded-full text-sm"
          >
            {author.name}{' '}
            <span
              onClick={() => handleRemoveSelectedAuthor(author.id)}
              className="ml-2 cursor-pointer text-neutral-300 hover:text-white"
            >
              X
            </span>
          </span>
        ))}
      </div>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search author name"
          className="w-full p-3 pl-10 rounded-lg bg-neutral-700 text-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">🔍</span>
      </div>
      <div className="mb-4">
        <h4 className="text-neutral-400 text-sm mb-2">Suggested</h4>
        {filteredAuthors.map((author) => (
          // Use the new AuthorListItem component here
          <AuthorListItem
            key={author.id}
            author={author}
            onToggleSelect={handleToggleSelect}
          />
        ))}
      </div>
      <div className="text-xs text-neutral-400 mt-4">All</div>
    </div>
  );
};

export default AuthorSelection;
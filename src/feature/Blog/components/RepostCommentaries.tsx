import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RepostsCommentarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
}

const RepostsCommentarySidebar: React.FC<RepostsCommentarySidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const dummyReposts = [
    {
      id: '1',
      author: 'Jane Doe',
      bio: 'Enthusiast of new technologies.',
      comment: 'Loved this article! Shared it with my network because the insights on future trends were incredibly well-researched and presented. A truly comprehensive piece that provides a clear roadmap for anyone looking to understand the evolving landscape of digital innovation.',
      timestamp: '2 hours ago',
      profile_picture: ''
    },
    {
      id: '2',
      author: 'John Smith',
      bio: 'Tech entrepreneur and blogger.',
      comment: 'Very insightful points about the future of tech. Great read! It really makes you think about the broader implications of AI and blockchain on society. Highly recommend it to anyone interested in cutting-edge advancements.',
      timestamp: '5 hours ago',
      profile_picture: 'https://via.placeholder.com/40/FF5733/FFFFFF?text=JS'
    },
    {
      id: '3',
      author: 'Alice Wonderland',
      bio: 'Freelance writer.',
      comment: 'Reposting this for everyone to see. Excellent work! The clarity of the arguments is superb, and the examples provided make complex ideas easy to grasp. This is definitely going into my personal knowledge base.',
      timestamp: '1 day ago',
      profile_picture: ''
    },
    {
      id: '4',
      author: 'Bob Charles',
      bio: 'Digital marketing specialist.',
      comment: 'A must-read for anyone interested in this topic. The depth of analysis is impressive, and it challenges conventional wisdom in a very constructive way. I especially appreciated the section on sustainable practices in the tech industry. This piece will be a valuable reference for a long time.',
      timestamp: '2 days ago',
      profile_picture: 'https://via.placeholder.com/40/33FF57/FFFFFF?text=BC'
    },
  ];

  const MAX_COMMENT_LINES = 2;

  const needsTruncation = (text: string, maxLines: number, charLimit: number = 100) => {
    const lineBreaks = (text.match(/\n/g) || []).length;
    return lineBreaks >= maxLines || text.length > charLimit;
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-[var(--background)] shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 border-b border-[var(--neutral-700)] flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--plain-a)]">Repost Commentaries</h2>
        <button 
          onClick={onClose} 
          className="text-[var(--neutral-300)] hover:text-[var(--plain-a)] focus:outline-none"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-60px)] 
        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {dummyReposts.length > 0 ? (
          dummyReposts.map((repost) => {
            const isExpanded = expandedComments.has(repost.id);
            const firstNameInitial = repost.author.split(' ')[0].charAt(0).toUpperCase();
            const shouldTruncate = needsTruncation(repost.comment, MAX_COMMENT_LINES, 100);

            return (
              <div 
                key={repost.id} 
                className="mb-4 p-3 bg-[var(--background)] shadow-md rounded-lg border border-[var(--neutral-700)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  {repost.profile_picture ? (
                    <img
                      src={repost.profile_picture}
                      alt={repost.author}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-400)] flex items-center justify-center text-[var(--plain-b)] font-bold text-lg">
                      {firstNameInitial}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[var(--plain-a)]">{repost.author}</p>
                    {repost.bio && (
                      <p className="text-[var(--neutral-200)] text-xs">{repost.bio}</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <p
                    className={`text-[var(--neutral-100)] text-sm ${
                      !isExpanded && shouldTruncate ? 'line-clamp-2' : ''
                    }`}
                  >
                    {repost.comment}
                  </p>
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(repost.id)}
                      className="text-[var(--primary-400)] text-sm mt-1 hover:underline focus:outline-none"
                      aria-label={isExpanded ? 'Show less comment' : 'Show more comment'}
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>

                <p className="text-[var(--neutral-400)] text-xs mt-2">
                  {repost.timestamp}
                </p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-[var(--neutral-300)] text-center">
              No repost commentaries yet for this article.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepostsCommentarySidebar;
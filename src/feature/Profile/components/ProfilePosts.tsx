import React from 'react';
import { LuFile } from 'react-icons/lu';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useTranslation } from 'react-i18next';

interface ProfileArticlesProps {
  authorId?: string;
  posts?: Article[]; // Optional prop for pre-fetched posts
  isAuthUser?: boolean;
}

const ProfilePosts: React.FC<ProfileArticlesProps> = ({ posts = [], isAuthUser = false }) => {
  // If posts are not provided, this component assumes the parent handles loading/error states
  const hasPosts = posts && posts.length > 0;
  const {t} = useTranslation();

  return (
    <div>
      {hasPosts ? (
        <div className="w-full flex flex-col items-center">
          {posts.map((post: Article) => (
            <BlogPost key={post._id} article={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 flex flex-col items-center gap-4">
          <LuFile className="text-4xl text-neutral-400" />
          {isAuthUser ? (
            <div className="flex flex-col items-center gap-4 max-w-md px-4">
              <p className="text-neutral-400 text-base mb-2">
                {t("profile.noPosts") || "You haven't created any posts yet"}
              </p>
              <div className="text-left text-neutral-300 text-sm space-y-2 bg-neutral-800 p-4 rounded-lg">
                <p className="font-medium text-neutral-200 mb-3">To create a post:</p>
                <ol className="list-decimal list-inside space-y-2 text-neutral-300">
                  <li>Click on the button on the sidebar or button navigation (depending on screen size) "create post"</li>
                  <li>From the popup that appears, select "create post"</li>
                  <li>Then publish</li>
                </ol>
              </div>
            </div>
          ) : (
            <p className="text-neutral-400 text-base">
              This user has no posts yet oops
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;

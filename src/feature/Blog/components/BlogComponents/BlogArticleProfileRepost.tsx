import React, { useEffect } from "react";
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { Article, User } from "../../../../models/datamodels";
import { useRoute } from "../../../../hooks/useRoute";
import { useUpdateArticle } from "../../hooks/useArticleHook";
import { timeAgo } from "../../../../utils/dateFormater";

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content?: string;
  title?: string;
  isArticle: boolean;
  article: Article;
}

const BlogArticleProfileRepost: React.FC<BlogProfileProps> = ({ user, article }) => {
  const { goToProfile } = useRoute();
  const { mutate } = useUpdateArticle(); 


  const handleProfileClick = (username: string) => {
    mutate({
      articleId: article._id || '',
      article: {
        author_profile_views_count: article.author_profile_views_count! + 1,
        engagement_count: article.engagement_count! + 1
      }
    })
    if (username) {
      goToProfile(username);
    }
  };

  // Only the useEffect for updating article counts is maintained
  useEffect(() => {
    mutate({
      articleId: article._id || '',
      article: {
        impression_count: article.impression_count! + 1,
      }
    })
  }, [article, mutate]);

  if (!user) {
    return <LuLoader className="size-4 animate-spin my-auto" />;
  }

  return (
    <div className="blog-profile relative flex items-center gap-3">
      {user?.profile_picture && user?.profile_picture !== 'https://example.com/default-profile.png' && user?.profile_picture !== '' ? (
        <img
          src={user?.profile_picture}
          alt="avatar"
          onClick={() => handleProfileClick(user?.username || "")}
          className="cursor-pointer size-12 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <span
          className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center"
          onClick={() => handleProfileClick(user?.username || "")}
        >
          {user?.name?.charAt(0).toUpperCase() || 'D'}
        </span>
      )}
      <div className="profile-info flex-1">
        <div className="profile-name flex items-center gap-1">
          <p
                className="hover:underline cursor-pointer text-base font-semibold"
                onClick={() => handleProfileClick(user?.username || "")}
              >
                {user?.name ? user?.name : <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />}
              </p>
          {user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400" />}
          {/* Removed conditional rendering for follow button */}
        </div>
        <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-100 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]" title={user?.bio}>
              {user?.bio && user.bio.length > 40 ? `${user.bio.substring(0, 40)}...` : (user?.bio || "Reepls user")}
            </p>
            <span className="text-sm text-neutral-100">•</span>
            <span className="text-sm text-neutral-100">{timeAgo(article?.createdAt || '')}</span>
          </div>
      </div>
      {/* Removed all menu and popup related JSX */}
    </div>
  );
};

export default BlogArticleProfileRepost;
import { Bookmark, EllipsisVertical, Share2, UserPlus, X, Trash2, Edit, BarChart2, Flag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LuBadgeCheck, LuLoader } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SharePopup from "../../../../components/molecules/share/SharePopup";
import { useRoute } from "../../../../hooks/useRoute";
import { useUser } from "../../../../hooks/useUser";
import { Article, ArticleDuplicate, User } from "../../../../models/datamodels";
import { useUnfollowUser } from "../../../Follow/hooks";
import { useKnowUserFollowings } from "../../../Follow/hooks/useKnowUserFollowings";
import { useGetSavedArticles, useRemoveSavedArticle, useSaveArticle } from "../../../Saved/hooks";
import "./Blog.scss";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import { useSendFollowNotification } from "../../../Notifications/hooks/useNotification";
import { useDeleteArticle, useUpdateArticle } from "../../hooks/useArticleHook";
import ConfirmationModal from "../ConfirmationModal";
import PostEditModal from "../PostEditModal";
import { t } from "i18next";
import ReportArticlePopup from "../../../Reports/components/ReportPostPopup";
import { timeAgo } from "../../../../utils/dateFormater";

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content?: string;
  title?: string;
  isArticle: boolean;
  article:Article
}

const BlogProfile: React.FC<BlogProfileProps> = ({ user,article_id,article, title, content, isArticle }) => {
  const { authUser, isLoggedIn } = useUser();
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { isFollowing } = useKnowUserFollowings();
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } = useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const [saved, setSaved] = useState(false);
  const { mutate: followUser, isPending: isFollowPending } = useSendFollowNotification();
  const { mutate: deleteArticle, isPending: isDeletePending } = useDeleteArticle();
    const [showReportPopup, setShowReportPopup] = useState(false);

  const articleTitle = title || (content ? content.split(" ").slice(0, 10).join(" ") + "..." : "Untitled Post");
  const articleUrl = `${window.location.origin}/posts/${isArticle ? "article" : "post"}/${isArticle?'slug/'+article.slug: article_id}`;
     const {mutate} = useUpdateArticle()

  const isCurrentAuthorArticle = user?._id === authUser?.id;

  const handleProfileClick = (username: string) => {
         mutate({
      articleId:article._id || '',
      article:{
       author_profile_views_count:(article.author_profile_views_count || 0) +1,
        engagement_count:(article.engagement_count || 0) +1
      }
    })
    if (username) {
      goToProfile(username);
    }
  };

  const handleDeleteArticle = () => {
    deleteArticle(article_id, {
      onSuccess: () => {
        toast.success('Article deleted successfully');
        setShowDeleteConfirmation(false);
        navigate('/feed');
      },
      onError: () => {
        toast.error('An error occurred while trying to delete article');
        setShowDeleteConfirmation(false);
      },
    });
  };

  const handleSavedArticle = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    if (isSavePending || isRemovePending) return;

    if (saved) {
      removeSavedArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleRemoved"));
               mutate({
      articleId:article._id || '',
      article:{
   
        engagement_count:(article.engagement_count || 0) -1
      }
    })
          setSaved(false);
          
        },
      });
    } else {
      saveArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleSaved"));
          setSaved(true);
               mutate({
      articleId:article._id || '',
      article:{
        engagement_count:(article.engagement_count || 0) +1
      }
    })
        },
      });
    }
  };

  const handleFollowClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    if (!user?._id) return;

    if (isFollowing(user?._id)) {
      unfollowUser(user?._id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.userUnfollowed"));
            mutate({
      articleId:article._id || '',
      article:{
        author_follower_count:(article.author_follower_count || 0) -1,
        engagement_count:(article.engagement_count || 0) -1
      }
    })
        },
      });
    } else {
      followUser({ receiver_id: user?._id }, {
        onSuccess: () => {
          toast.success(t("blog.alerts.userFollowed"));
                mutate({
      articleId:article._id || '',
      article:{
        author_follower_count:(article.author_follower_count || 0) + 1,
        engagement_count:(article.engagement_count || 0) +1
      }
    })
        },
      });
    }
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
    setShowMenu(false);
  };

  const handleEllipsisClick = () => {
    check()
    if (!isLoggedIn) {
      setShowSignInPopup(true);
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleEditClick = (id: string) => {
    if (isArticle) {
      navigate(`/article/edit/${id}`);
    } else {
      setShowEditModal(true);
    }
    setShowMenu(false);
  };

  const handleAnalyticsClick = (value: string) => {
    navigate(`/post/analytics/${value}`);
    setShowMenu(false);
  };

  function check(){

  }

  useEffect(() => {
    const isSaved = savedArticles?.articles?.some((article: ArticleDuplicate) => article?.article?._id === article_id);
    setSaved(isSaved );
  }, [savedArticles, article_id]);

  const getFollowStatusText = (isMenu = false) => {
    if (!isLoggedIn) return t("follow");
    if (isFollowPending) return `${t("following")}...`;
    if (isUnfollowPending) return `${t("unfollowing")}...`;
    return isFollowing(user?._id || "") ? t("") : isMenu ? t("blog.Followauthor") : t("follow");
  };
  const getFollowMenuStatusText = (isMenu = false) => {
    if (!isLoggedIn) return t("follow");
    if (isFollowPending) return `${t("following")}...`;
    if (isUnfollowPending) return `${t("unfollowing")}...`;
    return isFollowing(user?._id || "") ? t("following") : isMenu ? t("blog.Followauthor") : t("follow");
  };

  const getSaveStatusText = () => {
    if (!isLoggedIn) return t("blog.AddToSaved");
    if (isSavePending) return t("blog.saving");
    if (isRemovePending) return t("blog.removing");
    return saved ? t("blog.UnsavePost") : t("blog.AddToSaved");
  };

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
        <p
          className="flex justify-center items-center bg-purple-200 text-purple-800 text-[16px] font-medium rounded-full w-10 h-10 text-center"
          onClick={() => handleProfileClick(user?.username || "")}
        >
          {user?.name?.charAt(0).toUpperCase() || 'D'}
        </p>
      )}
      <div className=" flex-1">
        <div className="profile-name flex items-center gap-1">
          <p
            className="hover:underline cursor-pointer text-[15px] font-semibold"
            onClick={() => handleProfileClick(user?.username || "")}
          >
            {user?.name ? user.name.split(' ').slice(0, 2).join(' ') : " "}
          </p>
          {user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400" />}
          {!location.pathname.includes("/feed/following") && (
            <div>
              {!isCurrentAuthorArticle && (
                <span
                  className={`cursor-pointer text-primary-400 hover:underline ml-2 text-sm ${
                    !isLoggedIn ? "pointer-events-none opacity-50" : ""
                  }`}
                  onClick={handleFollowClick}
                >
                  {getFollowStatusText()}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
            <p className="text-sm text-neutral-100 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]" title={user?.bio}>
              {user?.bio && user.bio.length > 30 ? `${user.bio.substring(0, 30)}...` : (user?.bio || "Reepls user")}
            </p>
            <span className="text-sm text-neutral-100">•</span>
            <span className="text-sm text-neutral-100">{timeAgo(article?.createdAt || '')}</span>
          </div>
      </div>
      <div className="relative">
        {showMenu ? (
          <X className="size-4 cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
        ) : (
          <EllipsisVertical className="size-3 cursor-pointer" onClick={handleEllipsisClick} />
        )}
        {showMenu && isLoggedIn && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-0 z-40"
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 top-6 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50 z-50">
              {isCurrentAuthorArticle ? (
                <>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={() => handleEditClick(article_id)}
                  >
                    <Edit size={18} className="text-neutral-500" />
                    <div>{t("blog.EditPost")}</div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={() => handleAnalyticsClick(article_id)}
                  >
                    <BarChart2 size={18} className="text-neutral-500" />
                    <div>{t("blog.Analytics")}</div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={handleShareClick}
                  >
                    <Share2 size={18} className="text-neutral-500" />
                    <div>{t("blog.Share")}</div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer text-red-500"
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    <Trash2 size={18} className="text-red-500" />
                    <div>{t("blog.Delete")}</div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={handleSavedArticle}
                  >
                    <Bookmark size={18} className="text-neutral-500" />
                    <div>{getSaveStatusText()}</div>
                  </div>
                 <div
                  className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                  onClick={() => setShowReportPopup(true)}
                >
                  <Flag size={18} className="text-neutral-500" />
                  {t("blog.ReportPost")}
                </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={handleFollowClick}
                  >
                    <UserPlus size={18} className="text-neutral-500" />
                    {getFollowMenuStatusText(true)}
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={handleShareClick}
                  >
                    <Share2 size={18} className="text-neutral-500" /> {t("blog.Share")}
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {showSignInPopup && (
          <SignInPopUp
            text={t("blog.followthisuser")}
            position="below"
            onClose={() => setShowSignInPopup(false)}
          />
        )}
      </div>
      {showSharePopup && (
        <SharePopup 
          url={articleUrl} 
          title={articleTitle} 
          subtitle={article?.subtitle}
          thumbnail={article?.thumbnail}
          media={article?.media}
          isArticle={article?.isArticle}
          description={article?.subtitle || article?.content?.substring(0, 160) + "..."}
          onClose={() => setShowSharePopup(false)} 
        />
      )}
          {showReportPopup && (
        <ReportArticlePopup
          articleTitle={articleTitle}
          articleId={article_id}
          onClose={() => setShowReportPopup(false)}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmationModal
          title={t("blog.DeleteArticle")}
          message={t("blog.DeleteArticleConfirmation")}
          onConfirm={handleDeleteArticle}
          onCancel={() => setShowDeleteConfirmation(false)}
          confirmText={isDeletePending ? t("blog.Deleting") : t("blog.Delete")}
          confirmColor="red"
        />
      )}
      {showEditModal && (
        <PostEditModal
          isModalOpen={showEditModal}
          setIsModalOpen={setShowEditModal}
          articleId={article_id}
        />
      )}
    </div>
  );
};

export default BlogProfile;
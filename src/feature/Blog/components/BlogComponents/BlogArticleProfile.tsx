import {
  Bookmark,
  EllipsisVertical,
  Share2,
  UserPlus,
  X,
  Trash2,
  Edit,
  BarChart2,
  Flag,
} from "lucide-react";
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
import {
  useGetSavedArticles,
  useRemoveSavedArticle,
  useSaveArticle,
} from "../../../Saved/hooks"; // Ensure these hooks have optimistic updates
import "./Blog.scss";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import { useSendFollowNotification } from "../../../Notifications/hooks/useNotification";
import { useDeleteArticle, useUpdateArticle } from "../../hooks/useArticleHook";
import ConfirmationModal from "../ConfirmationModal";
import PostEditModal from "../PostEditModal";
import { t } from "i18next";
import ReportArticlePopup from "../../../Reports/components/ReportPostPopup";
import { timeAgo } from "../../../../utils/dateFormater";
import { cn } from "../../../../utils"; // Make sure cn utility is imported if you use it

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content?: string;
  title?: string;
  isArticle: boolean;
  article: Article;
  isRepostedView?: boolean;
}

const BlogArticleProfile: React.FC<BlogProfileProps> = ({
  user,
  article_id,
  article,
  title,
  content,
  isArticle,
  isRepostedView = false,
}) => {
  const { authUser, isLoggedIn } = useUser();
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { mutate: unfollowUser, isPending: isUnfollowPending } =
    useUnfollowUser();
  const { isFollowing } = useKnowUserFollowings();
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } =
    useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const [saved, setSaved] = useState(false);
  const { mutate: followUser, isPending: isFollowPending } =
    useSendFollowNotification();
  const { mutate: deleteArticle, isPending: isDeletePending } =
    useDeleteArticle();
  const [showReportPopup, setShowReportPopup] = useState(false);

  const articleTitle =
    title ||
    (content
      ? content.split(" ").slice(0, 10).join(" ") + "..."
      : "Untitled Post");
  const articleUrl = `${window.location.origin}/posts/${
    isArticle ? "article" : "post"
  }/${isArticle ? "slug/" + article.slug : article_id}`;
  const { mutate } = useUpdateArticle(); // This is for updating article properties, not for save/remove status

  const isCurrentAuthorArticle = user?._id === authUser?.id;

  const handleProfileClick = (username: string) => {
    // Only update engagement if the user being clicked is not the current auth user
    if (user?._id !== authUser?.id) {
      mutate({
        articleId: article._id || "",
        article: {
          author_profile_views_count: (article.author_profile_views_count || 0) + 1,
          engagement_count: (article.engagement_count || 0) + 1,
        },
      });
    }
    if (username) {
      goToProfile(username);
    }
  };

  const handleDeleteArticle = () => {
    deleteArticle(article_id, {
      onSuccess: () => {
        toast.success("Article deleted successfully");
        setShowDeleteConfirmation(false);
        navigate("/feed");
      },
      onError: () => {
        toast.error("An error occurred while trying to delete article");
        setShowDeleteConfirmation(false);
      },
    });
  };

  const handleSavedArticle = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    // Prevent multiple rapid clicks while a save/remove operation is ongoing
    if (isSavePending || isRemovePending) return;

    if (saved) {
      removeSavedArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleRemoved"));
          // The `useEffect` below will react to the optimistic update in `useRemoveSavedArticle`
          // which modifies the `savedArticles` cache.
          
          // You might still want to update engagement count immediately for the user experience,
          // though for true consistency, this should ideally also be part of an optimistic
          // update on a 'main article' query or handled by your backend.
          mutate({
            articleId: article._id || "",
            article: {
              engagement_count: (article.engagement_count || 0) - 1,
            },
          });
        },
        onError: () => {
          toast.error(t("blog.alerts.articleRemoveFailed"));
          // The `useEffect` below will react to the rollback in `useRemoveSavedArticle`.
        },
      });
    } else {
      saveArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleSaved"));
          // The `useEffect` below will react to the optimistic update in `useSaveArticle`.

          // Similar to above, client-side engagement update.
          mutate({
            articleId: article._id || "",
            article: {
              engagement_count: (article.engagement_count || 0) + 1,
            },
          });
        },
        onError: () => {
          toast.error(t("blog.alerts.articleSaveFailed"));
          // The `useEffect` below will react to the rollback in `useSaveArticle`.
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
            articleId: article._id || "",
            article: {
              author_follower_count: (article.author_follower_count || 0) - 1,
              engagement_count: (article.engagement_count || 0) - 1,
            },
          });
        },
        onError: () => toast.error(t("blog.alerts.userUnfollowFailed")),
      });
    } else {
      followUser(
        { receiver_id: user?._id },
        {
          onSuccess: () => {
            toast.success(t("blog.alerts.userFollowed"));
            mutate({
              articleId: article._id || "",
              article: {
                author_follower_count: (article.author_follower_count || 0) + 1,
                engagement_count: (article.engagement_count || 0) + 1,
              },
            });
          },
          onError: () => toast.error(t("blog.alerts.userFollowFailed")),
        }
      );
    }
  };

  const handleShareClick = () => {
    setShowSharePopup(true);
    setShowMenu(false);
  };

  const handleEllipsisClick = () => {
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

  // This useEffect ensures the 'saved' state is always in sync with the savedArticles cache.
  // It will react to both optimistic updates and actual server responses (via invalidateQueries).
  useEffect(() => {
    const isSaved = savedArticles?.articles?.some(
      (item: ArticleDuplicate) => item?.article?._id === article_id
    );
    setSaved(isSaved);
  }, [savedArticles, article_id]);


  // Helper function for follow status text display
  const getFollowStatusText = () => {
    if (!isLoggedIn) return t("follow");
    if (isFollowPending) return `${t("following")}...`;
    if (isUnfollowPending) return `${t("unfollowing")}...`;
    // This is for the main 'Follow' button next to the author's name
    return isFollowing(user?._id || "") ? "" : t("follow"); // Empty string to hide if already following
  };

  // Helper function for follow status text display in the menu
  const getFollowMenuStatusText = () => {
    if (!isLoggedIn) return t("follow");
    if (isFollowPending) return `${t("following")}...`;
    if (isUnfollowPending) return `${t("unfollowing")}...`;
    // This is for the menu item 'Follow author' or 'Following'
    return isFollowing(user?._id || "") ? t("following") : t("blog.Followauthor");
  };

  // Helper function for save status text display - NOW SHARED LOGIC!
  const getSaveStatusText = () => {
    if (!isLoggedIn) return t("blog.AddToSaved");
    // The `saved` state should update optimistically,
    // so `isSavePending` and `isRemovePending` primarily manage text display during the network call.
    if (isSavePending) return t("blog.saving");
    if (isRemovePending) return t("blog.removing");
    return saved ? t("blog.UnsavePost") : t("blog.AddToSaved");
  };

  // Initial loader for the entire component if user data isn't loaded yet.
  // This is fine as it indicates data fetching for the profile.
  if (!user) {
    return <LuLoader className="size-4 animate-spin my-auto" />;
  }

  return (
    <div className="blog-profile relative flex items-center justify-between">
      {isRepostedView ? (
        <div className="flex items-center gap-2">
          <p
            className="font-semibold cursor-pointer"
            onClick={() => goToProfile(user?.username || "")}
          >
            {user?.username || (
              <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />
            )}
          </p>
          <span className="text-neutral-300 text-sm">Reposted</span>
        </div>
      ) : (
        <>
          {user?.profile_picture &&
          user?.profile_picture !== "https://example.com/default-profile.png" &&
          user?.profile_picture !== "" ? (
            <img
              src={user?.profile_picture}
              alt="avatar"
              onClick={() => handleProfileClick(user?.username || "")}
              className="cursor-pointer size-14 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span
              className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center"
              onClick={() => handleProfileClick(user?.username || "")}
            >
              {user?.name?.charAt(0).toUpperCase() || "D"}
            </span>
          )}
          <div className="profile-info flex-1 ml-3">
            <div className="profile-name flex items-center gap-1">
              <p
                className="hover:underline cursor-pointer text-base font-semibold"
                onClick={() => handleProfileClick(user?.username || "")}
              >
                {user?.name ? (
                  user?.name
                ) : (
                  <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />
                )}
              </p>
              {user?.is_verified_writer && (
                <LuBadgeCheck className="size-4 text-primary-400" />
              )}
              {!location.pathname.includes("/feed/following") && (
                <div>
                  {!isCurrentAuthorArticle && (
                    <span
                      className={cn( // Use cn utility for class concatenation
                        `cursor-pointer text-primary-400 hover:underline ml-2 text-sm`,
                        !isLoggedIn ? "pointer-events-none opacity-50" : "", // Grey out if not logged in
                        (isFollowPending || isUnfollowPending) ? "opacity-70" : "" // Subtle dim for pending
                      )}
                      onClick={handleFollowClick}
                    >
                      {getFollowStatusText()}
                      {(isFollowPending || isUnfollowPending) && <LuLoader className="animate-spin size-3 ml-1 inline-block" />} {/* Small loader next to text */}
                    </span>
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-neutral-100">{user?.bio}</p>
            <span className="text-sm text-neutral-100">
              {article?.createdAt ? (
                timeAgo(article?.createdAt || "")
              ) : (
                <div className="w-24 h-3 bg-neutral-600 rounded-md animate-pulse mt-1" />
              )}
            </span>
          </div>
        </>
      )}
      <div className="relative">
        {showMenu ? (
          <X
            className="size-4 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          />
        ) : (
          <EllipsisVertical
            className="size-3 cursor-pointer"
            onClick={handleEllipsisClick}
          />
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
                  {(!isArticle ||
                    (isArticle && article?.type === "Repost")) && (
                    <div
                      className={cn( // Apply conditional styling to the div for disabling click
                        "flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer",
                        (isSavePending || isRemovePending) ? "pointer-events-none opacity-70" : "" // Disable and dim while pending
                      )}
                      onClick={handleSavedArticle}
                    >
                      <Bookmark
                        size={18}
                        className={cn(
                          "text-neutral-500", // Default color
                          saved ? "fill-primary-500 text-primary-500" : "", // Filled/colored if saved (optimistic)
                          // No opacity here, it's applied to the parent div
                        )}
                      />
                      <div>
                        {getSaveStatusText()}
                        {(isSavePending || isRemovePending) && <LuLoader className="animate-spin size-3 ml-1 inline-block" />} {/* Small loader next to text */}
                      </div>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={() => setShowReportPopup(true)}
                  >
                    <Flag size={18} className="text-neutral-500" />
                    {t("blog.ReportPost")}
                  </div>
                  <div
                    className={cn( // Apply conditional styling to the div for disabling click
                      "flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer",
                      (isFollowPending || isUnfollowPending) ? "pointer-events-none opacity-70" : "" // Disable and dim while pending
                    )}
                    onClick={handleFollowClick}
                  >
                    <UserPlus size={18} className="text-neutral-500" />
                    <div>
                      {getFollowMenuStatusText()}
                      {(isFollowPending || isUnfollowPending) && <LuLoader className="animate-spin size-3 ml-1 inline-block" />} {/* Small loader next to text */}
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                    onClick={handleShareClick}
                  >
                    <Share2 size={18} className="text-neutral-500" />{" "}
                    {t("blog.Share")}
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

export default BlogArticleProfile;
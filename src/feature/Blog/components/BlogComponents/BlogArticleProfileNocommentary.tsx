import { EllipsisVertical } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LuLoader } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
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
} from "../../../Saved/hooks";
import "./Blog.scss";
import { useSendFollowNotification } from "../../../Notifications/hooks/useNotification";
import { useDeleteArticle, useUpdateArticle } from "../../hooks/useArticleHook";
import ConfirmationModal from "../ConfirmationModal";
import PostEditModal from "../PostEditModal";
import { t } from "i18next";
import ReportArticlePopup from "../../../Reports/components/ReportPostPopup";
// import { timeAgo } from "../../../../utils/dateFormater";

// Import only necessary icons for the simplified view
import {
  X,
  Trash2,
  Edit,
  BarChart2,
  Flag,
  Bookmark,
  Share2,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import BlogRepostModal from "../BlogRepostModal";
import { useDeleteRepost, useRemoveSavedRepost, useSaveRepost } from "../../../Repost/hooks/useRepost";
import { cn } from "../../../../utils";

interface BlogProfileProps {
  date: string;
  article_id: string;
  user: User;
  content?: string;
  title?: string;
  isArticle: boolean;
  article: Article;
  isRepostedView?: boolean; // New prop to control the view
}

const BlogArticleProfileNoComment: React.FC<BlogProfileProps> = ({
  user,
  article_id,
  article,
  title,
  content,
  isArticle,
  isRepostedView = true,
}) => {
  const { authUser, isLoggedIn } = useUser();
  const { goToProfile } = useRoute();
  const [showMenu, setShowMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [showRepostDeleteConfirmation, setShowRepostDeleteConfirmation] = useState(false);
  // const location = useLocation(); // Keep commented out as it's not used in simplified view
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
  const { mutate: deleteRepost, isPending: isDeleteRepostPending } =
    useDeleteRepost();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const { mutate: saveRepost, isPending: isSaveRepostPending } = useSaveRepost();
  const { mutate: removeRepost, isPending: isRemoveRepostPending } = useRemoveSavedRepost();

  // const {data} = useGetSavedReposts();

  // Check if current user is the reposted user
  const isCurrentUserReposted = article?.repost?.repost_user?._id === authUser?.id;

  const articleTitle =
    title ||
    (content
      ? content.split(" ").slice(0, 10).join(" ") + "..."
      : "Untitled Post");
  const articleUrl = `${window.location.origin}/posts/${
    isArticle ? "article" : "post"
  }/${isArticle ? "slug/" + article.slug : article_id}`;
  const { mutate } = useUpdateArticle();

  const isCurrentAuthorArticle = user?._id === authUser?.id;

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

  const handleEditRepostCommentary = () => {
    setShowRepostModal(true);
    setShowMenu(false);
  };

  const handleDeleteRepost = () => {
    if (article?._id) {
    
      deleteRepost(article._id, {
        onSuccess: () => {
          toast.success("Repost deleted successfully");
          setShowRepostDeleteConfirmation(false);
          navigate("/feed");
        },
        onError: (error) => {
          toast.error("An error occurred while trying to delete repost");
          console.error("Failed to delete repost:", error.message);
          setShowRepostDeleteConfirmation(false);
        },
      });
    }
  };

  const handleSavedArticle = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    // Prevent multiple rapid clicks while a save/remove operation is ongoing
    if (isSavePending || isRemovePending || isSaveRepostPending || isRemoveRepostPending) return;

    // Check if the article is a repost and use the appropriate hooks
    if (article?.type === 'Repost' && article?.repost?.repost_id) {
        if (saved) {
            removeRepost(article.repost.repost_id, {
                onSuccess: () => {
                    toast.success(t("blog.alerts.articleRemoved"));
                    mutate({
                        articleId: article._id || "",
                        article: {
                            engagement_count: (article.engagement_count || 0) - 1,
                        },
                    });
                },
                onError: () => {
                    toast.error(t("blog.alerts.articleRemoveFailed"));
                },
            });
        } else {
            saveRepost(article.repost.repost_id, {
                onSuccess: () => {
                    toast.success(t("blog.alerts.articleSaved"));
                    mutate({
                        articleId: article._id || "",
                        article: {
                            engagement_count: (article.engagement_count || 0) + 1,
                        },
                    });
                },
                onError: () => {
                    toast.error(t("blog.alerts.articleSaveFailed"));
                },
            });
        }
    } else {
        // Original logic for standard articles
        if (saved) {
            removeSavedArticle(article_id, {
                onSuccess: () => {
                    toast.success(t("blog.alerts.articleRemoved"));
                    mutate({
                        articleId: article._id || "",
                        article: {
                            engagement_count: (article.engagement_count || 0) - 1,
                        },
                    });
                },
                onError: () => {
                    toast.error(t("blog.alerts.articleRemoveFailed"));
                },
            });
        } else {
            saveArticle(article_id, {
                onSuccess: () => {
                    toast.success(t("blog.alerts.articleSaved"));
                    mutate({
                        articleId: article._id || "",
                        article: {
                            engagement_count: (article.engagement_count || 0) + 1,
                        },
                    });
                },
                onError: () => {
                    toast.error(t("blog.alerts.articleSaveFailed"));
                },
            });
        }
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
    check();
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

  function check() {
    // This function remains empty as per your request
  }

  useEffect(() => {
    const isSaved = savedArticles?.articles?.some(
      (item: ArticleDuplicate) => item?.article?._id === article_id
    );
    setSaved(isSaved);
  }, [savedArticles, article_id]);

  const getFollowMenuStatusText = (isMenu = false) => {
    if (!isLoggedIn) return t("follow");
    if (isFollowPending) return `${t("following")}...`;
    if (isUnfollowPending) return `${t("unfollowing")}...`;
    return isFollowing(user?._id || "")
      ? t("following")
      : isMenu
      ? t("blog.Followauthor")
      : t("follow");
  };

  const getSaveStatusText = () => {
    if (!isLoggedIn) return t("blog.AddToSaved");
    if (isSavePending || isSaveRepostPending) return t("blog.saving");
    if (isRemovePending || isRemoveRepostPending) return t("blog.removing");
    return saved ? t("blog.UnsavePost") : t("blog.AddToSaved");
  };

  if (!user) {
    return <LuLoader className="size-4 animate-spin my-auto" />;
  }

  return (
    <div className=" relative flex items-center justify-between">
      {isRepostedView ? (
        <div className="flex w-full justify-between items-center ">
          <div className="flex items-center gap-3">
            <p
              className="font-semibold cursor-pointer text-[14px] text-neutral-50"
              onClick={() => goToProfile(user?.username || "")}
            >
              {user?.name? user?.name: <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />}
            </p>
            <span className="text-neutral-300 text-sm">Reposted</span>
          </div>
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
                  ) : isCurrentUserReposted ? (
                    <>
                      <div
                        className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
                        onClick={handleEditRepostCommentary}
                      >
                        <MessageSquare size={18} className="text-neutral-500" />
                        <div>Add Commentary</div>
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
                        onClick={() => setShowRepostDeleteConfirmation(true)}
                      >
                        <Trash2 size={18} className="text-red-500" />
                        <div>Delete Repost</div>
                      </div>
                    </>
                  ) : (
                    <>
                      {(!isArticle ||
                        (isArticle && article?.type === "Repost")) && (
                        <div
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer",
                            (isSavePending || isRemovePending || isSaveRepostPending || isRemoveRepostPending) ? "pointer-events-none opacity-70" : ""
                          )}
                          onClick={handleSavedArticle}
                        >
                          <Bookmark
                            size={18}
                            className={cn(
                              "text-neutral-500",
                              saved ? "fill-primary-500 text-primary-500" : ""
                            )}
                          />
                          <div>
                            {getSaveStatusText()}
                            {(isSavePending || isRemovePending || isSaveRepostPending || isRemoveRepostPending) && <LuLoader className="animate-spin size-3 ml-1 inline-block" />}
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
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer",
                          (isFollowPending || isUnfollowPending) ? "pointer-events-none opacity-70" : ""
                        )}
                        onClick={handleFollowClick}
                      >
                        <UserPlus size={18} className="text-neutral-500" />
                        <div>
                          {getFollowMenuStatusText(true)}
                          {(isFollowPending || isUnfollowPending) && <LuLoader className="animate-spin size-3 ml-1 inline-block" />}
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
        </div>
      ) : (
        // Original detailed view
        <>
          {user?.profile_picture &&
          user?.profile_picture !== "https://example.com/default-profile.png" &&
          user?.profile_picture !== "" ? (
            <img
              src={user?.profile_picture}
              alt="avatar"
              onClick={() => goToProfile(user?.username || "")}
              className="cursor-pointer size-14 rounded-full object-cover"
              loading="lazy"
            />
          ) : (
            <span
              className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center"
              onClick={() => goToProfile(user?.username || "")}
            >
              {user?.name?.charAt(0).toUpperCase() || "D"}
            </span>
          )}
          <div className="profile-info flex-1">
            <div className="profile-name flex items-center gap-1">
              <p
                className="hover:underline cursor-pointer text-base font-semibold"
                onClick={() => goToProfile(user?.username || "")}
              >
               {user? user?.name: <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />}
              </p>
              {/* Removed LuBadgeCheck and follow button here as per previous instruction to simplify the original view. Re-add if needed */}
            </div>
            {/* Removed bio and timeAgo here as per previous instruction to simplify the original view. Re-add if needed */}
          </div>
        </>
      )}

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
      {showRepostModal && (
        <BlogRepostModal
          isOpen={showRepostModal}
          onClose={() => setShowRepostModal(false)}
          article_id={article_id}
          article={article}
          author_of_post={user}
          isEditMode={true}
          repostId={article?.repost?.repost_id}
          initialComment={article?.repost?.repost_comment}
        />
      )}
      {showRepostDeleteConfirmation && (
        <ConfirmationModal
          title="Delete Repost"
          message="Are you sure you want to delete this repost? This action cannot be undone."
          onConfirm={handleDeleteRepost}
          onCancel={() => setShowRepostDeleteConfirmation(false)}
          confirmText={isDeleteRepostPending ? "Deleting..." : "Delete"}
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default BlogArticleProfileNoComment;
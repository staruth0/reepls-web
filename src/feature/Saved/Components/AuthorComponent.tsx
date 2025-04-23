import React, { useEffect, useState } from 'react';
import { LuBadgeCheck, LuEllipsisVertical } from 'react-icons/lu';
import { UserPlus, EyeOff, Flag, X } from 'lucide-react';
import {  useUnfollowUser } from '../../Follow/hooks';
import { useKnowUserFollowings } from '../../Follow/hooks/useKnowUserFollowings';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetUserByUsername } from '../../Profile/hooks';
import ReportUserPopup from '../../Reports/components/ReportUserPopup';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUser';
import { useSendFollowNotification } from '../../Notifications/hooks/useNotification';

interface AuthorComponentProps {
  username: string;
}

const AuthorComponent: React.FC<AuthorComponentProps> = ({ username }) => {
  const { user } = useGetUserByUsername(username || '');
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showReportPopup, setShowReportPopup] = useState(false);
  const { isFollowing: isUserFollowing } = useKnowUserFollowings();
    const { mutate: followUser, isPending: isFollowPending } = useSendFollowNotification();
  // const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {authUser} = useUser();

  useEffect(() => {
    console.log('userer', user);
  }, [user]);

  const handleFollowClick = () => {
    if (isFollowPending || isUnfollowPending || !user?.id) return;

    if (isUserFollowing(user.id)) {
      unfollowUser(user.id, {
        onSuccess: () => {
          toast.success(t('saved.alerts.unfollowSuccess'));
          setShowMenu(false);
        },
        onError: () => {
          toast.error(t('saved.alerts.unfollowFailed'));
          setShowMenu(false);
        },
      });
    } else {
      followUser({receiver_id:user.id}, {
        onSuccess: () => {
          toast.success(t('saved.alerts.followSuccess'));
          setShowMenu(false);
        },
        onError: () => {
          toast.error(t('saved.alerts.followFailed'));
          setShowMenu(false);
        },
      });
    }
  };

  const handleBlockConfirm = () => {
    if (!user?.id) return;

    console.log(`Blocked ${user.username}`);
    toast.success(`User ${user.username} blocked successfully`);
    setShowBlockConfirm(false);
    setShowMenu(false);
  };

  const handleViewProfile = () => {
    if (!user?.id) return;
    navigate(`/profile/${user.username}`);
    setShowMenu(false);
  };

  const handleReport = () => {
    if (!user?.id) return;
    setShowReportPopup(true);
    setShowMenu(false);
  };

  const getFollowStatusText = () => {
    if (!user?.id) return 'Follow';

    if (isFollowPending) return t('following');
    if (isUnfollowPending) return t('unfollowing');

    return isUserFollowing(user.id) ? t('following') : t('follow');
  };

  return (
    <div className="flex items-center gap-2 w-full min-w-[350px] relative">
      <div className="flex-shrink-0">
        {user?.profile_picture && user?.profile_picture !== 'https://example.com/default-profile.png' && user?.profile_picture !== '' ? (
          <img
            src={user?.profile_picture}
            alt="avatar"
            className="cursor-pointer w-10 h-10 rounded-full object-cover"
            onClick={handleViewProfile}
          />
        ) : (
          <span
            className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-10 h-10 text-center"
            onClick={handleViewProfile}
          >
            {user?.username?.charAt(0).toUpperCase() || 'D'}
          </span>
        )}
      </div>
      <div className="text-neutral-50 w-full flex items-center justify-between">
        <div>
          <div className="text-[16px] flex items-center font-semibold">
            <span className="hover:underline hover:cursor-pointer" onClick={handleViewProfile}>
              {user?.username}
            </span>
            <span>
              {user?.is_verified_writer && <LuBadgeCheck className="size-4 text-primary-400" />}
            </span>
          </div>
          <div className="text-[13px] line-clamp-1">{user?.bio}</div>
        </div>

        {showMenu ? (
          <X className="size-4 cursor-pointer" onClick={() => setShowMenu(false)} />
        ) : (
          <LuEllipsisVertical className="size-4 cursor-pointer" onClick={() => setShowMenu(true)} />
        )}
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-0 z-40"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 top-10 bg-neutral-800 shadow-md rounded-md p-2 w-52 text-neutral-50 z-50">
        { user?._id === authUser?.id ? '':   <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleFollowClick}
            >
              <UserPlus size={18} className="text-neutral-500" />
              <div className="text-neutral-50">{getFollowStatusText()}</div>
            </div>}
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={() => setShowBlockConfirm(true)}
            >
              <EyeOff size={18} className="text-neutral-500" />
              <div>{t("saved.authorActions.block")}</div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleViewProfile}
            >
              <UserPlus size={18} className="text-neutral-500" />
              <div>{t("saved.authorActions.viewProfile")}</div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 cursor-pointer"
              onClick={handleReport}
            >
              <Flag size={18} className="text-neutral-500" />
              <div>{t("saved.authorActions.reportUser")}</div>
            </div>
          </div>
        </>
      )}

      {/* Block Confirmation Popup */}
      {showBlockConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-[99999]"
            onClick={() => setShowBlockConfirm(false)}
          ></div>
          <div className="fixed w-[80%] sm:w-[60%] md:w-[50%] lg:w-[30%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md p-6 z-[99999] text-neutral-50">
            <h3 className="text-lg font-semibold mb-4">{t("saved.authorActions.comfirmBlock")}</h3>
            <p className="mb-6">{t("saved.authorActions.comfirmMessage", { username })}</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-neutral-600 rounded-md hover:bg-neutral-700"
                onClick={() => setShowBlockConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleBlockConfirm}
              >
                {t("saved.authorActions.block")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Report User Popup */}
      {showReportPopup && (
        <ReportUserPopup
          username={user?.username || ''}
          userId={user?.id || ''}
          onClose={() => setShowReportPopup(false)}
        />
      )}
    </div>
  );
};

export default AuthorComponent;
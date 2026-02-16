import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import { useFCM } from '../../hooks/useFCM';
import { LuBell, LuX } from 'react-icons/lu';

const NotificationPermissionPopup: React.FC = () => {
  const { isLoggedIn } = useUser();
  const { isSubscribed, subscribeToFCM, isLoading } = useFCM();
  const [showPopup, setShowPopup] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const STORAGE_KEY = 'notificationPermissionPopupDismissed';

  useEffect(() => {
    // Check if user is logged in and notifications are not enabled
    if (!isLoggedIn) {
      setShowPopup(false);
      return;
    }

    // Check if popup was previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === 'true') {
      setIsDismissed(true);
      setShowPopup(false);
      return;
    }

    // Check notification permission status
    if ('Notification' in window) {
      const permission = Notification.permission;
      
      // Don't show popup if permission is denied (user explicitly denied)
      if (permission === 'denied') {
        setShowPopup(false);
        return;
      }
      
      // Show popup if:
      // 1. Permission is default (not asked yet)
      // 2. User is not subscribed to FCM
      // 3. Popup hasn't been dismissed
      if (permission === 'default' && !isSubscribed && !isDismissed) {
        // Small delay to ensure user sees the app first
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setShowPopup(false);
      }
    }
  }, [isLoggedIn, isSubscribed, isDismissed]);

  const handleEnable = async () => {
    const success = await subscribeToFCM();
    if (success) {
      setShowPopup(false);
      // Don't mark as dismissed if user enabled - they might want to see it again if they disable
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleClose = () => {
    handleDismiss();
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 relative border border-neutral-700">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100 transition-colors"
          aria-label="Close"
        >
          <LuX size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-400/20 flex items-center justify-center">
            <LuBell className="text-primary-400" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-neutral-100 mb-2">
            Enable Notifications
          </h3>
          <p className="text-neutral-300 text-sm leading-relaxed">
            Stay updated with the latest content, reactions, comments, and more. 
            We'll send you push notifications when something important happens.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-100 font-medium transition-colors"
            disabled={isLoading}
          >
            Not Now
          </button>
          <button
            onClick={handleEnable}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary-400 hover:bg-primary-500 text-neutral-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionPopup;


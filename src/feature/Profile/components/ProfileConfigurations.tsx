import React, { useContext, useEffect, useState } from "react";
import ConfigurationWrapper from "./ConfigurationWrapper";
import { useTranslation } from "react-i18next";
import useTheme from "../../../hooks/useTheme";
import { VoiceLanguageContext } from "../../../context/VoiceLanguageContext/VoiceLanguageContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../hooks/useUser";
import { apiClient } from "../../../services/apiClient";
import { toast } from "react-toastify";
import { useFetchVapidPublicKey } from "../../../feature/Notifications/hooks/useNotification";

// Type for subscription data
interface SubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
}

// Type for PushSubscription JSON result
interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

const ProfileConfigurations: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVideoAutoPlay, setIsVideoAutoPlay] = useState<boolean>(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState<boolean>(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const [voiceLanguages, setVoiceLanguages] = useState<SpeechSynthesisVoice[]>([]);
  const { setVoiceLanguage } = useContext(VoiceLanguageContext);
  const navigate = useNavigate();
  const { authUser, logout: manualLogout } = useUser();
  const { data: vapidData, isLoading: vapidLoading, error: vapidError } = useFetchVapidPublicKey();
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const languages = [
    { code: "en", label: t("English") },
    { code: "fr", label: t("French") },
  ];

  // Convert base64 VAPID key to Uint8Array
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    if (!base64String) {
      console.error('Invalid base64 string provided');
      return new Uint8Array();
    }
    try {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    } catch (error) {
      console.error('Error converting base64 to Uint8Array:', error);
      return new Uint8Array();
    }
  };

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker Registered:', registration);
          setSwRegistration(registration);
        })
        .catch((error) => {
          console.error('Service Worker Registration Failed:', error);
          toast.error(t('Failed to enable notifications. Please try again later.'));
        });
    } else {
      console.warn('Push notifications not supported in this browser');
    }
  }, [t]);

  // Check notification permission
  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        setIsNotificationsEnabled(permission === 'granted');
        if (permission === 'denied') {
          console.warn('Notification permission was denied');
          toast.warn(t('Notifications are blocked. Please enable them in your browser settings.'));
        }
      }
    };
    checkPermission();
  }, [t]);

  // Handle notification toggle
  const handleToggleNotifications = async () => {
    if (!swRegistration || !vapidData?.publicVapid || !authUser?.id) {
      toast.error(t('Cannot toggle notifications: Missing required data.'));
      return;
    }

    if (isNotificationsEnabled) {
      // Unsubscribe from notifications
      try {
        const subscription = await swRegistration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await apiClient.post('/push-notification/unsubscribe', { endpoint: subscription.endpoint });
          setIsNotificationsEnabled(false);
          toast.success(t('Notifications disabled successfully!'));
        }
      } catch (error: any) {
        console.error('Error unsubscribing from notifications:', error);
        toast.error(t('Failed to disable notifications: ') );
      }
    } else {
      // Subscribe to notifications
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission denied');
          toast.warn(t('Notification permission denied.'));
          return;
        }

        setIsNotificationsEnabled(true);
        const applicationServerKey = urlBase64ToUint8Array(vapidData.publicVapid);
        const subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });

        const subscriptionJSON = subscription.toJSON() as PushSubscriptionJSON;
        const subscriptionData: SubscriptionData = {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime || null,
          keys: {
            p256dh: subscriptionJSON.keys?.p256dh || '',
            auth: subscriptionJSON.keys?.auth || '',
          },
          userId: `${authUser.id}`,
        };

        await apiClient.post('/push-notification/subscribe', subscriptionData);
        console.log('Successfully subscribed to push notifications');
        toast.success(t('Notifications enabled successfully!'));
      } catch (error: any) {
        console.error('Push subscription failed:', error);
        toast.error(t('Failed to enable notifications: ') );
      }
    }
  };

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleAutoPlay = () => {
    setIsVideoAutoPlay(!isVideoAutoPlay);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setShowLanguageMenu(false);
  };

  const handleLanguageChangeVoice = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedVoice = voiceLanguages.find(
      (voice) => voice.name === event.target.value
    );
    if (selectedVoice) {
      console.log(selectedVoice);
      setVoiceLanguage(selectedVoice);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const handleConfirmLogout = () => {
    manualLogout();
    setShowLogoutPopup(false);
    navigate('/auth');
  };

  const handleCancelLogout = () => {
    console.log("Cancelled logout.");
    setShowLogoutPopup(false);
  };

  // Navigation handlers
  const handleProfileSettingsClick = () => {
    if (authUser?.id) {
      navigate(`/profile/settings/${authUser.username}`);
    } else {
      console.log("User ID not found, cannot navigate.");
    }
  };

  const handleViewAnalyticsClick = () => {
    if (authUser?.id) {
      navigate(`/profile/analytics/${authUser.id}`);
    } else {
      console.log("User ID not found, cannot navigate.");
    }
  };

  // const handleDraftsClick = () => {
  //   if (authUser?.id) {
  //     navigate(`/drafts/${authUser.id}`);
  //   } else {
  //     console.log("User ID not found, cannot navigate.");
  //   }
  // };

  const handleTermsClick = () => {
    navigate(`/Terms&Policies`);
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoiceLanguages(voices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Handle VAPID key loading and errors
  useEffect(() => {
    if (vapidLoading) {
      console.log('Loading VAPID key...');
    }
    if (vapidError) {
      console.error('Error fetching VAPID key:', vapidError);
      toast.error(t('Failed to load notification settings.'));
    }
  }, [vapidLoading, vapidError, t]);

  return (
    <div className="profile__configurations px-6 py-2 sticky top-0">
      <div className="text-[16px] text-neutral-50">{t(`Settings`)}</div>
      <div className="actual__settings mt-8 flex flex-col gap-5">
        <ConfigurationWrapper>
          <div
            className="cursor-pointer w-full"
            onClick={handleProfileSettingsClick}
          >
            {t(`profile.profileSettings`)}
          </div>
        </ConfigurationWrapper>
        <ConfigurationWrapper>
          <div
            className="cursor-pointer w-full"
            onClick={handleViewAnalyticsClick}
          >
            {t(`View Analytics`)}
          </div>
        </ConfigurationWrapper>
        {/* <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleDraftsClick}>
            {t(`Drafts`)}
          </div>
        </ConfigurationWrapper> */}

        <ConfigurationWrapper>
          <div>{t(`Default Language`)}</div>
          <div className="relative">
            <div
              className="flex gap-2 items-center cursor-pointer text-neutral-50"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {languages.find((lang) => lang.code === i18n.language)?.label ||
                t("English")}
              <svg
                className={`w-4 h-4 transition-transform ${
                  showLanguageMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-neutral-700 ${
                        i18n.language === language.code
                          ? "text-primary-400"
                          : "text-neutral-50"
                      }`}
                      onClick={() => handleLanguageChange(language.code)}
                      role="menuitem"
                    >
                      {language.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`profile.voiceLanguage`)}</div>
          <div className="relative">
            <select
              className="bg-neutral-800 text-neutral-50 p-2 rounded-md outline-none"
              onChange={handleLanguageChangeVoice}
            >
              {voiceLanguages.length === 0 ? (
                <option disabled>Loading voices...</option>
              ) : (
                voiceLanguages.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`profile.notifications`)}</div>
          <div className="flex gap-2 items-center">
            {t(isNotificationsEnabled ? "On" : "Off")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                isNotificationsEnabled ? "bg-primary-400" : "bg-gray-400"
              }`}
              onClick={handleToggleNotifications}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isNotificationsEnabled ? "translate-x-[20px]" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`profile.videoAutoPlay`)}</div>
          <div className="flex gap-2 items-center">
            {t(isVideoAutoPlay ? "On" : "Off")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                isVideoAutoPlay ? "bg-primary-400" : "bg-gray-400"
              }`}
              onClick={handleToggleAutoPlay}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isVideoAutoPlay ? "translate-x-[20px]" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div>{t(`Theme`)}</div>
          <div className="flex gap-2 items-center">
            {t(theme === "light" ? "Light" : "Dark")}
            <div
              className={`w-[40px] h-[20px] rounded-[2rem] flex items-center px-[2px] cursor-pointer transition-colors duration-300 ${
                theme === "light" ? "bg-gray-400" : "bg-primary-400"
              }`}
              onClick={handleToggleTheme}
            >
              <div
                className={`w-[18px] h-[18px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  theme === "light" ? "translate-x-0" : "translate-x-[20px]"
                }`}
              ></div>
            </div>
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleTermsClick}>
            {t(`profile.TermsandPolicies`)}
          </div>
        </ConfigurationWrapper>

        <ConfigurationWrapper>
          <div className="cursor-pointer w-full" onClick={handleLogoutClick}>
            {t(`profile.logout`)}
          </div>
        </ConfigurationWrapper>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-5 z-[9999]"
            onClick={handleCancelLogout}
          ></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md shadow-lg p-4 sm:p-6 z-[9999] w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] flex flex-col items-center">
  <h2 className="text-neutral-50 text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">
    {t("Are you sure you want to log out?")}
  </h2>
  <div className="flex justify-end gap-3 sm:gap-4 w-full">
    <button
      className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 bg-neutral-700 text-neutral-50 rounded-md hover:bg-neutral-600 text-sm sm:text-base"
      onClick={handleCancelLogout}
    >
      {t("No")}
    </button>
    <button
      className="px-4 sm:px-6 md:px-8 py-1 sm:py-2 bg-red-500 text-neutral-50 rounded-md hover:bg-red-600 text-sm sm:text-base"
      onClick={handleConfirmLogout}
    >
      {t("Yes")}
    </button>
  </div>
</div>
        </>
      )}
    </div>
  );
};

export default ProfileConfigurations;
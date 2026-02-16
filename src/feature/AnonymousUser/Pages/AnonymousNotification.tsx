import React from "react";
import { useUser } from "../../../hooks/useUser";
import Topbar from "../../../components/atoms/Topbar/Topbar"; 

import { useTranslation } from "react-i18next";
import AuthPromptPopup from "../components/AuthPromtPopup";

const AnonymousNotification: React.FC = () => {
  const { isLoggedIn } = useUser();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <div className="text-neutral-50 text-lg font-semibold w-full">
          {t("Notifications")}
        </div>
      </Topbar>
      <div className="mt-10">
        {isLoggedIn ? (
          <div>Anonymous Notification</div>
        ) : (
          <AuthPromptPopup text={t("view notifications")} />
        )}
      </div>
    </div>
  );
};

export default AnonymousNotification;
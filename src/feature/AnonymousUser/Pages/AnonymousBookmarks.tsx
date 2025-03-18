import React from "react";
import { useUser } from "../../../hooks/useUser"; 
import Topbar from "../../../components/atoms/Topbar/Topbar"; 
import { useTranslation } from "react-i18next";
import AuthPromptPopup from "../components/AuthPromtPopup";

const AnonymousBookmarks: React.FC = () => {
  const { isLoggedIn } = useUser();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <div className="text-neutral-50 text-lg font-semibold w-full">
          {t("Bookmarks")}
        </div>
      </Topbar>
      <div className="mt-10">
        {isLoggedIn ? (
          <div>AnonymousBookmarks</div>
        ) : (
          <AuthPromptPopup text={t("view bookmarks")} />
        )}
      </div>
    </div>
  );
};

export default AnonymousBookmarks;
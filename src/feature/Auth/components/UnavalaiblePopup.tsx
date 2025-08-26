import {  useState } from "react";
import { useTranslation } from "react-i18next";

function PhoneLoginDisabledModal() {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-2">{t("Notice")}</h2>
        <p className="mb-4">
          {t("Phone login is currently unavailable. Please use email to sign in.")}
        </p>
        <button
          onClick={() => setShow(false)}
          className="px-10 py-2 rounded-xl bg-primary-400 text-white"
        >
          {t("Ok")}
        </button>
      </div>
    </div>
  );
}

export default PhoneLoginDisabledModal;

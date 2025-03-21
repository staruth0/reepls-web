import React from "react";
import { useTranslation } from "react-i18next";
import Topbar from "../atoms/Topbar/Topbar";

const TermsPolicies: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen  flex flex-col">
      {/* Topbar */}
      <Topbar>
        <p className="text-neutral-50">{t("Terms and Policies")}</p>
      </Topbar>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="text-neutral-50 max-w-3xl text-left">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            {t("Terms and Policies")}
          </h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("1. Acceptance of Terms")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "By accessing or using our writing platform, you agree to be bound by these Terms and Policies. If you do not agree, please do not use the platform."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("2. User Accounts")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "You must create an account to publish content. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("3. Content Ownership and Rights")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "You retain ownership of the content you create and publish on the platform. By posting, you grant us a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content on the platform."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("4. Acceptable Use")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "You may not post content that is illegal, offensive, or violates the rights of others. This includes plagiarism, hate speech, or explicit material without proper labeling."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("5. Intellectual Property")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "The platform’s design, code, and branding are our intellectual property. You may not copy or reproduce them without permission."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("6. Termination")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("7. Limitation of Liability")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "We are not liable for any damages arising from your use of the platform, including loss of data or content."
              )}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {t("8. Changes to Terms")}
            </h2>
            <p className="text-sm leading-relaxed">
              {t(
                "We may update these Terms and Policies at any time. Continued use of the platform after changes constitutes acceptance of the new terms."
              )}
            </p>
          </section>

          <p className="text-sm text-center mt-8">
            {t("Last updated: March 12, 2025")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPolicies;

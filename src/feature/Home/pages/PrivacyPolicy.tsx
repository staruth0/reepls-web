import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-neutral-50 flex flex-col">
      <Header />
      {/* Spacer so fixed header does not overlap content */}
      <div className="h-14 md:h-16 shrink-0" aria-hidden />

      <div className="flex-1 max-w-4xl mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 lg:py-16">
        <header className="mb-10">
          <p className="text-sm text-neutral-400 mb-2">Last updated: February 2026</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Reepls Privacy Policy</h1>
          <p className="text-neutral-100 text-base md:text-lg leading-relaxed">
            This Privacy Policy explains how Reepls (&quot;Reepls&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects,
            uses, shares, and protects your information when you use our web app, Android app, and related
            services (collectively, the &quot;Service&quot;). Reepls is a social platform that helps African
            thought leaders, storytellers, and communities share and amplify their voices.
          </p>
        </header>

        {/* Table of Contents */}
        <nav
          aria-label="Privacy policy table of contents"
          className="mb-10 border border-neutral-700 rounded-lg p-5 bg-neutral-900/40"
        >
          <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-neutral-100">
            <li>
              <a href="#introduction" className="hover:text-primary-400">
                Introduction &amp; Scope
              </a>
            </li>
            <li>
              <a href="#data-we-collect" className="hover:text-primary-400">
                Information We Collect
              </a>
            </li>
            <li>
              <a href="#how-we-use-data" className="hover:text-primary-400">
                How We Use Your Information
              </a>
            </li>
            <li>
              <a href="#legal-basis" className="hover:text-primary-400">
                Legal Bases for Processing
              </a>
            </li>
            <li>
              <a href="#cookies-and-tracking" className="hover:text-primary-400">
                Cookies, Analytics &amp; Tracking
              </a>
            </li>
            <li>
              <a href="#data-sharing" className="hover:text-primary-400">
                How We Share Information
              </a>
            </li>
            <li>
              <a href="#international-transfers" className="hover:text-primary-400">
                International Data Transfers
              </a>
            </li>
            <li>
              <a href="#data-retention" className="hover:text-primary-400">
                Data Retention
              </a>
            </li>
            <li>
              <a href="#child-safety" className="hover:text-primary-400">
                Children, Teens &amp; Child Safety
              </a>
            </li>
            <li>
              <a href="#your-rights" className="hover:text-primary-400">
                Your Rights &amp; Controls
              </a>
            </li>
            <li>
              <a href="#security" className="hover:text-primary-400">
                Security
              </a>
            </li>
            <li>
              <a href="#account-deletion" className="hover:text-primary-400">
                Account Deletion &amp; Data Requests
              </a>
            </li>
            <li>
              <a href="#third-parties" className="hover:text-primary-400">
                Third-Party Services (including Firebase)
              </a>
            </li>
            <li>
              <a href="#changes" className="hover:text-primary-400">
                Changes to This Policy
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary-400">
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        <main className="space-y-10 text-sm md:text-base leading-relaxed text-neutral-100">
          <section id="introduction">
            <h2 className="text-2xl font-semibold mb-3">1. Introduction &amp; Scope</h2>
            <p className="mb-3">
              This Privacy Policy applies when you access or use Reepls through our website, progressive
              web app, Android app available on Google Play, or any other interface that links to this
              policy. By using Reepls, you agree that we may process your information as described here.
            </p>
            <p>
              If you do not agree with this Privacy Policy, please do not use Reepls. For questions or
              concerns, you can always reach us at{" "}
              <a
                href="mailto:reepls.project@gmail.com"
                className="text-primary-400 hover:text-primary-300"
              >
                reepls.project@gmail.com
              </a>
              .
            </p>
          </section>

          <section id="data-we-collect">
            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
            <p className="mb-3">
              We collect different types of information to operate the Reepls platform, provide core
              social features, and keep the community safe. The specific data we process depends on how
              you use Reepls.
            </p>

            <h3 className="text-xl font-semibold mb-2">2.1 Account &amp; Profile Information</h3>
            <p className="mb-2">
              When you register or update your profile, we may collect and store:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Name</li>
              <li>Username / handle</li>
              <li>Email address</li>
              <li>Phone number (for phone-based registration and verification)</li>
              <li>Password (stored securely on our backend; we do not store plain-text passwords)</li>
              <li>Profile picture and banner image</li>
              <li>Bio, &quot;about&quot; information, title, address/town, and interests</li>
              <li>Your role on the platform (for example, reader, writer, or admin)</li>
              <li>Verification and status flags (for example, email/phone verified, verified writer)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.2 Content You Create</h3>
            <p className="mb-2">
              As a social platform, we process the content you choose to create, upload, or interact with,
              including:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Posts, articles, communiqués, and other written content</li>
              <li>Images and videos attached to posts or your profile</li>
              <li>Podcasts and audio content, including metadata such as duration, file size, and format</li>
              <li>Streams and other media you publish or participate in</li>
              <li>Reposts, saved content, and bookmarks</li>
              <li>Comments, reactions, and reports you submit</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.3 Usage, Analytics &amp; Interaction Data</h3>
            <p className="mb-2">
              To help you and other users discover relevant content and to improve Reepls, we may collect:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Which posts, articles, podcasts, streams, and profiles you view or interact with</li>
              <li>
                Engagement metrics, such as views, likes/reactions, comments, shares, saves, and profile
                views
              </li>
              <li>Categories and interests inferred from your interaction history</li>
              <li>
                Subscription and follower information, such as which publications or creators you follow
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.4 Device, Log &amp; Technical Data</h3>
            <p className="mb-2">
              When you use Reepls, we may automatically collect certain technical data, including:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Device information (such as device type, operating system, and browser type)</li>
              <li>IP address and approximate location derived from your IP (where permitted by law)</li>
              <li>
                Log information (such as access times, pages viewed, and features used within the app)
              </li>
              <li>
                Information from cookies or similar technologies used to remember your preferences and
                provide a smoother experience
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.5 Notifications &amp; Firebase Cloud Messaging (FCM)</h3>
            <p className="mb-2">
              If you enable push notifications, we use Firebase Cloud Messaging (FCM) to deliver alerts
              about new followers, comments, reactions, publications, and other activity related to your
              content. For this, we may collect and process:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>A device-specific push notification token linked to your Reepls account</li>
              <li>Your notification preferences (for example, whether you are subscribed to push alerts)</li>
            </ul>
            <p>
              You can enable or disable notifications at any time within your profile or device settings.
            </p>
          </section>

          <section id="how-we-use-data">
            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>To create and manage your account and profile</li>
              <li>To authenticate you and secure your access to the Service</li>
              <li>To allow you to publish, share, and manage posts, articles, media, podcasts, and streams</li>
              <li>To show you relevant content, recommendations, and suggestions</li>
              <li>To power social features like following, subscriptions, comments, reactions, and notifications</li>
              <li>To provide analytics to you (for example, profile and post analytics) and to improve Reepls</li>
              <li>To communicate with you about your account, security, changes to our terms, and support requests</li>
              <li>To detect, investigate, and prevent abuse, spam, fraud, or violations of our Terms</li>
              <li>To comply with legal obligations and requests from authorities where required</li>
            </ul>
          </section>

          <section id="legal-basis">
            <h2 className="text-2xl font-semibold mb-3">4. Legal Bases for Processing</h2>
            <p className="mb-3">
              Where applicable data protection laws require it (for example, in the EU/EEA, UK, and similar
              jurisdictions), we process your personal data only when we have a valid legal basis, such as:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>
                <span className="font-semibold">Contract:</span> To provide the Service you have requested,
                including creating an account and enabling core features.
              </li>
              <li>
                <span className="font-semibold">Legitimate interests:</span> To operate, protect, and improve
                Reepls in a way that is balanced against your rights and expectations (for example, to secure
                the Service, fight spam, and understand how features are used).
              </li>
              <li>
                <span className="font-semibold">Consent:</span> For certain activities such as sending push
                notifications or using optional cookies/analytics, we rely on your consent, which you can
                withdraw at any time.
              </li>
              <li>
                <span className="font-semibold">Legal obligations:</span> To comply with applicable laws,
                including child safety and reporting obligations.
              </li>
            </ul>
          </section>

          <section id="cookies-and-tracking">
            <h2 className="text-2xl font-semibold mb-3">5. Cookies, Analytics &amp; Tracking</h2>
            <p className="mb-3">
              We may use cookies and similar technologies on the web to keep you logged in, remember your
              preferences, and measure how the Service is used. These technologies may collect device and
              usage information as described above.
            </p>
            <p>
              Some analytics and performance tools may be provided by third parties. Where required by law,
              we will request your consent before setting non-essential cookies or similar tracking
              technologies.
            </p>
          </section>

          <section id="data-sharing">
            <h2 className="text-2xl font-semibold mb-3">6. How We Share Information</h2>
            <p className="mb-3">
              We do not sell your personal data. We may share your information in the following limited
              situations:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>
                <span className="font-semibold">With other users:</span> Content you publish on Reepls (for
                example, your profile, posts, articles, podcasts, and streams) is visible according to your
                settings and the design of the platform.
              </li>
              <li>
                <span className="font-semibold">With service providers:</span> We may share information with
                trusted vendors who help us operate Reepls, such as cloud hosting providers, content delivery
                networks, analytics providers, and messaging providers like Firebase.
              </li>
              <li>
                <span className="font-semibold">For legal and safety reasons:</span> We may disclose
                information if we reasonably believe it is necessary to comply with a law, regulation,
                legal process, or governmental request; to protect the safety, rights, or property of users,
                the public, or Reepls; or to enforce our Terms.
              </li>
              <li>
                <span className="font-semibold">Business transfers:</span> If we are involved in a merger,
                acquisition, restructuring, or sale of assets, your information may be transferred as part of
                that transaction, subject to this Privacy Policy or an equivalent policy.
              </li>
            </ul>
          </section>

          <section id="international-transfers">
            <h2 className="text-2xl font-semibold mb-3">7. International Data Transfers</h2>
            <p>
              Reepls is focused on Africa but may use service providers and infrastructure located in other
              countries. As a result, your information may be processed in countries that may have different
              data protection laws than your home country. Where required, we take appropriate safeguards to
              protect your personal data in accordance with applicable laws.
            </p>
          </section>

          <section id="data-retention">
            <h2 className="text-2xl font-semibold mb-3">8. Data Retention</h2>
            <p className="mb-3">
              We keep your personal data for as long as it is reasonably necessary to provide the Service,
              comply with our legal obligations, resolve disputes, and enforce our agreements. In general:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Account information is retained while your account is active.</li>
              <li>
                Content you publish may remain available on Reepls unless you delete it or your account, or
                unless we remove it for policy violations or safety reasons.
              </li>
              <li>
                Push notification tokens and related data are retained while you are subscribed, and may be
                deleted or deactivated when you unsubscribe or uninstall the app.
              </li>
              <li>
                We may retain certain logs and records for a longer period where required by law or for
                legitimate security, fraud prevention, and safety purposes.
              </li>
            </ul>
          </section>

          <section id="child-safety">
            <h2 className="text-2xl font-semibold mb-3">9. Children, Teens &amp; Child Safety</h2>
            <p className="mb-3">
              Reepls is not directed to children under the minimum age required to use social media services
              in their country (for example, 13 years old in many jurisdictions). We do not knowingly allow
              children under this age to create accounts. If we learn that a child has created an account in
              violation of our requirements, we will take steps to close the account and delete or
              anonymize personal data where appropriate.
            </p>
            <p className="mb-3">
              We have a zero-tolerance policy for child sexual abuse and exploitation, including child
              sexual abuse material (CSAM). We use a combination of automated tools, user reports, and human
              review to detect and respond to such content. When we discover or receive a credible report of
              CSAM, we remove the content, take enforcement action on the account, and may report the matter
              to relevant authorities as required by law.
            </p>
            <p>
              For more detailed information on our child safety approach, please review our{" "}
              <Link to="/child-safety-standards" className="text-primary-400 hover:text-primary-300">
                Child Safety Standards
              </Link>
              .
            </p>
          </section>

          <section id="your-rights">
            <h2 className="text-2xl font-semibold mb-3">10. Your Rights &amp; Controls</h2>
            <p className="mb-3">
              Depending on your location and applicable law, you may have certain rights regarding your
              personal data. These may include:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>The right to access the personal data we hold about you</li>
              <li>The right to correct or update inaccurate or incomplete information</li>
              <li>
                The right to delete or request deletion of your personal data (subject to legal and safety
                obligations)
              </li>
              <li>The right to object to or restrict certain types of processing</li>
              <li>
                The right to withdraw consent where processing is based on your consent (for example, push
                notifications)
              </li>
              <li>The right to receive a copy of your data in a portable format (where applicable)</li>
            </ul>
            <p>
              You can exercise many of these rights directly in the app by updating your profile, changing
              your settings, or disabling notifications. You may also contact us using the details in the{" "}
              <a href="#contact" className="text-primary-400 hover:text-primary-300">
                Contact Us
              </a>{" "}
              section.
            </p>
          </section>

          <section id="security">
            <h2 className="text-2xl font-semibold mb-3">11. Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect your information, including
              encryption in transit, access controls, and other safeguards appropriate to the nature of the
              data. However, no online service is completely secure, and we cannot guarantee absolute
              security. You are responsible for keeping your login credentials safe and notifying us if you
              suspect unauthorized access to your account.
            </p>
          </section>

          <section id="account-deletion">
            <h2 className="text-2xl font-semibold mb-3">12. Account Deletion &amp; Data Requests</h2>
            <p className="mb-3">
              You may request that we delete your Reepls account and associated personal data, subject to
              certain limitations (for example, where we are required to retain data for legal, safety, or
              anti-abuse reasons).
            </p>
            <p>
              To request account deletion or access to your data, please use any in-app account management
              tools available to you or contact us at{" "}
              <a
                href="mailto:reepls.project@gmail.com"
                className="text-primary-400 hover:text-primary-300"
              >
                reepls.project@gmail.com
              </a>
              . We may need to verify your identity before fulfilling your request.
            </p>
          </section>

          <section id="third-parties">
            <h2 className="text-2xl font-semibold mb-3">
              13. Third-Party Services (including Firebase)
            </h2>
            <p className="mb-3">
              Reepls uses certain third-party services to deliver the app and its features. These may
              include:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Cloud hosting and storage providers for storing media and operational data</li>
              <li>
                Firebase Cloud Messaging (FCM) to deliver push notifications to your device when you opt in
              </li>
              <li>
                Analytics and performance tools to help us understand how the app is used and improve
                stability
              </li>
            </ul>
            <p>
              These providers process data on our behalf and are bound by contractual and legal obligations
              to protect your information and use it only for the purposes we specify.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold mb-3">14. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, the
              Service, or applicable laws. When we make material changes, we will notify you by updating the
              &quot;Last updated&quot; date at the top of this page and, where appropriate, by providing
              additional notice in the app or by email. Your continued use of Reepls after any changes means
              you accept the updated policy.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-3">15. Contact Us</h2>
            <p className="mb-2">
              If you have any questions, concerns, or requests about this Privacy Policy or how Reepls
              handles your data, you can contact us at:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:reepls.project@gmail.com"
                  className="text-primary-400 hover:text-primary-300"
                >
                  reepls.project@gmail.com
                </a>
              </li>
            </ul>
          </section>
        </main>
      </div>

      <LandingPageFooter />
    </div>
  );
};

export default PrivacyPolicy;


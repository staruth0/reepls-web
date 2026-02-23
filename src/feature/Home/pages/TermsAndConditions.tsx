import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-neutral-50 flex flex-col">
      <Header />
      {/* Spacer so fixed header does not overlap content */}
      <div className="h-14 md:h-16 shrink-0" aria-hidden />

      <div className="flex-1 max-w-4xl mx-auto px-5 md:px-8 lg:px-10 py-10 md:py-14 lg:py-16">
        <header className="mb-10">
          <p className="text-sm text-neutral-400 mb-2">Last updated: February 2026</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Reepls Terms &amp; Conditions</h1>
          <p className="text-neutral-100 text-base md:text-lg leading-relaxed">
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of Reepls
            (&quot;Reepls&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), including our web app,
            Android app available on Google Play, and any related services (collectively, the
            &quot;Service&quot;). By creating an account or using Reepls, you agree to be bound by these
            Terms.
          </p>
        </header>

        {/* Table of Contents */}
        <nav
          aria-label="Terms and conditions table of contents"
          className="mb-10 border border-neutral-700 rounded-lg p-5 bg-neutral-900/40"
        >
          <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-neutral-100">
            <li>
              <a href="#acceptance" className="hover:text-primary-400">
                Acceptance of Terms
              </a>
            </li>
            <li>
              <a href="#eligibility" className="hover:text-primary-400">
                Eligibility &amp; Use of the Service
              </a>
            </li>
            <li>
              <a href="#account-registration" className="hover:text-primary-400">
                Account Registration &amp; Security
              </a>
            </li>
            <li>
              <a href="#user-content" className="hover:text-primary-400">
                Your Content &amp; Rights You Grant
              </a>
            </li>
            <li>
              <a href="#acceptable-use" className="hover:text-primary-400">
                Acceptable Use &amp; Community Standards
              </a>
            </li>
            <li>
              <a href="#child-safety-terms" className="hover:text-primary-400">
                Child Safety &amp; Prohibited Content
              </a>
            </li>
            <li>
              <a href="#intellectual-property" className="hover:text-primary-400">
                Intellectual Property
              </a>
            </li>
            <li>
              <a href="#notifications" className="hover:text-primary-400">
                Notifications &amp; Communications
              </a>
            </li>
            <li>
              <a href="#suspension-termination" className="hover:text-primary-400">
                Suspension &amp; Termination
              </a>
            </li>
            <li>
              <a href="#disclaimers" className="hover:text-primary-400">
                Disclaimers
              </a>
            </li>
            <li>
              <a href="#limitation-liability" className="hover:text-primary-400">
                Limitation of Liability
              </a>
            </li>
            <li>
              <a href="#indemnity" className="hover:text-primary-400">
                Indemnity
              </a>
            </li>
            <li>
              <a href="#governing-law" className="hover:text-primary-400">
                Governing Law &amp; Dispute Resolution
              </a>
            </li>
            <li>
              <a href="#app-store-terms" className="hover:text-primary-400">
                App Store Terms (Google Play)
              </a>
            </li>
            <li>
              <a href="#changes-terms" className="hover:text-primary-400">
                Changes to These Terms
              </a>
            </li>
            <li>
              <a href="#contact-terms" className="hover:text-primary-400">
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        <main className="space-y-10 text-sm md:text-base leading-relaxed text-neutral-100">
          <section id="acceptance">
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="mb-3">
              By accessing or using Reepls, you agree to these Terms, our{" "}
              <Link to="/privacy-policy" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </Link>
              , and any additional policies or guidelines we may publish within the Service. If you do not
              agree, you may not use Reepls.
            </p>
            <p>
              If you are using Reepls on behalf of an organization, you represent and warrant that you have
              authority to bind that organization to these Terms.
            </p>
          </section>

          <section id="eligibility">
            <h2 className="text-2xl font-semibold mb-3">2. Eligibility &amp; Use of the Service</h2>
            <p className="mb-3">
              You may use Reepls only if you are legally allowed to form a binding contract with us and are
              not barred from using the Service under applicable law. In general, this means:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>
                You must meet the minimum age required to use social media services in your country (for
                example, 13 years old in many jurisdictions).
              </li>
              <li>
                If you are under the age of majority in your jurisdiction, you must have the consent of a
                parent or legal guardian where required by law.
              </li>
            </ul>
            <p>
              We may limit access to certain features or areas of the Service based on your role, location,
              or other criteria, and we may change eligibility requirements from time to time.
            </p>
          </section>

          <section id="account-registration">
            <h2 className="text-2xl font-semibold mb-3">3. Account Registration &amp; Security</h2>
            <p className="mb-3">
              To use many features of Reepls, you must create an account and provide certain information
              such as your name, username, email address or phone number, and a password. You agree to:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your information as needed</li>
              <li>Keep your login credentials confidential and secure</li>
              <li>
                Immediately notify us if you suspect any unauthorized use of your account or a security
                breach
              </li>
            </ul>
            <p>
              You are responsible for all activities that occur under your account, except where such
              activities are the direct result of a security incident caused by us.
            </p>
          </section>

          <section id="user-content">
            <h2 className="text-2xl font-semibold mb-3">4. Your Content &amp; Rights You Grant</h2>
            <p className="mb-3">
              Reepls is a platform for user-generated content, including posts, articles, communiqués,
              podcasts, streams, images, videos, and comments (&quot;User Content&quot;). You retain
              ownership of the User Content you create and share on Reepls.
            </p>
            <p className="mb-3">
              By posting or otherwise making User Content available on the Service, you grant Reepls a
              non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to host,
              store, reproduce, modify (for example, to format or transcode content for display),
              distribute, publicly perform, publicly display, and otherwise use your User Content in
              connection with operating, promoting, and improving the Service.
            </p>
            <p>
              This license continues for as long as your content is available on Reepls. You can generally
              delete your User Content at any time; however, copies may persist in backups or logs for a
              reasonable period, and some content (such as reposts by other users) may survive in limited
              ways consistent with the functionality of the platform.
            </p>
          </section>

          <section id="acceptable-use">
            <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use &amp; Community Standards</h2>
            <p className="mb-3">
              You agree to use Reepls responsibly, in accordance with these Terms, our community standards,
              and all applicable laws. You may not use the Service to:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Post content that is illegal, deceptive, or fraudulent</li>
              <li>
                Promote hate, harassment, or violence against individuals or groups based on race, ethnicity,
                nationality, religion, gender, sexual orientation, disability, or other protected
                characteristics
              </li>
              <li>Share excessively graphic, sexually explicit, or otherwise inappropriate content</li>
              <li>Violate the intellectual property or privacy rights of others</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
              <li>Send spam or unsolicited promotional messages</li>
              <li>Interfere with or disrupt the operation of the Service or the experience of others</li>
              <li>Attempt to reverse engineer, decompile, or otherwise access the source code of the app</li>
            </ul>
            <p>
              We may, at our sole discretion, remove or restrict content and accounts that violate these
              rules or otherwise harm the community.
            </p>
          </section>

          <section id="child-safety-terms">
            <h2 className="text-2xl font-semibold mb-3">6. Child Safety &amp; Prohibited Content</h2>
            <p className="mb-3">
              Reepls has zero tolerance for any form of child sexual abuse and exploitation (CSAE),
              including child sexual abuse material (CSAM). You may not:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Upload, share, or link to any CSAM or CSAE content</li>
              <li>Sexualize minors in any form</li>
              <li>Attempt to groom, solicit, or otherwise exploit children or teens</li>
            </ul>
            <p className="mb-3">
              We use a combination of automated tools, user reports, and human review to detect and respond
              to CSAE/CSAM. We remove such content, may suspend or permanently ban offending accounts, and
              may report suspected CSAM and related information to relevant authorities, including
              organizations like the National Center for Missing &amp; Exploited Children (NCMEC), in
              accordance with applicable law.
            </p>
            <p>
              For more detail on our approach to child safety, please review our dedicated{" "}
              <Link to="/child-safety-standards" className="text-primary-400 hover:text-primary-300">
                Child Safety Standards
              </Link>
              .
            </p>
          </section>

          <section id="intellectual-property">
            <h2 className="text-2xl font-semibold mb-3">7. Intellectual Property</h2>
            <p className="mb-3">
              All rights, title, and interest in and to the Service (excluding User Content) are and will
              remain the exclusive property of Reepls and its licensors. This includes the design, code,
              logos, trademarks, and other elements of the app.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of the Service unless you have
              our prior written consent. Any feedback or suggestions you provide may be used by us without
              obligation to you.
            </p>
          </section>

          <section id="notifications">
            <h2 className="text-2xl font-semibold mb-3">8. Notifications &amp; Communications</h2>
            <p className="mb-3">
              Reepls may send you notifications and communications related to your account, content, and
              activity on the platform. These may include:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Push notifications delivered via Firebase Cloud Messaging (FCM)</li>
              <li>In-app notifications about followers, comments, reactions, and other activity</li>
              <li>Service-related emails (for example, verification, security alerts, and policy updates)</li>
            </ul>
            <p>
              You can control many notification types through your in-app settings or device settings.
              However, we may still send you important service or legal notices relating to your account.
            </p>
          </section>

          <section id="suspension-termination">
            <h2 className="text-2xl font-semibold mb-3">9. Suspension &amp; Termination</h2>
            <p className="mb-3">
              We reserve the right, at our sole discretion, to suspend or terminate your access to all or
              part of the Service at any time, with or without notice, for reasons that may include:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Violation of these Terms or other policies</li>
              <li>Illegal, abusive, or harmful behavior</li>
              <li>Repeated infringement of intellectual property rights</li>
              <li>Security or operational risks to the Service or other users</li>
            </ul>
            <p>
              You may also stop using Reepls at any time and, where available, delete your account. Our{" "}
              <Link to="/privacy-policy#account-deletion" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </Link>{" "}
              explains how we handle your data when you close your account.
            </p>
          </section>

          <section id="disclaimers">
            <h2 className="text-2xl font-semibold mb-3">10. Disclaimers</h2>
            <p className="mb-3">
              Reepls is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest
              extent permitted by law, we disclaim all warranties, express or implied, including but not
              limited to implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p>
              We do not guarantee that the Service will be uninterrupted, secure, or error-free, or that
              content will always be available, accurate, or timely.
            </p>
          </section>

          <section id="limitation-liability">
            <h2 className="text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
            <p className="mb-3">
              To the fullest extent permitted by law, Reepls and its affiliates, officers, employees,
              agents, and partners will not be liable for any indirect, incidental, special, consequential,
              or punitive damages, or any loss of profits or revenues, whether incurred directly or
              indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
              <li>Your use of or inability to use the Service</li>
              <li>Any conduct or content of other users or third parties</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            <p>
              In all cases, our total liability will be limited to the amount you have paid to us (if any)
              for use of the Service in the twelve (12) months immediately preceding the event giving rise
              to the claim, or the minimum amount required under applicable law if greater.
            </p>
          </section>

          <section id="indemnity">
            <h2 className="text-2xl font-semibold mb-3">12. Indemnity</h2>
            <p>
              You agree to indemnify and hold harmless Reepls and its affiliates, officers, directors,
              employees, and agents from and against any claims, liabilities, damages, losses, and expenses
              (including reasonable legal and accounting fees) arising out of or in any way connected with
              your access to or use of the Service, your User Content, or your violation of these Terms.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-semibold mb-3">13. Governing Law &amp; Dispute Resolution</h2>
            <p className="mb-3">
              These Terms and any dispute arising out of or in connection with them will be governed by and
              construed in accordance with the laws of the jurisdiction in which Reepls is legally
              established, without regard to its conflict of law principles.
            </p>
            <p>
              Where permitted by law, you agree that any disputes will be resolved through good-faith
              negotiations. If we are unable to resolve a dispute informally, it may be submitted to the
              competent courts in the relevant jurisdiction, unless otherwise required by mandatory
              consumer-protection law in your country of residence.
            </p>
          </section>

          <section id="app-store-terms">
            <h2 className="text-2xl font-semibold mb-3">14. App Store Terms (Google Play)</h2>
            <p className="mb-3">
              When you download or use the Reepls Android app from Google Play, you also agree to any
              applicable terms and policies of Google LLC and the Google Play Store, including their
              developer policies and content guidelines.
            </p>
            <p>
              Google is not responsible for providing support for the Reepls app and is not liable for any
              claims related to your use of the app. All such support obligations rest with Reepls.
            </p>
          </section>

          <section id="changes-terms">
            <h2 className="text-2xl font-semibold mb-3">15. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time to reflect changes to the Service, our practices,
              or applicable laws. When we make material changes, we will update the &quot;Last updated&quot;
              date at the top of this page and, where appropriate, provide additional notice (for example,
              in-app or by email). Your continued use of Reepls after any changes means you accept the
              updated Terms.
            </p>
          </section>

          <section id="contact-terms">
            <h2 className="text-2xl font-semibold mb-3">16. Contact Us</h2>
            <p className="mb-2">
              If you have any questions about these Terms or the Service, you can contact us at:
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

export default TermsAndConditions;


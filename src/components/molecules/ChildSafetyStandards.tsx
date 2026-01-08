import React from "react";
import { Link } from "react-router-dom";
import Topbar from "../atoms/Topbar/Topbar";

const ChildSafetyStandards: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <Topbar>
        <p className="text-neutral-50">Reepls Child Safety Standards</p>
      </Topbar>

      {/* Content */}
      <div className="flex-1 px-5 md:px-10 lg:px-20 py-8">
        <div className="max-w-4xl mx-auto text-neutral-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Reepls Child Safety Standards
            </h1>
            <p className="text-neutral-300 text-sm md:text-base mb-4">
              Last updated: January 2026
            </p>
            <div className="text-sm text-neutral-400">
              <Link 
                to="/Terms&Policies" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                View Terms and Policies
              </Link>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-8 text-base md:text-lg leading-relaxed text-neutral-200">
            <p>
              Reepls is a social platform dedicated to amplifying African voices through thought leadership, storytelling, and community discussions. We are fully committed to protecting children and maintaining a safe environment for all users. We have a zero-tolerance policy for any form of child sexual abuse and exploitation (CSAE), including child sexual abuse material (CSAM).
            </p>
          </div>

          {/* Prohibited Content */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
              Prohibited Content and Behavior
            </h2>
            <p className="text-neutral-300 mb-4 text-base md:text-lg">
              We strictly prohibit:
            </p>
            <ul className="list-disc list-inside space-y-3 text-neutral-200 text-base md:text-lg ml-4">
              <li>Any content depicting, promoting, or facilitating the sexual abuse or exploitation of children.</li>
              <li>CSAM in any form, including images, videos, text, or links.</li>
              <li>Any attempt to groom, solicit, or interact with minors for sexual purposes.</li>
              <li>Content that sexualizes minors or encourages harmful behavior toward children.</li>
            </ul>
          </section>

          {/* Detection and Moderation */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
              Detection and Moderation
            </h2>
            <p className="text-neutral-300 mb-4 text-base md:text-lg">
              We employ a combination of proactive measures to prevent and detect CSAE/CSAM:
            </p>
            <ul className="list-disc list-inside space-y-3 text-neutral-200 text-base md:text-lg ml-4">
              <li>Automated content scanning and AI-based moderation tools.</li>
              <li>User reporting features within the app (accessible via profile settings or content menus).</li>
              <li>Human review by our trained moderation team for flagged content.</li>
              <li>Regular audits and collaboration with industry safety tools.</li>
            </ul>
          </section>

          {/* Actions on Violations */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
              Actions on Violations
            </h2>
            <p className="text-neutral-300 mb-4 text-base md:text-lg">
              Upon discovery or report of prohibited content:
            </p>
            <ul className="list-disc list-inside space-y-3 text-neutral-200 text-base md:text-lg ml-4">
              <li>We immediately remove the content.</li>
              <li>We suspend or permanently ban the offending account.</li>
              <li>We preserve evidence as required by law.</li>
              <li>We report confirmed CSAM to the National Center for Missing & Exploited Children (NCMEC) and relevant authorities (e.g., law enforcement in the user's jurisdiction).</li>
            </ul>
          </section>

          {/* Reporting Concerns */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
              Reporting Concerns
            </h2>
            <p className="text-neutral-300 mb-4 text-base md:text-lg leading-relaxed">
              Users can report potential child safety issues directly in the Reepls app via the "Report" button on posts, profiles, or messages. Reports are reviewed promptly by our safety team.
            </p>
            <p className="text-neutral-300 mt-4 text-base md:text-lg leading-relaxed">
              For external reports or inquiries, contact our designated child safety point of contact:{" "}
              <a 
                href="mailto:reepls.project@gmail.com" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                reepls.project@gmail.com
              </a>
              .
            </p>
          </section>

          {/* Compliance */}
          <section className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
              Compliance
            </h2>
            <p className="text-neutral-300 mb-4 text-base md:text-lg leading-relaxed">
              Reepls complies with all applicable child safety laws, including reporting obligations to authorities. We continuously update our practices to align with industry best standards.
            </p>
            <div className="mt-6 p-4 bg-neutral-800 rounded-lg border-l-4 border-red-500">
              <p className="text-neutral-200 text-base md:text-lg font-semibold">
                If you believe a child is in immediate danger, contact local law enforcement or a child protection hotline.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChildSafetyStandards;


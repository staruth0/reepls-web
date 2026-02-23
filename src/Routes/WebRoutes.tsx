import Home from "../feature/Home/pages/Home";
import PrivacyPolicy from "../feature/Home/pages/PrivacyPolicy";
import TermsAndConditions from "../feature/Home/pages/TermsAndConditions";

const WebRoutes = {
  path: "/",
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      path: "terms-and-conditions",
      element: <TermsAndConditions />,
    },
  ],
};

export { WebRoutes };

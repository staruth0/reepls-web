import "../styles/home.scss";
import Header from "../components/header/Header";
import {
  HeroSection,
  NarrativeGapSection,
  ProblemSection,
  ReeplsSolutionSection,
  CoreFeaturesSection,
  // InDepthPostsSection,
  // StreamsSection,
  // CurateKnowledgeSection,
  FinalCTASection,
} from "../components/LandingPage";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";

import { useUser } from "../../../hooks/useUser";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SplashComponent from "../../../components/molecules/SplashScreen/SplashComponent";
import { updateMetaTags } from "../../../utils";

function Home() {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  // Initialize showSplash based on isLoggedIn to prevent flash of landing page
  const [showSplash, setShowSplash] = useState(() => isLoggedIn);
  const [splashText, setSplashText] = useState<string | undefined>(undefined);

  const checkInternetConnection = useCallback(() => {
    if (navigator.onLine) {
      // Internet is good, navigate to /feed
      navigate("/feed");
    } else {
      // Internet is bad, update splash text and keep showing splash
      setSplashText("Internet connection not good. Please check your network.");
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is logged in on mount
    if (isLoggedIn) {
      // Wait 3 seconds, then check internet
      const splashTimer = setTimeout(() => {
        checkInternetConnection();
      }, 3000);

      // Cleanup timeout on unmount
      return () => clearTimeout(splashTimer);
    } else {
      // If user logs out, hide splash
      setShowSplash(false);
    }
  }, [isLoggedIn, checkInternetConnection]);

  //Continuously check internet if it's bad
  useEffect(() => {
    if (splashText && !navigator.onLine) {
      const interval = setInterval(() => {
        if (navigator.onLine) {
          navigate("/feed"); // Navigate when internet is back
        }
      }, 2000); // Check every 2 seconds

      return () => clearInterval(interval);
    }
  }, [splashText, navigate]);

  // Update meta tags for SEO when landing page is displayed
  useEffect(() => {
    if (!showSplash && !isLoggedIn) {
      const homepageUrl = window.location.origin;
      const homepageDescription = "Reepls is the dedicated platform where Africa's thought leaders, storytellers, and innovators share, publish, and watch their influence spread.";
      
      updateMetaTags({
        title: "REEPLS - Amplify Your African Voice | Platform for Thought Leaders & Storytellers",
        description: homepageDescription,
        image: `${homepageUrl}/favicon.png`,
        url: homepageUrl,
      });

      // Also update the meta description tag directly
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', homepageDescription);
    }
  }, [showSplash, isLoggedIn]);

  if (showSplash) {
    return <SplashComponent text={splashText} />;
  }

  return (
    <div className="home__container bg-background">
      <Header />
      <HeroSection />
      <NarrativeGapSection />
      <ProblemSection />
      <ReeplsSolutionSection />
      <CoreFeaturesSection />
      {/* <InDepthPostsSection />
      <StreamsSection />
      <CurateKnowledgeSection /> */}
      <FinalCTASection />
      <LandingPageFooter />
    </div>
  );
}

export default Home;
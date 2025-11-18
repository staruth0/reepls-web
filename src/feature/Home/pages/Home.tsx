import "../styles/home.scss";
import Header from "../components/header/Header";
import {
  HeroSection,
  NarrativeGapSection,
  ProblemSection,
  ReeplsSolutionSection,
  CoreFeaturesSection,
  InDepthPostsSection,
  StreamsSection,
  CurateKnowledgeSection,
  FinalCTASection,
} from "../components/LandingPage";
import LandingPageFooter from "../components/LandingPage/LandingPageFooter";

import { useUser } from "../../../hooks/useUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashComponent from "../../../components/molecules/SplashScreen/SplashComponent";

function Home() {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const [splashText, setSplashText] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if user is logged in on mount
    if (isLoggedIn) {
      setShowSplash(true); 

      // Wait 5 seconds, then check internet
      const splashTimer = setTimeout(() => {
        checkInternetConnection();
      }, 3000);

      // Cleanup timeout on unmount
      return () => clearTimeout(splashTimer);
    }
  }, [isLoggedIn,setShowSplash]);

  const checkInternetConnection = () => {
    if (navigator.onLine) {
      // Internet is good, navigate to /feed
      navigate("/feed");
    } else {
      // Internet is bad, update splash text and keep showing splash
      setSplashText("Internet connection not good. Please check your network.");
    }
  };

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
      <InDepthPostsSection />
      <StreamsSection />
      <CurateKnowledgeSection />
      <FinalCTASection />
      <LandingPageFooter />
    </div>
  );
}

export default Home;
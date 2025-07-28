import React, { useContext, useState } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import ToggleFeed from "./components/ToogleFeed";
import CognitiveModeIndicator from "../../components/atoms/CognitiveModeIndicator";
import Communique from "./components/Communique/Communique";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";

const FeedPodcasts: React.FC = () => {
  const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
  const { toggleCognitiveMode } = useContext(CognitiveModeContext);

  // Handle cognitive mode toggle
  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            <CognitiveModeIndicator
              isActive={isBrainActive}
              onClick={handleBrainClick}
            />
          </div>
        </Topbar>

        <div>Podcasts</div>
      </div>

      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default FeedPodcasts;

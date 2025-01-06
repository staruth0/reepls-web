import React from "react";
import TopRightComponent from "../../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../../components/molecules/RightRecentComponent";
import RightOlderComponent from "../../../../components/molecules/RightOlderComponent";

interface CommuniqueProps {
  isExpandedMode: boolean;
  handleExpandedMode: () => void;
}

const Communique: React.FC<CommuniqueProps> = ({
  isExpandedMode,
  handleExpandedMode,
}) => {
  return (
    <>
      <TopRightComponent
        isExpandedMode={isExpandedMode}
        handleExpandedMode={handleExpandedMode}
      />
      <RightRecentComponent isExpandedMode={isExpandedMode} />
      <RightOlderComponent isExpandedMode={isExpandedMode} />
    </>
  );
};

export default Communique;

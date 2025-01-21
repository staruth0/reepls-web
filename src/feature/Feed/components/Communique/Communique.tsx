import React from "react";
import TopRightComponent from "../../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../../components/molecules/RightRecentComponent";
import RightOlderComponent from "../../../../components/molecules/RightOlderComponent";
import { useGetCommuniquerArticles } from "../../../Blog/hooks/useArticleHook";

interface CommuniqueProps {
  isExpandedMode: boolean;
  handleExpandedMode: () => void;

}

const Communique: React.FC<CommuniqueProps> = ({isExpandedMode,handleExpandedMode}) => {
  const {data} = useGetCommuniquerArticles()

  
  return (
    <>
      <TopRightComponent
        isExpandedMode={isExpandedMode}
        handleExpandedMode={handleExpandedMode}
      />
      <RightRecentComponent isExpandedMode={isExpandedMode}  communiqueList={data}/>
      <RightOlderComponent isExpandedMode={isExpandedMode} />
    </>
  );
};

export default Communique;

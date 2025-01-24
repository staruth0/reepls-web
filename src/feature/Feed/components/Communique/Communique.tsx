import React from "react";
import TopRightComponent from "../../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../../components/molecules/RightRecentComponent";
import { useGetCommuniquerArticles } from "../../../Blog/hooks/useArticleHook";
import Trending from "../Trending";



const Communique: React.FC = () => {
  const {data} = useGetCommuniquerArticles()

  
  return (
    <>
      <TopRightComponent/>
      <RightRecentComponent  communiqueList={data} />
      <Trending/>
    </>
  );
};

export default Communique;

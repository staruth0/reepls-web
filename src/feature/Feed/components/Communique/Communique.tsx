import React, { useEffect } from "react";
import TopRightComponent from "../../../../components/atoms/TopRightComponent";
import RightRecentComponent from "../../../../components/molecules/RightRecentComponent";
import { useGetCommuniquerArticles } from "../../../Blog/hooks/useArticleHook";
import Trending from "../Trending";
import CommuniqueSkeleton from "../CommuniqueSkeleton";




const Communique: React.FC = () => {
  const {data, isLoading} = useGetCommuniquerArticles()
 
  useEffect(() => {
    if(data) console.log('communiques',data)
  },[data])
  
  return (
    <>
      <TopRightComponent />
      {isLoading ? (
        <div className="flex flex-col gap-4 mt-5">
          <CommuniqueSkeleton />
          <CommuniqueSkeleton />
        </div>
      ) : (
        <RightRecentComponent communiqueList={data?.pages[0].articles} />
      )}
      <Trending />
    </>
  );
};

export default Communique;

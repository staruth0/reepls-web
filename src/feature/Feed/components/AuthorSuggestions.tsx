import React from "react";
import SeeMore from "./SeeMore";
import AuthorSugestionComponent from "./AuthorSugestionComponent";
import { useGetRecommendedUsersById } from "../../Profile/hooks";
import { useUser } from "../../../hooks/useUser";
import { User } from "../../../models/datamodels"; 

const AuthorSuggestions: React.FC = () => {
  const { authUser } = useUser();
  const {data: recommendedUsers,isLoading,error} = useGetRecommendedUsersById(authUser?.id || "");


  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!recommendedUsers?.length) {
    return (
      <div className="w-full flex flex-col gap-6 mt-4 py-1 text-gray-500">
        No recommended authors found.
      </div>
    );
  }


  return (
    <div className="w-full flex flex-col gap-6 mt-4 py-1">
      {recommendedUsers?.slice(0,4)?.map((user:User) => (
        <AuthorSugestionComponent
          key={user.id} 
          username={user.username!} 
          title={user.title || "Suggested Author"} 
          id={user._id || ""}
        />
      ))}
      <SeeMore />
    </div>
  );
};

export default AuthorSuggestions;

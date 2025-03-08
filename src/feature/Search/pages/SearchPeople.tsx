import React, { useEffect } from 'react'
import AuthorComponent from '../../Saved/Components/AuthorComponent';
import { useUser } from '../../../hooks/useUser';
import { useGetFollowing } from '../../Follow/hooks';
import { Follow } from '../../../models/datamodels';

const SearchPeople: React.FC = () => {
  const { authUser } = useUser();
  const { data: followingsData } = useGetFollowing(authUser?.id || ""); 
  
    useEffect(() => {
      console.log('author id',authUser?.id)
    }, [authUser])
    
      const followings = followingsData?.data || [];

  return (
    <div className="people">
      <div className="space-y-4 mt-4">
        <p>Leading in Politics</p>
        {followings.length > 0 ? (
          followings.map((following: Follow) => (
            <AuthorComponent
              key={following.followed_id?.user_id}
              user={following?.followed_id}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-center">No followings yet</p>
        )}
      </div>
      <div className="space-y-4 mt-4">
        <p>Leading in Business</p>
        {followings.length > 0 ? (
          followings.map((following: Follow) => (
            <AuthorComponent
              key={following.followed_id?.user_id}
              user={following.followed_id}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-center">No followings yet</p>
        )}
      </div>
    </div>
  );
}

export default SearchPeople
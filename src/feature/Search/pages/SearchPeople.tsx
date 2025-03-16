import React, { useEffect } from 'react';
import AuthorComponent from '../../Saved/Components/AuthorComponent';
import { useUser } from '../../../hooks/useUser';
import { useGetFollowing } from '../../Follow/hooks';
import { Follow, User } from '../../../models/datamodels';
import { useGetTrendingAuthors } from '../../Feed/hooks';

export interface Contributor {
  authorId: string;
  totalViews: number;
  totalShares: number;
  totalPositiveReactions: number;
  positiveReactionCounts: {
    like: number;
    clap: number;
    love: number;
    smile: number;
    cry: number;
  };
  engagementRate: string;
  weightedScore: string;
  author: User;
}

export interface TrendingAuthorCategory {
  leaderIn: string;
  contributors: Contributor[];
}

const SearchPeople: React.FC = () => {
  const { authUser } = useUser();
  const { data: followingsData } = useGetFollowing(authUser?.id || "");
  const { data: trendingAuthors, isLoading, error } = useGetTrendingAuthors();

  useEffect(() => {
    console.log('author id', authUser?.id);
    console.log('trending authors', trendingAuthors);
  }, [authUser, trendingAuthors]);

  const followings = followingsData?.data || [];

  return (
    <div className="people">
      {/* Section for People You Follow */}
      <div className="space-y-4 mt-4">
        <p className="text-lg font-semibold">People You Follow</p>
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

      {/* Trending Authors Sections */}
      {isLoading ? (
        <p className="text-neutral-500 text-center mt-4">Loading trending authors...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-4">Error: {error.message}</p>
      ) : (
        trendingAuthors?.map((category:TrendingAuthorCategory) => (
          <div key={category.leaderIn} className="space-y-4 mt-4">
            <p className="text-lg font-semibold">Leading in {category.leaderIn}</p>
            {category.contributors.length > 0 ? (
              category.contributors.map((contributor) => (
                <AuthorComponent
                  key={contributor.authorId}
                  user={contributor.author}
                />
              ))
            ) : (
              <p className="text-neutral-500 text-center">No trending authors in this category</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPeople;


// export const handleFollowClick = (
//   isFollowing: boolean,
//   setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>,
//   userData: any,
//   id: string,
//   mutate: any
// ) => {
//   if (!userData) return;

//   const updatedFollowing = isFollowing
//     ? userData.following.filter((followingId: string) => followingId !== id) 
//     : [...userData.following, id]; 

//   setIsFollowing(!isFollowing); 
//   mutate(
//     { following: updatedFollowing },
//     {
//       onSuccess: () => {
//       },
//       onError: () => {
//         setIsFollowing(isFollowing); 
//       },
//     }
//   );
// };

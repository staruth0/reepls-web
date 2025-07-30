import React, { useEffect } from 'react'
import { useGetMyReposts } from '../../Repost/hooks/useRepost';


const ProfileReposts = () => {

    const {data} = useGetMyReposts()


  useEffect(() => {
    if (data) {
    console.log("Reposts data:", data);
    }
  }, [data]);
  return (
    <div>ProfileReposts</div>
  )
}

export default ProfileReposts
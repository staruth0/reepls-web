import React from 'react'
import BlogComponent from '../../../components/molecules/BlogComponent'
import '../styles/FeedPosts.scss'


const FeedPosts:React.FC = () => {
  return (
    <div className='Feed__Posts px-20'>      
          <BlogComponent/>
    </div>
  )
}

export default FeedPosts
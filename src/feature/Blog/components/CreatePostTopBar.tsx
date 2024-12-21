import React from 'react'
import '../styles/Createposttopbar.scss'

const CreatePostTopBar:React.FC = () => {
  return (
      <div className="create__post__top__bar">
          <div>Create Post</div>

          <select>
              <option value="regular post">Regular post</option>
              <option value="Article">Article</option>
          </select>
    </div>
  )
}

export default CreatePostTopBar
import React from 'react'
import { Lightbulb } from "lucide-react";


const BlogArticleHeader:React.FC = () => {
  return (
      <div className='inline-flex rounded-full px-5 py-2 bg-secondary-400 ml-3 mb-1 items-center text-secondary-100'>
          <Lightbulb size={18} />
          <span>Article</span>
    </div>
  )
}

export default BlogArticleHeader
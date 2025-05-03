import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuLoader, LuX } from 'react-icons/lu';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import { toast } from 'react-toastify';
import './PostView.scss';
import BlogPost2 from '../Blog/components/BlogPost2';

const PostView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useGetArticleById(id!);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => navigate(-1), 300); // Match the animation duration
  };

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching article.');
      navigate('/feed');
    }
  }, [isError, navigate]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className={`post-view-container ${isClosing ? 'closing' : ''}`}>
      {/* Dark overlay */}
      <div className="post-view-overlay" onClick={handleClose} />
      
      {/* Main content */}
      <div className="post-view-content">
        <Topbar>
          <button 
            onClick={handleClose}
            className="close-button"
            aria-label="Close post"
          >
            <LuX className="size-5" />
          </button>
        </Topbar>

        <div className="post-content-container">
          {isLoading ? (
            <div className="loading-container">
              <LuLoader className="animate-spin text-primary-400 text-2xl" />
            </div>
          ) : article ? (
            <BlogPost2 
              article={article} 
              isModalView={true}
              onClose={handleClose}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PostView;
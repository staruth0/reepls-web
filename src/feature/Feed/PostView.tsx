import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LuLoader, LuX } from 'react-icons/lu';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import './PostView.scss';
import BlogPost2 from '../Blog/components/BlogPost2';

const PostView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, isError } = useGetArticleById(id!);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    if (isClosing) return; // Prevent multiple close attempts
    
    setIsClosing(true);
    setTimeout(() => {
      try {
        // Navigate to home page instead of browser back
        // This ensures users always land on the home page when closing shared links
        navigate('/feed', { replace: true });
      } catch (error) {
        console.error('Navigation failed:', error);
        // Fallback: try to navigate to root
        window.location.href = '/feed';
      }
    }, 300); // Match the animation duration
  };

  useEffect(() => {
    if (isError) {
      navigate('/feed', { replace: true });
    }
  }, [isError, navigate]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isClosing) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isClosing]);

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

        <div className="post-content-container ">
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
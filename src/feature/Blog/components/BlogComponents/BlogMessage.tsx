import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../utils';
import './Blog.scss';
import { useTranslation } from 'react-i18next';
import { Article } from '../../../../models/datamodels';
import { useUpdateArticle } from '../../hooks/useArticleHook';

interface BlogMessageProps {
  title: string;
  content: string;
  isArticle: boolean;
  article_id: string;
  slug?: string;
  article: Article;
}

const BlogMessage: React.FC<BlogMessageProps> = ({ title, content, article, isArticle, article_id, slug }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [hasClicked, setHasClicked] = useState(false); // Added to prevent multiple updates
  const contentRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { mutate } = useUpdateArticle();
  const { t } = useTranslation();

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight, 10);
      const maxHeight = lineHeight * 3;

      if (contentHeight > maxHeight) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [content]);

  // Function to convert URLs in text to clickable links
  const renderContentWithLinks = useMemo(() => {
    if (!content) return null;

    // URL regex pattern - matches http, https, www, and common domains
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // Add the URL as a clickable link
      const url = match[0];
      const href = url.startsWith('http') ? url : `https://${url}`;
      
      parts.push(
        <a
          key={match.index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 underline break-all"
          onClick={(e) => e.stopPropagation()} // Prevent triggering parent click handlers
        >
          {url}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last URL
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    // If no URLs were found, return the original content
    return parts.length > 0 ? parts : content;
  }, [content]);

  const handleToggle = () => {
    if (isArticle) {
      if (!hasClicked) {
        setHasClicked(true);
        mutate({
          articleId: article._id || '',
          article: {
            views_count:(article.views_count || 0) +1,
            engagement_count: (article.engagement_count || 0) + 1, 
          },
        });
        navigate(slug ? `/posts/article/slug/${slug}` : `/posts/article/${article_id}`);
      }
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <div className="blog-message">
      <div className="text-[15px] font-semibold mb-2">{title}</div>
      <p
        ref={contentRef}
        className={cn(
          'text-neutral-100 text-[14px] leading-[20px] transition-all duration-500 ease-in-out',
          isExpanded ? 'line-clamp-none' : 'line-clamp-3',
          'whitespace-pre-wrap'
        )}
      >
        {renderContentWithLinks}
      </p>
      {isArticle ? (
        <button
          onClick={handleToggle}
          disabled={hasClicked} // Disable button after first click
          className="text-primary-400 underline decoration-dotted underline-offset-4 text-[14px] font-medium mt-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("blog.Continuereading")}
        </button>
      ) : (
        showToggle && (
          <button 
            onClick={handleToggle} 
            className="text-primary-400 hover:text-primary-300 text-[14px] font-medium mt-1 transition-colors duration-200 ease-in-out"
          >
            {isExpanded ? t('blog.seeLess') : t('blog.seeMore')}
          </button>
        )
      )}
    </div>
  );
};

export default BlogMessage;
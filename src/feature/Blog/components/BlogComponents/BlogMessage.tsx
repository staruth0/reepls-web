import React, { useEffect, useRef, useState } from 'react';
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

  const handleToggle = () => {
    if (isArticle) {
      if (!hasClicked) {
        setHasClicked(true);
        mutate({
          articleId: article._id || '',
          article: {
            views_count:article.views_count! +1,
            engagement_ount: article.engagement_ount! + 1, 
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
          'text-neutral-100 text-[14px] leading-[20px] transition-all duration-300',
          isExpanded ? 'line-clamp-none' : 'line-clamp-3',
          'whitespace-pre-wrap'
        )}
      >
        {content}
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
          <button onClick={handleToggle} className="text-neutral-50 text-[14px] font-medium mt-1">
            {isExpanded ? t('blog.seeLess') : t('blog.seeMore')}
          </button>
        )
      )}
    </div>
  );
};

export default BlogMessage;
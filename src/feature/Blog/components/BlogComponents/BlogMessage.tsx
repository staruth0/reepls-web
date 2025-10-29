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
  const [hasClicked, setHasClicked] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const { mutate } = useUpdateArticle();
  const { t } = useTranslation();

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight, 10);
      const maxHeight = lineHeight * 3;
      setShowToggle(contentHeight > maxHeight);
    }
  }, [content]);

  const handleToggle = () => {
    if (isArticle) {
      if (!hasClicked) {
        setHasClicked(true);
        mutate({
          articleId: article._id || '',
          article: {
            views_count: article.views_count! + 1,
            engagement_count: article.engagement_count! + 1,
          },
        });
        navigate(slug ? `/posts/article/slug/${slug}` : `/posts/article/${article_id}`);
      }
    } else {
      setIsExpanded((prev) => !prev);
    }
  };

  // ✅ Highlight hashtags (#tag)
  const formatContent = (text: string) => {
    const parts = text.split(/(\#[a-zA-Z0-9_]+)/g); // split but keep hashtags
    return parts.map((part, index) =>
      part.startsWith('#') ? (
        <span key={index} className="text-[#57C016] font-medium">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
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
        {formatContent(content)}
      </p>
      {isArticle ? (
        <button
          onClick={handleToggle}
          disabled={hasClicked}
          className="text-primary-400 underline decoration-dotted underline-offset-4 text-[14px] font-medium mt-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('blog.Continuereading')}
        </button>
      ) : (
        showToggle && (
          <button
            onClick={handleToggle}
            className="text-[#57C016] text-[14px] font-medium mt-1"
          >
            {isExpanded ? t('blog.seeLess') : t('readmore')}
          </button>
        )
      )}
    </div>
  );
};

export default BlogMessage;

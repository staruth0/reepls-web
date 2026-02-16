import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag, LuMic, LuX, LuBook } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type Editor } from 'reactjs-tiptap-editor';
import axios from 'axios';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { useUser } from '../../../hooks/useUser';
    import { Article, MediaItem, Publication } from '../../../models/datamodels';
import { uploadArticleThumbnail } from '../../../utils/media';
import AuthPromptPopup from '../../AnonymousUser/components/AuthPromtPopup';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import useDraft from '../hooks/useDraft';
import { useSendNewArticleNotification } from '../../Notifications/hooks/useNotification';
import { apiClient1 } from '../../../services/apiClient';
import UploadProgressModal from '../components/UploadProgressModal';
import { 
  validateArticleTitle, 
  validateArticleSubtitle, 
  validateArticleContent,
  getCharacterCountDisplay,
  getWordCountDisplay,
  getCharacterCountColor,
  getWordCountColor,
  LIMITS
} from '../../../utils/validation';

import PublicationSelectionModal from '../../Stream/components/PublicationSelectionModal';
import { useGetMyPublications } from '../../Stream/Hooks';
import TagsModal from '../components/TagsModal';


interface PodcastData {
  title: string;
  description: string;
  audioFile: File | null;
  audioPreview: string;
  tags: string[];
  category: string;
  isPublic: boolean;
}

const CreatePost: React.FC = () => {
  const { authUser, isLoggedIn } = useUser();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const { saveDraftArticle, loadDraftArticle, clearDraftArticle } = useDraft();
  const { mutate: createArticle } = useSendNewArticleNotification();
  const [initialEditorContent, setInitialEditorContent] = useState<{
    title: string;
    subtitle: string;
    content: string;
    htmlContent: string;
    isCommunique: boolean;
  }>({
    title: '',
    subtitle: '',
    content: '',
    htmlContent: '',
    isCommunique: false,
  });
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  
  const [showPodcastModal, setShowPodcastModal] = useState<boolean>(false);
  const [podcastData, setPodcastData] = useState<PodcastData>({
    title: '',
    description: '',
    audioFile: null,
    audioPreview: '',
    tags: [],
    category: '',
    isPublic: true
  });
  const [isUploadingPodcast, setIsUploadingPodcast] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);
  const [showPublicationModal, setShowPublicationModal] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);
  const { data: publications } = useGetMyPublications();

  useEffect(() => {
    if (publications) {
      console.log('Publications data received:', publications);
    }
  }, [publications]);

  const actions = [
    {
      label: 'Preview',
      disabled: !isLoggedIn,
      ActionIcon: LuEye,
      onClick: () => {
        if (!isLoggedIn) return;
        const { text: trimmedContent, html: trimmedHtmlContent } = trimContentWhitespace(content, htmlContent);
        saveDraftArticle({ title, subtitle, content: trimmedContent, htmlContent: trimmedHtmlContent, media, isCommunique });
        navigate('/posts/article/preview');
      },
    },
    {
      label: 'Schedule',
      disabled: !isLoggedIn,
      ActionIcon: LuCalendar,
      onClick: () => {
        toast.info('Scheduling is not available yet', {
          autoClose: 1500,
        });
      },
    },
    {
      label: 'Share',
      disabled: true,
      ActionIcon: LuShare,
      onClick: () => {
        if (!isLoggedIn) return;
      },
    },
    {
      label: 'Save Draft',
      disabled: !isLoggedIn,
      ActionIcon: LuSave,
      onClick: () => {
        if (!isLoggedIn) return;
      },
    },
    {
      label: tags.length > 0 ? `Tags (${tags.length})` : 'Add Tags',
      ActionIcon: LuTag,
      disabled: !isLoggedIn,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowTagsModal(true);
      },
    },
    {
      label: 'Add Podcast',
      disabled: !isLoggedIn,
      ActionIcon: LuMic,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowPodcastModal(true);
      },
    },
    {
      label: selectedPublicationId ? 'Change Publication' : 'Select Publication',
      disabled: !isLoggedIn,
      ActionIcon: LuBook,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowPublicationModal(true);
      },
    },
  ];

  const handlePodcastAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Audio file size must be less than 50MB.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      setPodcastData(prev => ({
        ...prev,
        audioFile: file,
        audioPreview: URL.createObjectURL(file)
      }));
      toast.success('Audio file selected!');
    }
  };

  const handleRemovePodcastAudio = () => {
    setPodcastData(prev => ({
      ...prev,
      audioFile: null,
      audioPreview: ''
    }));
    if (audioInputRef.current) audioInputRef.current.value = '';
    toast.info('Audio file removed');
  };

  const handleSavePodcast = () => {
    if (!podcastData.title.trim()) {
      toast.error('Podcast title cannot be empty.');
      return;
    }
    if (!podcastData.audioFile) {
      toast.error('Please upload an audio file for your podcast.');
      return;
    }
    setShowPodcastModal(false);
    toast.success('Podcast added to article!');
  };

  const handlePublicationSelect = (publicationId: string) => {
    setSelectedPublicationId(publicationId);
    setShowPublicationModal(false);
    const selectedPub = publications?.find((p: Publication) => p._id === publicationId);
    toast.success(`Publication "${selectedPub?.title}" selected for article!`);
  };

  const handleClearPublication = () => {
    setSelectedPublicationId(null);
    toast.info('Publication selection cleared');
  };

  const handleSaveTags = (newTags: string[]) => {
    setTags(newTags);
  };

  const handleClearTags = () => {
    setTags([]);
    toast.info('Tags cleared');
  };

  // Helper function to trim leading and trailing blank lines from content
  const trimContentWhitespace = (text: string, html: string): { text: string; html: string } => {
    // Trim plain text - remove leading and trailing newlines/whitespace
    let trimmedText = text.trim();
    
    // Trim HTML - remove empty paragraphs and breaks at the beginning and end
    let trimmedHtml = html;
    
    // Remove leading empty paragraphs (including those with only whitespace, breaks, or non-breaking spaces)
    // Matches: <p></p>, <p> </p>, <p><br></p>, <p><br/></p>, <p>&nbsp;</p>, <p><br class="..."></p>, etc.
    // This regex matches one or more empty paragraph tags at the start
    trimmedHtml = trimmedHtml.replace(/^(<p[^>]*>(\s|&nbsp;|&#160;|<br[^>]*>)*<\/p>\s*)+/i, '');
    
    // Remove trailing empty paragraphs (including those with only whitespace, breaks, or non-breaking spaces)
    trimmedHtml = trimmedHtml.replace(/(<p[^>]*>(\s|&nbsp;|&#160;|<br[^>]*>)*<\/p>\s*)+$/i, '');
    
    // Also trim any leading/trailing whitespace from the HTML string itself
    trimmedHtml = trimmedHtml.trim();
    
    return { text: trimmedText, html: trimmedHtml };
  };

  // Helper function to navigate based on isArticle property
  const navigateToPostOrArticle = (article: any) => {
    if (article?.isArticle) {
      // Navigate to article view by slug
      if (article?.slug) {
        navigate(`/posts/article/slug/${article.slug}`);
      } else if (article?._id) {
        // Fallback to ID if slug is not available
        navigate(`/posts/article/slug/${article._id}`);
      } else {
        // Final fallback to feed
        navigate('/feed');
      }
    } else {
      // Navigate to post view by ID
      if (article?._id) {
        navigate(`/posts/post/${article._id}`);
      } else {
        // Fallback to feed
        navigate('/feed');
      }
    }
  };

const onPublish = async () => {
  if (!isLoggedIn) return;
  
  // Validate title
  const titleValidation = validateArticleTitle(title);
  if (!titleValidation.isValid) {
    toast.error(titleValidation.message, { autoClose: 3000 });
    return;
  }
  
  // Validate subtitle (optional but with character limit)
  if (subtitle) {
    const subtitleValidation = validateArticleSubtitle(subtitle);
    if (!subtitleValidation.isValid) {
      toast.error(subtitleValidation.message, { autoClose: 3000 });
      return;
    }
  }
  
  // Validate content
  const contentValidation = validateArticleContent(content);
  if (!contentValidation.isValid) {
    toast.error(contentValidation.message, { autoClose: 3000 });
    return;
  }
  
  if (!title || !content) {
    toast.error(t('Please provide a title and content.'), {
      autoClose: 1500,
    });
    return;
  }

  const toastId = toast.info(t('Publishing the article...'), {
    isLoading: true,
    autoClose: false,
  });

  try {
    let thumbnailUrl = thumbnailImage;
    
    if (thumbnail && authUser?.id) {
      thumbnailUrl = await uploadArticleThumbnail(authUser.id, thumbnail);
      setThumbnailImage(thumbnailUrl);
    }

    // Trim leading and trailing blank lines from content
    const { text: trimmedContent, html: trimmedHtmlContent } = trimContentWhitespace(content, htmlContent);

    // If there's no podcast, use the original hook
    if (!podcastData.audioFile) {
      const article: Article = {
        title,
        subtitle,
        content: trimmedContent,
        htmlContent: trimmedHtmlContent,
        thumbnail: thumbnailUrl, 
        media,
        tags,
        status: 'Published',
        type: 'LongForm',
        isArticle: true,
        is_communiquer: isCommunique,
        publication_id: selectedPublicationId || undefined,
      };

      console.log('article debugging', article);

      createArticle(article, {
        onSuccess: (data) => {
          toast.update(toastId, {
            render: t('Article published successfully'),
            type: 'success',
            isLoading: false,
            autoClose: 1500,
          });
          clearDraftArticle();
          // Extract article from nested response structure
          const articleData = data?.notification?.article || data?.article || data;
          navigateToPostOrArticle(articleData);
        },
        onError: (error) => {
          toast.update(toastId, {
            render: t('Error creating article: ') + error,
            type: 'error',
            isLoading: false,
            autoClose: 1500,
          });
        },
      });
      return;
    }

    // If there is a podcast, use the direct API call
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('content', trimmedContent);
    formData.append('htmlContent', trimmedHtmlContent);
    if (thumbnailUrl) {
      formData.append('thumbnail', thumbnailUrl);
    }
    formData.append('is_communiquer', isCommunique.toString());
    if (selectedPublicationId) {
      formData.append('publication_id', selectedPublicationId);
    }
    formData.append('tags', JSON.stringify(tags));
    
    // Add podcast data
    formData.append('podcastTitle', podcastData.title);
    formData.append('podcastDescription', podcastData.description);
    formData.append('podcastTags', JSON.stringify(podcastData.tags));
    formData.append('podcastCategory', podcastData.category);
    formData.append('podcastIsPublic', podcastData.isPublic.toString());
    formData.append('audio', podcastData.audioFile);

    setIsUploadingPodcast(true);
    setUploadProgress(0);

    const response = await apiClient1.post(
      '/podcasts/create-with-article',
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
          );
          setUploadProgress(percentCompleted);
        },
      }
    );

    toast.update(toastId, {
      render: t('Article with podcast published successfully'),
      type: 'success',
      isLoading: false,
      autoClose: 1500,
    });
    clearDraftArticle();
    // Extract article from nested response structure
    const articleData = response?.data?.notification?.article || response?.data?.article || response?.data;
    navigateToPostOrArticle(articleData);
  } catch (error) {
    console.error('Upload error:', error);
    let errorMessage = 'Upload failed';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    toast.update(toastId, {
      render: errorMessage,
      type: 'error',
      isLoading: false,
      autoClose: 1500,
    });
  } finally {
    setIsUploadingPodcast(false);
    setUploadProgress(0);
  }
};

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
  };

  useEffect(() => {
    if (hasLoadedDraft) return;
    const draftArticle = loadDraftArticle();
    if (draftArticle) {
      setInitialEditorContent({
        title: draftArticle.title,
        subtitle: draftArticle.subtitle,
        content: draftArticle.content,
        htmlContent: draftArticle.htmlContent,
        isCommunique: draftArticle.isCommunique || false,
      });
      setTitle(draftArticle.title);
      setSubtitle(draftArticle.subtitle);
      setContent(draftArticle.content);
      setHtmlContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
      setIsCommunique(draftArticle.isCommunique || false);
    }
    setHasLoadedDraft(true);
  }, [hasLoadedDraft, loadDraftArticle]);

  useEffect(() => {
    if (hasLoadedDraft && editorRef.current?.editor) {
      setContent(initialEditorContent.content);
      setHtmlContent(initialEditorContent.htmlContent);
      setTimeout(() => {
        editorRef.current?.editor?.commands?.setContent(initialEditorContent.htmlContent);
      }, 0);
    }
  }, [hasLoadedDraft, initialEditorContent]);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    const { text: trimmedContent, html: trimmedHtmlContent } = trimContentWhitespace(content, htmlContent);
    saveDraftArticle({ title, subtitle, content: trimmedContent, htmlContent: trimmedHtmlContent, media, isCommunique });
  }, [title, subtitle, content, htmlContent, media, isCommunique, selectedPublicationId, hasLoadedDraft, saveDraftArticle]);

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <CreatePostTopBar
          title={t('New Article')}
          mainAction={{ label: 'Publish', onClick: onPublish }}
          actions={actions}
          isCommunique={isCommunique}
          onToggleCommunique={setIsCommunique}
        />
      </Topbar>

      <div className="mt-10">
        {isLoggedIn ? (
          <div className="md:px-4">
            <ImageSection onImageChange={(image) => setThumbnail(image as File)} />
            <div className="mx-auto mt-3 px-5 sm:px-0 max-w-[800px]">
              <div className="">
                <div className="relative">
                  <textarea
                    placeholder={t('Enter your title here...')}
                    className="resize-none w-full h-auto mb-2 text-3xl font-semibold font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
                    value={title}
                    rows={2}
                    maxLength={LIMITS.ARTICLE.TITLE_MAX_CHARS}
                    onChange={(e) => {
                      if (e.target.value.length <= LIMITS.ARTICLE.TITLE_MAX_CHARS) {
                        setTitle(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
                    disabled={!hasLoadedDraft}
                  />
                  <div className="absolute bottom-1 right-2 text-xs">
                    <span className={getCharacterCountColor(title, LIMITS.ARTICLE.TITLE_MAX_CHARS)}>
                      {getCharacterCountDisplay(title, LIMITS.ARTICLE.TITLE_MAX_CHARS)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="subtitle"
                    placeholder={t('Enter your subtitle here... (optional)')}
                    className="resize-none w-full h-auto mb-0 text-lg font-medium font-inter border-none outline-none bg-transparent placeholder-gray-400"
                    value={subtitle}
                    rows={2}
                    maxLength={LIMITS.ARTICLE.SUBTITLE_MAX_CHARS}
                    onChange={(e) => {
                      if (e.target.value.length <= LIMITS.ARTICLE.SUBTITLE_MAX_CHARS) {
                        setSubtitle(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
                    disabled={!hasLoadedDraft}
                  />
                  <div className="absolute bottom-1 right-2 text-xs">
                    <span className={getCharacterCountColor(subtitle, LIMITS.ARTICLE.SUBTITLE_MAX_CHARS)}>
                      {getCharacterCountDisplay(subtitle, LIMITS.ARTICLE.SUBTITLE_MAX_CHARS)}
                    </span>
                  </div>
                </div>
                
                {/* Selected Publication Indicator */}
                {selectedPublicationId && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <LuBook size={16} className="text-primary-400" />
                    <span className="text-sm text-primary-300">
                      Publishing to: {publications?.find((p: Publication) => p._id === selectedPublicationId)?.title}
                    </span>
                    <button
                      onClick={handleClearPublication}
                      className="ml-auto text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                )}

                {/* Selected Tags Indicator */}
                {tags.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <LuTag size={16} className="text-primary-400 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm text-primary-300 block mb-1">
                        Tags ({tags.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded border border-primary-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleClearTags}
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div id="editor" className="mb-20 relative">
              <TipTapRichTextEditor
                initialContent={htmlContent}
                handleContentChange={setContent}
                editorRef={editorRef}
                handleMediaUpload={(url, type) => setMedia([{ url, type }, ...media])}
                handleHtmlContentChange={setHtmlContent}
                disabled={!hasLoadedDraft}
                className="block max-w-full bg-primary-100 static mx-auto my-1"
              />
              <div className="absolute bottom-1 right-2 text-xs">
                <span className={getWordCountColor(content, LIMITS.ARTICLE.CONTENT_MAX_WORDS)}>
                  {getWordCountDisplay(content, LIMITS.ARTICLE.CONTENT_MAX_WORDS)} words
                </span>
              </div>
            </div>
          </div>
        ) : (
          <AuthPromptPopup text={t('create a post')} />
        )}
      </div>

      {/* Podcast Modal */}
      {showPodcastModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Podcast</h2>
              <button 
                onClick={() => setShowPodcastModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <LuX className="size-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Podcast Title</label>
                <input
                  type="text"
                  value={podcastData.title}
                  onChange={(e) => setPodcastData({...podcastData, title: e.target.value})}
                  className="w-full p-2 bg-neutral-700 rounded"
                  placeholder="Enter podcast title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={podcastData.description}
                  onChange={(e) => setPodcastData({...podcastData, description: e.target.value})}
                  className="w-full p-2 bg-neutral-700 rounded"
                  rows={3}
                  placeholder="Enter podcast description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Audio File</label>
                {podcastData.audioPreview ? (
                  <div className="bg-neutral-700 p-3 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm truncate">
                        {podcastData.audioFile?.name || 'Audio file'}
                      </span>
                      <button 
                        onClick={handleRemovePodcastAudio}
                        className="text-red-400 hover:text-red-300"
                      >
                        <LuX className="size-4" />
                      </button>
                    </div>
                    <audio controls className="w-full" src={podcastData.audioPreview} />
                  </div>
                ) : (
                  <label className="flex items-center justify-center p-4 border border-dashed border-neutral-600 rounded cursor-pointer hover:bg-neutral-700">
                    <LuMic className="size-5 mr-2" />
                    <span>Select Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handlePodcastAudioSelect}
                      className="hidden"
                      ref={audioInputRef}
                    />
                  </label>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPodcastModal(false)}
                  className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePodcast}
                  disabled={!podcastData.title || !podcastData.audioFile}
                  className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 disabled:opacity-50"
                >
                  Save Podcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Modal */}
      <UploadProgressModal
        isOpen={isUploadingPodcast}
        progress={uploadProgress}
        message={isUploadingPodcast ? "Publishing article with podcast..." : "Publishing article..."}
      />

      {/* Publication Selection Modal */}
      {showPublicationModal && (
        <PublicationSelectionModal
          isOpen={showPublicationModal}
          onClose={() => setShowPublicationModal(false)}
          publications={publications || []}
          onSelect={handlePublicationSelect}
          selectedPublicationId={selectedPublicationId}
        />
      )}

      {/* Tags Modal */}
      <TagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        onSave={handleSaveTags}
        selectedTags={tags}
      />
    </div>
  );
};

export default CreatePost;
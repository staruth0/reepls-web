import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag, LuMic, LuX, LuPlus, LuBook } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type Editor } from 'reactjs-tiptap-editor';
import axios from 'axios';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { useUser } from '../../../hooks/useUser';
import { Article, MediaItem, MediaType, Publication } from '../../../models/datamodels';
import { uploadArticleThumbnail } from '../../../utils/media';
import AuthPromptPopup from '../../AnonymousUser/components/AuthPromtPopup';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useGetArticleById, useUpdateArticle } from '../hooks/useArticleHook';
import { useGetPodcastsByUser } from '../../Podcast/hooks';
import { apiClient1 } from '../../../services/apiClient';
import UploadProgressModal from '../components/UploadProgressModal';
import { useGetMyPublications } from '../../Stream/Hooks';
import PublicationSelectionModal from '../../Stream/components/PublicationSelectionModal';
import TagsModal from '../components/TagsModal';
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

interface Podcast {
  id: string;
  title: string;
  description: string;
  audio: {
    url: string;
    storageKey: string;
    duration: number;
    fileSize: number;
    mimeType: string;
  };
  tags: string[];
  isPublic: boolean;
}

const EditPost: React.FC = () => {
  const { authUser, isLoggedIn } = useUser();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams(); 
  const articleId = id;
  const { data: article, isLoading: isFetchingArticle } = useGetArticleById(articleId || '');
  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle();

  const { data: podcastsData, isLoading: podloading, isError, error } = useGetPodcastsByUser({
    userId: authUser?.id || '',
    limit: 10,
    sortOrder: 'desc',
  });

  // Podcast related state
  const [showPodcastModal, setShowPodcastModal] = useState<boolean>(false);
  const [showPodcastListModal, setShowPodcastListModal] = useState<boolean>(false);
  const [showNewPodcastModal, setShowNewPodcastModal] = useState<boolean>(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isAttachingPodcast, setIsAttachingPodcast] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // New podcast state
  const [newPodcastTitle, setNewPodcastTitle] = useState<string>('');
  const [newPodcastDescription, setNewPodcastDescription] = useState<string>('');
  const [newPodcastAudioFile, setNewPodcastAudioFile] = useState<File | null>(null);
  const [newPodcastAudioPreview, setNewPodcastAudioPreview] = useState<string>('');
  const [newPodcastTags, setNewPodcastTags] = useState<string[]>([]);
  const [newPodcastIsPublic, setNewPodcastIsPublic] = useState<boolean>(true);
  const newPodcastAudioInputRef = useRef<HTMLInputElement>(null);
  
  // Publication related state
  const [selectedPublicationId, setSelectedPublicationId] = useState<string | null>(null);
  const [showPublicationModal, setShowPublicationModal] = useState<boolean>(false);
  const { data: publications } = useGetMyPublications();

  // Tags related state
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);

  const actions = [
    {
      label: 'Preview',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuEye,
      onClick: () => {
        if (!isLoggedIn) return;
        navigate(`/posts/article/preview?id=${articleId}`);
      },
    },
    {
      label: 'Schedule',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuCalendar,
      onClick: () => {
        toast.info('Scheduling is not available yet', { autoClose: 1500 });
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
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuSave,
      onClick: () => {
        if (!isLoggedIn) return;
        toast.info('Draft saving not implemented for editing yet', { autoClose: 1500 });
      },
    },
    {
      label: tags.length > 0 ? `Tags (${tags.length})` : 'Add Tags',
      ActionIcon: LuTag,
      disabled: !isLoggedIn || isUpdating,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowTagsModal(true);
      },
    },
    {
      label: 'Attach Podcast',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuMic,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowPodcastModal(true);
      },
    },
    {
      label: selectedPublicationId ? 'Change Publication' : 'Select Publication',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuBook,
      onClick: () => {
        if (!isLoggedIn) return;
        setShowPublicationModal(true);
      },
    },
  ];

  // Populate fields with fetched article data
  useEffect(() => {
    if (article && isFetchingArticle === false) {
      setTitle(article.title || '');
      setSubtitle(article.subtitle || '');
      setContent(article.content || '');
      setHtmlContent(article.htmlContent || '');
      setMedia(article.media || []);
      setIsCommunique(article.is_communiquer || false);
      setSelectedPublicationId(article.publication_id || null);
      setTags(article.tags || []);
      
      if (article.thumbnail) {
        setThumbnailImage(article.thumbnail);
      } 
      
      setIsLoading(false);
    }
  }, [article, isFetchingArticle]);

  // Set editor content once loaded
  useEffect(() => {
    if (!isLoading && editorRef.current?.editor) {
      setTimeout(() => {
        editorRef.current?.editor?.commands?.setContent(htmlContent);
      }, 0);
    }
  }, [isLoading, htmlContent]);

  const handleNewPodcastAudioSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file.');
        if (newPodcastAudioInputRef.current) newPodcastAudioInputRef.current.value = '';
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Audio file size must be less than 50MB.');
        if (newPodcastAudioInputRef.current) newPodcastAudioInputRef.current.value = '';
        return;
      }
      setNewPodcastAudioFile(file);
      setNewPodcastAudioPreview(URL.createObjectURL(file));
      toast.success('Audio file selected!');
    }
  };

  const handleRemoveNewPodcastAudio = () => {
    setNewPodcastAudioFile(null);
    setNewPodcastAudioPreview('');
    if (newPodcastAudioInputRef.current) newPodcastAudioInputRef.current.value = '';
    toast.info('Audio file removed');
  };

  const handlePublicationSelect = (publicationId: string) => {
    setSelectedPublicationId(publicationId);
    setShowPublicationModal(false);
    const selectedPub = publications?.find((p: Publication) => p.id === publicationId);
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

  const handleCreateAndAttachPodcast = async () => {
    if (!newPodcastTitle.trim() || !newPodcastAudioFile || !articleId) {
      toast.error('Please provide a title and audio file for your podcast.');
      return;
    }

    const toastId = toast.info('Creating and attaching podcast...', {
      isLoading: true,
      autoClose: false,
    });

    try {
      setIsAttachingPodcast(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('title', newPodcastTitle);
      formData.append('description', newPodcastDescription);
      formData.append('tags', JSON.stringify(newPodcastTags));
      formData.append('isPublic', newPodcastIsPublic.toString());
      formData.append('audio', newPodcastAudioFile);

      await apiClient1.post(
        `/podcasts/attach-to-article/${articleId}`,
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
        render: 'New podcast created and attached successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      });
      
      // Reset new podcast state
      setNewPodcastTitle('');
      setNewPodcastDescription('');
      setNewPodcastAudioFile(null);
      setNewPodcastAudioPreview('');
      setNewPodcastTags([]);
      setNewPodcastIsPublic(true);
      
      setShowNewPodcastModal(false);
      setShowPodcastModal(false);
    } catch (error) {
      console.error('Error creating and attaching podcast:', error);
      let errorMessage = 'Failed to create and attach podcast';
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
      setIsAttachingPodcast(false);
      setUploadProgress(0);
    }
  };

  const handleAttachPodcast = async () => {
    if (!selectedPodcast || !articleId) return;

    const toastId = toast.info('Attaching podcast to article...', {
      isLoading: true,
      autoClose: false,
    });

    try {
      setIsAttachingPodcast(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('title', selectedPodcast.title);
      formData.append('description', selectedPodcast.description);
      formData.append('tags', JSON.stringify(selectedPodcast.tags));
      formData.append('isPublic', selectedPodcast.isPublic.toString());
      
      // Fetch the audio file as a blob
      const response = await fetch(selectedPodcast.audio.url);
      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], 'podcast-audio.mp3', { type: selectedPodcast.audio.mimeType });
      
      formData.append('audio', audioFile);

      await apiClient1.post(
        `/podcasts/attach-to-article/${articleId}`,
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
        render: 'Podcast attached to article successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      });
      setShowPodcastListModal(false);
      setSelectedPodcast(null);
      // Navigate based on isArticle property
      if (article?.isArticle) {
        // Navigate to article view by slug
        if (article?.slug) {
          navigate(`/posts/article/slug/${article.slug}`);
        } else if (article?._id) {
          navigate(`/posts/article/slug/${article._id}`);
        } else {
          navigate('/feed');
        }
      } else {
        // Navigate to post view by ID
        if (article?._id) {
          navigate(`/posts/post/${article._id}`);
        } else {
          navigate('/feed');
        }
      }
    } catch (error) {
      console.error('Error attaching podcast:', error);
      let errorMessage = 'Failed to attach podcast';
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
      setIsAttachingPodcast(false);
      setUploadProgress(0);
    }
  };

  const onUpdate = async () => {
    if (!isLoggedIn || !articleId) return;
    
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
      toast.error(t('Please provide a title and content.'), { autoClose: 1500 });
      return;
    }

    const toastId = toast.info(t('Updating the article...'), { 
      isLoading: true, 
      autoClose: false 
    });

    try {
      let updatedThumbnail = thumbnailImage;
      let updatedMedia = [...media];

      // Upload new thumbnail if provided
      if (thumbnail && authUser?.id) {
        updatedThumbnail = await uploadArticleThumbnail(authUser.id, thumbnail);
        setThumbnailImage(updatedThumbnail);
        
        // Remove old thumbnail from media if it exists
        updatedMedia = media.filter(item => item.url !== thumbnailImage);
        // Add new thumbnail to media
        updatedMedia.unshift({ 
          url: updatedThumbnail, 
          type: MediaType.Image 
        });
      }

      const updatedArticleData: Article = {
        _id: articleId,
        title,
        subtitle,
        content,
        htmlContent,
        thumbnail: updatedThumbnail,
        media: updatedMedia,
        tags,
        status: 'Published',
        type: 'LongForm',
        isArticle: true,
        is_communiquer: isCommunique,
        publication_id: selectedPublicationId || undefined,
      };

      updateArticle(
        { articleId, article: updatedArticleData },
        {
          onSuccess: () => {
            toast.update(toastId, {
              render: t('Article updated successfully'),
              type: 'success',
              isLoading: false,
              autoClose: 1500,
            });
            // Navigate based on isArticle property
            if (article?.isArticle) {
              // Navigate to article view by slug
              if (article?.slug) {
                navigate(`/posts/article/slug/${article.slug}`);
              } else if (article?._id) {
                navigate(`/posts/article/slug/${article._id}`);
              } else {
                navigate('/feed');
              }
            } else {
              // Navigate to post view by ID
              if (article?._id) {
                navigate(`/posts/post/${article._id}`);
              } else {
                navigate('/feed');
              }
            }
          },
          onError: (error: Error) => {
            toast.update(toastId, {
              render: t('Error updating article: ') + (error?.message || 'Unknown error'),
              type: 'error',
              isLoading: false,
              autoClose: 1500,
            });
          },
        }
      );
    } catch (error) {
      toast.update(toastId, {
        render: t('Error uploading thumbnail: ') + (error as Error).message,
        type: 'error',
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
  };

  if (!articleId) {
    return <div className="text-center mt-10">No article ID provided</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <CreatePostTopBar
          title={t('Edit Article')}
          mainAction={{ label: 'Update', onClick: onUpdate }}
          actions={actions}
          isCommunique={isCommunique}
          onToggleCommunique={setIsCommunique}
        />
      </Topbar>

      <div className="mt-10">
        {isLoggedIn ? (
          isFetchingArticle || isLoading ? (
            <div className="text-center mt-10">Loading article...</div>
          ) : (
            <div className="sm:max-w-xl md:max-w-4xl m-auto md:px-4">
              <ImageSection 
                onImageChange={(image) => setThumbnail(image as File)} 
                existingImageUrl={thumbnailImage}
              />
              <div className="mt-5">
                <div className="px-5 sm:px-0">
                  <div className="relative">
                    <textarea
                      placeholder={t('Enter your title here...')}
                      className="resize-none w-full mb-2 text-[20px] sm:text-3xl font-semibold font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
                      value={title}
                      rows={2}
                      maxLength={LIMITS.ARTICLE.TITLE_MAX_CHARS}
                      onChange={(e) => {
                        if (e.target.value.length <= LIMITS.ARTICLE.TITLE_MAX_CHARS) {
                          setTitle(e.target.value);
                        }
                      }}
                      onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
                      disabled={isUpdating}
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
                      disabled={isUpdating}
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
                          Publishing to: {publications?.find((p: Publication) => p.id === selectedPublicationId)?.title}
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
                  disabled={isUpdating}
                  className="block max-w-full bg-primary-100 static mx-auto my-1"
                />
                <div className="absolute bottom-1 right-2 text-xs">
                  <span className={getWordCountColor(content, LIMITS.ARTICLE.CONTENT_MAX_WORDS)}>
                    {getWordCountDisplay(content, LIMITS.ARTICLE.CONTENT_MAX_WORDS)} words
                  </span>
                </div>
              </div>
            </div>
          )
        ) : (
          <AuthPromptPopup text={t('edit a post')} />
        )}
      </div>

      {/* Initial Podcast Modal (Choose between Listings or New) */}
      {showPodcastModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Attach Podcast</h2>
              <button 
                onClick={() => setShowPodcastModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <LuX className="size-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowPodcastModal(false);
                  setShowPodcastListModal(true);
                }}
                className="w-full p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg flex items-center justify-center"
              >
                <LuMic className="size-5 mr-2" />
                <span>From Listings</span>
              </button>
              
              <button
                onClick={() => {
                  setShowPodcastModal(false);
                  setShowNewPodcastModal(true);
                }}
                className="w-full p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg flex items-center justify-center"
              >
                <LuPlus className="size-5 mr-2" />
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Podcast Listings Modal */}
      {showPodcastListModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Podcast</h2>
              <button 
                onClick={() => {
                  setShowPodcastListModal(false);
                  setShowPodcastModal(true);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <LuX className="size-5" />
              </button>
            </div>
            
            {podloading ? (
              <div className="text-center py-4">Loading podcasts...</div>
            ) : isError ? (
              <div className="text-red-400 text-center py-4">
                Error loading podcasts: {error?.message || 'Unknown error'}
              </div>
            ) : podcastsData?.data?.results?.length === 0 ? (
              <div className="text-center py-4">
                No podcasts found. 
                <button 
                  onClick={() => {
                    setShowPodcastListModal(false);
                    setShowNewPodcastModal(true);
                  }}
                  className="text-primary-500 hover:text-primary-400 ml-1"
                >
                  Create a new one
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {podcastsData?.data?.results?.map((podcast: Podcast) => (
                  <div 
                    key={podcast.id}
                    className={`p-3 rounded cursor-pointer ${selectedPodcast?.id === podcast.id ? 'bg-primary-500' : 'bg-neutral-700 hover:bg-neutral-600'}`}
                    onClick={() => setSelectedPodcast({
                      id: podcast.id,
                      title: podcast.title,
                      description: podcast.description,
                      audio: podcast.audio,
                      tags: podcast.tags || [],
                      isPublic: podcast.isPublic
                    })}
                  >
                    <h3 className="font-medium">{podcast.title}</h3>
                    <p className="text-sm text-neutral-300 truncate">{podcast.description}</p>
                    <div className="text-xs text-neutral-400 mt-1">
                      Duration: {podcast.audio.duration || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 mt-4">
              <button
                onClick={() => {
                  setShowPodcastListModal(false);
                  setShowPodcastModal(true);
                }}
                className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (selectedPodcast) {
                    setShowPodcastListModal(false);
                    handleAttachPodcast();
                  }
                }}
                disabled={!selectedPodcast}
                className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 disabled:opacity-50"
              >
                Attach Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Podcast Modal */}
      {showNewPodcastModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Podcast</h2>
              <button 
                onClick={() => {
                  setShowNewPodcastModal(false);
                  setShowPodcastModal(true);
                }}
                className="text-neutral-400 hover:text-white"
              >
                <LuX className="size-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title*</label>
                <input
                  type="text"
                  value={newPodcastTitle}
                  onChange={(e) => setNewPodcastTitle(e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded"
                  placeholder="Enter podcast title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newPodcastDescription}
                  onChange={(e) => setNewPodcastDescription(e.target.value)}
                  className="w-full p-2 bg-neutral-700 rounded"
                  rows={3}
                  placeholder="Enter podcast description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Audio File*</label>
                {newPodcastAudioPreview ? (
                  <div className="bg-neutral-700 p-3 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm truncate">
                        {newPodcastAudioFile?.name || 'Audio file'}
                      </span>
                      <button 
                        onClick={handleRemoveNewPodcastAudio}
                        className="text-red-400 hover:text-red-300"
                      >
                        <LuX className="size-4" />
                      </button>
                    </div>
                    <audio controls className="w-full" src={newPodcastAudioPreview} />
                  </div>
                ) : (
                  <label className="flex items-center justify-center p-4 border border-dashed border-neutral-600 rounded cursor-pointer hover:bg-neutral-700">
                    <LuMic className="size-5 mr-2" />
                    <span>Select Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleNewPodcastAudioSelect}
                      className="hidden"
                      ref={newPodcastAudioInputRef}
                      required
                    />
                  </label>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newPodcastIsPublic"
                  checked={newPodcastIsPublic}
                  onChange={(e) => setNewPodcastIsPublic(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out bg-neutral-700 border-neutral-600 rounded"
                />
                <label htmlFor="newPodcastIsPublic" className="text-neutral-300 text-sm">
                  Make Public
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-4">
              <button
                onClick={() => {
                  setShowNewPodcastModal(false);
                  setShowPodcastModal(true);
                }}
                className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
              >
                Back
              </button>
              <button
                onClick={handleCreateAndAttachPodcast}
                disabled={!newPodcastTitle || !newPodcastAudioFile || isAttachingPodcast}
                className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600 disabled:opacity-50"
              >
                {isAttachingPodcast ? 'Creating...' : 'Create & Attach'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Modal */}
      <UploadProgressModal
        isOpen={isAttachingPodcast}
        progress={uploadProgress}
        message={showNewPodcastModal ? "Creating and attaching podcast..." : "Attaching podcast to article..."}
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

export default EditPost;
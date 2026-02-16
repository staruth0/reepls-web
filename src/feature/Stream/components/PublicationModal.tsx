import React, { useState, useEffect } from "react";
import { X, Book} from "lucide-react";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import { usePushArticleToPublication } from "../Hooks";
import { Publication } from "../../../models/datamodels";



interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  publications: Publication[];
  articleId: string;
  onPush: (articleId: string, publicationId: string) => void;
  currentPublicationId?: string | null;
}

const PublicationModal: React.FC<PublicationModalProps> = ({
  isOpen,
  onClose,
  publications,
  articleId,
  currentPublicationId,
  
}) => {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const { mutate: pushArticleToPublication, isPending: isPushPending } = usePushArticleToPublication();

  // Find the publication the article currently belongs to
  const currentPublication = currentPublicationId 
    ? publications.find(pub => pub._id === currentPublicationId)
    : null;

  // Pre-select the current publication when modal opens
  useEffect(() => {
    if (isOpen && currentPublication) {
      setSelectedPublication(currentPublication);
    } else if (isOpen && !currentPublication) {
      setSelectedPublication(null);
    }
  }, [isOpen, currentPublication]);

  const handlePushToPublication = () => {
    if (!selectedPublication) {
      toast.error("Please select a publication");
      return;
    }

    // Prevent pushing to another publication if article already belongs to one
    if (currentPublicationId && selectedPublication._id !== currentPublicationId) {
      toast.error("This article already belongs to a publication and cannot be pushed to another");
      return;
    }

    console.log('selectedPublication', {
      articleId,
      publicationId: selectedPublication._id || '',
    })

    pushArticleToPublication(
      {
        articleId,
        publicationId: selectedPublication._id || '',
      },
      {
        onSuccess: () => {
          toast.success(`Article pushed to ${selectedPublication.title} successfully`);
          onClose();
          setSelectedPublication(null);
        },
        onError: (error) => {
          toast.error("Failed to push article to publication");
          console.error("Push article error:", error);
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedPublication(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <Book size={20} />
            Push to Publication
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-100 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          {currentPublicationId ? (
            <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm font-medium mb-1">
                Article Already Belongs to a Publication
              </p>
              <p className="text-neutral-300 text-xs">
                This article is already part of a publication and cannot be pushed to another publication.
              </p>
              {currentPublication && (
                <p className="text-neutral-200 text-xs mt-1">
                  Current publication: <span className="font-semibold">{currentPublication.title}</span>
                </p>
              )}
            </div>
          ) : (
            <p className="text-neutral-100 text-sm mb-3">
              Select a publication to push this article to:
            </p>
          )}
          
           {publications && publications.length > 0 ? (
             <div className="space-y-1 max-h-60 overflow-y-auto">
               {publications.map((publication) => {
                 const isCurrentPublication = publication._id === currentPublicationId;
                 const isSelected = selectedPublication?._id === publication._id;
                 const isDisabled = currentPublicationId && !isCurrentPublication;
                 
                 return (
                 <div
                   key={publication._id}
                   className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                     isDisabled 
                       ? "opacity-50 cursor-not-allowed" 
                       : isSelected
                       ? "bg-primary-500/10 cursor-pointer"
                       : "hover:bg-neutral-700/30 cursor-pointer"
                   }`}
                   onClick={() => {
                     if (!isDisabled) {
                       setSelectedPublication(publication);
                     }
                   }}
                 >
                   {/* Icon */}
                   <div className="w-10 h-10 rounded-lg bg-neutral-600 flex items-center justify-center flex-shrink-0">
                     {publication.cover_image ? (
                       <img
                         src={publication.cover_image}
                         alt={publication.title}
                         className="w-10 h-10 rounded-lg object-cover"
                       />
                     ) : (
                       <Book size={16} className="text-neutral-400" />
                     )}
                   </div>
                   
                   {/* Content */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2">
                       <h3 className="font-semibold text-neutral-100 text-sm">
                         {publication.title}
                       </h3>
                       {isCurrentPublication && (
                         <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">
                           Current
                         </span>
                       )}
                     </div>
                     
                     {publication.short_description && (
                       <p className="text-xs text-neutral-200 mt-1 truncate">
                         {publication.short_description}
                       </p>
                     )}
                     
                     {/* Tags - you can add this if publications have tags */}
                     <div className="flex gap-1 mt-1">
                       {publication?.tags?.map((tag) => (
                        <span className="text-xs text-neutral-200">#{tag}</span>
                      ))}
                    
                     </div>
                   </div>
                   
                   {/* Checkbox */}
                   <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                     isSelected
                       ? "border-primary-500 bg-primary-500"
                       : "border-neutral-400"
                   }`}>
                     {isSelected && (
                       <div className="w-2 h-2 rounded-full bg-white"></div>
                     )}
                   </div>
                 </div>
               );
               })}
             </div>
          ) : (
            <div className="text-center py-8">
              <Book size={48} className="text-neutral-500 mx-auto mb-3" />
              <p className="text-neutral-400 mb-2">No publications found</p>
              <p className="text-sm text-neutral-500">
                Create a publication first to push articles to it.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-neutral-700 text-neutral-100 rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePushToPublication}
            disabled={!!(!selectedPublication || isPushPending || (currentPublicationId && selectedPublication?._id !== currentPublicationId))}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isPushPending ? (
              <>
                <LuLoader className="animate-spin size-4" />
                Pushing...
              </>
            ) : (
              "Push to Publication"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationModal;

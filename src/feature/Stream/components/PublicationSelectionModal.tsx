import React, { useState } from "react";
import { X, Book } from "lucide-react";
import { toast } from "react-toastify";
import { Publication } from "../../../models/datamodels";



interface PublicationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  publications: Publication[];
  onSelect: (publicationId: string) => void;
  selectedPublicationId?: string | null;
}

const PublicationSelectionModal: React.FC<PublicationSelectionModalProps> = ({
  isOpen,
  onClose,
  publications,
  onSelect,
  selectedPublicationId,
}) => {
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(selectedPublicationId || null);

  const handleSelect = () => {
    if (!tempSelectedId) {
      toast.error("Please select a publication");
      return;
    }
    onSelect(tempSelectedId);
    onClose();
  };

  const handleClose = () => {
    setTempSelectedId(selectedPublicationId || null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-background rounded-lg p-6 text-neutral-100 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <Book size={20} />
            Select Publication
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-100 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-neutral-100 text-sm mb-3">
            Choose a publication to associate with this article:
          </p>
          
          {publications && publications.length > 0 ? (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {publications.map((publication) => (
                <div
                  key={publication.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    tempSelectedId === publication._id
                      ? "bg-primary-500/10"
                      : "hover:bg-neutral-700/30"
                  }`}
                  onClick={() => setTempSelectedId(publication._id || null)}
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
                    </div>
                    
                    {publication.short_description && (
                      <p className="text-xs text-neutral-200 mt-1 truncate">
                        {publication.short_description}
                      </p>
                    )}
                    
                    {/* Tags */}
                    <div className="flex gap-1 mt-1">
                      {publication?.tags?.map((tag) => (
                        <span className="text-xs text-neutral-200">#{tag}</span>
                      ))}
                  
                    </div>
                  </div>
                  
                  {/* Radio Button */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    tempSelectedId === publication._id
                      ? "border-primary-500 bg-primary-500"
                        : "border-neutral-200"
                  }`}>
                    {tempSelectedId === publication._id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Book size={48} className="text-neutral-500 mx-auto mb-3" />
              <p className="text-neutral-400 mb-2">No publications found</p>
              <p className="text-sm text-neutral-500">
                Create a publication first to associate articles with it.
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
            onClick={handleSelect}
            disabled={!tempSelectedId}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select Publication
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicationSelectionModal;

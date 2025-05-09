import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuImagePlus } from 'react-icons/lu';
import { cn } from '../../../utils';
import '../styles/ImageSection.scss';

interface ImageSectionProps {
  onImageChange: (image: string | File) => void;
  existingImageUrl?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ onImageChange, existingImageUrl }) => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const { t } = useTranslation();

  // Initialize with existing image if provided
  React.useEffect(() => {
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
    }
  }, [existingImageUrl]);

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageChange(''); // Pass empty string to indicate removal
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {imageUrl && (
        <div className="relative">
          <img 
            className="object-cover w-auto h-96 rounded-md" 
            src={imageUrl} 
            alt="thumbnail" 
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label={t('Remove image')}
          >
            ×
          </button>
        </div>
      )}
      <label
        htmlFor="thumbnail-image"
        className={cn(
          'border rounded-full cursor-pointer',
          imageUrl ? 'border-primary-600 bg-primary-800' : 'border-primary-400 bg-primary-400',
          'flex items-center justify-center gap-2 px-5 py-3 hover:bg-primary-700 transition-colors'
        )}>
        <LuImagePlus className="size-6" />
        {imageUrl ? t('Replace thumbnail image') : t('Add thumbnail image')}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageInput} 
          className="hidden" 
          id="thumbnail-image" 
        />
      </label>
    </div>
  );
};

export default ImageSection;
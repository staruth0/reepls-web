import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuImagePlus } from 'react-icons/lu';
import { cn } from '../../../utils';
import '../styles/ImageSection.scss';

const ImageSection: React.FC<{ onImageChange: (image: string | File) => void }> = ({ onImageChange }) => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const { t } = useTranslation();

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      onImageChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {imageUrl && <img className=" object-cover w-auto h-96" src={imageUrl} alt="thumbnail" />}
      <label
        htmlFor="thumbnail-image"
        className={cn(
          'border rounded-full border-primary-600 bg-primary-800 cursor-pointer',
          imageUrl ? 'border-primary-600' : 'bg-primary-400',
          'flex items-center justify-center gap-2 px-5 py-3'
        )}>
        <LuImagePlus className="size-6" />

        {imageUrl ? t(`Replace thumbnail image`) : t(`Add thumbnail image`)}
        <input type="file" accept="image/*" onChange={handleImageInput} className="hidden" id="thumbnail-image" />
      </label>
    </div>
  );
};

export default ImageSection;

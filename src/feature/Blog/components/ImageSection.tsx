import React, { useRef } from "react";
import image from "../../../assets/icons/image-plus.svg";
import "../styles/ImageSection.scss";

const ImageSection: React.FC = () => {
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    inputRef.current?.click();
  };

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div className="image__section__container">
      {imageUrl ? (
        <img src={imageUrl} alt="thumbnail" />
      ) : (
        <div className="image__section__content">
          <div>Add thumbnail image for article (optional)</div>
          <div
             onClick={handleDivClick}
             className="image__section__upload__container"
          >
            <p>add image</p>
            <img src={image} alt="add image" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageInput}
              style={{ display: "none" }}
              ref={inputRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSection;

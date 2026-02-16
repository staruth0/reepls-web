// src/feature/Profile/components/MediaItem.jsx


export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

const MediaItem = ({ media }:{media:MediaItem}) => {
  return (
    <div className="aspect-square w-full rounded-lg overflow-hidden">
      {media.type === 'image' ? (
        <img
          src={media.url}
          alt="Media"
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={media.url}
          controls
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default MediaItem;
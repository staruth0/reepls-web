import React from 'react';
import AuthorSelection from '../../feature/Stream/components/AuthorSelection';


const UploadPodcastTestPage: React.FC = () => {

  const handleSelectAuthors = () => {
    // noop or test-specific action
    return;
  };

  const handleCloseSelection = () => {
    // noop
    return;
  };

  return (
    <>
      <div className={`podcast-upload-only`}>
        <AuthorSelection
          onSelectAuthors={handleSelectAuthors}
          onClose={handleCloseSelection}
          initialSelectedAuthors={[]}
        />

          {/* Public/Private Toggle */}
      </div>
    </>
  );
};

export default UploadPodcastTestPage;
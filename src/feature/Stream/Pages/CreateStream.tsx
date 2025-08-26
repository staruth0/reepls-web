import React, { useState } from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamDetailsForm from '../components/StreamDetailsForm';
import AuthorsTab from '../components/AuthorsTab';
import AuthorSelection from '../components/AuthorSelection'; // Your provided component
import StreamSidebar from '../components/StreamSidebar';

const CreateStream: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [streamDetails, setStreamDetails] = useState({
    name: '',
    description: '',
    topics: [] as string[],
  });
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([
    { id: 'you-1', name: 'You' },
  ]);
  const [isAuthorSelectionOpen, setIsAuthorSelectionOpen] = useState(false);
  const [invitationNote, setInvitationNote] = useState('');

  const handleNextStep = (details: typeof streamDetails) => {
    setStreamDetails(details);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleAuthorsSelected = (selectedAuthors: { id: string; name: string }[]) => {
    // Merge the new selection with the existing 'You' author
    const updatedAuthors = [{ id: 'you-1', name: 'You' }, ...selectedAuthors];
    setAuthors(updatedAuthors);
    setIsAuthorSelectionOpen(false);
  };

  const handleRemoveAuthor = (authorId: string) => {
    setAuthors((prevAuthors) => prevAuthors.filter((a) => a.id !== authorId));
  };

  const handleSubmit = () => {
    // Logic to handle form submission (e.g., creating stream, sending invites)
    console.log('Submitting form with:', { streamDetails, authors, invitationNote });
  };

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>Create Stream</div>
        </Topbar>

        <div className="w-full">
          <div className="p-8">
            <p className="text-center text-neutral-300 max-w-lg mx-auto mb-10">
              Streams allow authors to curate their work into themed collections, giving each its own unique identity and a dedicated audience. <span className="underline cursor-pointer">Learn more</span>
            </p>
            <div className="flex justify-center items-center mb-10">
              <div className={`flex items-center space-x-2 ${currentStep === 1 ? 'text-primary-500' : 'text-neutral-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-primary-500 text-white' : 'border border-neutral-400'}`}>
                  1
                </div>
                <span>Stream Details</span>
              </div>
              <div className="h-px w-20 bg-neutral-300 mx-4"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 2 ? 'text-primary-500' : 'text-neutral-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-primary-500 text-white' : 'border border-neutral-400'}`}>
                  2
                </div>
                <span>Authors</span>
              </div>
            </div>

            {currentStep === 1 ? (
              <StreamDetailsForm onNext={handleNextStep} initialData={streamDetails} />
            ) : (
              <AuthorsTab
                authors={authors}
                onBack={handleBack}
                onSubmit={handleSubmit}
                onOpenSelection={() => setIsAuthorSelectionOpen(true)}
                onRemoveAuthor={handleRemoveAuthor}
                invitationNote={invitationNote}
                onInvitationNoteChange={setInvitationNote}
                streamDetails={{
                  // provide actual values from this component's state/props where available
                  name: streamDetails.name || '',
                  description: streamDetails.description || '',
                  topics: streamDetails.topics || [],
                }}
              />
            )}
          </div>
        </div>
      </div>

      {isAuthorSelectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <AuthorSelection
            onSelectAuthors={handleAuthorsSelected}
            onClose={() => setIsAuthorSelectionOpen(false)}
            initialSelectedAuthors={authors.slice(1)} 
          />
        </div>
      )}

      <div className="communique sidebar bg-background hidden lg:block">
         <StreamSidebar />
      </div>
    </div>
  );
};

export default CreateStream;
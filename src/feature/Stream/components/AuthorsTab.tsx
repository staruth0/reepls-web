import React from 'react';
import StreamHeader from './StreamHeader';
import { CircleUserRound, Lock, X } from 'lucide-react';

interface AuthorsTabProps {
  authors: { id: string; name: string }[];
  onBack: () => void;
  onSubmit: () => void;
  onOpenSelection: () => void;
  onRemoveAuthor: (authorId: string) => void;
  invitationNote: string;
  onInvitationNoteChange: (note: string) => void;
  streamDetails: { name: string; description: string; topics: string[] };
}

const AuthorsTab: React.FC<AuthorsTabProps> = ({
  authors,
  onBack,
  onSubmit,
  onOpenSelection,
  onRemoveAuthor,
  invitationNote,
  onInvitationNoteChange,

}) => {
  const showInviteButton = authors.length > 1;

  return (
    <div className="max-w-xl mx-auto">
      {/* The new component to display the stream header */}
      <StreamHeader
        
      />

   
      <div className="">
        <div className="flex flex-wrap gap-4 items-center mb-8">
          {/* Replaced old "Owner: You" component with new locked version */}
          <div className="relative">
            <div className="w-40 h-12 bg-neutral-200 rounded-full flex items-center justify-center p-2">
              <Lock className="w-5 h-5 text-neutral-500" />
              <span className="text-neutral-500 ml-2">Owner: You</span>
            </div>
          </div>
          {authors.slice(1).map((author) => (
              <div key={author.id} className="">
              <div className=" h-12 bg-neutral-500 rounded-full flex items-center gap-2 p-2">
                <CircleUserRound className="w-8 h-8 rounded-full text-neutral-300" />
                <span className="text-sm font-semibold">{author.name}</span>
                <button
                  onClick={() => onRemoveAuthor(author.id)}
                  className="text-neutral-500 hover:text-red-500"
                >
                  <X className="size-6" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={onOpenSelection}
            className="size-12 bg-primary-400 rounded-full flex items-center justify-center text-white text-2xl font-light"
          >
            +
          </button>
        </div>

        {showInviteButton && (
          <div className="mt-8">
            <label className="block text-neutral-100 mb-2">Invitation Note</label>
            <textarea
              className="w-full p-2 border border-neutral-200 rounded-md h-32"
              placeholder="Greetings [Name], it would be my pleasure to have you join me in streaming together on Stream Name Here. We would write about so so and so. Other benefits. Thank you for your response. Ai should refine this"
              value={invitationNote}
              onChange={(e) => onInvitationNoteChange(e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            className="text-neutral-300 px-8 py-2 rounded-full font-bold"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="bg-primary-400 text-white px-8 py-2 rounded-full font-bold"
            onClick={onSubmit}
          >
            {showInviteButton ? 'Send Invite' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorsTab;
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

interface ReportUserPopupProps {
  username: string;
  userId: string;
  onClose: () => void;
}

const ReportUserPopup: React.FC<ReportUserPopupProps> = ({ username, userId, onClose }) => {
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to submit the report
      console.log(`Reporting user ${userId} with reason: ${reportText}`);
      toast.success('Report submitted successfully');
      setReportText('');
      onClose();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setReportText('');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-[99999]"
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div className="fixed w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md p-6 z-[99999] text-neutral-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Report {username}</h3>
          <X
            className="size-5 cursor-pointer hover:text-neutral-300"
            onClick={onClose}
          />
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            className="w-full h-32 p-3 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-50 placeholder-neutral-400 focus:outline-none focus:border-primary-400 resize-none"
            placeholder="Please describe why you are reporting this user..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-sm text-neutral-400 mt-1">
            {reportText.length}/500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-neutral-600 rounded-md hover:bg-neutral-700 disabled:opacity-50"
            onClick={handleClear}
            disabled={isSubmitting || !reportText}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportUserPopup;
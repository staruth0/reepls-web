import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface ReportUserPopupProps {
  username: string;
  userId: string;
  onClose: () => void;
}

const ReportUserPopup: React.FC<ReportUserPopupProps> = ({ username, onClose }) => {
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {t} = useTranslation()

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error('Please provide a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      
      toast.success(t('report.reportSuccess'));
      setReportText('');
      onClose();
    } catch (error) {
      toast.error(t('report.reportFailed'));
      console.error('Error submitting report:', error);
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
          <h3 className="text-lg font-semibold">{t("report.title", {username})}</h3>
          <X
            className="size-5 cursor-pointer hover:text-neutral-300"
            onClick={onClose}
          />
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            className="w-full h-32 p-3 bg-neutral-900  border border-neutral-700 rounded-md text-neutral-400 placeholder-neutral-400 focus:outline-none focus:border-primary-400 resize-none"
            placeholder="Please describe why you are reporting this user..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-sm text-neutral-400 mt-1">
            {reportText.length}/{t("report.characterNum")}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-neutral-600 rounded-md hover:bg-neutral-700 disabled:opacity-50"
            onClick={handleClear}
            disabled={isSubmitting || !reportText}
          >
           {t("report.clear")}
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
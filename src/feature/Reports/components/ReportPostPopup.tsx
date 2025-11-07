import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useCreateReport } from '../hooks';
import { useUser } from '../../../hooks/useUser';

interface ReportArticlePopupProps {
  articleTitle: string;
  articleId: string;
  onClose: () => void;
}

const ReportArticlePopup: React.FC<ReportArticlePopupProps> = ({ 
  // articleTitle, 
  articleId, 
  onClose 
}) => {
  const [reportText, setReportText] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateReport();
  const { authUser } = useUser();

  const reportReasons = [
    t('Inappropriate content'),
    t('False information'),
    t('Spam or advertisement'),
    t('Plagiarism'),
    t('Hate speech'),
    t('Other')
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error(t('report.selectReason'));
      return;
    }

    const fullReason = reportText.trim() 
      ? `${selectedReason}: ${reportText}`
      : selectedReason;

    if (!authUser?.id) {
      toast.error(t('report.authenticationError'));
      return;
    }

    console.log('fullReason', {
      article_id: articleId,
      reporter_id: authUser.id,
      reason: fullReason
    });

    mutate({
      article_id: articleId,
      reporter_id: authUser.id,
      reason: fullReason
    }, {
      onSuccess: () => {
        toast.success(t('report.reportSuccess'));
        setReportText('');
        setSelectedReason('');
        onClose();
      },
      onError: () => {
        toast.error(t('report.reportFailed'));
      }
    });
  };

  const handleClear = () => {
    setReportText('');
    setSelectedReason('');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[99999] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed w-[95%] sm:w-[85%] md:w-[70%] lg:w-[50%] xl:w-[40%] max-w-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-lg p-6 z-[99999] text-neutral-50 shadow-xl border border-neutral-700">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {t("report.articleTitle")}
            </h3>
            <p className="text-sm text-neutral-400">
              {t("report.articleSubtitle")}
            </p>
          </div>
          <button
            className="p-1 rounded-full hover:bg-neutral-700 transition-colors"
            onClick={onClose}
            // aria-label={t("common.close")}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Reason Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {t("report.selectReason")}*
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {reportReasons.map((reason) => (
              <button
                key={reason}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  selectedReason === reason
                    ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                    : 'bg-neutral-700 border-neutral-600 hover:bg-neutral-600'
                }`}
                onClick={() => setSelectedReason(reason)}
                disabled={isPending}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            {t("report.additionalDetails")}
            <span className="text-xs text-neutral-500 ml-1">
              ({t("report.optionalButRecommended")})
            </span>
          </label>
          <textarea
            className="w-full min-h-[120px] p-3 bg-neutral-900 border border-neutral-700 rounded-md text-neutral-300 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder={t("report.detailsPlaceholder")}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            disabled={isPending}
            maxLength={500}
          />
          <p className="text-xs text-neutral-500 mt-1">
            {t("report.characterLimit", { count: reportText.length, max: 500 })}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            className="px-4 py-2 text-sm bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors disabled:opacity-50"
            onClick={handleClear}
            disabled={isPending || (!reportText && !selectedReason)}
          >
            {t("report.clear")}
          </button>
          <button
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={isPending || !selectedReason}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("report.submitting")}
              </>
            ) : (
              t("report.submit")
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportArticlePopup;
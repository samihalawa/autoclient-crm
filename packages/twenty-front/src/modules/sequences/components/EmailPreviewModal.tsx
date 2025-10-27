import { X, User, Building2 } from 'lucide-react';
import { useMemo } from 'react';

interface EmailPreviewModalProps {
  subject: string;
  content: string;
  onClose: () => void;
}

// Sample data for variable replacement in preview
const SAMPLE_DATA: Record<string, string> = {
  '{{person.name.first}}': 'John',
  '{{person.name.last}}': 'Doe',
  '{{person.name.full}}': 'John Doe',
  '{{person.email}}': 'john.doe@example.com',
  '{{person.company}}': 'Acme Corp',
  '{{person.title}}': 'VP of Sales',
  '{{company.name}}': 'Acme Corp',
  '{{company.domain}}': 'acme.com',
  '{{company.industry}}': 'Technology',
  '{{sequence.name}}': 'Product Demo Follow-up',
  '{{sequence.owner.name}}': 'Jane Smith',
};

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  subject,
  content,
  onClose,
}) => {
  // Replace variables with sample data
  const previewSubject = useMemo(() => {
    let result = subject;
    Object.entries(SAMPLE_DATA).forEach(([variable, value]) => {
      result = result.replace(
        new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'),
        value,
      );
    });
    return result;
  }, [subject]);

  const previewContent = useMemo(() => {
    let result = content;
    Object.entries(SAMPLE_DATA).forEach(([variable, value]) => {
      result = result.replace(
        new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'),
        value,
      );
    });
    return result;
  }, [content]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Info */}
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-900 font-medium">Preview Mode</p>
              <p className="text-xs text-blue-700 mt-1">
                Variables have been replaced with sample data. Actual emails
                will use real recipient information.
              </p>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Email metadata */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-500 w-16">
                From:
              </span>
              <span className="text-sm text-gray-900">you@yourcompany.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-500 w-16">
                To:
              </span>
              <span className="text-sm text-gray-900">
                {SAMPLE_DATA['{{person.email}}']}
              </span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xs font-medium text-gray-500 w-16">
                Subject:
              </span>
              <span className="text-sm text-gray-900 flex-1">
                {previewSubject || (
                  <em className="text-gray-400">No subject</em>
                )}
              </span>
            </div>
          </div>

          {/* Email body */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[200px]">
            {previewContent ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {previewContent}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <p className="text-sm">No content to preview</p>
              </div>
            )}
          </div>

          {/* Sample data reference */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Building2 className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Sample Data Used:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Name:</span>{' '}
                    {SAMPLE_DATA['{{person.name.full}}']}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Company:</span>{' '}
                    {SAMPLE_DATA['{{person.company}}']}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Title:</span>{' '}
                    {SAMPLE_DATA['{{person.title}}']}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Industry:</span>{' '}
                    {SAMPLE_DATA['{{company.industry}}']}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

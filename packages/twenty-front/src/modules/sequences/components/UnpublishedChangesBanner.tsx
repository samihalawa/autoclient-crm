import { AlertCircle } from 'lucide-react';

interface UnpublishedChangesBannerProps {
  onPublish: () => void;
  onDiscard: () => void;
}

export const UnpublishedChangesBanner: React.FC<
  UnpublishedChangesBannerProps
> = ({ onPublish, onDiscard }) => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="text-sm font-medium text-amber-900">
            You have unpublished changes
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onDiscard}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Discard changes
          </button>
          <button
            onClick={onPublish}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

import { Sparkles, Edit, Trash2 } from 'lucide-react';

interface AIContentChipProps {
  prompt: string;
  onEdit: () => void;
  onClear: () => void;
}

export const AIContentChip: React.FC<AIContentChipProps> = ({
  prompt,
  onEdit,
  onClear,
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              AI-Powered Content
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-4 font-medium">"{prompt}"</p>
          <p className="text-xs text-gray-500">
            This content will be generated using AI when the email is sent,
            personalized for each recipient.
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
            title="Edit prompt"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onClear}
            className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            title="Clear AI content"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import { useState, useCallback } from 'react';
import { Sparkles, X } from 'lucide-react';

interface AIAssistantProps {
  initialPrompt?: string;
  onConfirm: (prompt: string) => void;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  initialPrompt = '',
  onConfirm,
  onClose,
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [preview, setPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate preview (mock - replace with actual Gemini API call)
  const handleGeneratePreview = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // TODO: Replace with actual Gemini API call
      // const response = await geminiService.generateEmailContent(prompt);

      // Mock preview for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPreview(
        `This is a preview of the AI-generated content based on your prompt:\n\n${prompt}\n\nThe actual content will be generated when the email is sent using the Gemini API.`,
      );
    } catch {
      // TODO: Replace with proper error handling using error service
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  // Confirm and save prompt
  const handleConfirm = useCallback(() => {
    if (!prompt.trim()) return;
    onConfirm(prompt);
  }, [prompt, onConfirm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AI Email Assistant
              </h2>
              <p className="text-sm text-gray-500">
                Describe what you want to say, and AI will draft it for you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Prompt input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'Write a friendly follow-up email asking about their interest in our product'"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                Be specific about tone, content, and purpose
              </p>
              <button
                onClick={handleGeneratePreview}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-sm font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? 'Generating...' : 'Generate preview'}
              </button>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {preview}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This is a preview. The actual content will be generated with
                recipient-specific details when the email is sent.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!prompt.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-sm font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Confirm prompt
          </button>
        </div>
      </div>
    </div>
  );
};

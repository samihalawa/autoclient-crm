import { useState, useCallback, useRef } from 'react';
import { Trash2, Sparkles, Eye, Braces } from 'lucide-react';
import { type SequenceStep } from '../types/sequence.types';
import { AIAssistant } from './AIAssistant';
import { VariablePicker } from './VariablePicker';
import { EmailPreviewModal } from './EmailPreviewModal';
import { AIContentChip } from './AIContentChip';

interface SequenceStepProps {
  step: SequenceStep;
  stepNumber: number;
  onUpdate: (updates: Partial<SequenceStep>) => void;
  onDelete: () => void;
}

export const SequenceStepComponent: React.FC<SequenceStepProps> = ({
  step,
  stepNumber,
  onUpdate,
  onDelete,
}) => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isVariablePickerOpen, setIsVariablePickerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if content contains AI prompt
  const aiPromptMatch = step.content?.match(/\[AI_PROMPT:(.*?)\]/s);
  const hasAIPrompt = !!aiPromptMatch;
  const aiPrompt = aiPromptMatch?.[1] || '';

  // Handle variable insertion
  const handleVariableInsert = useCallback(
    (variable: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = step.content || '';
      const before = text.substring(0, start);
      const after = text.substring(end);

      const newContent = before + variable + after;
      onUpdate({ content: newContent });

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newPosition = start + variable.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);

      setIsVariablePickerOpen(false);
    },
    [step.content, onUpdate],
  );

  // Handle AI prompt confirmation
  const handleAIPromptConfirm = useCallback(
    (prompt: string) => {
      onUpdate({ content: `[AI_PROMPT:${prompt}]` });
      setIsAIAssistantOpen(false);
    },
    [onUpdate],
  );

  // Handle AI prompt edit
  const handleEditAIPrompt = useCallback(() => {
    setIsAIAssistantOpen(true);
  }, []);

  // Handle clear AI prompt
  const handleClearAIPrompt = useCallback(() => {
    onUpdate({ content: '' });
  }, [onUpdate]);

  // Render wait step
  if (step.type === 'wait') {
    return (
      <div className="flex items-start space-x-4">
        {/* Step number badge */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
          {stepNumber}
        </div>

        {/* Wait step content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Wait</span>
              <input
                type="number"
                min="1"
                value={step.waitDays || 1}
                onChange={(e) =>
                  onUpdate({ waitDays: parseInt(e.target.value) || 1 })
                }
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-500">
                {step.waitDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render automated email step
  return (
    <div className="flex items-start space-x-4">
      {/* Step number badge */}
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">
        {stepNumber}
      </div>

      {/* Email step content */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Automated email
          </span>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Subject line */}
        <div className="px-4 py-3 border-b border-gray-200">
          <input
            type="text"
            value={step.subject || ''}
            onChange={(e) => onUpdate({ subject: e.target.value })}
            placeholder="Email subject"
            className="w-full text-sm border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
          />
        </div>

        {/* Email content */}
        <div className="p-4">
          {!step.content && !hasAIPrompt ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <p className="text-sm text-gray-500">
                Start composing your email
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Compose with AI</span>
                </button>
                <button
                  onClick={() => onUpdate({ content: ' ' })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Write manually
                </button>
              </div>
            </div>
          ) : hasAIPrompt ? (
            // AI content chip
            <AIContentChip
              prompt={aiPrompt}
              onEdit={handleEditAIPrompt}
              onClear={handleClearAIPrompt}
            />
          ) : (
            // Manual composition
            <div>
              {/* Toolbar */}
              <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-gray-200">
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                  title="Switch to AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsVariablePickerOpen(!isVariablePickerOpen)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors relative"
                  title="Insert variable"
                >
                  <Braces className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Variable picker dropdown */}
                {isVariablePickerOpen && (
                  <div className="absolute left-0 top-full mt-2 z-10">
                    <VariablePicker onSelect={handleVariableInsert} />
                  </div>
                )}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={step.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Write your email content..."
                className="w-full min-h-[200px] text-sm border-0 focus:outline-none focus:ring-0 resize-none placeholder-gray-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isAIAssistantOpen && (
        <AIAssistant
          initialPrompt={aiPrompt}
          onConfirm={handleAIPromptConfirm}
          onClose={() => setIsAIAssistantOpen(false)}
        />
      )}

      {isPreviewOpen && (
        <EmailPreviewModal
          subject={step.subject || ''}
          content={step.content || ''}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

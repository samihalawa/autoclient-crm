import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import {
  type Sequence,
  type SequenceStep,
  type SequenceStepType,
} from '../types/sequence.types';
import { SequenceStepComponent } from './SequenceStep';
import { v4 as uuidv4 } from 'uuid';

interface SequenceEditorProps {
  sequence: Sequence;
  updateSequence: (updater: (prev: Sequence) => Sequence) => void;
}

export const SequenceEditor: React.FC<SequenceEditorProps> = ({
  sequence,
  updateSequence,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Add new step
  const handleAddStep = useCallback(
    (type: SequenceStepType) => {
      const newStep: SequenceStep = {
        id: uuidv4(),
        type,
        order: sequence.steps.length,
        ...(type === 'wait' ? { waitDays: 1 } : { subject: '', content: '' }),
      };

      updateSequence((prev) => ({
        ...prev,
        steps: [...prev.steps, newStep],
      }));

      setIsAddMenuOpen(false);
    },
    [sequence.steps.length, updateSequence],
  );

  // Update specific step
  const handleUpdateStep = useCallback(
    (stepId: string, updates: Partial<SequenceStep>) => {
      updateSequence((prev) => ({
        ...prev,
        steps: prev.steps.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step,
        ),
      }));
    },
    [updateSequence],
  );

  // Delete step
  const handleDeleteStep = useCallback(
    (stepId: string) => {
      updateSequence((prev) => ({
        ...prev,
        steps: prev.steps
          .filter((step) => step.id !== stepId)
          .map((step, index) => ({ ...step, order: index })),
      }));
    },
    [updateSequence],
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="space-y-4">
        {/* Timeline header */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
            1
          </div>
          <span className="font-medium">Sequence starts</span>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {sequence.steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Timeline connector */}
              {index > 0 && (
                <div className="absolute left-4 top-0 w-0.5 h-6 -mt-4 bg-gray-300" />
              )}

              {/* Step component */}
              <SequenceStepComponent
                step={step}
                stepNumber={index + 2}
                onUpdate={(updates) => handleUpdateStep(step.id, updates)}
                onDelete={() => handleDeleteStep(step.id)}
              />

              {/* Timeline connector to next step */}
              {index < sequence.steps.length - 1 && (
                <div className="absolute left-4 bottom-0 w-0.5 h-6 -mb-6 bg-gray-300" />
              )}
            </div>
          ))}
        </div>

        {/* Add step button */}
        <div className="relative pt-6">
          {sequence.steps.length > 0 && (
            <div className="absolute left-4 top-0 w-0.5 h-6 bg-gray-300" />
          )}

          <div className="relative">
            <button
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add step</span>
            </button>

            {/* Add step menu */}
            {isAddMenuOpen && (
              <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 w-48">
                <button
                  onClick={() => handleAddStep('automated-email')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Automated email
                </button>
                <button
                  onClick={() => handleAddStep('wait')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Wait
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timeline end */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 pt-6">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-medium">
            {sequence.steps.length + 2}
          </div>
          <span className="font-medium">Sequence ends</span>
        </div>
      </div>
    </div>
  );
};

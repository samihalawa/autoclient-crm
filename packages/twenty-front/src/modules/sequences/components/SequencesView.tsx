import { useState, useCallback, useMemo } from 'react';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { type Sequence, type SequenceTab } from '../types/sequence.types';
import { SequenceEditor } from './SequenceEditor';
import { SequenceSettings } from './SequenceSettings';
import { UnpublishedChangesBanner } from './UnpublishedChangesBanner';
import { EnrollRecipientsModal } from './EnrollRecipientsModal';

interface SequencesViewProps {
  initialSequence?: Sequence;
  onSave?: (sequence: Sequence) => Promise<void>;
}

export const SequencesView: React.FC<SequencesViewProps> = ({
  initialSequence,
  onSave,
}) => {
  // Core state management
  const [draft, setDraft] = useState<Sequence | null>(initialSequence || null);
  const [publishedSequence, setPublishedSequence] = useState<Sequence | null>(
    initialSequence ? cloneDeep(initialSequence) : null,
  );
  const [activeTab, setActiveTab] = useState<SequenceTab>('Editor');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Derived state
  const isDirty = useMemo(() => {
    if (!draft || !publishedSequence) return false;
    return !isEqual(draft, publishedSequence);
  }, [draft, publishedSequence]);

  const isNew = useMemo(() => !publishedSequence, [publishedSequence]);

  // Update draft function - passed to child components
  const updateDraft = useCallback((updater: (prev: Sequence) => Sequence) => {
    setDraft((prev) => (prev ? updater(prev) : null));
  }, []);

  // Publish changes
  const handlePublish = useCallback(async () => {
    if (!draft) return;
    const published = cloneDeep(draft);
    setPublishedSequence(published);
    if (onSave !== undefined) {
      await onSave(published);
    }
  }, [draft, onSave]);

  // Discard changes
  const handleDiscard = useCallback(() => {
    if (!publishedSequence) return;
    setDraft(cloneDeep(publishedSequence));
  }, [publishedSequence]);

  // Toggle sequence enabled state
  const handleToggleEnabled = useCallback(() => {
    updateDraft((prev) => ({
      ...prev,
      isEnabled: !prev.isEnabled,
    }));
  }, [updateDraft]);

  if (!draft) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Unpublished Changes Banner */}
      {isDirty && (
        <UnpublishedChangesBanner
          onPublish={handlePublish}
          onDiscard={handleDiscard}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {draft.name || 'Untitled Sequence'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {draft.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Enable sequence toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isEnabled}
                onChange={handleToggleEnabled}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable sequence
              </span>
            </label>

            {/* Enroll recipients button */}
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              disabled={isNew}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isNew
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Enroll recipients
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-6 mt-4 border-b border-gray-200">
          {(['Editor', 'Recipients', 'Settings'] as SequenceTab[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={tab === 'Recipients' && isNew}
                className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${
                  tab === 'Recipients' && isNew
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'Editor' && (
          <SequenceEditor sequence={draft} updateSequence={updateDraft} />
        )}
        {activeTab === 'Recipients' && !isNew && (
          <div className="p-8">
            <h2 className="text-lg font-medium">Recipients</h2>
            <p className="text-gray-500 mt-2">
              View and manage sequence enrollments
            </p>
          </div>
        )}
        {activeTab === 'Settings' && (
          <SequenceSettings
            settings={draft.settings}
            onUpdate={(settings) =>
              updateDraft((prev) => ({
                ...prev,
                settings: { ...(prev.settings || {}), ...settings },
              }))
            }
          />
        )}
      </div>

      {/* Modals */}
      {isEnrollModalOpen && (
        <EnrollRecipientsModal
          sequenceId={draft.id}
          onClose={() => setIsEnrollModalOpen(false)}
          onEnroll={(_recipientIds) => {
            // TODO: Implement actual enrollment logic with backend API
            // console.log('Enrolling recipients in sequence:', {
            //   sequenceId: draft.id,
            //   recipientIds: _recipientIds,
            // });
            setIsEnrollModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

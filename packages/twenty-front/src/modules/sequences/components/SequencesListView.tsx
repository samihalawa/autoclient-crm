import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Sequence, SequenceStatus } from '../types/sequence.types';
import { useState } from 'react';

/**
 * List view for Sequences - shows all sequences with create/edit actions
 * This is the index page for /objects/sequences route
 */
export const SequencesListView = () => {
  const [isCreating, setIsCreating] = useState(false);

  // Fetch sequences from GraphQL
  const { records: sequences, loading, error, refetch } = useFindManyRecords<Sequence>({
    objectNameSingular: 'sequence',
    orderBy: [{ createdAt: 'DescNullsFirst' }],
  });

  // Hook for creating new sequences
  const { createOneRecord: createSequence } = useCreateOneRecord<Sequence>({
    objectNameSingular: 'sequence',
  });

  const handleCreateSequence = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      await createSequence({
        name: 'New Sequence',
        subject: '',
        status: 'draft' as SequenceStatus,
        isDraft: true,
      });
      await refetch();
    } catch (err) {
      console.error('Failed to create sequence:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Loading state
  if (loading && !sequences) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading sequences...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load sequences
          </h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Sequences</h1>
            <p className="text-sm text-gray-500 mt-1">
              Automate email outreach with AI-powered sequences
            </p>
          </div>
          <button
            onClick={handleCreateSequence}
            disabled={isCreating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isCreating ? 'Creating...' : 'New Sequence'}</span>
          </button>
        </div>
      </div>

      {/* Sequences List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {sequences && sequences.map((sequence) => (
            <div
              key={sequence.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {sequence.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sequence.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : sequence.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : sequence.status === 'archived'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sequence.status.charAt(0).toUpperCase() + sequence.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {sequence.subject || 'No subject set'}
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                    <span>Last updated: {new Date(sequence.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {(!sequences || sequences.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No sequences yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first email sequence to start automating outreach
            </p>
            <button
              onClick={handleCreateSequence}
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isCreating ? 'Creating...' : 'Create Sequence'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

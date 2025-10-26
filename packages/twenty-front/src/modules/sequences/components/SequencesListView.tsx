import { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * List view for Sequences - shows all sequences with create/edit actions
 * This is the index page for /objects/sequences route
 */
export const SequencesListView = () => {
  const [sequences] = useState([
    // Mock data for now - will be replaced with GraphQL query
    {
      id: '1',
      name: 'Welcome Email Sequence',
      description: 'Onboarding emails for new users',
      stepsCount: 3,
      isEnabled: true,
      enrolledCount: 45,
    },
  ]);

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
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>New Sequence</span>
          </button>
        </div>
      </div>

      {/* Sequences List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {sequences.map((sequence) => (
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
                        sequence.isEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sequence.isEnabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {sequence.description}
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                    <span>{sequence.stepsCount} steps</span>
                    <span>{sequence.enrolledCount} enrolled</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {sequences.length === 0 && (
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Sequence
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

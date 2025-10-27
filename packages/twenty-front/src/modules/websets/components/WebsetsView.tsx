import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { Plus, Crosshair, Sparkles, Users, Briefcase, Search, Loader2, AlertCircle } from 'lucide-react';
import { Webset, WebsetScope } from '../types/webset.types';
import { useState } from 'react';

/**
 * List view for Websets - shows all websets with criteria and enrichments
 * This is the index page for /objects/websets route
 *
 * Websets are like Attio's lists - you define criteria for finding people/companies,
 * and enrichments for adding data to those results.
 */
export const WebsetsView = () => {
  const [isCreating, setIsCreating] = useState(false);

  // Fetch websets from GraphQL
  const { records: websets, loading, error, refetch } = useFindManyRecords<Webset>({
    objectNameSingular: 'webset',
    orderBy: [{ createdAt: 'DescNullsFirst' }],
  });

  // Hook for creating new websets
  const { createOneRecord: createWebset } = useCreateOneRecord<Webset>({
    objectNameSingular: 'webset',
  });

  const handleCreateWebset = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      await createWebset({
        name: 'New Webset',
        query: '',
        scope: 'company' as WebsetScope,
        depth: 25,
        status: 'idle',
      });
      await refetch();
    } catch (err) {
      console.error('Failed to create webset:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'company':
        return <Briefcase className="w-4 h-4" />;
      case 'person':
        return <Users className="w-4 h-4" />;
      default:
        return <Crosshair className="w-4 h-4" />;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'company':
        return 'Companies';
      case 'person':
        return 'People';
      default:
        return 'Custom';
    }
  };

  // Loading state
  if (loading && !websets) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading websets...</p>
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
            Failed to load websets
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
            <h1 className="text-2xl font-semibold text-gray-900">Websets</h1>
            <p className="text-sm text-gray-500 mt-1">
              Define criteria and enrichments to find and enrich your ideal
              prospects
            </p>
          </div>
          <button
            onClick={handleCreateWebset}
            disabled={isCreating}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>{isCreating ? 'Creating...' : 'New Webset'}</span>
          </button>
        </div>
      </div>

      {/* Websets List */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {websets.map((webset) => (
            <div
              key={webset.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Webset Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {webset.name}
                    </h3>
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {getScopeIcon(webset.scope)}
                      <span>{getScopeLabel(webset.scope)}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{webset.description}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Configure
                </button>
              </div>

              {/* Criteria and Enrichments Bar */}
              <div className="bg-gray-50 rounded-md p-4 space-y-3">
                {/* Criteria */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Criteria
                  </label>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      <Search className="w-3 h-3" />
                      <span>{webset.criteriaCount} criteria</span>
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      + Add
                    </button>
                  </div>
                </div>

                {/* Enrichments */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Enrichments
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                      <Sparkles className="w-3 h-3" />
                      <span>{webset.enrichmentsCount} enrichments</span>
                    </span>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <span className="font-medium">
                    {webset.resultsCount} results
                  </span>
                  <span>Last run {webset.lastRun}</span>
                </div>
                <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Run Search
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!websets || websets.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No websets yet
            </h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">
              Create your first webset to start finding and enriching prospects
              based on custom criteria
            </p>
            <button
              onClick={handleCreateWebset}
              disabled={isCreating}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isCreating ? 'Creating...' : 'Create Webset'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

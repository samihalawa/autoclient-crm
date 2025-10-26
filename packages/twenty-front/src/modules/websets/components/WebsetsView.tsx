import { useState } from 'react';
import { Plus, Crosshair, Sparkles, Users, Briefcase, Search } from 'lucide-react';

/**
 * List view for Websets - shows all websets with criteria and enrichments
 * This is the index page for /objects/websets route
 *
 * Websets are like Attio's lists - you define criteria for finding people/companies,
 * and enrichments for adding data to those results.
 */
export const WebsetsView = () => {
  const [websets] = useState([
    // Mock data for now - will be replaced with GraphQL query
    {
      id: '1',
      name: 'AI Startups in SF',
      description: 'Recently funded AI companies in San Francisco',
      scope: 'company',
      criteriaCount: 3,
      enrichmentsCount: 5,
      resultsCount: 42,
      lastRun: '2 hours ago',
    },
    {
      id: '2',
      name: 'VP of Sales Contacts',
      description: 'Sales leaders in enterprise SaaS companies',
      scope: 'person',
      criteriaCount: 2,
      enrichmentsCount: 3,
      resultsCount: 128,
      lastRun: '1 day ago',
    },
  ]);

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
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>New Webset</span>
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
        {websets.length === 0 && (
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Webset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState, useCallback } from 'react';
import { X, Search, UserPlus, Users, CheckCircle2 } from 'lucide-react';

interface EnrollRecipientsModalProps {
  sequenceId: string;
  onClose: () => void;
  onEnroll: (recipientIds: string[]) => void;
}

// Mock recipient data - in production this would come from Twenty CRM's Person objects
interface Recipient {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
}

const MOCK_RECIPIENTS: Recipient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    company: 'Acme Corp',
    title: 'VP of Sales',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@techco.com',
    company: 'TechCo',
    title: 'CTO',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@startup.io',
    company: 'Startup Inc',
    title: 'CEO',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.w@enterprise.com',
    company: 'Enterprise LLC',
    title: 'Director of Marketing',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@innovate.co',
    company: 'Innovate Co',
    title: 'Product Manager',
  },
];

export const EnrollRecipientsModal: React.FC<EnrollRecipientsModalProps> = ({
  sequenceId: _sequenceId,
  onClose,
  onEnroll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(
    new Set(),
  );

  // Filter recipients based on search query
  const filteredRecipients = MOCK_RECIPIENTS.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Toggle recipient selection
  const handleToggleRecipient = useCallback((recipientId: string) => {
    setSelectedRecipients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recipientId)) {
        newSet.delete(recipientId);
      } else {
        newSet.add(recipientId);
      }
      return newSet;
    });
  }, []);

  // Select all filtered recipients
  const handleSelectAll = useCallback(() => {
    const allIds = new Set(filteredRecipients.map((r) => r.id));
    setSelectedRecipients(allIds);
  }, [filteredRecipients]);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedRecipients(new Set());
  }, []);

  // Handle enrollment
  const handleEnroll = useCallback(() => {
    if (selectedRecipients.size === 0) return;
    onEnroll(Array.from(selectedRecipients));
  }, [selectedRecipients, onEnroll]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Enroll Recipients
              </h2>
              <p className="text-sm text-gray-500">
                Select people to add to this sequence
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

        {/* Search and selection controls */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Selection controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>
                {selectedRecipients.size} of {filteredRecipients.length}{' '}
                selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                disabled={filteredRecipients.length === 0}
                className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Select all
              </button>
              <button
                onClick={handleClearAll}
                disabled={selectedRecipients.size === 0}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Recipients list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {filteredRecipients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="w-12 h-12 mb-3" />
              <p className="text-sm">
                {searchQuery
                  ? 'No recipients found'
                  : 'No recipients available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecipients.map((recipient) => {
                const isSelected = selectedRecipients.has(recipient.id);
                return (
                  <button
                    key={recipient.id}
                    onClick={() => handleToggleRecipient(recipient.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {recipient.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {recipient.name}
                            </p>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {recipient.email}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {recipient.title} at {recipient.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedRecipients.size === 0
              ? 'Select recipients to enroll'
              : `${selectedRecipients.size} recipient${
                  selectedRecipients.size === 1 ? '' : 's'
                } will be enrolled`}
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEnroll}
              disabled={selectedRecipients.size === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Enroll Recipients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

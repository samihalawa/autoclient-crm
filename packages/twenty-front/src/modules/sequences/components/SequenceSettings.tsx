import { useCallback } from 'react';
import {
  Clock,
  Mail,
  Calendar,
  Link as LinkIcon,
  LogOut,
  Info,
} from 'lucide-react';
import {
  type SequenceSettings as SequenceSettingsType,
  type SequenceExitCriteria,
} from '../types/sequence.types';

interface SequenceSettingsProps {
  settings?: SequenceSettingsType;
  onUpdate: (settings: Partial<SequenceSettingsType>) => void;
}

const EXIT_CRITERIA_OPTIONS: {
  value: SequenceExitCriteria;
  label: string;
  description: string;
}[] = [
  {
    value: 'Replied',
    label: 'Recipient replied',
    description:
      'Stop when recipient sends a reply to any email in the sequence',
  },
  {
    value: 'Opened',
    label: 'Recipient opened email',
    description: 'Stop when recipient opens any email in the sequence',
  },
  {
    value: 'Clicked',
    label: 'Recipient clicked link',
    description: 'Stop when recipient clicks a link in any email',
  },
  {
    value: 'Bounced',
    label: 'Email bounced',
    description: 'Stop when an email bounces (hard or soft bounce)',
  },
  {
    value: 'Unsubscribed',
    label: 'Recipient unsubscribed',
    description: 'Stop when recipient clicks the unsubscribe link',
  },
];

const TIMEZONE_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
];

export const SequenceSettings: React.FC<SequenceSettingsProps> = ({
  settings,
  onUpdate,
}) => {
  // Default settings if none provided
  const currentSettings: SequenceSettingsType = settings || {
    businessDaysOnly: true,
    threadEmails: true,
    sendingWindow: undefined,
    unsubscribeLink: undefined,
    exitCriteria: ['Replied', 'Unsubscribed', 'Bounced'],
  };

  // Handle exit criteria toggle
  const handleExitCriteriaToggle = useCallback(
    (criteria: SequenceExitCriteria) => {
      const current = currentSettings.exitCriteria || [];
      const updated = current.includes(criteria)
        ? current.filter((c) => c !== criteria)
        : [...current, criteria];
      onUpdate({ exitCriteria: updated });
    },
    [currentSettings.exitCriteria, onUpdate],
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* General Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            General Settings
          </h3>
        </div>

        <div className="space-y-4">
          {/* Business days only */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSettings.businessDaysOnly}
                  onChange={(e) =>
                    onUpdate({ businessDaysOnly: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Send on business days only
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Skip weekends when calculating wait times between steps
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Thread emails */}
          <div className="flex items-start justify-between pt-4 border-t border-gray-200">
            <div className="flex-1">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSettings.threadEmails}
                  onChange={(e) => onUpdate({ threadEmails: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Thread emails together
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Group all emails in the sequence into a single thread
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sending Window */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Sending Window
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Define when emails in this sequence can be sent
          </p>

          <div className="grid grid-cols-3 gap-4">
            {/* Start time */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Start time
              </label>
              <input
                type="time"
                value={currentSettings.sendingWindow?.start || '09:00'}
                onChange={(e) =>
                  onUpdate({
                    sendingWindow: {
                      start: e.target.value,
                      end: currentSettings.sendingWindow?.end || '17:00',
                      timezone:
                        currentSettings.sendingWindow?.timezone ||
                        'America/New_York',
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* End time */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                End time
              </label>
              <input
                type="time"
                value={currentSettings.sendingWindow?.end || '17:00'}
                onChange={(e) =>
                  onUpdate({
                    sendingWindow: {
                      start: currentSettings.sendingWindow?.start || '09:00',
                      end: e.target.value,
                      timezone:
                        currentSettings.sendingWindow?.timezone ||
                        'America/New_York',
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                value={
                  currentSettings.sendingWindow?.timezone || 'America/New_York'
                }
                onChange={(e) =>
                  onUpdate({
                    sendingWindow: {
                      start: currentSettings.sendingWindow?.start || '09:00',
                      end: currentSettings.sendingWindow?.end || '17:00',
                      timezone: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Unsubscribe Link */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <LinkIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Unsubscribe Link
          </h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Add an unsubscribe link to emails in this sequence
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Unsubscribe URL
            </label>
            <input
              type="url"
              value={currentSettings.unsubscribeLink || ''}
              onChange={(e) => onUpdate({ unsubscribeLink: e.target.value })}
              placeholder="https://yourcompany.com/unsubscribe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              This link will be automatically added to the footer of all emails
            </p>
          </div>
        </div>
      </div>

      {/* Exit Criteria */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <LogOut className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Exit Criteria</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-900">
              Select conditions that will automatically remove a recipient from
              this sequence
            </p>
          </div>

          <div className="space-y-3">
            {EXIT_CRITERIA_OPTIONS.map((option) => {
              const isSelected = currentSettings.exitCriteria?.includes(
                option.value,
              );
              return (
                <div
                  key={option.value}
                  className={`border rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleExitCriteriaToggle(option.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {option.label}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Help text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              About Sequence Settings
            </h4>
            <p className="text-xs text-gray-600">
              These settings control how and when emails are sent in this
              sequence. Changes to settings only affect new enrollments and
              future emails. Recipients already in the sequence will continue
              with their current settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

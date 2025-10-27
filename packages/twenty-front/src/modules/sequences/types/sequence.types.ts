export type SequenceStepType = 'automated-email' | 'wait';

export type SequenceExitCriteria =
  | 'Bounced'
  | 'Unsubscribed'
  | 'Replied'
  | 'Opened'
  | 'Clicked';

export interface SequenceStep {
  id: string;
  type: SequenceStepType;
  order: number;
  // For wait steps
  waitDays?: number;
  // For automated-email steps
  subject?: string;
  content?: string; // Can contain plain text, variables, or AI prompt format
}

export interface SequenceSettings {
  businessDaysOnly: boolean;
  threadEmails: boolean;
  sendingWindow?: {
    start: string;
    end: string;
    timezone: string;
  };
  unsubscribeLink?: string;
  exitCriteria: SequenceExitCriteria[];
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  steps: SequenceStep[];
  settings: SequenceSettings;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SequenceTab = 'Editor' | 'Recipients' | 'Settings';

export interface VariableOption {
  label: string;
  value: string;
  children?: VariableOption[];
}

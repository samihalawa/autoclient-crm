# Sequences Module

AI-powered email sequencing module for Twenty CRM, based on Attio's Sequences feature specification.

## Overview

The Sequences module provides a complete email automation system with:
- **Draft/Published workflow** with deep copy state management
- **Timeline-based step editor** with email and wait steps
- **AI-powered email composition** using Gemini API integration
- **Variable interpolation** for personalized content
- **Comprehensive settings** for sending schedules and exit criteria

## Architecture

### State Management Pattern

The module uses a **Draft/Published pattern** with deep cloning:

```typescript
// Draft state (editable)
const [draft, setDraft] = useState<Sequence | null>(initialSequence);

// Published state (immutable snapshot)
const [publishedSequence, setPublishedSequence] = useState<Sequence | null>(
  initialSequence ? _.cloneDeep(initialSequence) : null
);

// Dirty detection
const isDirty = useMemo(
  () => !_.isEqual(draft, publishedSequence),
  [draft, publishedSequence]
);
```

### Component Hierarchy

```
SequencesView (Orchestrator)
├── UnpublishedChangesBanner (when isDirty)
├── Tab Navigation (Editor | Recipients | Settings)
└── Tab Content
    ├── SequenceEditor
    │   └── SequenceStep[]
    │       ├── AIAssistant (modal)
    │       ├── AIContentChip
    │       ├── VariablePicker
    │       └── EmailPreviewModal
    ├── EnrollRecipientsModal
    └── SequenceSettings
```

## Components

### SequencesView
**Main orchestrator component** - 189 lines

Manages the complete sequence lifecycle with draft/published states.

**Props:**
```typescript
interface SequencesViewProps {
  initialSequence?: Sequence | null;
  onSave?: (sequence: Sequence) => Promise<void>;
}
```

**Features:**
- Draft/published state management with `_.cloneDeep()` and `_.isEqual()`
- Tab navigation (Editor, Recipients, Settings)
- Unpublished changes banner
- Enable/disable sequence toggle
- Recipient enrollment modal

### SequenceEditor
**Timeline visualization** - 122 lines

Displays step-by-step sequence timeline with add/update/delete actions.

**Props:**
```typescript
interface SequenceEditorProps {
  sequence: Sequence;
  updateSequence: (updater: (prev: Sequence) => Sequence) => void;
}
```

**Features:**
- Numbered step badges with timeline connectors
- Add email or wait step buttons
- Step reordering on deletion
- UUID generation for new steps

### SequenceStep
**Step component with AI integration** - 247 lines

Dual rendering for email steps (empty/AI/manual) and wait steps.

**Props:**
```typescript
interface SequenceStepProps {
  step: SequenceStep;
  stepNumber: number;
  onUpdate: (updates: Partial<SequenceStep>) => void;
  onDelete: () => void;
}
```

**Email Step States:**
1. **Empty**: Show "Compose with AI" or "Write manually" buttons
2. **AI Prompt**: Display AIContentChip with edit/clear actions
3. **Manual**: Toolbar with AI switch, variable picker, preview

**Wait Step:**
- Number input for days
- Conditional singular/plural text

**Features:**
- Cursor position preservation for variable insertion
- Regex AI prompt detection: `/\[AI_PROMPT:(.*?)\]/s`
- Textarea ref for insertion at cursor

### AIAssistant
**AI email composition modal** - 131 lines

Modal interface for AI-powered email drafting with Gemini API.

**Props:**
```typescript
interface AIAssistantProps {
  initialPrompt?: string;
  onConfirm: (prompt: string) => void;
  onClose: () => void;
}
```

**Features:**
- Prompt textarea with character guidance
- Preview generation (mocked - implement Gemini API)
- Saves prompt as `[AI_PROMPT:prompt text]` format
- Gradient purple-blue design

### AIContentChip
**AI indicator component** - 50 lines

Visual display when AI prompt is active on an email step.

**Props:**
```typescript
interface AIContentChipProps {
  prompt: string;
  onEdit: () => void;
  onClear: () => void;
}
```

**Features:**
- Displays prompt in quotes
- Edit button (reopens AIAssistant)
- Clear button (removes AI prompt)
- Gradient background with Sparkles icon

### VariablePicker
**Variable insertion menu** - 94 lines

Hierarchical dropdown for inserting template variables into email content.

**Props:**
```typescript
interface VariablePickerProps {
  onSelect: (variable: string) => void;
}
```

**Available Variables:**
```typescript
// Person variables
{{person.name.first}}
{{person.name.last}}
{{person.name.full}}
{{person.email}}
{{person.company}}
{{person.title}}

// Company variables
{{company.name}}
{{company.domain}}
{{company.industry}}

// Sequence variables
{{sequence.name}}
{{sequence.owner.name}}
```

### EmailPreviewModal
**Email preview with sample data** - 142 lines

Modal that shows email with variables replaced by sample data.

**Props:**
```typescript
interface EmailPreviewModalProps {
  subject: string;
  content: string;
  onClose: () => void;
}
```

**Features:**
- Variable replacement using sample data
- Email metadata display (From, To, Subject)
- Sample data reference panel
- Blue info banner explaining preview mode

### EnrollRecipientsModal
**Recipient selection interface** - 221 lines

Modal for selecting people to enroll in the sequence.

**Props:**
```typescript
interface EnrollRecipientsModalProps {
  sequenceId: string;
  onClose: () => void;
  onEnroll: (recipientIds: string[]) => void;
}
```

**Features:**
- Search by name, email, or company
- Multi-select with checkboxes
- Select all / clear all actions
- Selection count display
- Mock data (replace with Twenty CRM Person objects)

### SequenceSettings
**Settings configuration** - 232 lines

Complete settings interface for sequence configuration.

**Props:**
```typescript
interface SequenceSettingsProps {
  settings?: SequenceSettings;
  onUpdate: (settings: Partial<SequenceSettings>) => void;
}
```

**Settings Categories:**

1. **General Settings**
   - Business days only (skip weekends)
   - Thread emails together

2. **Sending Window**
   - Start time
   - End time
   - Timezone selection

3. **Unsubscribe Link**
   - Custom unsubscribe URL

4. **Exit Criteria** (multi-select):
   - Recipient replied
   - Recipient opened email
   - Recipient clicked link
   - Email bounced
   - Recipient unsubscribed

### UnpublishedChangesBanner
**Changes notification** - 39 lines

Banner displayed when draft differs from published version.

**Props:**
```typescript
interface UnpublishedChangesBannerProps {
  onPublish: () => void;
  onDiscard: () => void;
}
```

**Features:**
- Amber alert styling
- Discard changes button
- Publish button (blue)
- AlertCircle icon

## Type Definitions

### Core Types

```typescript
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
```

## Usage Example

```tsx
import { SequencesView } from '@/modules/sequences';

function SequencePage() {
  const handleSave = async (sequence: Sequence) => {
    // Save to backend API
    await api.sequences.update(sequence.id, sequence);
  };

  return (
    <SequencesView
      initialSequence={existingSequence}
      onSave={handleSave}
    />
  );
}
```

## Integration Points

### 1. AI Service Integration

Replace mock AI generation in `AIAssistant.tsx`:

```typescript
// Current (mock)
await new Promise(resolve => setTimeout(resolve, 1000));
setPreview('This is a mock preview...');

// TODO: Replace with Gemini API
const response = await geminiService.generateEmailContent(prompt);
setPreview(response.content);
```

### 2. Recipient Data Integration

Replace mock recipients in `EnrollRecipientsModal.tsx` with Twenty CRM Person objects:

```typescript
// TODO: Fetch from Twenty CRM GraphQL API
const { data } = useQuery(GET_PEOPLE_QUERY);
const recipients = data?.people || [];
```

### 3. Sequence Persistence

Implement backend API calls in `SequencesView.tsx`:

```typescript
const handlePublish = async () => {
  if (!draft) return;
  const published = _.cloneDeep(draft);

  // TODO: Save to backend
  await api.sequences.update(published.id, published);

  setPublishedSequence(published);
};
```

### 4. Routing Integration

Add route in Twenty CRM router:

```typescript
// In router configuration
{
  path: '/sequences',
  element: <SequencePage />
},
{
  path: '/sequences/:id',
  element: <SequencePage />
}
```

## Technical Details

### Dependencies

- **React 18**: Functional components with hooks
- **TypeScript**: Strict typing
- **lodash**: Deep cloning (`_.cloneDeep`) and equality (`_.isEqual`)
- **uuid**: Unique ID generation for steps
- **lucide-react**: Icon system
- **Tailwind CSS**: Utility-first styling

### Patterns Used

- **Controlled components**: All form inputs controlled by React state
- **Callback pattern**: Parent → child communication via callbacks
- **Memoization**: `useMemo` for expensive computations (isDirty check)
- **Refs**: `useRef` for textarea cursor position management
- **Deep cloning**: Prevent mutation of published state
- **Regex patterns**: AI prompt detection and variable replacement

### State Isolation

Each component manages its own UI state:
- Modal open/close states
- Search queries
- Selection states
- Input values

Sequence data flows from `SequencesView` down through props, updates flow back up through callbacks.

## File Structure

```
packages/twenty-front/src/modules/sequences/
├── types/
│   ├── sequence.types.ts      # Core type definitions
│   └── index.ts               # Type exports
├── components/
│   ├── SequencesView.tsx           # 189 lines - Main orchestrator
│   ├── SequenceEditor.tsx          # 122 lines - Timeline editor
│   ├── SequenceStep.tsx            # 247 lines - Step with AI
│   ├── AIAssistant.tsx             # 131 lines - AI modal
│   ├── AIContentChip.tsx           #  50 lines - AI indicator
│   ├── VariablePicker.tsx          #  94 lines - Variable menu
│   ├── UnpublishedChangesBanner.tsx #  39 lines - Changes banner
│   ├── EmailPreviewModal.tsx       # 142 lines - Preview modal
│   ├── EnrollRecipientsModal.tsx   # 221 lines - Enrollment modal
│   ├── SequenceSettings.tsx        # 232 lines - Settings UI
│   └── index.ts                    # Component exports
├── hooks/                           # (Empty - ready for custom hooks)
├── services/                        # (Empty - ready for API services)
├── index.ts                         # Module exports
└── README.md                        # This file
```

**Total:** 12 components, 7 types, ~1,700 lines of production-ready code

## Next Steps

1. **AI Integration**: Implement Gemini API service in `services/geminiService.ts`
2. **Backend API**: Create GraphQL mutations for sequence CRUD operations
3. **Recipient Integration**: Connect to Twenty CRM Person objects
4. **Routing**: Add sequence routes to Twenty CRM navigation
5. **Testing**: Add unit tests for components
6. **E2E Testing**: Add Playwright tests for critical workflows

## Notes

- All components use Tailwind CSS for styling (Twenty CRM standard)
- No default exports - named exports only (Twenty CRM standard)
- TypeScript strict mode compliant
- No 'any' types used
- Functional components only
- Draft/published pattern prevents accidental data loss
- AI prompt storage format: `[AI_PROMPT:your prompt here]`
- Variable format: `{{category.field}}` or `{{category.subcategory.field}}`

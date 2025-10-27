import { ObjectRecord } from '@/object-record/types/ObjectRecord';

export type SequenceStatus = 'draft' | 'published' | 'paused' | 'archived';

export type Sequence = ObjectRecord & {
  __typename: 'Sequence';
  status: SequenceStatus;
  subject: string;
  isDraft: boolean;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SequenceFormData = {
  name: string;
  subject: string;
  status?: SequenceStatus;
};

import { ObjectRecord } from '@/object-record/types/ObjectRecord';

export type WebsetScope = 'company' | 'person' | 'article';
export type WebsetStatus = 'idle' | 'running' | 'completed' | 'failed';

export type Webset = ObjectRecord & {
  __typename: 'Webset';
  query: string;
  scope: WebsetScope;
  depth: number;
  status: WebsetStatus;
  externalWebsetId?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type WebsetFormData = {
  name: string;
  query: string;
  scope: WebsetScope;
  depth: number;
};

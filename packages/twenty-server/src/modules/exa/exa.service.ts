import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CreateWebsetInput {
  title: string;
}

export interface CreateSearchInput {
  query: string;
  count?: number;
  entity?: { type: 'company' | 'person' | 'article'; description?: string };
  criteria?: Array<{ description: string }>;
  recall?: boolean;
  behavior?: 'override' | 'append';
  exclude?: Array<{ source: 'import' | 'webset'; id: string }>;
  metadata?: Record<string, string>;
}

export interface CreateEnrichmentInput {
  description: string;
  format?: 'text' | 'date' | 'number' | 'options' | 'email' | 'phone';
  options?: Array<{ label: string }>;
  instructions?: string;
  metadata?: Record<string, string>;
}

export interface ExaWebsetSearch {
  id: string;
  object: 'webset_search';
  status: 'created' | 'running' | 'completed' | 'canceled';
  query: string;
  progress?: {
    found: number;
    analyzed: number;
    completion: number;
    timeLeft: number | null;
  };
}

export interface ExaWebsetItem {
  id: string;
  object: 'webset_item';
  source: 'search' | 'import';
  sourceId: string;
  websetId: string;
  properties: {
    type: 'company' | 'person' | 'article';
    url: string;
    description: string;
    content?: string;
    company?: {
      name: string;
      location?: string;
      employees?: number;
      industry?: string;
      about?: string;
      logoUrl?: string;
    };
    person?: {
      name: string;
      location?: string;
      position?: string;
      company?: { name: string; location?: string };
      pictureUrl?: string;
    };
  };
  evaluations?: Array<{
    criterion: string;
    reasoning: string;
    satisfied: 'yes' | 'no' | 'unclear';
  }>;
  enrichments?: Array<{
    object: 'enrichment_result';
    status: 'pending' | 'completed' | 'canceled';
    format: 'text' | 'date' | 'number' | 'options' | 'email' | 'phone';
    result?: string[];
    reasoning?: string;
    enrichmentId: string;
  }>;
}

export interface ExaWebset {
  id: string;
  object: 'webset';
  status: 'idle' | 'running' | 'paused';
  title?: string;
  name?: string;
  searches: ExaWebsetSearch[];
  enrichments: any[];
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ExaService {
  private readonly logger = new Logger(ExaService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.exa.ai/websets/v0';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('EXA_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.warn('EXA_API_KEY not configured - Exa integration will not work');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Exa API key is not configured');
    }

    const fullUrl = `${this.baseUrl}/${endpoint}`;

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
      } catch (e) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }
      const message = errorBody.message || errorBody.detail || errorBody.error || JSON.stringify(errorBody);
      throw new Error(String(message));
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as T;
  }

  async createWebset(input: CreateWebsetInput): Promise<ExaWebset> {
    this.logger.log(`Creating webset: ${input.title}`);
    return this.request<ExaWebset>('websets', {
      method: 'POST',
      body: JSON.stringify({ title: input.title }),
    });
  }

  async listWebsets(cursor?: string, limit = 50): Promise<{ data: ExaWebset[]; hasMore: boolean; nextCursor?: string }> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', String(limit));

    const query = params.toString();
    const response = await this.request<any>(`websets${query ? `?${query}` : ''}`);

    // Handle different response formats
    if (Array.isArray(response)) {
      return { data: response, hasMore: false };
    }

    if (response.data && Array.isArray(response.data)) {
      return {
        data: response.data,
        hasMore: response.hasMore || !!response.nextCursor,
        nextCursor: response.nextCursor,
      };
    }

    return { data: [], hasMore: false };
  }

  async getWebset(websetId: string, expand?: string[]): Promise<ExaWebset> {
    const params = new URLSearchParams();
    expand?.forEach(e => params.append('expand', e));

    const query = params.toString();
    return this.request<ExaWebset>(`websets/${websetId}${query ? `?${query}` : ''}`);
  }

  async createSearch(websetId: string, input: CreateSearchInput): Promise<ExaWebsetSearch> {
    this.logger.log(`Creating search for webset ${websetId}`);
    return this.request<ExaWebsetSearch>(`websets/${websetId}/searches`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getSearch(websetId: string, searchId: string): Promise<ExaWebsetSearch> {
    return this.request<ExaWebsetSearch>(`websets/${websetId}/searches/${searchId}`);
  }

  async listWebsetItems(
    websetId: string,
    cursor?: string,
    limit = 100,
  ): Promise<{ data: ExaWebsetItem[]; hasMore: boolean; nextCursor?: string }> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', String(limit));

    const query = params.toString();
    return this.request<{ data: ExaWebsetItem[]; hasMore: boolean; nextCursor?: string }>(
      `websets/${websetId}/items${query ? `?${query}` : ''}`,
    );
  }

  async createEnrichment(websetId: string, input: CreateEnrichmentInput): Promise<any> {
    this.logger.log(`Creating enrichment for webset ${websetId}`);
    return this.request(`websets/${websetId}/enrichments`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  /**
   * Helper method to run a search and poll until completion
   */
  async runSearchAndPoll(
    websetId: string,
    searchInput: CreateSearchInput,
    progressCallback?: (progress: ExaWebsetSearch['progress']) => void,
    maxAttempts = 30,
  ): Promise<ExaWebsetItem[]> {
    const search = await this.createSearch(websetId, searchInput);

    let currentSearch = search;
    let attempts = 0;

    while (
      (currentSearch.status === 'created' || currentSearch.status === 'running') &&
      attempts < maxAttempts
    ) {
      await new Promise(res => setTimeout(res, 2000)); // Wait 2 seconds
      currentSearch = await this.getSearch(websetId, currentSearch.id);

      if (currentSearch.progress && progressCallback) {
        progressCallback(currentSearch.progress);
      }

      attempts++;
    }

    if (currentSearch.status === 'canceled') {
      throw new Error('Search was canceled');
    }

    if (attempts >= maxAttempts) {
      throw new Error('Search timed out');
    }

    // Fetch all items
    const items: ExaWebsetItem[] = [];
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const page = await this.listWebsetItems(websetId, cursor, 100);
      items.push(...page.data);
      cursor = page.nextCursor;
      hasMore = page.hasMore;
    }

    return items;
  }
}

import { Controller, Post, Get, Body, Param, Query, Logger } from '@nestjs/common';
import { ExaService, CreateWebsetInput, CreateSearchInput, CreateEnrichmentInput } from './exa.service';
import { ExaObjectsInitializer } from './setup/initialize-exa-objects';

@Controller('integration/exa')
export class ExaController {
  private readonly logger = new Logger(ExaController.name);

  constructor(
    private readonly exaService: ExaService,
    private readonly exaObjectsInitializer: ExaObjectsInitializer,
  ) {}

  @Post('websets')
  async createWebset(@Body() input: CreateWebsetInput) {
    this.logger.log(`Creating webset: ${input.title}`);
    return this.exaService.createWebset(input);
  }

  @Get('websets')
  async listWebsets(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.exaService.listWebsets(cursor, limitNum);
  }

  @Get('websets/:websetId')
  async getWebset(
    @Param('websetId') websetId: string,
    @Query('expand') expand?: string,
  ) {
    const expandArray = expand ? expand.split(',') : undefined;
    return this.exaService.getWebset(websetId, expandArray);
  }

  @Post('websets/:websetId/searches')
  async createSearch(
    @Param('websetId') websetId: string,
    @Body() input: CreateSearchInput,
  ) {
    this.logger.log(`Creating search for webset ${websetId}`);
    return this.exaService.createSearch(websetId, input);
  }

  @Get('websets/:websetId/searches/:searchId')
  async getSearch(
    @Param('websetId') websetId: string,
    @Param('searchId') searchId: string,
  ) {
    return this.exaService.getSearch(websetId, searchId);
  }

  @Get('websets/:websetId/items')
  async listWebsetItems(
    @Param('websetId') websetId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.exaService.listWebsetItems(websetId, cursor, limitNum);
  }

  @Post('websets/:websetId/enrichments')
  async createEnrichment(
    @Param('websetId') websetId: string,
    @Body() input: CreateEnrichmentInput,
  ) {
    this.logger.log(`Creating enrichment for webset ${websetId}`);
    return this.exaService.createEnrichment(websetId, input);
  }

  @Post('websets/:websetId/search-and-poll')
  async runSearchAndPoll(
    @Param('websetId') websetId: string,
    @Body() searchInput: CreateSearchInput,
  ) {
    this.logger.log(`Running search and poll for webset ${websetId}`);

    // Note: In a real implementation, this should use WebSockets or Server-Sent Events
    // for real-time progress updates. For now, we'll return the final results.
    return this.exaService.runSearchAndPoll(websetId, searchInput);
  }

  @Post('setup/initialize')
  async initializeCustomObjects(@Body('workspaceId') workspaceId: string) {
    this.logger.log(`Initializing Exa custom objects for workspace ${workspaceId}`);

    if (!workspaceId) {
      throw new Error('workspaceId is required');
    }

    try {
      await this.exaObjectsInitializer.initialize(workspaceId);
      return {
        success: true,
        message: 'Exa custom objects initialized successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to initialize custom objects: ${error.message}`);
      throw error;
    }
  }
}

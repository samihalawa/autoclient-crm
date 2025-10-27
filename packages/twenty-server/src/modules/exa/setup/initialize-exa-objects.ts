import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldMetadataType } from 'twenty-shared/types';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';

interface CustomObjectDefinition {
  displayName: string;
  pluralName: string;
  apiName: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: FieldMetadataType;
    description?: string;
    options?: any;
    defaultValue?: any;
  }>;
}

@Injectable()
export class ExaObjectsInitializer {
  private readonly logger = new Logger(ExaObjectsInitializer.name);

  constructor(
    @InjectRepository(ObjectMetadataEntity, 'metadata')
    private objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectRepository(FieldMetadataEntity, 'metadata')
    private fieldMetadataRepository: Repository<FieldMetadataEntity>,
  ) {}

  async initialize(workspaceId: string): Promise<void> {
    this.logger.log(`Initializing Exa custom objects for workspace ${workspaceId}`);

    const customObjects: CustomObjectDefinition[] = [
      {
        displayName: 'Webset',
        pluralName: 'Websets',
        apiName: 'websets',
        description: 'AI-powered prospect discovery campaigns using Exa websets',
        fields: [
          { name: 'query', label: 'Search Query', type: FieldMetadataType.TEXT, description: 'The search query for finding prospects' },
          { name: 'scope', label: 'Scope', type: FieldMetadataType.SELECT, description: 'Entity type to search for', options: ['company', 'person', 'article'] },
          { name: 'depth', label: 'Depth', type: FieldMetadataType.NUMBER, description: 'Number of results to find', defaultValue: 25 },
          { name: 'status', label: 'Status', type: FieldMetadataType.SELECT, description: 'Current status', options: ['idle', 'running', 'completed', 'failed'] },
          { name: 'externalWebsetId', label: 'Exa Webset ID', type: FieldMetadataType.TEXT, description: 'External Exa webset identifier' },
        ],
      },
      {
        displayName: 'Prospect',
        pluralName: 'Prospects',
        apiName: 'prospects',
        description: 'AI-discovered prospects from Exa websets',
        fields: [
          { name: 'websetId', label: 'Webset', type: FieldMetadataType.RELATION, description: 'Parent webset' },
          { name: 'externalItemId', label: 'Exa Item ID', type: FieldMetadataType.TEXT, description: 'External Exa item identifier' },
          { name: 'entityType', label: 'Type', type: FieldMetadataType.SELECT, options: ['company', 'person'] },
          { name: 'url', label: 'URL', type: FieldMetadataType.LINKS, description: 'Prospect website or profile URL' },
          { name: 'description', label: 'Description', type: FieldMetadataType.TEXT, description: 'AI-generated description' },
          { name: 'companyName', label: 'Company Name', type: FieldMetadataType.TEXT },
          { name: 'companyLocation', label: 'Company Location', type: FieldMetadataType.TEXT },
          { name: 'companyEmployees', label: 'Company Employees', type: FieldMetadataType.NUMBER },
          { name: 'companyIndustry', label: 'Company Industry', type: FieldMetadataType.TEXT },
          { name: 'companyLogoUrl', label: 'Company Logo', type: FieldMetadataType.LINKS },
          { name: 'personName', label: 'Person Name', type: FieldMetadataType.TEXT },
          { name: 'personLocation', label: 'Person Location', type: FieldMetadataType.TEXT },
          { name: 'personPosition', label: 'Person Position', type: FieldMetadataType.TEXT },
          { name: 'personCompany', label: 'Person Company', type: FieldMetadataType.TEXT },
          { name: 'personPictureUrl', label: 'Person Picture', type: FieldMetadataType.LINKS },
          { name: 'qualityScore', label: 'Quality Score', type: FieldMetadataType.NUMBER, description: '0-100 match quality' },
          { name: 'importStatus', label: 'Import Status', type: FieldMetadataType.SELECT, options: ['pending', 'imported', 'skipped'] },
          { name: 'importedPersonId', label: 'Imported Person', type: FieldMetadataType.RELATION, description: 'Linked CRM person record' },
          { name: 'importedCompanyId', label: 'Imported Company', type: FieldMetadataType.RELATION, description: 'Linked CRM company record' },
          { name: 'enrichmentData', label: 'Enrichment Data', type: FieldMetadataType.RAW_JSON, description: 'Additional enrichment results' },
        ],
      },
      {
        displayName: 'Sequence',
        pluralName: 'Sequences',
        apiName: 'sequences',
        description: 'Automated email outreach sequences',
        fields: [
          { name: 'status', label: 'Status', type: FieldMetadataType.SELECT, options: ['draft', 'published', 'paused', 'archived'], defaultValue: 'draft' },
          { name: 'subject', label: 'Email Subject', type: FieldMetadataType.TEXT },
          { name: 'isDraft', label: 'Is Draft', type: FieldMetadataType.BOOLEAN, defaultValue: true },
        ],
      },
      {
        displayName: 'Sequence Step',
        pluralName: 'Sequence Steps',
        apiName: 'sequenceSteps',
        description: 'Individual steps in an email sequence',
        fields: [
          { name: 'sequenceId', label: 'Sequence', type: FieldMetadataType.RELATION },
          { name: 'order', label: 'Order', type: FieldMetadataType.NUMBER },
          { name: 'delayDays', label: 'Delay (Days)', type: FieldMetadataType.NUMBER },
          { name: 'subject', label: 'Subject', type: FieldMetadataType.TEXT },
          { name: 'body', label: 'Email Body', type: FieldMetadataType.TEXT },
          { name: 'aiPrompt', label: 'AI Prompt', type: FieldMetadataType.TEXT, description: 'Prompt for AI content generation' },
        ],
      },
      {
        displayName: 'Sequence Enrollment',
        pluralName: 'Sequence Enrollments',
        apiName: 'sequenceEnrollments',
        description: 'People enrolled in sequences',
        fields: [
          { name: 'sequenceId', label: 'Sequence', type: FieldMetadataType.RELATION },
          { name: 'personId', label: 'Person', type: FieldMetadataType.RELATION },
          { name: 'currentStepIndex', label: 'Current Step', type: FieldMetadataType.NUMBER, defaultValue: 0 },
          { name: 'status', label: 'Status', type: FieldMetadataType.SELECT, options: ['active', 'paused', 'completed', 'failed'], defaultValue: 'active' },
          { name: 'enrolledAt', label: 'Enrolled At', type: FieldMetadataType.DATE_TIME },
          { name: 'lastEmailSentAt', label: 'Last Email Sent', type: FieldMetadataType.DATE_TIME },
          { name: 'nextEmailScheduledAt', label: 'Next Email', type: FieldMetadataType.DATE_TIME },
        ],
      },
    ];

    for (const objDef of customObjects) {
      await this.createCustomObject(workspaceId, objDef);
    }

    this.logger.log('Exa custom objects initialized successfully');
  }

  private async createCustomObject(
    workspaceId: string,
    definition: CustomObjectDefinition,
  ): Promise<ObjectMetadataEntity> {
    this.logger.log(`Creating custom object: ${definition.displayName}`);

    // Check if object already exists
    const existing = await this.objectMetadataRepository.findOne({
      where: {
        workspaceId,
        nameSingular: definition.apiName,
      },
    });

    if (existing) {
      this.logger.log(`Object ${definition.displayName} already exists, skipping`);
      return existing;
    }

    // Create object metadata
    const objectMetadata = this.objectMetadataRepository.create({
      workspaceId,
      nameSingular: definition.apiName,
      namePlural: definition.pluralName,
      labelSingular: definition.displayName,
      labelPlural: definition.pluralName,
      description: definition.description,
      icon: 'IconTarget',
      isCustom: true,
      isActive: true,
      isSystem: false,
    });

    const savedObject = await this.objectMetadataRepository.save(objectMetadata);

    // Create fields
    for (const fieldDef of definition.fields) {
      await this.createField(savedObject.id, fieldDef);
    }

    return savedObject;
  }

  private async createField(
    objectMetadataId: string,
    definition: {
      name: string;
      label: string;
      type: FieldMetadataType;
      description?: string;
      options?: any;
      defaultValue?: any;
    },
  ): Promise<void> {
    this.logger.log(`Creating field: ${definition.label}`);

    const field = this.fieldMetadataRepository.create({
      objectMetadataId,
      name: definition.name,
      label: definition.label,
      type: definition.type,
      description: definition.description,
      options: definition.options,
      defaultValue: definition.defaultValue,
      isNullable: true,
      isActive: true,
      isCustom: true,
      isSystem: false,
    });

    await this.fieldMetadataRepository.save(field);
  }
}

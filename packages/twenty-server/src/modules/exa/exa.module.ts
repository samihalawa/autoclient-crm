import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExaService } from './exa.service';
import { ExaController } from './exa.controller';
import { ExaObjectsInitializer } from './setup/initialize-exa-objects';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ObjectMetadataEntity, FieldMetadataEntity],
      'metadata',
    ),
  ],
  providers: [ExaService, ExaObjectsInitializer],
  controllers: [ExaController],
  exports: [ExaService, ExaObjectsInitializer],
})
export class ExaModule {}

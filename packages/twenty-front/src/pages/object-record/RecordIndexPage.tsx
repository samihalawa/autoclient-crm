import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { RecordIndexContainerGater } from '@/object-record/record-index/components/RecordIndexContainerGater';
import { SequencesListView } from '@/modules/sequences/components/SequencesListView';
import { WebsetsView } from '@/modules/websets/components/WebsetsView';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { useRecoilComponentValue } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValue';
import { isUndefined } from '@sniptt/guards';

export const RecordIndexPage = () => {
  const contextStoreCurrentObjectMetadataItemId = useRecoilComponentValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    MAIN_CONTEXT_STORE_INSTANCE_ID,
  );

  const { objectMetadataItems } = useObjectMetadataItems();

  if (isUndefined(contextStoreCurrentObjectMetadataItemId)) {
    return <></>;
  }

  const objectMetadataItem = objectMetadataItems.find(
    (objectMetadataItem) =>
      objectMetadataItem.id === contextStoreCurrentObjectMetadataItemId,
  );

  if (isUndefined(objectMetadataItem)) {
    return <></>;
  }

  // Check if this is a sequence object - render custom list UI
  if (objectMetadataItem.nameSingular === 'sequence') {
    return (
      <PageContainer>
        <SequencesListView />
      </PageContainer>
    );
  }

  // Check if this is a webset object - render custom UI
  if (objectMetadataItem.nameSingular === 'webset') {
    return (
      <PageContainer>
        <WebsetsView />
      </PageContainer>
    );
  }

  // Default: render generic table view for all other objects
  return (
    <PageContainer>
      <ContextStoreComponentInstanceContext.Provider
        value={{
          instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID,
        }}
      >
        <RecordIndexContainerGater />
      </ContextStoreComponentInstanceContext.Provider>
    </PageContainer>
  );
};

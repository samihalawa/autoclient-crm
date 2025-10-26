import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { RecordIndexContainerGater } from '@/object-record/record-index/components/RecordIndexContainerGater';
import { SequencesListView } from '@/modules/sequences/components/SequencesListView';
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

  // Check if this is a webset object - render custom UI (to be implemented)
  if (objectMetadataItem.nameSingular === 'webset') {
    return (
      <PageContainer>
        {/* TODO: WebsetsView component will go here */}
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Websets (Custom UI Coming Soon)
          </h1>
          <p className="text-gray-500 mt-2">
            This will show criteria and enrichments interface like Attio.
          </p>
        </div>
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

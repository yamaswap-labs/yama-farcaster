import { CollectType, postCollectETF } from '@/api/rest/etf_collect';
import { ETFDTO } from '@/api/rest/get_etf_list';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type CollectETFContextType = {
  cachedCollectedPubkeys: string[];
  myCollected: ETFDTO[];
  setCachedCollectedPubkeys: Dispatch<SetStateAction<string[]>>;
  fetchCollected: () => void;
  postCollect: (pubKey: string, type: CollectType) => ReturnType<typeof postCollectETF>;
};

export const CollectETFContext = createContext<CollectETFContextType | null>(null);

export const useCollectETFContext = () => {
  const collectETFContext = useContext(CollectETFContext);

  if (!collectETFContext) {
    throw new Error('useCollectETF has to be used within <CollectETFProvider>');
  }

  return collectETFContext;
};

export default CollectETFContext;

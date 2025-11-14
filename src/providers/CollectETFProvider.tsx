import { CollectETFReqBody, getCollectedETFs, postCollectETF } from '@/api/rest/etf_collect';
import { ETFDTO } from '@/api/rest/get_etf_list';
import CollectETFContext, { CollectETFContextType } from '@/contexts/CollectETFContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { Keypair } from '@solana/web3.js';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import nacl from 'tweetnacl';

export type PostCollectMutateFnParams = Pick<CollectETFReqBody, 'etfPublicKey' | 'type'>;

export const CollectETFProvider = ({ children }: PropsWithChildren<any>) => {
  const { publicKey } = useWallet();
  // every time postCollect is triggered, cachedCollectedPubkeys will be reset
  const [cachedCollectedPubkeys, setCachedCollectedPubkeys] = useState<string[]>([]);
  // myCollected is the data fetched from the backend
  const [myCollected, setMyCollected] = useState<ETFDTO[]>([]);
  const postCollect = useCallback<CollectETFContextType['postCollect']>(
    (pubKey: any, type: any) => {
      // 1. generate keypair
      const keypair = Keypair.generate();
      const message = new TextEncoder().encode(publicKey?.toBase58());
      const signature = nacl.sign.detached(message, keypair.secretKey);
      // 2. convert to base64
      const signatureBase64 = Buffer.from(signature).toString('base64');
      const messageBase64 = Buffer.from(message).toString('base64');

      return postCollectETF({
        etfPublicKey: pubKey,
        type,
        publicKey: keypair.publicKey.toBase58(),
        walletPublicKey: publicKey?.toBase58() || '',
        signature: signatureBase64,
        message: messageBase64,
      });
    },
    [publicKey],
  );

  const fetchCollected = useCallback(() => {
    if (!publicKey) {
      return;
    }

    getCollectedETFs({
      from_timestamp: 0,
      limit: -1,
      walletPublicKey: publicKey?.toBase58() || '',
      page: 1,
    }).then((res) => {
      if (res.success) {
        setMyCollected(res.data.items || []);
        setCachedCollectedPubkeys(res.data.items.map((e) => e.public_key));
      }
      return res;
    });
  }, [publicKey]);

  useEffect(() => {
    if (
      (myCollected.length && !cachedCollectedPubkeys.length) ||
      (cachedCollectedPubkeys.length && !myCollected.length)
    ) {
      fetchCollected();
    }
  }, [cachedCollectedPubkeys, myCollected, publicKey, fetchCollected]);

  return (
    <CollectETFContext.Provider
      value={{
        myCollected,
        cachedCollectedPubkeys,
        fetchCollected,
        setCachedCollectedPubkeys,
        postCollect,
      }}
    >
      {children}
    </CollectETFContext.Provider>
  );
};

export default CollectETFProvider;

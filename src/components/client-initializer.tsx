'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function ClientInitializer({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
    };

    if (sdk && !isLoaded) {
      load();
    }
  }, [isLoaded]);

  return isLoaded ? <>{children}</> : null;
}
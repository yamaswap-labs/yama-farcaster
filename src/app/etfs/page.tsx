'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';
import '../../app/globals.css';
import ClientInitializer from '@/components/client-initializer';
import ETFsListFeature from '@/components/etfs-list/etfs-list-feature';

export default function App() {
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

	return <ETFsListFeature />;
}

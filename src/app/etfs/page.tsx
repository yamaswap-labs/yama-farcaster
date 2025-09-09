'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';
import '../../app/globals.css';
import ClientInitializer from '@/components/client-initializer';

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

	return (
		<ClientInitializer>
			<div className='mx-auto flex flex-col items-center px-4'>
				<main>
					<div>ETFs page</div>
				</main>
			</div>
		</ClientInitializer>
	);
}

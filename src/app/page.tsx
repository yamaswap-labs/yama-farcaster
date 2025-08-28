'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';
import './globals.css';

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
		<div className='mx-auto flex flex-col items-center px-4'>
			<main>
				<div>Hello, App</div>
			</main>
		</div>
	);
}

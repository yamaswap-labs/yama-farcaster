import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
	const metadata: Metadata = {
		title: 'Your Page Name',
		description: 'Your Page Description',
	};

	const frameUrl = `${APP_BASE_URL}`;

	const frameMetadata = await generateFrameMetadata({
		name: metadata.title as string,
		title: metadata.title as string,
		url: frameUrl,
		description: metadata.description as string,
		imageUrl: `${frameUrl}/opengraph-image`,
		launchButtonName: 'Launch App',
	});

	return {
		...metadata,
		...frameMetadata,
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}

import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';
import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { UiLayout } from '@/components/ui/ui-layout';
import { generateAppMetadata } from './metadata';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactQueryProvider } from './react-query-provider';
import { SolanaProvider } from '@/components/solana/solana-provider';
import { ClusterProvider } from '@/components/cluster/cluster-data-access';

// const geistSans = Geist({
// 	variable: '--font-geist-sans',
// 	subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
// 	variable: '--font-geist-mono',
// 	subsets: ['latin'],
// });

export const metadata = generateAppMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang='en'>
			<body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
				<ReactQueryProvider>
					<ClusterProvider>
						<SolanaProvider>
							<ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
								<UiLayout>{children}</UiLayout>
							</ThemeProvider>
						</SolanaProvider>
					</ClusterProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}

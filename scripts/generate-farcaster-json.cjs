/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envLocalFilePath = path.resolve(__dirname, '..', '.env.local');
const isEnvLocalFileExists = fs.existsSync(envLocalFilePath);
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
	dotenv.config({ path: path.resolve(__dirname, '..', '.env.production') });
} else if (isDev && isEnvLocalFileExists) {
	dotenv.config({ path: envLocalFilePath });
} else {
	dotenv.config({ path: path.resolve(__dirname, '..', '.env.development') });
}

const MINIAPP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN;
const MINIAPP_PROTOCOL = isProd || !!MINIAPP_DOMAIN ? 'https://' : 'http://';
const DEFAULT_MINIAPP_DOMAIN = isProd ? 'app.yamaswap.com' : 'localhost:3000';
const MINIAPP_BASE_URL = `${MINIAPP_PROTOCOL}${MINIAPP_DOMAIN || DEFAULT_MINIAPP_DOMAIN}`;

if (!MINIAPP_DOMAIN) {
	console.warn(
		'\x1b[43m\x1b[30m%s\x1b[0m',
		'[WARNING]: NEXT_PUBLIC_FC_MINIAPP_DOMAIN is not set, defaulting to localhost:3000.',
	);
}

const farcasterConfig = {
	accountAssociation: {
		header: '',
		payload: '',
		signature: '',
	},
	frame: {
		version: '1',
		name: 'Your App name',
		subtitle: 'Welcome to Your App name!',
		iconUrl: `${MINIAPP_BASE_URL}/logo.jpg`,
		homeUrl: `${MINIAPP_BASE_URL}`,
		splashImageUrl: `${MINIAPP_BASE_URL}/logo.jpg`,
		splashBackgroundColor: '#171717',
		primaryCategory: 'finance', // To be updated
		requiredChains: ['solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'],
		requiredCapabilities: ['actions.signIn', 'wallet.getSolanaProvider'],
		heroImageUrl: 'https://rewards.warpcast.com/og.png',
	},
};

const outputDir = path.join(__dirname, '..', 'public', '.well-known');
const outputPath = path.join(outputDir, 'farcaster.json');

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(farcasterConfig, null, 2));

console.log(`✅ Generated farcaster.json at ${outputPath}`);
console.log(`🤪 Miniapp Domain ${MINIAPP_DOMAIN}`);
console.log(`🤪 Miniapp URL ${farcasterConfig.frame.homeUrl}`);
console.log(`🤪 Miniapp Splash Image URL ${farcasterConfig.frame.splashImageUrl}`);
console.log(`🤪 Miniapp Splash Background Color ${farcasterConfig.frame.splashBackgroundColor}\n`);

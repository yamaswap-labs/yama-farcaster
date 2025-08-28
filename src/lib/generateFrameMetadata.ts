import type { Metadata } from 'next';
import { APP_LOGO_URL, APP_NAME, APP_SPLASH_BG_COLOR } from './constants';

/**
 * Open Graph Protocol (OGP)
 * It is a protocol that lets websites creator control what users see when their site
 * is shared across the web.
 * It uses meta tags to describe the content of the page. Such as...
 * - `og:title`: title of the page
 * - `og:description`: description of the page
 * - `og:image`: preview image of the page
 * - `og:url`: url of the page
 * and etc.
 *
 * Farcaster Mini Apps (Frame) Protocol
 * Farcaster Mini Apps Metadata is an extension of Open Graph Metadata, it doesn't modify the `og` tags, but uses `other` tag to pass Farcaster Mini Apps Metadata.
 *
 * In Farcaster, your application is called MiniApp, and the page you want to share of your MiniApp is called Frame.
 */
export interface FrameMetadata {
	name: string; // frame name, same as og:site_name
	title: string; // frame title, same as og:title
	url: string; // frame url, same as og:url
	description: string; // frame description, same as og:description
	imageUrl: string; // preview image of the page, same as og:image
	launchButtonName: string; // shared preview button name
	iconUrl?: string; // shared page's loading page icon, defaults to name of your application in `farcaster.json`
	backgroundColor?: string; // loading page background color, defaults to `splashBackgroundColor` specified in `farcaster.json`
}

export function generateFrameMetadata({
	name,
	title,
	url,
	description,
	imageUrl,
	launchButtonName,
	iconUrl,
	backgroundColor,
}: FrameMetadata): Pick<Metadata, 'openGraph' | 'other'> {
	const previewEmbedFcMetadata: Metadata['other'] = {
		'fc:miniapp': JSON.stringify({
			version: 'next',
			imageUrl,
			button: {
				title: launchButtonName || '💜 Try Now!',
				action: {
					type: 'launch_miniapp',
					name,
					url,
					splashImageUrl: iconUrl || APP_LOGO_URL,
					splashBackgroundColor: backgroundColor || APP_SPLASH_BG_COLOR,
				},
			},
		}),
	};

	return {
		openGraph: {
			siteName: APP_NAME,
			title,
			description,
			images: [{ url: imageUrl }],
		},
		other: previewEmbedFcMetadata,
	};
}

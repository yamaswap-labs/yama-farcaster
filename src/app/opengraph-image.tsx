import { ImageResponse } from 'next/og';

// Image metadata
export const alt = '[App Name]';
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					background: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<p
					style={{
						fontSize: 80,
						color: '#c80000',
					}}
				>
					Welcome to [App Name]!
				</p>
				<p
					style={{
						fontSize: 64,
					}}
				>
					Click to try [App Name]
				</p>
			</div>
		),
		// ImageResponse options
		{
			...size,
		},
	);
}

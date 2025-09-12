import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./app/**/*.{js,ts,jsx,tsx}', // 如果使用 App Router
		'./src/**/*.{js,ts,jsx,tsx}', // 如果使用 src 目录
	],
	theme: {
		extend: {
			fontSize: {
				// 常用 font-size + line-height mapping，按照 font-size 从小到大
				xxs: ['10px', '18px'],
				xs: ['12px', '20px'],
				sm: ['14px', '22px'],
				base: ['16px', '24px'],
				lg: ['20px', '28px'],
				xl: ['22px', '30px'],
				'2xl': ['32px', '40px'],
				'18px': ['18px', '26px'],
			},
			backgroundSize: {
				'100%': '100% 100%',
			},
			backgroundImage: {
				layout: "url('/bg-image.png')",
			},
			/**
			 * ✨✨✨✨✨✨✨✨
			 * hsl colors 和带有 css variables 的配置
			 * 是由 shadcn ui 初始化自动生成的，一般情况不手动修改
			 * ✨✨✨✨✨✨✨✨
			 */
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				white: '#fff',
				black: '#000',
				text: '#ffffff99',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('daisyui')],
};
export default config;

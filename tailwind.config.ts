import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				mono: ['VT323', 'monospace'],
				sans: ['Rubik', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'41%': { opacity: '1' },
					'42%': { opacity: '0.4' },
					'43%': { opacity: '1' },
					'45%': { opacity: '0.2' },
					'46%': { opacity: '1' },
				},
				'glitch-text': {
					'0%, 100%': { transform: 'translate(0)', textShadow: '0 0 transparent' },
					'33%': { transform: 'translate(-2px, 1px)', textShadow: '2px 0 #ff003c, -2px 0 #00fff9' },
					'66%': { transform: 'translate(2px, -1px)', textShadow: '-2px 0 #ff003c, 2px 0 #00fff9' },
				},
				'scanline': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100vh)' },
				},
				'warm-pulse': {
					'0%, 100%': { textShadow: '0 0 8px #ffb347, 0 0 20px #ff8c00' },
					'50%': { textShadow: '0 0 16px #ffd27f, 0 0 40px #ffb347' },
				},
				'icon-blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.15' },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(8px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'shake': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-6px, 3px)' },
					'40%': { transform: 'translate(6px, -3px)' },
					'60%': { transform: 'translate(-4px, 2px)' },
					'80%': { transform: 'translate(4px, -2px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flicker': 'flicker 4s infinite',
				'glitch-text': 'glitch-text 0.4s infinite',
				'scanline': 'scanline 6s linear infinite',
				'warm-pulse': 'warm-pulse 2s ease-in-out infinite',
				'icon-blink': 'icon-blink 1.8s ease-in-out infinite',
				'fade-in': 'fade-in 0.4s ease-out',
				'shake': 'shake 0.4s ease-in-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			colors: {
				redOrange: '#FF5733',
				white: '#FFFFFF'
			}
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp'),
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'crimson',
						enhancements: true
					}
				]
			}
		})
	]
} satisfies Config;

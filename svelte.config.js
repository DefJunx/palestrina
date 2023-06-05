import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	vitePlugin: {
		inspector: true
	},
	kit: {
		alias: {
			$src: './src',
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components/*'
		},
		adapter: adapter()
	}
};
export default config;

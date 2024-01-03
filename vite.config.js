import { defineConfig } from 'vite';
import path from 'path';

// Plugins
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { qrcode } from 'vite-plugin-qrcode';

// Files
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			// Registering PWA
			registerType: 'autoUpdate',
			injectRegister: 'script',

			// Workbox
			workbox: {
				clientsClaim: true,
				skipWaiting: true
			},

			// Manifest
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
			manifest
		}),
		qrcode()
	],

	optimizeDeps: {
		exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
	},

	server: {
		// port: 3000
		// ! Enable this for local https
		https: {
			key: path.resolve(__dirname, 'localhost.key'),
			cert: path.resolve(__dirname, 'localhost.crt')
		}

		// headers: {
		// 	'Cross-Origin-Opener-Policy': 'same-origin',
		// 	'Cross-Origin-Embedder-Policy': 'require-corp'
		// }
	},

	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src') // Create an alias named '@' pointing to the 'src' folder
		}
	}
});

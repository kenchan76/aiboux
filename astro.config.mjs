// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	output: 'server',
  devToolbar: {
    enabled: false,
  },

  adapter: cloudflare({
    imageService: 'passthrough',
    remoteBindings: process.env.AIBOUX_CF_REMOTE_BINDINGS === 'true',
  }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [
          '**/all_log/**',
          '**/output/**',
          '**/test-results/**',
          '**/playwright-report/**',
        ],
      },
      allowedHosts: [
        'core.aiboux.com',
        'mail.aiboux.com',
        'file.aiboux.com',
        'biz.aiboux.com',
        'office.aiboux.com',
        'rirekisho.aiboux.com',
        'docs.aiboux.com',
        'shop.aiboux.com',
        'mall.aiboux.com',
      ],
    },
  },
});

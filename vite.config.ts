import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function copyIndexTo404() {
  return {
    name: 'copy-index-to-404',
    closeBundle() {
      try {
        const distPath = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distPath, 'index.html');
        const backupPath = path.join(distPath, '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, backupPath);
          console.log('Successfully copied index.html to 404.html for GitHub Pages routing.');
        }
      } catch (err) {
        console.error('Failed to copy index.html to 404.html:', err);
      }
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isGitHubBuild = process.env.GITHUB_ACTIONS === 'true' || process.env.BUILD_FOR_GH_PAGES === 'true';

  return {
    plugins: [
      react(), 
      tailwindcss(),
      copyIndexTo404()
    ],
    base: isGitHubBuild ? '/UCSmile_prototype/' : '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

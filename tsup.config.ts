import { defineConfig } from 'tsup';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  onSuccess: async () => {
    // Copy CSS file to dist/styles.css
    const srcCss = path.resolve(__dirname, 'src/styles/main.css');
    const distCss = path.resolve(__dirname, 'dist/styles.css');
    if (fs.existsSync(srcCss)) {
      if (!fs.existsSync(path.dirname(distCss))) {
        fs.mkdirSync(path.dirname(distCss), { recursive: true });
      }
      fs.copyFileSync(srcCss, distCss);
    }
  },
});

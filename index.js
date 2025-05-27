#!/usr/bin/env node

import {copyFileSync, existsSync, mkdirSync, readdirSync, statSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = process.argv[2] || 'b2c-landing';
const src = path.join(__dirname, 'template');
const dest = path.join(process.cwd(), targetDir);

function copyRecursive(srcDir, destDir) {
  if (!existsSync(destDir)) mkdirSync(destDir, {recursive: true});

  for (const item of readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive(src, dest);
console.log(`✅ Шаблон успешно установлен в ./${targetDir}`);
